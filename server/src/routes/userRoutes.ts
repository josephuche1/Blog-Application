import * as userController from "../controllers/userController"; // import all functions from userController
import express from "express";
import bodyParser from "body-parser";

const router = express.Router(); // create a router

router.post("/register", bodyParser.json(), userController.registerUser); // create a route to register a user
router.post("/login", bodyParser.json(), userController.LoginUser); // create a route to login a user

export default router;
