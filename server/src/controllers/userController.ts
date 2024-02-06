import { RequestHandler } from "express";
import User from "../models/userSchema";
import passport from "passport";

interface IUser {
    email: string;
    username: string;
    password: string;
}

// create a function to register a user. This function will be used as a middleware in the route
export const registerUser: RequestHandler<unknown, unknown, IUser, unknown> = async (req, res, next) => {
    const { email, username, password } = req.body;
    console.log(req.body);
    try{
        const user = new User({email, username});
         const existingUsername = await User.findOne({username})
         if(existingUsername){
             return res.json({isAuthenticated: false, error: "Username already exists"});
         }

         const existingEmail = await User.findOne({email});
         if(existingEmail){
                return res.json({isAuthenticated: false, error: "Email already exists"});
         }
         

        User.register(user, password, (err, user) => {
            if(err){
                return next(err);
            }
            passport.authenticate("local")(req, res, () => {
                res.json({isAuthenticated: true, user: {email, username}});
            });
        });
     } catch(err){
        next(err)
     }
  };