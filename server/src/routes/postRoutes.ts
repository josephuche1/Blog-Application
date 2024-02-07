import {Router} from 'express'; // import the Router class from the express module
import * as postController from "../controllers/postsController"; // import all functions from the postController module

const router = Router(); // create an instance of the Router class

router.get("/:id", postController.getPost); // create a route to get a specific post by id


export default router; // export the router instance