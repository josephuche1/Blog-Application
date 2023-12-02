import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import formidable from "formidable";
import session from "express-sesion";
import passport from "passport"; 
import passportLocalMongoose from "passport-local-mongoose";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import findorCreate from "mongoose-findorcreate";

const app = express();
const port = 5000;

app.use(cors());

mongoose.connect(process.env.DB)
  .then(() => {
    console.log("Connected to database successfully");
  })
  .catch((err) => {
    console.log(`Failed to connect to database: ${err.message}`)
  });

const postSchema = new mongoose.Schema({
  text:String,
  likes:Nummber,
  comments: [postSchema],
  image:String,
});

const userSchema = new mongoose.Schema({
   email:String,
   password:String,
   googleId:String,
   posts:[postShema],
   profilepic:String
});

const User = mongoose.model("user", userSchema);
const Post = mongoose.model("post", postSchema);



app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.listen(port, () => {
    console.log(`API server is running  on porti ${port}`)
});