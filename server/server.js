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
let message;

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
   username: String,
   password:String,
   googleId:String,
   facebook:String,
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
  callbackURL: "http://localhost:3000/auth/facebook/home",
  profileFields: ["id", "displayName", "photos", "email"]
}, 
(accesstoken, refreshToken, profile, cb) => {
   User.findOrCreate({facebook:profile.id, email:profile.email, username: profile.email}, (err, user) => {
     return cb(err,user);
   })
}
));

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get("/auth/facebook/home", 
  passport.authenticate("facebook", { failureRedirect: "/login"}),
  (req,res) => {
    // successfully authenticated, redirect home
    // TODO pass user as you redirect to home page
    res.redirect("/");
  });

app.get("/", (req,res) =>{
   if(req.isAuthenticated()){
    res.json({userId:req.user._id});
   } else {
    res.redirect("/login");
   }
});

app.post("/register", async (req,res) => {
   try{
     //Searching for users with the same username, trying to create users with the unique username
     const user = await User.findOne(({username: req.fields.email})); 
     if(user){
      message = "Username already taken";
      res.redirect(`/register`)
     }
     if(req.fields.password  === req.fields.confirmPassword){
      User.register({username: req.body.email, email: req.fields.email, posts:[],profilepic:"default"}, req.fields.password, (err, user) => {
        if(err){
          message = `An error occurred while signing up: ${err.message}`;
          res.redirect(`/register`);
        }
        else{
          passport.authenticate("local")(req, res, () => {
              const userN = JSON.stringify(user);
              res.redirect(`/`);
          })
        }
      })
     } else{
      res.json({message: "'Password' and 'Confirm Password' must be the exact same."});
     }
   } catch(err) {
       message = `An error has occurred: ${err.message}`;
       res.redirect(`/register`);
   }
});

app.post("/login", (req, res) => {
  try{
    const user = new user({
      username: req.body.email,
      password:req.body.password, 
    });
    req.login(user, (err) => {
      if(err){
        console.log(`An error occured while trying to log in: ${err.message}`);
        res.redirect("/login");
      } else{
        passport.authenticate("local", {
          failureRedirect: "/login",
          successRedirect:"/"
        })
      }
    })
  } catch(err){
    message =`An error occured: ${err.message}`
    res.redirect("/login");
  }
});

// Blog post API


app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.listen(port, () => {
    console.log(`API server is running on port ${port}`)
});