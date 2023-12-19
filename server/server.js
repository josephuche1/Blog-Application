import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport, { Passport } from "passport"; 
import passportLocalMongoose from "passport-local-mongoose";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import findOrCreate from "mongoose-findorcreate";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import bodyParser from "body-parser";
import Formidable from "express-formidable";

const app = express();
const port = 5000;
let message;
let gfs;

app.use(cors({
  origin: "http://localhost:3000", // Replace with your frontend origin
  credentials: true
}));
app.use(bodyParser.json())

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

const conn = mongoose.connection;

conn.once("open", () => {
  gfs =new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'postImages'
  });
});

const postSchema = new mongoose.Schema({
  text:String,
  likes:Number,
  comments: [String], // Store the comments in an array with as the comment id 
  image:String,
  timestamp:String,
  author: String
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

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    });
});

// passport.use(new FacebookStrategy({
//   clientID: process.env.APP_ID,
//   clientSecret: process.env.APP_SECRET,
//   callbackURL: "http://localhost:3000/auth/facebook/home",
//   profileFields: ["id", "displayName", "photos", "email"]
// }, 
// (accesstoken, refreshToken, profile, cb) => {
//    User.findOrCreate({facebook:profile.id, email:profile.email, username: profile.email}, (err, user) => {
//      return cb(err,user);
//    })
// }
// ));

// app.get("/auth/facebook", passport.authenticate("facebook"));

// app.get("/auth/facebook/home", 
//   passport.authenticate("facebook", { failureRedirect: "http://localhost:3000/login"}),
//   (req,res) => {
//     // successfully authenticated, redirect home
//     res.redirect("http://localhost:3000/");
//   });

// app.get("/findUser/:username" , async (req,res) => {
//   try{
//     const user = await User.findOne({username: req.params.username});
//     if(user){
//       res.json({isFound: true});
//     } else{
//       res.json({isFound: false});
//     }
//   } catch(err){
//     res.status(500).json({error: err.message});
//   }
// });

app.get("/", (req,res) =>{
   if(req.isAuthenticated()){
    console.log(req.user);
    res.json({userId:req.user, isAuthenticated: true});
   } else {
    console.log("Not authenticated");
    res.json({isAuthenticated: false});
   }
});

app.post("/register", (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  User.register({ username: username},password, (err, user) => {
    if (err) {
      const message = `An error occurred while signing up: ${err.message}`;
      res.json({isAuthenticated: false, error: message});
    }
    passport.authenticate("local")(req, res, function(){
      res.json({isAuthenticated: true, user: user});
    });
  });
});


app.post("/login", (req, res) => {
  try{
    const user = new user({
      username: req.body.username,
      password:req.body.password, 
    });
    req.login(user, (err) => {
      if(err){
        res.json({isAuthenticated: false, error:err.message});
      } else{
        passport.authenticate("local", () => {
          res.json({isAuthenticated: true, user:user});
        })
      }
    })
  } catch(err){
    message =`An error occured: ${err.message}`
    res.redirect("/login");
  }
});

// Blog post API
app.get("/api/posts/:id", async (req,res) => {
  if(req.isAuthenticated()){
    const post = await Post.findById(req.params.id);
    if(post){
      res.json({post});
    } else{
      res.json({message: `Post ${req.params.id} not found`});
    }
  } else{
    res.json({isAuthenticated: false});
  }
});

app.post("/api/posts", Formidable(), async (req,res) => {
    try{
      if(req.files.image.name != ""){
        const image = req.files.image;
        const buf = crypto.randomBytes(16);
        const filePath = buf.toString("hex")+path.extname(image.name);

        const readStream = fs.createReadStream(image.path);

        const uploadStream = gfs.openUploadStream(filePath, {
          chunkSizeBytes:1048576,
          metadata:{
            name: image.name,
            size:image.size,
            type: image.type
          }
        });
        readStream.pipe(uploadStream);
        uploadStream.on("finish", async () => {
          const newPost = new Post({
            image:filePath,
            text: req.fields.text,
            likes: 0,
            comments:[],
            timestamp:new Date(),
            author:req.fields.author
          })
          await newPost.save();
          res.json(newPost);
        })
      } else{
        const newPost = new Post({
          text: req.fields.text,
          likes: 0,
          comments:[],
          timestamp:new Date()
        })
        await newPost.save();
        res.json(newPost);
      }
    } catch(err){
       res.json({message: `An error has occured: ${err.messsage}`});
    }
});

app.get("/api/posts", async (req,res) => {
   try{
    const posts = await Post.find({});
    if(posts.length !== 0){
       res.json(posts);
    }
    else{
      res.json({message: "No posts yet"});
    }
   } catch(err){
     res.status(500).json({error: err.message});
   }
   
});

app.patch("/api/posts/:id", Formidabble(), async (req,res) => {
  const post = await Post.findById(req.params.id);
  try{
    if(req.files.image.name != ""){
      if(post.image != "" || post.image){
        const old =gfs.find({filename: post.image}).toArray();
        if(post.length != 0){
          await gfs.delete(old[0]._id);
        }
      }
      const image = req.files.image;
      const buf = crypto.randomBytes(16);
      const filePath = buf.toString("hex")+path.extname(image.name);

      const readStream = fs.createReadStream(image.path);

      const uploadStream = gfs.openUploadStream(filePath, {
        chunkSizeBytes:1048576,
        metadata:{
          name: image.name,
          size:image.size,
          type: image.type
        }
      });
      readStream.pipe(uploadStream);
      uploadStream.on("finish",async () => {
        post.image = filePath;
        await post.save();
      })
    } 
    post.text = post.text || req.fields.text;
    post.timestamp = new Date();
    await post.save();
    res.json(post);
    
  } catch(err){
     res.json({message: `An error has occured: ${err.messsage}`});
  }
});

app.delete("/ap/posts/:id", async (req, res) => {
   try{
     await Post.findById(req.params.id)
        .then(async (post) => {
          const image = await gfs.find({filename: post.image}).toArray();
          if(image.length != 0){
            await gfs.delete(image[0]._id);
          }
          await Post.findByIdAndDelete(req.params.id);
          res.status(200).json({message: "Successfully deleted"});
        })
        .catch((err) => {
          console.log(`Error: ${err.message}`)
          res.json({message: `An error has occured.Please try again later`});
        });
   }catch(err){
     console.log(`Error: ${err.message}`)
     res.status(500).send(`We are fixing the problem right away. Please try again later`);
   }
});

app.get("/api/isAuthenticated", (req,res) => {
 
    if(req.isAuthenticated()){
      res.json({isAuthenticated: true});
    } else{
      res.json({isAuthenticated: false});
    }
});

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.listen(port, () => {
    console.log(`API server is running on port ${port}`)
});