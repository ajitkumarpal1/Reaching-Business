import React, { useEffect } from 'react'
import { BrowserRouter , Routes, Route, Router } from 'react-router-dom'
import { Home, Forgotpass, Listproducts, Login, Register } from './pages'
import ProtectedRoute from "./ProtectedRoute" 
import './App.css'
import { useState } from 'react'
import { UserAuthContextProvider } from './context/UserAuthContext'




const App = () => {

  const [editProduct, setEditProduct] = useState(false);
  const [update, setUpdate] = useState(false)
  const [searchbutton, setSearchbutton] = useState(false);
  const [userId, setUserId] = useState("")

  useEffect(() =>{
      console.log(userId)
  },[])
  const getUserIdhandler = (id) =>{
      console.log(id)
      setUserId(id);
  }
  

  return (
      <div className='App'>
        <UserAuthContextProvider>
        <Routes>
         
          <Route path='/' element={<Login />} />
          <Route path='/*' element={<ProtectedRoute><Home UserId={userId} setUserId={setUserId} /></ProtectedRoute>} />
          <Route path='/Forgotpass' element={<Forgotpass />} />
          <Route path='/Register' element={<Register  getUserId={getUserIdhandler}/>} /> 
        </Routes>
        </UserAuthContextProvider>
      </div>
  )
}

export default App