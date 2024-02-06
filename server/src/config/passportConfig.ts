import express from 'express';
import env from '../utils/validateEnv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User, {IUser} from "../models/userSchema"; // Adjust the path as necessary
import app from '../app';

app.use(session({
    secret: env.SECRET,
    resave: false,
    saveUninitialized: false,
  }));

  passport.use(new LocalStrategy(User.authenticate()));

  passport.serializeUser((user: any, done) => {
        done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    User.findById(id)
      .then((user) => {
        done(null, user);
      });
  });

  app.use(passport.initialize());
  app.use(passport.session());