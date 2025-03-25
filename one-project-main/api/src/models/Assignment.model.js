import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
    },
    aura_point:{
        type:Number,
    },
    complete:{
        type:Boolean,
        default:false
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
},{timestamps:true})

export const Assignment= mongoose.model("Assignment",assignmentSchema)