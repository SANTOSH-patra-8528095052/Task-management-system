import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { Assignment } from "../models/Assignment.model.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import cookieParser from 'cookie-parser'

const examdetails = asyncHandler( async (req,res) => {
    
})