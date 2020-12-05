import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'

const useTransaction = () => {
  const [pending, setPending] = useState(false)

  const contractCall = useCallback(
    (contractFn, parameters, pendingMessage, failedMessage, successMessage, successCallback, completedCallback) => {
      setPending(true)
      contractFn(...parameters)
        .then(txResponse => {
          const toastId = toast(pendingMessage, {
            autoClose: false,
            closeOnClick: false,
            draggable: false
          })
          return Promise.all([txResponse.wait(), toastId])
        })
        .then(([txReceipt, toastId]) => {
          setPending(false)
          toast.dismiss(toastId)
          if (txReceipt.status === 0) {
            toast(failedMessage)
          } else if (txReceipt.status === 1) {
            toast(successMessage)
            if (successCallback) successCallback()
          } else {
            toast("Not sure what happened with that transaction")
          }
          if (completedCallback) completedCallback()
        })
        .catch(error => {
          console.error(error)
          setPending(false)
          toast("There was an error! Check your browser's console logs for more details.")
        })
    }, [])

  return { contractCall, pending }
}

export { useTransaction }