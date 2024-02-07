// import all the required modules
import app from "./app"; // import the app module to start the server
import env from "./utils/validateEnv"; // import the validateEnv function to validate the environment variables
import mongoose, {Error} from "mongoose"; // import the mongoose module for mongodb connection
import {initializeGridFs} from "./utils/gridFsConfig"; // import the initializeGridFs function to initialize the GridFSBucket

import User from "./models/userSchema"; // import the user schema
import Post from "./models/postSchema"; // import the post schema

const port = env.PORT; // port number

mongoose.connect(env.MONGO_URI) // connect to the database.
    .then(() => {
        console.log("Connected to the database"); // log a message if the connection is successful
        initializeGridFs(); // initialize the GridFSBucket
        app.listen(port, () => { // start the server
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err: Error) => console.log("Failed to connect to the database: ", err.message)); // log an error message if the connection fails

export const conn = mongoose.connection; // create a connection to the database
