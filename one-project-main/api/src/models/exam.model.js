import mongoose, { Schema } from "mongoose" ;

const ExamSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
    },
    aura_point: {
        type: Number,
    },
    semester:{
        type:Number,
        enum:[1,2,3,4,5,6,7,8],
        default:1,
    },
    branch:{
        type:String,
        enum:["CSE","ECE","CHEM_ENG","PIE","ME","CE","EE","IT","None"],
        default:"CSE",
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
   
},{timestamps : true})

export const Exam = mongoose.model("Exam" , ExamSchema);