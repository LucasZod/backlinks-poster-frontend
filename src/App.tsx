import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Auth } from './pages/Auth/Auth'
import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { Home } from './pages/Home/Home'

function App() {
  return (
    <React.Fragment>
      <ToastContainer position="top-center" autoClose={5000} theme="colored" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  )
}

export default App
