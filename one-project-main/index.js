import dotenv from "dotenv";
dotenv.config({path:'../.env'})
import { User } from "./models/User.model.js";
import { Assignment } from "./models/Assignment.model.js";
import multer from 'multer'


import cors from 'cors'
import express from 'express'
import connectDB from './db/index.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'


const app=express()
const upload=multer()
const salt = bcrypt.genSaltSync(10);
const secret = "jn4k5n6n5nnn6oi4n";

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.static("public"))
app.use(express.json())
app.use(cookieParser())


connectDB().then( () =>{
    app.listen(process.env.PORT || 3000 , () =>{
        console.log(`😁server is running at port : ${process.env.PORT}`);
    })
}).catch((err) => {
    console.log('MONGO DB connection failed !!! ',err)
})


app.post("/register", async (req, res) => {
    console.log(req.body);
    
    const { username, password } = req.body;
    try {
      const userDoc = await User.create({
        username,
        password: bcrypt.hashSync(password, salt),
      });
      res.json(userDoc);
    } catch (error) {
      res.status(400).json(error);
    }
  });

  app.get("/header", async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) throw err;
      res.json(info);
    });
  });


  app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const userDoc = await User.findOne({ username });
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        // logged in
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({
            id: userDoc._id,
            username,
          });
        });
      } else {
        res.status(400).json("wrong credentials");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  });

  app.post("/logout", async (req, res) => {
    res.cookie("token", "").json("ok you are logout");
  });

  app.post("/assignment",upload.none(), async (req,res) =>{
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async(err, info) => {
      if (err) throw err;
      const {title, description,dueDate,aura_point} = req.body
      const assignmnetDoc= await Assignment.create({
        title,
        description,
        dueDate,
        aura_point,
        author:info.id,
      })
      res.json(assignmnetDoc)
    })
  })

  app.get("/assignment", async (req, res) => {
    const assignments = await Assignment.find()
      .populate("author",['username'])
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(assignments);
  });

  app.get('/assignment/:id', async (req,res) =>{
    const {id} = req.params;
    const assignmentDoc = await Assignment.findById(id).populate('author',['username'])
    res.json(assignmentDoc)
})

app.put('/assignment',upload.none(), async (req,res) =>{

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const {id, title, description,dueDate,aura_point} = req.body
      const assignmentDoc = await Assignment.findById(id);
      const isAuthor= JSON.stringify(assignmentDoc.author)===JSON.stringify(info.id)
      if( !isAuthor ){
          return res.status(400).json('you are not the author');
      }

      await assignmentDoc.updateOne({title, description,dueDate,aura_point})

      res.json(assignmentDoc);
   });

})













// 