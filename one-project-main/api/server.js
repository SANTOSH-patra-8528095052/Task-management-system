const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:3000/task_management", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TimetableSchema = new mongoose.Schema({
  crId: String,
  timetable: [
    {
      day: String,
      slots: [{ subject: String, time: String }],
    },
  ],
});

const Timetable = mongoose.model("Timetable", TimetableSchema);

app.post("/create-timetable", async (req, res) => {
  const { crId, timetable } = req.body;
  try {
    const newTimetable = new Timetable({ crId, timetable });
    await newTimetable.save();
    res.status(201).json({ message: "Timetable created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error creating timetable" });
  }
});

app.get("/get-timetable/:crId", async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ crId: req.params.crId });
    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ error: "Error fetching timetable" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
