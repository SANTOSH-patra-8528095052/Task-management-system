import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { UserContext } from '../UserContext';
import { Link, Navigate } from 'react-router-dom';
import ProfileLogo from './ProfileLogo.jsx';

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [isLoggedOut, setIsLoggedOut] = useState(false); // Track logout status

  useEffect(() => {
    fetch('http://localhost:3000/header', {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((userInfo) => {
        setUserInfo(userInfo);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  }, [setUserInfo]);

  const logout = () => {
    fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include', // Ensures cookies are included in the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Logout failed');
        }
        setIsLoggedOut(true); 
        setUserInfo(null); // Clear user info if logout was successful
        return response.json();
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        alert("Failed to logout. Please try again.");
      });
  };

  const username = userInfo?.username;

  // If logged out, redirect to the login page
  if (isLoggedOut) {
    return <Navigate to='/login' />;
  }

  return (
    <div className="homepage-container">
      <header className="header">
        <Link to='/'>
          <h1>Task Manager</h1>
          <img
            src="https://img.freepik.com/free-vector/1-logo-design-template_23-2151180197.jpg?t=st=1735323970~exp=1735327570~hmac=098a77c9d8488eaa4d6c8c7c6402994a3e2d69df948ea4eb899d1f8b3ae4a6e8&w=740"
            width="100"
            height="100"
            alt="logo"
          />
        </Link>

        <nav>
          <ul className="nav-links">
            {username ? (
              <>
                <button onClick={logout} className="user-profile-logo">
                  Logout
                </button>
                <li>
                  <Link className="user-profile-logo" to='/create-assignment'>
                    Create Assignment
                  </Link>
                </li>
                <li>
                  <Link to={`/login/profile/${userInfo.id}`}> 
                    <ProfileLogo name={username} />
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li><Link to='/login'>Login</Link></li>
                <li><Link to='/register'>Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;
