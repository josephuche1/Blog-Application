// import all the required modules
import app from "./app"; // import the app module to start the server
import env from "./utils/validateEnv"; // import the validateEnv function to validate the environment variables
import mongoose, {Error} from "mongoose"; // import the mongoose module for mongodb


import User from "./models/userSchema"; // import the user schema
import Post from "./models/postSchema"; // import the post schema

const port = env.PORT; // port number

mongoose.connect(env.MONGO_URI) // connect to the database
    .then(() => {
        console.log("Connected to the database");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err: Error) => console.log("Failed to connect to the database: ", err.message));

const conn = mongoose.connection; // create a connection to the database
let gfs:  mongoose.mongo.GridFSBucket; // create a variable to store the gridfs bucket

conn.once("open", () => { // once the connection is open, create a gridfs bucket
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "images"
    });
});




