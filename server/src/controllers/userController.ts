import { RequestHandler } from "express"; // import the RequestHandler type from the express module
import User from "../models/userSchema"; // import the User model
import passport from "passport"; // import the passport module
import { IRegisterUser, ILoginUser } from "../models/interfaceEnumsTypes"; // import the IRegisterUser and ILoginUser interfaces
import { EServerResponseStatus } from "../models/interfaceEnumsTypes";

// create a function to register a user. This function will be used as a middleware in the route
export const registerUser: RequestHandler<unknown, unknown, IRegisterUser, unknown> = async (req, res, next) => {
    const { email, username, password } = req.body; // get the email, username and password from the request body
    // console.log(req.body);
    try{
        const user = new User({email, username}); // create a new user with the email and username
         const existingUsername = await User.findOne({username}) // check if the username already exists
         if(existingUsername){
             return res.json({isAuthenticated: false, msg: EServerResponseStatus.EXISTING_USERNAME }); // send a response if the username already exists
         }

         const existingEmail = await User.findOne({email}); // check if the email already exists
         if(existingEmail){
                return res.json({isAuthenticated: false, msg: EServerResponseStatus.EXISTING_EMAIL}); // send a response if the email already exists
         }
         

        User.register(user, password, (err, user) => { // register the user with the password
            if(err){
                return next(err); // pass the error to the error handling middleware
            }
            passport.authenticate("local")(req, res, () => { // authenticate the user
                res.json({isAuthenticated: true, user: {email, username}, msg: EServerResponseStatus.SUCCESS}); // send a response with the user's email and username
            });
        });
     } catch(err){
        next(err) // pass the error to the error handling middleware
     }
};

// create a function to login a user. This function will be used as a middleware in the route
export const LoginUser: RequestHandler<unknown, unknown, ILoginUser, unknown> = async (req, res, next) => {
    const {username, password} = req.body; // get the username and password from the request body
    console.log(req.body);
    try{
        const user = new User({ // create a new user with the username and password
            username,
            password,
        });

        req.login(user, (err) => { // login the user
            if(err){ // check if there is an error
                res.json({isAuthenticated: false, msg: EServerResponseStatus.ERROR}); // send a response with the error message
            }
            else{
                passport.authenticate("local")(req, res, () => { // authenticate the user
                    res.json({isAuthenticated: true, user: username, msg: EServerResponseStatus.SUCCESS}); // send a response with the user's username
                });
            }
        })
    } catch(err){
        next(err); // pass the error to the error handling middleware
    }
};

// create a function to logout a user. This function will be used as a middleware in the route
export const LogoutUser: RequestHandler = (req, res) => {
    req.logout(() => { // logout the user
        res.json({isAuthenticated: false, user: null, msg: EServerResponseStatus.SUCCESS}); // send a response with the user set to null
    });
}