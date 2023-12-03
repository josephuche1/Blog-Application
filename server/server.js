import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import formidableMiddleware from "express-formidable";
import session from "express-session";
import passport from "passport"; 
import passportLocalMongoose from "passport-local-mongoose";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import findOrCreate from "mongoose-findorcreate";

const app = express();
const port = 5000;

app.use(cors());
app.use(formidableMiddleware());

// setting up user authentication
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(process.env.DB)
  .then(() => {
    console.log("Connected to database successfully");
  })
  .catch((err) => {
    console.log(`Failed to connect to database: ${err.message}`)
  });

const postSchema = new mongoose.Schema({
  text:String,
  likes:Number,
  comments: [String], // Store the comments in an array with as the comment id 
  image:String,
});

const userSchema = new mongoose.Schema({
   email:String,
   password:String,
   googleId:String,
   posts:[String], // Store user posts in an array with the post id
   profilepic:String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("user", userSchema);
const Post = mongoose.model("post", postSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new FacebookStrategy({
  clientID: process.env.APP_ID,
  clientSecret: process.env.APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/home"
}, 
(accesstoken, refreshToken, profile, cb) => {
   User.findOrCreate({facebook:profile.id}, (err, user) => {
     return cb(err,user);
   })
}
));



app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.listen(port, () => {
    console.log(`API server is running  on port ${port}`)
});