import React, { useState } from "react";
import { Navigate } from "react-router-dom";


const AssignmentForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    aura_point: "",
  });
  const [redirect, setRedirect] =useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    // Add API call to submit the data
    const data= new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('dueDate', formData.dueDate);
    data.append('aura_point', formData.aura_point);

    const response =await fetch('http://localhost:3000/assignment', {
      method: 'POST',
      body: data,
      credentials: "include"
    })
    if(response.ok) setRedirect(true);

  };

  if( redirect ) {
    return <Navigate to="/" />
  }

  return (
    <div className="assignment-form-container">
      <form className="assignment-form" onSubmit={handleSubmit}>
        <h1>Create an Assignment</h1>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Due Date:
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </label>
        <label>
          Aura Points:
          <input
            type="number"
            name="aura_point"
            value={formData.aura_point}
            onChange={handleChange}
            min="1"
          />
        </label>
        <button type="submit">Create Assignment</button>
      </form>
    </div>
  );
};

export default AssignmentForm;
