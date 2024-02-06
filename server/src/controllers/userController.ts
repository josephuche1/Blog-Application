import { RequestHandler } from "express";
import User from "../models/userSchema";
import passport from "passport";

interface IUser {
    email: string;
    username: string;
}

// create a function to register a user. This function will be used as a middleware in the route
export const registerUser: RequestHandler = (req, res) => {
    const { email, username, password } = req.body;
  
    try{
        User.register(new User({email, username}), password, (err, user) => {
            if(err){
                throw Error(err.message);
            }
            passport.authenticate("local")(req, res, () => {
                res.json({isAuthenticated: true, user: {email, username}});
            });
        });
     } catch(err){
        let errorMessage = "An unknown error occurred";
        if(err instanceof Error){
            errorMessage = err.message;
        }
        console.error(err);
        res.json({isAuthenticated: false, error: errorMessage});
     }
  };