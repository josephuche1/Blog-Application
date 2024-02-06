import "dotenv/config"; // import the dotenv module to use environment variables
import env from "./utils/validateEnv"; // import the validateEnv function to validate the environment variables
import express, {Request, Response, NextFunction} from "express"; // import the express module for the server
import userRoute from "./routes/userRoutes"; // import the user route
import { error } from "console";

const app = express(); // create an instance of express

app.use("/user", userRoute); // use the user route




// create a middleware to handle errors


app.use((error: unknown, req: Request, res: Response, next?: NextFunction): void => {
    let errorMessage = "An unknown error occurred";
    if(error instanceof Error){
        errorMessage = error.message;
    }
    console.error(error);
    res.json({isAuthenticated: false, error: errorMessage});
    
})



export default app; // export the app instance