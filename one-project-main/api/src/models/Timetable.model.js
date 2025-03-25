import mongoose ,{Schema} from "mongoose";

const TimetableSchema = new mongoose.Schema({
    crId: String,
    timetable: [
      {
        day: String,
        slots: [{ subject: String, time: String }],
      },
    ],
  });

  export const TimeTable = mongoose.model("Timetable",TimetableSchema);