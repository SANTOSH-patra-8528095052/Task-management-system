import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../Layout/Sidebar";

const Challenges = () => {
  const [userData, setUserData] = useState({
    username: "",
    role: "student", // default
    section: "",
    semester: "",
    branch: "",
    avatar: "",
    aura_points: 0,
    credit_points: 0,
    _id: ""
  });
  
  // For teachers, store created challenges.
  const [teacherChallenges, setTeacherChallenges] = useState([]);
  // For students, store completed and uncompleted challenges.
  const [studentChallenges, setStudentChallenges] = useState({
    completed: [],
    uncompleted: []
  });
  
  const navigate = useNavigate();

  // Inline styling objects
  const containerStyle = {
    maxWidth: "800px",
    margin: "30px auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
  };

  const headerStyle = {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px"
  };

  const subHeaderStyle = {
    textAlign: "center",
    color: "#555",
    fontSize: "20px",
    marginBottom: "10px"
  };

  const buttonStyle = {
    padding: "10px 20px",
    marginBottom: "20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  };

  const listStyle = {
    listStyle: "none",
    padding: 0
  };

  const listItemStyle = {
    margin: "10px 0",
    padding: "12px 16px",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    transition: "background 0.3s"
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#007BFF",
    fontWeight: "bold"
  };

  // Fetch the user profile first, then fetch challenges based on the role.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:3000/profile", {
          method: "GET",
          credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const { user } = await response.json(); // Expecting { user: { ... } }
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Once we have the user, fetch challenges based on role.
  useEffect(() => {
    if (!userData._id) return;
  
    const fetchChallenges = async () => {
      try {
        let url = userData.role === "teacher"
          ? "http://localhost:3000/challenges/created"
          : "http://localhost:3000/challenges/student";
  
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
  
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(`Failed to fetch challenges: ${errorMessage}`);
        }
  
        const data = await res.json();
        
        if (userData.role === "teacher") {
          setTeacherChallenges(data);
        } else {
          setStudentChallenges(data);
        }
      } catch (err) {
        console.error("Error fetching challenges:", err.message);
      }
    };
  
    fetchChallenges();
  }, [userData]);
  

  const handleCreate = () => {
    navigate("/challenges/create");
  };

  return (
    <div style={containerStyle}>
      <Sidebar/>
      <h1 style={headerStyle}>Challenges</h1>
      {userData.role === "teacher" ? (
        <div>
          <button style={buttonStyle} onClick={handleCreate}>
            Create Challenge
          </button>
          <h2 style={subHeaderStyle}>Your Created Challenges</h2>
          <ul style={listStyle}>
            {teacherChallenges.map((challenge) => (
              <li key={challenge._id} style={listItemStyle}>
                <Link to={`/challenges/${challenge._id}`} style={linkStyle}>
                  {challenge.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2 style={subHeaderStyle}>Completed Challenges</h2>
          <ul style={listStyle}>
            {studentChallenges.completed.map((challenge) => (
              <li key={challenge._id} style={listItemStyle}>
                <Link to={`/challenges/${challenge._id}`} style={linkStyle}>
                  {challenge.title}
                </Link>
              </li>
            ))}
          </ul>
          <h2 style={subHeaderStyle}>Uncompleted Challenges</h2>
          <ul style={listStyle}>
            {studentChallenges.uncompleted.map((challenge) => (
              <li key={challenge._id} style={listItemStyle}>
                <Link to={`/challenges/${challenge._id}`} style={linkStyle}>
                  {challenge.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Challenges;
