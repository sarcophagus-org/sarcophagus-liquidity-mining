import React from 'react'
import ReactDOM from 'react-dom'
import { ethers } from 'ethers'
import { ToastContainer } from 'react-toastify'
import { Web3ReactProvider } from '@web3-react/core'
import './index.css'
import App from './App'
import { DataProvider } from './dataContext'
import reportWebVitals from './reportWebVitals'

const getLibrary = provider => {
  return new ethers.providers.Web3Provider(provider)
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <DataProvider>
        <App />
        <ToastContainer closeButton={false} />
      </DataProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
