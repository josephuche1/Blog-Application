import "dotenv/config"; // import the dotenv module to use environment variables
import env from "./utils/validateEnv"; // import the validateEnv function to validate the environment variables
import express, {Request, Response, NextFunction} from "express"; // import the express module for the server
import userRoute from "./routes/userRoutes"; // import the user route
import postRoute from "./routes/postRoutes"; // import the post route
import passportConfig from "./utils/passportConfig"; // import the passport configuration
import imageRoute from "./routes/imageRoutes"; // import the image route
import webpush from "web-push"; // import the web-push module for push notifications

const app = express(); // create an instance of express

passportConfig(app); // configure passport

app.use("/user", userRoute); // use the user route
app.use("/api/posts", postRoute); // use the post route
app.use("/api/images", imageRoute); // use the image route


// create a middleware to handle errors
const errorHandling = (error: unknown, req: Request, res: Response, next: NextFunction): void => { // define the errorHandling middleware
    let errorMessage = "An unknown error occurred";
    if(error instanceof Error){ // check if the error is an instance of the Error class
        errorMessage = error.message;
    }
    console.error(error); // log the error to the console
    res.json({error: errorMessage}); // send a response with the error message
    next(); // call the next function
}
app.use(errorHandling); // use the errorHandling middleware

const publicVapidKey = env.PUBLIC_VAPID_KEY; // public vapid key
const privateVapidKey = env.PRIVATE_VAPID_KEY; // private vapid key



export default app; // export the app instance