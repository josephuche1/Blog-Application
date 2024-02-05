// import all the required modules
import "dotenv/config"; // import the dotenv module to use environment variables
import express from "express"; // import the express module for the server
import mongoose from "mongoose"; // import the mongoose module for mongodb
import cors from "cors"; // import the cors module for cross-origin requests
import session from "express-session"; // import the express-session module for session management
import passport from "passport"; // import the passport module for authentication
import passportLocalMongoose from "passport-local-mongoose"; // import the passport-local-mongoose module for authentication
import path from "path"; // import the path module for file paths
import fs from "fs"; // import the fs module for file system operations
import crypto from "crypto"; // import the crypto module for cryptographic operations
import bodyParser from "body-parser"; // import the body-parser module for parsing request bodies
import Formidable from "express-formidable"; // import the express-formidable module for parsing form data
import http from "http";  // import the http module for creating a server
import {Server} from 'socket.io'; // import the socket.io module for real-time communication

import {IUser, IPost} from "../src/schema"; // import the user schema



const app = express(); // create an instance of express
const port = 5000; // port number

const server = http.createServer(app); // create a server instance
const io  = new Server(server, { // create a new instance of socket.io using the server instance
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
})); // enable cors

app.use(session({ // configure session
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); // initialize passport
app.use(passport.session()); // use passport session

mongoose.connect(process.env.MONGO_URI as string) // connect to the database
    .then(() => console.log("Database connected"))
    .catch((err: Error) => console.log("Failed to connect to the database", err.message));

const conn = mongoose.connection; // create a connection to the database
let gfs:  mongoose.mongo.GridFSBucket; // create a variable to store the gridfs bucket

conn.once("open", () => { // once the connection is open, create a gridfs bucket
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "images"
    });
});

const userSchema = new mongoose.Schema<IUser>({
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    googleId: String,
    facebookId: String,
    posts: [String],
    profilePicture: String,
    likedPosts: [String],
});


const postSchema = new mongoose.Schema<IPost>({
    text: {type: String, default: ""},
    likes: {type: Number, default: 0},
    comments: {type:[String], default: []},
    image: {type:[String], default: []},
    timestamp: {type: Date, default: Date.now},
});







app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})