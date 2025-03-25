import React, { useState, useEffect } from "react";
import Sidebar from "../Layout/Sidebar";

const Assignments = () => {
  const [userData, setUserData] = useState({
    username: "",
    role: "student",
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
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setUserData(data.user);

        if (data.user.role === "teacher") {
          const createdResponse = await fetch("http://localhost:3000/assignments/created", {
            method: "GET",
            credentials: "include",
          });
          if (!createdResponse.ok) throw new Error("Failed to fetch created assignments");
          const createdData = await createdResponse.json();
          setAssignments((prev) => ({ ...prev, created: createdData }));
        } else if (data.user.role === "student") {
          const completedResponse = await fetch("http://localhost:3000/assignments/completed", {
            method: "GET",
            credentials: "include",
          });
          const uncompletedResponse = await fetch("http://localhost:3000/assignments/uncompleted", {
            method: "GET",
            credentials: "include",
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

  const handleCompleteAssignment = async (assignmentId) => {
    try {
      const response = await fetch("http://localhost:3000/assignments/update-completed", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignmentId }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update completed assignments");
      alert("Assignment marked as completed!");

      // Refresh assignments after update
      const updatedUncompleted = assignments.uncompleted.filter(
        (assignment) => assignment._id !== assignmentId
      );
      const updatedCompleted = [
        ...assignments.completed,
        assignments.uncompleted.find((assignment) => assignment._id === assignmentId),
      ];

      setAssignments({
        ...assignments,
        uncompleted: updatedUncompleted,
        completed: updatedCompleted,
      });
    } catch (error) {
      console.error("Error updating completed assignment:", error);
    }
  };

  return (
    <div className="assignments-wrapper">
      <Sidebar />
      <div className="assignments-container">
        <h1>Assignments</h1>
        {userData.role === "teacher" ? (
          <div>
            <h2>Created Assignments</h2>
            <div className="assignment-list">
              {assignments.created.length > 0 ? (
                assignments.created.map((assignment) => (
                  <div className="assignment-card" key={assignment._id}>
                    <h3>{assignment.title}</h3>
                    <p>{assignment.description}</p>
                    <p><strong>Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    <p><strong>Points:</strong> {assignment.aura_point}</p>
                  </div>
                ))
              ) : (
                <p>No created assignments found.</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div>
              <h2>Uncompleted Assignments</h2>
              <div className="assignment-list">
                {assignments.uncompleted.length > 0 ? (
                  assignments.uncompleted.map((assignment) => (
                    <div className="assignment-card" key={assignment._id}>
                      <h3>{assignment.title}</h3>
                      <p>{assignment.description}</p>
                      <p><strong>Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
                      <p><strong>Points:</strong> {assignment.aura_point}</p>
                      <button
                        className="mark-complete-btn"
                        onClick={() => handleCompleteAssignment(assignment._id)}
                      >
                        Mark as Completed
                      </button>
                    </div>
                  ))
                ) : (
                  <p>All assignments completed!</p>
                )}
              </div>
            </div>
            <div>
              <h2>Completed Assignments</h2>
              <div className="assignment-list">
                {assignments.completed.length > 0 ? (
                  assignments.completed.map((assignment) => (
                    <div className="assignment-card" key={assignment._id}>
                      <h3>{assignment.title}</h3>
                      <p>{assignment.description}</p>
                      <p><strong>Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
                      <p><strong>Points:</strong> {assignment.aura_point}</p>
                    </div>
                  ))
                ) : (
                  <p>No completed assignments found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
