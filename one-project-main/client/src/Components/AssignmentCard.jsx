import React from "react";
import { Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";

const AssignmentCard = ({ _id,title, description, dueDate, aura_point, author }) => {
  return (
    <div className="assignment-card-container">
      <div className="assignment-card">
        <h2 className="assignment-card-title">{title}</h2>
        {/* <p className="assignment-card-description">{description}</p> */}
        <div className="assignment-card-details">
          <p><strong>Due Date:</strong> <time>{formatISO9075(new Date(dueDate))}</time></p>
          <p><strong>Aura Points:</strong> {aura_point}</p>
          <p><strong>Author:</strong> {author.username}</p>
        </div>
        <Link to={`/assignment/${_id}`}>Read more</Link>
      </div>
    </div>
  );
};

export default AssignmentCard;
