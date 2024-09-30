import React from 'react'
import "./login.css"
import axios from "axios"
import {useState} from "react"
import {useNavigate,Link} from "react-router-dom"

const Login = () => {
  const [credentials,setCredentials]=useState({
    email:'',
    password:''
  })
  const navigate=useNavigate();
  const handleChange=(e)=>{
    setCredentials((prev)=>({prev,[e.target.id]:e.target.value}));
  }
  const handleClick= async (e)=>{
      e.preventDefault();
      try{
        const response = await axios.post('http://localhost:7000/api/user/login',credentials);
        if(response.data.token && response.data.userId){
          sessionStorage.setItem('token',response.data.token);
          sessionStorage.setItem('userId',response.data.userId);
          navigate("/explore");
        }else{
          console.log("Login failed, no token received.")
        }
      }catch(err){
        console.log("Error during login:", err);
      }
  }
  return (
    <div className='login'> {/*login*/}
        <div className='loginCard'> {/*loginCard*/}
            <div className='center'>{/*center*/}
                <h1>Welcome Back!</h1>
              <form>
                <div className='txt-field'>{/*txt-field*/}
                    <input
                    type="text"
                    placeholder='email'
                    id='email'
                    onChange={handleChange}
                    className='1Input' 
                    />
                    {/*1Input*/}
                </div>
                <div className='txt-field'>{/*txt-field*/}
                    <input
                    type="password"
                    placeholder='password'
                    id='password'
                    onChange={handleChange}
                    className='2Input' 
                    />
                    {/*2Input*/}
                </div>
                <div className='login-button'>{/*login-button*/}
                    <button className='button' onClick={handleClick}>Login</button> {/*button*/}
                </div>
                <div className='signup_link'>{/*signup_link*/}
                      <p>
                        Not registered? <Link to="/register">Register</Link>
                      </p>
                </div>
              </form>
            </div>
        </div>
    </div>
  )
}

export default Login