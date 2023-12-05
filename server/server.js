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
import path from "path";
import fs from "fs";
import crypto from "crypto";

const app = express();
const port = 5000;
let message;
let gfs;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
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
    res.redirect("/");
  });

app.get("/", (req,res) =>{
   if(req.isAuthenticated()){
    console.log(req.user);
    res.json({userId:req.user, isAuthenticated: true});
   } else {
    res.json({isAuthenticated: false});
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
app.get("/api/posts/:id", async (req,res) => {
  if(req.isAuthenticated()){
    const post = await Post.findById(req.params.id);
    if(post){
      res.json({post});
    } else{
      res.json({message: `Post ${req.params.id} not found`});
    }
  } else{
    res.redirect("/");
  }
});

app.post("/api/posts", async (req,res) => {
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

app.patch("/api/posts/:id", async (req,res) => {
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