import React, { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { UserContext } from '../UserContext';
import { CiEdit } from "react-icons/ci";
import { useParams, Link } from 'react-router-dom';
import { formatISO9075 } from "date-fns";
// import './AssignmentPage.css'; // Make sure to create this CSS file for styling

function AssignmentPage() {
    const [assignmentInfo, setAssignmentInfo] = useState(null);
    const { userInfo } = useContext(UserContext);
    const { id } = useParams();
    useEffect(() => {
        fetch(`http://localhost:3000/assignment/${id}`).then(response => {
            response.json().then(assignmentInfo => {
                setAssignmentInfo(assignmentInfo);
            });
        });
    }, [id]);

    if (!assignmentInfo) return '';

    return (
        <div className="assignment-card">
            <div className="assignment-header">
                <h1 className="assignment-title">{assignmentInfo.title}</h1>
                <p className="assignment-author">By: {assignmentInfo.author.username}</p>
            </div>
            <div className="assignment-body">
                <p className="assignment-description">{assignmentInfo.description}</p>
                <div className="assignment-details">
                    <p><strong>Posted At: </strong> <time>{formatISO9075(new Date(assignmentInfo.createdAt))}</time></p>
                    <p><strong>Due Date: </strong> <time>{formatISO9075(new Date(assignmentInfo.dueDate))}</time></p>
                    <p><strong>Aura Points:</strong> {assignmentInfo.aura_point}</p>
                </div>
            </div>
            {userInfo.id === assignmentInfo.author._id && (
                <div className="edit-row">
                    <Link className="edit-btn" to={`/edit/${assignmentInfo._id}`}>
                        <CiEdit />
                        Edit this Post
                    </Link>
                </div>
            )}
            <div className="assignment-actions">
                <Link to="/" className="back-link">Back to Assignments</Link>
            </div>
        </div>
    );
}

export default AssignmentPage;
