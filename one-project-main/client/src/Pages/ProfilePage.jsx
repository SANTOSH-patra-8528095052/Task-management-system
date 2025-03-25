import React, { useState, useEffect } from "react";
import Sidebar from "../Layout/Sidebar";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    role: "student",
    semester: "",
    branch:"None",
    section: "",
  });
  const [assignments, setAssignments] = useState({
    created: [],
    completed: [],
    uncompleted: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/profile", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setUserData(data.user);

        if (data.user.role === "teacher") {
          const createdResponse = await fetch("http://localhost:3000/assignments/created", {
            method: "GET",
            credentials: "include", // Include cookies
          });
          if (!createdResponse.ok) throw new Error("Failed to fetch created assignments");
          const createdData = await createdResponse.json();
          setAssignments((prev) => ({ ...prev, created: createdData }));
        } else if (data.user.role === "student") {
          const completedResponse = await fetch("http://localhost:3000/assignments/completed", {
            method: "GET",
            credentials: "include", // Include cookies
          });
          const uncompletedResponse = await fetch("http://localhost:3000/assignments/uncompleted", {
            method: "GET",
            credentials: "include", // Include cookies
          });
          if (!completedResponse.ok || !uncompletedResponse.ok)
            throw new Error("Failed to fetch student assignments");
          const [completedData, uncompletedData] = await Promise.all([
            completedResponse.json(),
            uncompletedResponse.json(),
          ]);
          setAssignments((prev) => ({
            ...prev,
            completed: completedData,
            uncompleted: uncompletedData,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include", // Include cookies in the request
      });
      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        console.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="content-wrapper">
      <Sidebar />
      <div className="profile-page">
        <h1>Profile Page</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Role:
            <select name="role" value={userData.role} onChange={handleInputChange}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </label>
          <label>
          Branch:{/*"CSE","ECE","CHEM_ENG","PIE","ME","CE","EE","IT","None"*/}
            <select name="branch" value={userData.branch} onChange={handleInputChange}>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="CHEM_ENG">CHEM_ENG</option>
              <option value="PIE">PIE</option>
              <option value="ME">ME</option>
              <option value="EE">EE</option>
              <option value="IT">IT</option>
              <option value="None">None</option>
            </select>
          </label>
          <label>
            Semester:
            <input
              type="text"
              name="semester"
              value={userData.semester}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Section:
            <input
              type="text"
              name="section"
              value={userData.section}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Update Profile</button>
        </form>
        <div className="role-specific-content">
          {userData.role === "teacher" ? (
            <div>
              <h2>Created Assignments</h2>
              <ul>
                {assignments.created.map((assignment) => (
                  <li key={assignment._id}>{assignment.title}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <h2>Uncompleted Assignments</h2>
              <ul>
                {assignments.uncompleted.map((assignment) => (
                  <li key={assignment._id}>{assignment.title}</li>
                ))}
              </ul>
              <h2>Completed Assignments</h2>
              <ul>
                {assignments.completed.map((assignment) => (
                  <li key={assignment._id}>{assignment.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
