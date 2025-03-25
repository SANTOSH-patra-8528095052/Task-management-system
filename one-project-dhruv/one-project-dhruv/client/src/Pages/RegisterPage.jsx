import React, { useState } from "react";
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Link, Navigate } from "react-router-dom";


export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect,setRedirect ] = useState(false);
  async function register(ev){
     ev.preventDefault() ;
     

     const response = await fetch('http://localhost:3000/register',{
            method: 'POST',
            body:JSON.stringify({username,password}),
            headers:{'Content-Type': 'application/json'},
     })
     if(response.status === 200){
            alert('registration successful')
            setRedirect(true)
     } else{
            alert('registration failed')
     }
    }
    if( redirect ){
      return <Navigate to="/login"/>
    }
    return (
        <div className="login-container">
          <div className="login-card">
            <h1>Register</h1>
            <form className="login-form" onSubmit={register}>
              <div className="form-group">
                <label htmlFor="email">Username</label>
                <input type="text" placeholder="Enter your username" value={username} onChange={ev =>{setUsername(ev.target.value)}} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="text" placeholder="Enter your password" value={password} onChange={ev =>{ setPassword(ev.target.value)}} />
              </div>
              <button type="submit" className="login-btn">Register</button>
            </form>
    
            <div className="divider">or</div>
    
            <div className="social-login">
              <button className="google-btn" >
                    <FaGoogle className="icon" /> Sign up with Google
                  </button>
                  <button className="github-btn">
                    <FaGithub className="icon" /> Sign up with GitHub
                  </button>
            </div>
          </div>
        </div>
      );
}
