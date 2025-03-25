import { useEffect, useState, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";

function EditAssignment() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [aura_point, setAura_point] = useState(""); 
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch post data when component loads
    fetch("http://localhost:3000/assignment/" + id)
      .then((response) => response.json())
      .then((assignmentInfo) => {
        setTitle(assignmentInfo.title);
        setDescription(assignmentInfo.description);
        setDueDate(assignmentInfo.dueDate);
        setAura_point(assignmentInfo.aura_point);
         // Set the existing cover URL
        setLoading(false);
      });
  }, [id]);

  async function updateAssignment(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("description", description);
    data.set("dueDate", dueDate);
    data.set("aura_point",aura_point);
    data.set("id", id);

    // If a new file is selected, append it to FormData
    

    const response = await fetch("http://localhost:3000/assignment", {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  }


  if (redirect) {
    return <Navigate to={"/assignment/" + id} />;
  }

  if (loading) {
    return <p>Loading...</p>; // Show loading state until data is ready
  }


  return (
    <div className="assignment-form-container">
      <form className="assignment-form" onSubmit={updateAssignment}>
        <h1>Create an Assignment</h1>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={description}
            onChange={ev => setDescription(ev.target.value)}
          />
        </label>
        <label>
          Due Date:
          <input
            type="date"
            name="dueDate"
            value={dueDate}
            onChange={ev => setDueDate(ev.target.value)}
          />
        </label>
        <label>
          Aura Points:
          <input
            type="number"
            name="aura_point"
            value={aura_point}
            onChange={ev => setAura_point(ev.target.value)}
            min="1"
          />
        </label>
        <button type="submit">Update Assignment</button>
      </form>
    </div>
  )
}

export default EditAssignment