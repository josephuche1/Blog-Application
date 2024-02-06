import { RequestHandler } from "express";
import User from "../models/userSchema";
import passport from "passport";
import { IRegisterUser, ILoginUser } from "../models/interfaceModels";


// create a function to register a user. This function will be used as a middleware in the route
export const registerUser: RequestHandler<unknown, unknown, IRegisterUser, unknown> = async (req, res, next) => {
    const { email, username, password } = req.body;
    // console.log(req.body);
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

// create a function to login a user. This function will be used as a middleware in the route
export const LoginUser: RequestHandler<unknown, unknown, ILoginUser, unknown> = async (req, res, next) => {
    const {username, password} = req.body;
    console.log(req.body);
    try{
        const user = new User({
            username,
            password,
        });

        req.login(user, (err) => {
            if(err){
                res.json({isAuthenticated: false, error: err.message});
            }
            else{
                passport.authenticate("local")(req, res, () => {
                    res.json({isAuthenticated: true, user: {username}});
                });
            }
        })
    } catch(err){
        next(err);
    }
};

// create a function to logout a user. This function will be used as a middleware in the route
export const LogoutUser: RequestHandler = (req, res) => {
    req.logout(() => {
        res.json({isAuthenticated: false, user: null});
    });
}