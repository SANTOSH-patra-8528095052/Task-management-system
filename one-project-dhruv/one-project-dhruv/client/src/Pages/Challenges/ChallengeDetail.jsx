import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [answers, setAnswers] = useState([]); // Answers structured by chapter

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await fetch(`http://localhost:3000/challenges/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch challenge details");
        }
        const data = await res.json();
        setChallenge(data);

        // Initialize answers with empty values based on chapters/questions
        const initAnswers = data.chapters.map((chap) =>
          chap.questions.map(() => "")
        );
        setAnswers(initAnswers);
      } catch (error) {
        console.error("Error fetching challenge:", error);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleAnswerChange = (chapIndex, quesIndex, value) => {
    setAnswers((prevAnswers) => {
      const updated = [...prevAnswers];
      updated[chapIndex][quesIndex] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`http://localhost:3000/challenges/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure cookies are sent with the request
        body: JSON.stringify({ answers }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed.");
  
      alert(data.message);
      navigate("/challenges");
    } catch (error) {
      alert(error.message || "Submission failed.");
    }
  };
  

  if (!challenge) return <div style={containerStyle}>Loading...</div>;

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{challenge.title}</h1>
      {challenge.chapters.map((chapter, chapIndex) => (
        <div key={chapIndex} style={chapterContainerStyle}>
          <h2 style={chapterHeaderStyle}>Chapter {chapIndex + 1}</h2>
          <p style={descriptionStyle}>{chapter.description}</p>
          {chapter.questions.map((q, quesIndex) => (
            <div key={quesIndex} style={questionContainerStyle}>
              <p style={questionTextStyle}>
                <strong>Q:</strong> {q.question}
              </p>
              <div>
                <label style={radioLabelStyle}>
                  <input
                    type="radio"
                    name={`chapter-${chapIndex}-question-${quesIndex}`}
                    value="Yes"
                    checked={answers[chapIndex]?.[quesIndex] === "Yes"}
                    onChange={(e) =>
                      handleAnswerChange(chapIndex, quesIndex, e.target.value)
                    }
                    style={{ marginRight: "5px" }}
                  />
                  Yes
                </label>
                <label style={radioLabelStyle}>
                  <input
                    type="radio"
                    name={`chapter-${chapIndex}-question-${quesIndex}`}
                    value="No"
                    checked={answers[chapIndex]?.[quesIndex] === "No"}
                    onChange={(e) =>
                      handleAnswerChange(chapIndex, quesIndex, e.target.value)
                    }
                    style={{ marginRight: "5px" }}
                  />
                  No
                </label>
              </div>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit} style={buttonStyle}>
        Submit Answers
      </button>
    </div>
  );
};

// Inline styles remain unchanged
const containerStyle = {
  maxWidth: "800px",
  margin: "50px auto",
  padding: "30px",
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const titleStyle = {
  textAlign: "center",
  color: "#333",
  marginBottom: "30px",
  fontSize: "28px",
};

const chapterContainerStyle = {
  marginBottom: "20px",
  padding: "20px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
};

const chapterHeaderStyle = {
  fontSize: "22px",
  color: "#444",
  marginBottom: "10px",
  borderBottom: "1px solid #ccc",
  paddingBottom: "5px",
};

const descriptionStyle = {
  color: "#666",
  marginBottom: "15px",
  lineHeight: "1.6",
};

const questionContainerStyle = {
  marginBottom: "15px",
  padding: "10px",
  backgroundColor: "#f0f0f0",
  borderRadius: "4px",
};

const questionTextStyle = {
  fontSize: "16px",
  color: "#555",
  marginBottom: "8px",
};

const radioLabelStyle = {
  marginRight: "15px",
  fontSize: "16px",
  color: "#333",
  cursor: "pointer",
};

const buttonStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  fontSize: "18px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "20px",
};

export default ChallengeDetail;
