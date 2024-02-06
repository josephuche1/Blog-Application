import "dotenv/config"; // import the dotenv module to use environment variables
import env from "./utils/validateEnv"; // import the validateEnv function to validate the environment variables
import express, {Request, Response, NextFunction} from "express"; // import the express module for the server
import passport from "passport";
import session from "express-session";
import User from "./models/userSchema";

const app = express(); // create an instance of express

// create a middleware to handle errors
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An error unknown occurred";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    res.json({isAuthenticated: false, error: errorMessage});
    next();
})


export default app; // export the app instance