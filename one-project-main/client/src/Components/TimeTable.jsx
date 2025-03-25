import React, { useState } from "react";
import axios from "axios";

const Timetable = () => {
  const [crId, setCrId] = useState("");
  const [timetable, setTimetable] = useState([
    { day: "Monday", slots: [{ subject: "", time: "" }] },
  ]);

  const addSlot = (index) => {
    const newTimetable = [...timetable];
    newTimetable[index].slots.push({ subject: "", time: "" });
    setTimetable(newTimetable);
  };

  const handleChange = (dayIndex, slotIndex, field, value) => {
    const newTimetable = [...timetable];
    newTimetable[dayIndex].slots[slotIndex][field] = value;
    setTimetable(newTimetable);
  };

  const handleSubmit = async () => {
    await axios.post("http://localhost:5000/create-timetable", { crId, timetable });
    alert("Timetable created successfully!");
  };

  return (
    <div>
      <h2>Create Timetable</h2>
      <input
        type="text"
        placeholder="Enter CR ID"
        value={crId}
        onChange={(e) => setCrId(e.target.value)}
      />
      {timetable.map((day, dayIndex) => (
        <div key={dayIndex}>
          <h3>{day.day}</h3>
          {day.slots.map((slot, slotIndex) => (
            <div key={slotIndex}>
              <input
                type="text"
                placeholder="Subject"
                value={slot.subject}
                onChange={(e) =>
                  handleChange(dayIndex, slotIndex, "subject", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Time"
                value={slot.time}
                onChange={(e) =>
                  handleChange(dayIndex, slotIndex, "time", e.target.value)
                }
              />
            </div>
          ))}
          <button onClick={() => addSlot(dayIndex)}>Add Slot</button>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Timetable</button>
    </div>
  );
};

export default Timetable;
