import { useContext, useEffect, useState } from "react";
import React from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate } from "react-router-dom";
import ProfileLogo from "./ProfileLogo.jsx";

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/header", {
      credentials: "include",
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
    fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Logout failed");
        }
        setIsLoggedOut(true);
        setUserInfo(null);
        return response.json();
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        alert("Failed to logout. Please try again.");
      });
  };

  const username = userInfo?.username;
  if (isLoggedOut) {
    return <Navigate to="/login" />;
  }

  const styles = {
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      background: "linear-gradient(90deg, #ff7e5f, #feb47b)", // Flashy gradient background
      borderBottom: "1px solid #ddd",
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      color: "black",
    },
    logoImage: {
      width: "50px",
      height: "50px",
      marginRight: "10px",
    },
    navLinks: {
      display: "flex",
      gap: "15px",
      listStyle: "none",
    },
    navItem: {
      textDecoration: "none",
      color: "white", // Changed text color for better contrast on the gradient\n      fontWeight: "bold",
    },
    button: {
      padding: "5px 10px",
      border: "none",
      backgroundColor: "#007bff",
      color: "white",
      cursor: "pointer",
      borderRadius: "5px",
    },
  };

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logoContainer}>
        <img
          src="https://img.freepik.com/free-vector/1-logo-design-template_23-2151180197.jpg"
          alt="logo"
          style={styles.logoImage}
        />
        <h1 style={{ margin: 0 }}>Task Manager</h1>
      </Link>
      <nav>
        <ul style={styles.navLinks}>
          {username ? (
            <>
              <button onClick={logout} style={styles.button}>Logout</button>
              <li>
                <Link to="/create-assignment" style={styles.navItem}>
                  Create Assignment
                </Link>
              </li>
              <li>
                <Link to={`/login/profile/${userInfo.id}`} style={styles.navItem}>
                  <ProfileLogo name={username} />
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" style={styles.navItem}>Login</Link>
              </li>
              <li>
                <Link to="/register" style={styles.navItem}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
