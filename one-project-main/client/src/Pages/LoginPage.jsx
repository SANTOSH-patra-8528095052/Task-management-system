import React, { useContext, useState } from "react";
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../UserContext";


export default function LoginPage() {
    const { user,loginWithRedirect } = useAuth0();
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {userInfo,setUserInfo} = useContext(UserContext)
  
    async function login(ev) {
      ev.preventDefault();
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        body: JSON.stringify({username, password}),
        headers: {'Content-Type':'application/json'},
        credentials: 'include',
      });
  
      if(response.ok){
          response.json().then(userInfo =>{
            setUserInfo(userInfo)
            setRedirect(true)
          })
         } else{
          alert('Wrong credentials')
      }
    }
  
    if(redirect){
      return <Navigate to={`profile/${userInfo.id}`}/>
    }
  
    return (
        <div className="login-container">
          <div className="login-card">
            <h1>Login</h1>
            <form className="login-form" onSubmit={login}>
              <div className="form-group">
                <label htmlFor="email">Username</label>
                <input type="username" placeholder="Enter your username" value={username} onChange={ev =>{setUsername(ev.target.value)}} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" placeholder="Enter your password" value={password} onChange={ev =>{ setPassword(ev.target.value)}} />
              </div>
              <button type="submit" className="login-btn">Login</button>
            </form>
    
            <div className="divider">or</div>
    
            <div className="social-login">
            <button className="google-btn" onClick={() =>{loginWithRedirect()}}>
                <FaGoogle className="icon" /> Sign in with Google
              </button>
              <button className="github-btn">
                <FaGithub className="icon" /> Sign in with GitHub
              </button>
            </div>
          </div>
        </div>
      );
}
