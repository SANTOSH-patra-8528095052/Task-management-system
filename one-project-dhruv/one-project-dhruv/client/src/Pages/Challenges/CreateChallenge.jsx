import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateChallenge = () => {
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState("");
  const [questionsSet, setQuestionsSet] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    rewardAura: 0,
    rewardCredit: 0,
    chapters: [
      {
        description: "",
        questions: [] // Initially empty; will be set after entering question count
      }
    ]
  });

  // Handle changes for general fields, chapter description, and individual questions
  const handleChange = (e, chapterIndex = 0, questionIndex = null) => {
    const { name, value } = e.target;
    if (["title", "rewardAura", "rewardCredit"].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === "description") {
      const updatedChapters = [...formData.chapters];
      updatedChapters[chapterIndex].description = value;
      setFormData(prev => ({ ...prev, chapters: updatedChapters }));
    } else if (name === "question" || name === "answer") {
      const updatedChapters = [...formData.chapters];
      updatedChapters[chapterIndex].questions[questionIndex][name] = value;
      setFormData(prev => ({ ...prev, chapters: updatedChapters }));
    }
  };

  // When user sets the number of questions, initialize the questions array
  const handleSetQuestions = (e) => {
    e.preventDefault();
    const num = parseInt(questionCount);
    if (isNaN(num) || num <= 0) {
      alert("Please enter a valid number of questions.");
      return;
    }
    const questionsArray = [];
    for (let i = 0; i < num; i++) {
      questionsArray.push({ question: "", answer: "Yes" });
    }
    setFormData(prev => {
      const updatedChapters = [...prev.chapters];
      updatedChapters[0].questions = questionsArray;
      return { ...prev, chapters: updatedChapters };
    });
    setQuestionsSet(true);
  };

  // On submission, send formData to the server
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/challenges", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create challenge");
        return res.json();
      })
      .then((data) => {
        alert("Challenge created successfully!");
        navigate("/challenges");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to create challenge.");
      });
  };

  // Inline styling objects
  const containerStyle = {
    maxWidth: "800px",
    margin: "50px auto",
    padding: "30px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const headerStyle = {
    textAlign: "center",
    color: "#333",
    marginBottom: "30px",
    fontSize: "28px"
  };

  const formGroupStyle = {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column"
  };

  const labelStyle = {
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#555"
  };

  const inputStyle = {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  };

  const textAreaStyle = {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    resize: "vertical"
  };

  const buttonStyle = {
    padding: "12px 20px",
    fontSize: "18px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px"
  };

  const chapterHeaderStyle = {
    fontSize: "22px",
    color: "#333",
    marginBottom: "15px",
    textDecoration: "underline"
  };

  const questionContainerStyle = {
    marginBottom: "15px",
    padding: "10px",
    border: "1px solid #eee",
    borderRadius: "4px",
    background: "#fafafa"
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Create Challenge</h1>
      {/* Step 1: Ask how many questions */}
      {!questionsSet ? (
        <form onSubmit={handleSetQuestions}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>How many questions do you want to ask?</label>
            <input
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>Set Questions</button>
        </form>
      ) : (
        /* Step 2: Render full challenge creation form */
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Title:</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Reward Aura:</label>
            <input
              type="number"
              name="rewardAura"
              value={formData.rewardAura}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Reward Credit:</label>
            <input
              type="number"
              name="rewardCredit"
              value={formData.rewardCredit}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          {/* Single chapter for simplicity */}
          <div style={formGroupStyle}>
            <h2 style={chapterHeaderStyle}>Chapter 1</h2>
            <label style={labelStyle}>Description (max 400 characters):</label>
            <textarea
              name="description"
              value={formData.chapters[0].description}
              onChange={(e) => handleChange(e, 0)}
              maxLength="400"
              required
              style={textAreaStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <h3 style={{ ...chapterHeaderStyle, fontSize: "20px", textDecoration: "none" }}>
              Questions
            </h3>
            {formData.chapters[0].questions.map((q, index) => (
              <div key={index} style={questionContainerStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Question:</label>
                  <input
                    name="question"
                    value={q.question}
                    onChange={(e) => handleChange(e, 0, index)}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Answer:</label>
                  <select
                    name="answer"
                    value={q.answer}
                    onChange={(e) => handleChange(e, 0, index)}
                    required
                    style={inputStyle}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
          <button type="submit" style={buttonStyle}>
            Create Challenge
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateChallenge;
