import React from 'react'
import ReactDOM from 'react-dom'
import { ToastContainer } from 'react-toastify'
import './index.css'
import App from './App'
import { Web3Provider } from './web3'
import { DataProvider } from './dataContext'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <Web3Provider>
      <DataProvider>
        <App />
        <ToastContainer closeButton={false} />
      </DataProvider>
    </Web3Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
