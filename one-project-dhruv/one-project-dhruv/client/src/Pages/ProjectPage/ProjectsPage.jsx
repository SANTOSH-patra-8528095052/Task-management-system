
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../Layout/Sidebar";

function ProjectPage() {
  const { id } = useParams(); // This is the projectId
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:3000/projects/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch project details. Status: ${response.status}`);
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError("Failed to fetch project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Call the endpoint that uploads the file and updates the project,
      // then adds the project to the user's submittedProjects.
      const response = await fetch(`http://localhost:3000/submit-project/${id}`, {
        method: "POST",
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Project submission failed.");
      }

      const result = await response.json();
      alert(result.message);
      // Update local state if needed. For example, mark project as submitted.
      setProject((prev) => ({ ...prev, status: "submitted" }));
      // Optionally, navigate to dashboard or another page:
      // navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.projectPage}>
      <Sidebar/>
      {project && (
        <div style={styles.projectContainer}>
          <h1 style={styles.projectTitle}>{project.title || "Untitled Project"}</h1>
          <p style={styles.projectDescription}>
            {project.description || "No description available."}
          </p>

          <div style={styles.projectSection}>
            <h2>Submitter:</h2>
            <p>{project.submitter ? project.submitter.username : "Unknown"}</p>
          </div>

          <div style={styles.projectSection}>
            <h2>Files:</h2>
            {project.files && project.files.length > 0 ? (
              project.files.map((file, index) => (
                <div key={index} style={styles.fileItem}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.fileLink}
                  >
                    {file.fileType?.toUpperCase() || "Unknown"} File
                  </a>
                </div>
              ))
            ) : (
              <p>No files uploaded.</p>
            )}
          </div>

          <div style={styles.projectSection}>
            <h2>Status:</h2>
            <p>{project.status || "Unknown"}</p>
          </div>

          <div style={styles.projectSection}>
            <h2>Tags:</h2>
            {project.tags && project.tags.length > 0 ? (
              <ul>
                {project.tags.map((tag, index) => (
                  <li key={index}>{tag}</li>
                ))}
              </ul>
            ) : (
              <p>No tags available.</p>
            )}
          </div>

          {project.feedback && (
            <div style={styles.projectSection}>
              <h2>Feedback:</h2>
              <p>{project.feedback}</p>
            </div>
          )}

          {/* File Upload Section */}
          <div style={styles.projectSection}>
            <h2>Upload Completed File:</h2>
            <input type="file" onChange={handleFileChange} style={styles.fileInput} />
          </div>

          {/* Submit Project Button */}
          <div style={styles.projectSection}>
            <button
              onClick={handleSubmit}
              disabled={uploading || project.status === "submitted"}
              style={
                uploading || project.status === "submitted"
                  ? styles.disabledButton
                  : styles.submitButton
              }
            >
              {uploading
                ? "Uploading..."
                : project.status === "submitted"
                ? "Project Submitted"
                : "Submit Project"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  projectPage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f4f9",
    padding: "20px",
  },
  projectContainer: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "700px",
  },
  projectTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  projectDescription: {
    fontSize: "16px",
    color: "#555",
    textAlign: "center",
    marginBottom: "15px",
  },
  projectSection: {
    marginTop: "15px",
    padding: "15px",
    background: "#f9f9f9",
    borderRadius: "8px",
  },
  fileItem: {
    margin: "8px 0",
  },
  fileLink: {
    textDecoration: "none",
    color: "#007bff",
    fontWeight: "bold",
    transition: "0.3s",
  },
  fileInput: {
    display: "block",
    margin: "10px 0",
  },
  submitButton: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    background: "#28a745",
    color: "white",
    transition: "0.3s",
  },
  disabledButton: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
    background: "#ccc",
    color: "#666",
    cursor: "not-allowed",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
  },
  error: {
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
    color: "red",
  },
};

export default ProjectPage;
