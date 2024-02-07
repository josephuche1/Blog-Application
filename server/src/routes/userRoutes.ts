import * as userController from "../controllers/userController"; // import all functions from userController
import express from "express"; // import the express module
import bodyParser from "body-parser"; // import the body-parser module

const router = express.Router(); // create a router

router.post("/register", bodyParser.json(), userController.registerUser); // create a route to register a user
router.post("/login", bodyParser.json(), userController.LoginUser); // create a route to login a user
router.get("/logout", userController.LogoutUser); // create a route to logout a user
router.get("/isAuthenticated", userController.CheckUser); // create a route to check if a user is authenticated


export default router; // export the router
