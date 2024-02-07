import "dotenv/config"; // import the dotenv module to use environment variables
import env from "./utils/validateEnv"; // import the validateEnv function to validate the environment variables
import express, {Request, Response, NextFunction} from "express"; // import the express module for the server
import userRoute from "./routes/userRoutes"; // import the user route
import postRoute from "./routes/postRoutes"; // import the post route
import passportConfig from "./utils/passportConfig"; // import the passport configuration

const app = express(); // create an instance of express

passportConfig(app); // configure passport

app.use("/user", userRoute); // use the user route
app.use("/api/posts", postRoute); // use the post route


// create a middleware to handle errors
const userAuth = (error: unknown, req: Request, res: Response, next: NextFunction): void => {
    let errorMessage = "An unknown error occurred";
    if(error instanceof Error){
        errorMessage = error.message;
    }
    console.error(error);
    res.json({error: errorMessage});
    next();
}
app.use(userAuth); // use the userAuth middleware



export default app; // export the app instance