import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport"; 
import passportLocalMongoose from "passport-local-mongoose";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import bodyParser from "body-parser";
import Formidable from "express-formidable";
import http from "http"; 
import {Server} from 'socket.io';

const app = express();
const port = 5000;
let message;
let gfs;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // This is your client's origin
    methods: ["GET", "POST"], // Allow these HTTP methods
    credentials: true // Allow cookies
  }
});


const userSockets = {};

app.use(cors({
  origin: "http://localhost:3000", // Replace with your frontend origin
  credentials: true,
  method: ["GET", "POST", "PATCH", "DELETE"]
}));

io.on("connection", (socket)  => {
  socket.on("user connected", (userId) => {
    userSockets[userId] = socket.id;
  });

  socket.on("notify", (data, userId, cb) => {
    io.to(userSockets[userId]).emit("notification", data);
    cb();
  })
  socket.on("disconnect", () => {
    // Remove the user's socket when they disconnect
    for (let userId in userSockets) {
      if (userSockets[userId] === socket) {
        delete userSockets[userId];
      }
    }
  });
})

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
   profilepic:String,
   likedPosts:[String], // Store the liked posts in an array with the post id
});

userSchema.plugin(passportLocalMongoose);

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


app.get("/", (req,res) =>{
   if(req.isAuthenticated()){
    res.json({user:req.user, isAuthenticated: true});
   } else {
    res.json({isAuthenticated: false});
   }
});

app.post("/register", bodyParser.json(), (req, res) => {
   try{
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
   } catch(err){
      message =`An error occured: ${err.message}`
      res.json({isAuthenticated: false, error: message});
    
   }
});

app.post("/login", bodyParser.json(), (req, res) => {
  try{
    const user = new User({
      username: req.body.username,
      password:req.body.password, 
    });
    req.login(user, (err) => {
      if(err){
        res.json({isAuthenticated: false, error:err.message});
      } else{
        passport.authenticate("local")(req, res, async () => {
          res.json({isAuthenticated: true, user: user});
        });
      }
    })
  } catch(err){
    message =`An error occured: ${err.message}`
    res.json({isAuthenticated: false, error: message});
  }
});

app.get("/logout", (req,res) => {
  req.logout(() => {
    res.json({isAuthenticated: false});
  })
  
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
      const author = await User.findById(req.fields.author);
      if(author){
        if(req.files.image){
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
              author:author.username
            })
            await newPost.save();
            author.posts.push(newPost._id);
            await author.save();
            io.emit("new post", newPost);
            res.json({newPost: newPost, message: "success"});
          })
        } else{
          const newPost = new Post({
            text: req.fields.text,
            likes: 0,
            comments:[],
            timestamp:new Date(),
            author:author.username
          })
          await newPost.save();
          author.posts.push(newPost._id);
          await author.save();
          io.emit("new post", newPost);
          res.json({newPost: newPost, message: "success"});
        }
        
      } else{
        res.json({message: "User not found"});
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
     res.json({error: err.message});
   }
   
});

app.patch("/api/posts/:id", Formidable(), async (req,res) => {
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
          res.json({message: "Successfully deleted"});
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

app.get("/api/getUser", (req,res) => {
  if(req.isAuthenticated()){
    res.json({user: req.user});
  } else{
    res.json({user: null});
  }
});

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.get("/images/:filename", async (req, res) => {
   try{
    const image = await gfs.find({filename: req.params.filename}).toArray();
    if(image.length != 0){
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    } else{
      res.json({message: "Image not found"});
    }
   } catch(err){
      res.json({message: `An error has occured: ${err.message}`});
   }
});

app.post("/like/:id", bodyParser.json(),  async (req, res) => {
    try{
      const post = await Post.findById(req.params.id);
      const user = await User.findOne({username: req.body.username});
      const author = await User.findOne({username: req.body.author})
      const index = user.likedPosts.indexOf(req.params.id);
      if(index === -1 && post){
        post.likes++;
        user.likedPosts.push(req.params.id);
        await post.save();
        await user.save();
        res.json({userId: author._id, message: "liked"});
        io.emit("like", "liked");

      }
      else{
        post.likes > 0 && post.likes--; 
        user.likedPosts.splice(index, 1);
        await post.save();
        await user.save();
        res.json({message: "unliked"});
        io.emit("like", "unliked");
      }
    
    } catch(err){
      console.log(err);
      res.json({message: "An error has occureD. Please Try again later"});
    }
});

app.get("/api/getLikes/:id", async (req, res) => {
  try{
    const post = await Post.findById(req.params.id);
    if(post){
      res.json({likes: post.likes});
    } else{
      res.json({message: "Post not found"});
    }
  } catch(err){
    res.json({message: "An error has occured. Please try again later"});
  }
});

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

server.listen(port, () => {
    console.log(`API server is running on port ${port}`)
});