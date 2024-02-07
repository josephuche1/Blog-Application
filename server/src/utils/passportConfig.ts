import express from 'express'; // import the express module
import env from './validateEnv'; // import the validateEnv function to validate the environment variables
import session from 'express-session'; // import the express-session module
import passport from 'passport';// import the passport module
import { Strategy as LocalStrategy } from 'passport-local'; // import the LocalStrategy class from the passport-local module
import User, {IUser} from "../models/userSchema"; // import the User model and the IUser interface

// create a function to configure the passport middleware
export default (app: express.Application): void => {
  app.use(session({ // use the session middleware
    secret: env.SECRET,
    resave: false,
    saveUninitialized: false,
  }));

  passport.use(new LocalStrategy(User.authenticate())); // use the LocalStrategy to authenticate the user

  passport.serializeUser((user: any, done) => { // serialize the user
        done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => { // deserialize the user
    User.findById(id) // find a user by id
      .then((user) => {
        done(null, user);
      }).catch((error) => done(error, null));
  });

  app.use(passport.initialize()); // use the passport middleware
  app.use(passport.session());// use the passport session middleware
};