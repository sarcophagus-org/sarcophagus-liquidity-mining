/* global web3: false, artifacts: false, contract: false, context: false */
/* eslint-disable jest/valid-expect */

const { expect } = require("chai");
const { expectEvent, expectRevert, time } = require("@openzeppelin/test-helpers");
const { toBN } = web3.utils;

const SarcoMock = artifacts.require("SarcoMock");
const LiquidityMiningLP = artifacts.require("LiquidityMiningLP");
const LP = artifacts.require("DaiMock");

contract("LiquidityMiningLP", (accounts) => {
  const [owner, staker1, staker2, staker3] = accounts;
  const staker1Initial = toBN("12000000000000");
  const staker2Initial = toBN("24000000000000");
  const totalRewards = toBN("60000000000000000000000");
  const stakingDuration = time.duration.years(1);
  const rewardPerSecond = totalRewards.div(stakingDuration);

  beforeEach(async function () {
    this.sarco = await SarcoMock.new();
    this.lp = await LP.new();
    this.liquidityMining = await LiquidityMiningLP.new(this.lp.address, this.sarco.address)
  });

  it("has expected LP address", async function () {
    expect(await this.liquidityMining.lp()).to.equal(this.lp.address);
  });

  it("has expected Sarco address", async function () {
    expect(await this.liquidityMining.sarco()).to.equal(this.sarco.address);
  });

  it("has expected owner", async function () {
    expect(await this.liquidityMining.owner()).to.equal(owner);
  });

  context("deposit reward tokens", function () {
    let start, end, tx

    beforeEach(async function () {
      start = (await time.latest()).add(time.duration.minutes(5));
      end = start.add(stakingDuration);
      await this.sarco.transfer(this.liquidityMining.address, totalRewards);
      tx = await this.liquidityMining.deposit(totalRewards, start, end);
    });

    it("emits a Deposit event", async function () {
      expectEvent(tx, "Deposit", { totalRewards: totalRewards, startTime: start, endTime: end });
    });

    it("has expected SARCO balance", async function () {
      expect(await this.sarco.balanceOf(this.liquidityMining.address)).to.be.bignumber.equal(totalRewards);
    });

    it("has expected total rewards", async function () {
      expect(await this.liquidityMining.totalRewards()).to.be.bignumber.equal(totalRewards);
    });

    it("has expected start time", async function () {
      expect(await this.liquidityMining.startTime()).to.be.bignumber.equal(start);
    });

    it("has expected end time", async function () {
      expect(await this.liquidityMining.endTime()).to.be.bignumber.equal(end);
    });

    it("has expected total stake", async function () {
      expect(await this.liquidityMining.totalStakeLp()).to.be.bignumber.equal("0");
    });

    it("has no stakers", async function () {
      expect(await this.liquidityMining.totalStakers()).to.be.bignumber.equal("0");
    });

    it("has zero staker1 stake", async function () {
      expect(await this.liquidityMining.userStakeLp(staker1)).to.be.bignumber.equal("0");
    });

    it("has zero staker2 stake", async function () {
      expect(await this.liquidityMining.userStakeLp(staker2)).to.be.bignumber.equal("0");
    });

    it("cannot stake with 0 amount", async function () {
      await expectRevert(
        this.liquidityMining.stake("0"),
        "LiquidityMiningLP::stake: missing LP"
      );
    });

    it("cannot stake before start time", async function () {
      await expectRevert(
        this.liquidityMining.stake(staker1Initial),
        "LiquidityMiningLP::stake: staking isn't live yet"
      );
    });

    context("advance to start time", function () {
      beforeEach(async function () {
        await time.increaseTo(start);
      });

      it("reverts without tokens approved for staking", async function () {
        await expectRevert(
          this.liquidityMining.stake(staker1Initial, { from: staker1 }),
          "ERC20: transfer amount exceeds balance -- Reason given: ERC20: transfer amount exceeds balance."
        );
      });

      context("staker1 & 2 stake at the same time", function () {
        let tx1, tx2

        beforeEach(async function () {
          await this.lp.transfer(staker1, staker1Initial);
          await this.lp.transfer(staker2, staker2Initial);
          await this.lp.approve(this.liquidityMining.address, staker1Initial, { from: staker1 });
          await this.lp.approve(this.liquidityMining.address, staker2Initial, { from: staker2 });
          tx1 = await this.liquidityMining.stake(staker1Initial, { from: staker1 });
          tx2 = await this.liquidityMining.stake(staker2Initial, { from: staker2 });
        });

        it("emits Stake events", async function () {
          expectEvent(tx1, "Stake", { staker: staker1, lpIn: staker1Initial });
          expectEvent(tx2, "Stake", { staker: staker2, lpIn: staker2Initial });
        });

        it("has expected total stake after multiple stakes", async function () {
          expect(await this.liquidityMining.totalStakeLp()).to.be.bignumber.equal(
            staker1Initial.add(staker2Initial)
          );
        });

        it("has expected staker1 stake", async function () {
          expect(await this.liquidityMining.userStakeLp(staker1)).to.be.bignumber.equal(staker1Initial);
        });

        it("has expected staker2 stake", async function () {
          expect(await this.liquidityMining.userStakeLp(staker2)).to.be.bignumber.equal(staker2Initial);
        });

        it("has expected first stake time", async function () {
          let firstStakeTime = String((await web3.eth.getBlock(tx1.receipt.blockNumber)).timestamp);
          expect(await this.liquidityMining.firstStakeTime()).to.be.bignumber.equal(firstStakeTime);
        });

        it("has two total stakers", async function () {
          expect(await this.liquidityMining.totalStakers()).to.be.bignumber.equal("2");
        });

        context("staker1 calls payout at half time", function () {
          let stakingHalfPeriod, reward1

          beforeEach(async function () {
            stakingHalfPeriod = stakingDuration.div(toBN("2"));
            await time.increaseTo(start.add(stakingHalfPeriod));
            reward1 = await this.liquidityMining.payout.call(staker1, { from: staker1 });
            tx = await this.liquidityMining.payout(staker1, { from: staker1 });
          });

          it("has expected reward", async function () {
            let totalStakeForPeriod = staker1Initial.add(staker2Initial);
            let expectedReward = stakingHalfPeriod.mul(rewardPerSecond).mul(staker1Initial).div(totalStakeForPeriod);
            expect(reward1).to.be.bignumber.closeTo(expectedReward, expectedReward.div(toBN("100000")));
          });

          it("emits a Payout event", async function () {
            expectEvent(tx, "Payout", { staker: staker1 });
          });

          it("contract has staker1 claimed rewards", async function () {
            expect(await this.liquidityMining.userClaimedRewards(staker1)).to.be.bignumber.equal(reward1);
          });

          it("staker1 has expected SARCO rewards", async function () {
            expect(await this.sarco.balanceOf(staker1)).to.be.bignumber.equal(reward1);
          });

          it("staker1 has not removed stake", async function () {
            expect(await this.lp.balanceOf(staker1)).to.be.bignumber.equal("0");
          });

          context("advance to after staking ends", function () {
            beforeEach(async function () {
              await time.increase(stakingDuration);
            });

            it("reverts when staking after end time", async function () {
              await this.lp.transfer(staker3, staker1Initial);
              await this.lp.approve(this.liquidityMining.address, staker1Initial, { from: staker3 });
              await expectRevert(
                this.liquidityMining.stake(staker1Initial, { from: staker3 }),
                "LiquidityMiningLP::stake: staking is over"
              );
            });

            it("reverts when payout/restake after end", async function () {
              await expectRevert(
                this.liquidityMining.payout(staker2, { from: staker2 }),
                "LiquidityMiningLP::payout: withdraw instead"
              );
            });

            context("request withdraw for staker 2", function () {
              let reward, tx

              beforeEach(async function () {
                reward = (await this.liquidityMining.withdraw.call(staker2, { from: staker2 })).reward;
                tx = await this.liquidityMining.withdraw(staker2, { from: staker2 });
              });

              it("has expected reward after a withdraw", async function () {
                let totalStakeForPeriod = staker1Initial.add(staker2Initial);
                let expectedReward = stakingDuration.mul(rewardPerSecond).mul(staker2Initial).div(totalStakeForPeriod);
                expect(reward).to.be.bignumber.closeTo(expectedReward, expectedReward.div(toBN("100000")));
              });

              it("emits a Payout & Withdraw event", async function () {
                expectEvent(tx, "Payout", { staker: staker2 });
                expectEvent(tx, "Withdraw", { staker: staker2, lpOut: staker2Initial });
              });

              it("contract has staker2 claimed rewards", async function () {
                expect(await this.liquidityMining.userClaimedRewards(staker2)).to.be.bignumber.equal(reward);
              });

              it("has one total staker", async function () {
                expect(await this.liquidityMining.totalStakers()).to.be.bignumber.equal("1");
              });

              it("staker2 has expected SARCO rewards", async function () {
                expect(await this.sarco.balanceOf(staker2)).to.be.bignumber.equal(reward);
              });

              it("staker2 has expected LP balance", async function () {
                expect(await this.lp.balanceOf(staker2)).to.be.bignumber.equal(staker2Initial);
              });

              context("request withdraw for staker 1", function () {
                let reward2, tx

                beforeEach(async function () {
                  reward2 = (await this.liquidityMining.withdraw.call(staker1, { from: staker1 })).reward;
                  tx = await this.liquidityMining.withdraw(staker1, { from: staker1 });
                });

                it("has expected reward after a withdraw again", async function () {
                  let totalStakeForPeriod = staker1Initial.add(staker2Initial);
                  let expectedReward = stakingHalfPeriod.mul(rewardPerSecond).mul(staker1Initial).div(totalStakeForPeriod);
                  expect(reward2).to.be.bignumber.closeTo(expectedReward, expectedReward.div(toBN("100000")));
                });

                it("emits a Payout & Withdraw event again", async function () {
                  expectEvent(tx, "Payout", { staker: staker1 });
                  expectEvent(tx, "Withdraw", { staker: staker1, lpOut: staker1Initial });
                });

                it("staker1 has expected SARCO rewards again", async function () {
                  expect(await this.sarco.balanceOf(staker1)).to.be.bignumber.equal(reward1.add(reward2));
                });

                it("staker1 has expected LP balance", async function () {
                  expect(await this.lp.balanceOf(staker1)).to.be.bignumber.equal(staker1Initial);
                });

                it("contract has no remaining stakers", async function () {
                  expect(await this.liquidityMining.totalStakers()).to.be.bignumber.equal("0");
                });

                it("contract has no remaining rewards", async function () {
                  expect(await this.sarco.balanceOf(this.liquidityMining.address)).to.be.bignumber.closeTo("0", "20000000");
                });

                it("contract has no remaining stakes", async function () {
                  expect(await this.lp.balanceOf(this.liquidityMining.address)).to.be.bignumber.equal("0");
                });
              });
            });
          });
        });
      });
    });
  });
});