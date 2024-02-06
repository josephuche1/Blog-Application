import "dotenv/config"; // import the dotenv module to use environment variables
import express, {Request, Response, NextFunction} from "express"; // import the express module for the server

const app = express(); // create an instance of express


// create a middleware to handle errors
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An error unknown occurred";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    res.status(500).json({message: errorMessage});
    next();
})

export default app; // export the app instance