import "dotenv/config";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./components/App";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import axios from "axios";

ReactDOM.render(<App />, document.getElementById("root"));
