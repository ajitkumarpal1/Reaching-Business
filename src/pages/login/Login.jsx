import React, { useState } from 'react'
import './login.css'
import image from '../../assets/login.png'
import { useNavigate } from 'react-router-dom'
import { MdAlternateEmail } from 'react-icons/md'
import { Si1Password } from 'react-icons/si'
import { useUserAuth } from '../../context/UserAuthContext';




const Login = () => {

  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [user, setUser] = useState([])
  const { logIn } = useUserAuth();
  const [error, setError] = useState("");


  const handleInput = (event) =>{
    let newInput = {[event.target.name]: event.target.value}
    setData({...data, ...newInput});
  }

  const handleSubmit = async() => {
      setError("");
      try {
        await logIn(data.email, data.password)
        console.log("logged in  ")
 
        navigate("/Home/*")
      } catch (error) {
        setError(error)
        alert(error)
      }
  
  }


  return (
    <div className='rb__login'>
      <div className='rb__login-image'>
        <img src={image} />
      </div>
      <div className='rb__login-form_container'>
        <h1>Login</h1>
        <input 
          name='email'
          type='text' 
          placeholder='Username or Email' 
          onChange={(event) => handleInput(event)}
          />
        <input 
          name='password'
          type='password' 
          placeholder='Password' 
          onChange={(event) => handleInput(event)}
          />
        <div className='rb__login-form_container-buttons'>
          <button 
            onClick={handleSubmit}
          >
              Login
          </button>
          <button onClick={() => navigate('/Register')}>SignUp</button>
        </div>
        <div className='rb__login-forgotpass_container'>
        <p>Don't know your password, <a onClick={() => navigate('/Forgotpass')}>click here</a></p>
      </div>
      </div>
     
    </div>
  )
}

export default Login