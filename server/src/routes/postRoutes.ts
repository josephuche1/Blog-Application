import {Router} from 'express'; // import the Router class from the express module
import * as postController from "../controllers/postsController"; // import all functions from the postController module

const router = Router(); // create an instance of the Router class

router.get("/:id", postController.getPost); // create a route to get a specific post by id
router.post("/create", postController.createPost); // create a route to create a new post
router.delete("/delete/:id", postController.deletePost); // create a route to delete a post by id
router.get("/", postController.getPosts); // create a route to get all posts
router.get("/getImages/:id", postController.getPostImages); // create a route to get post images, if any


export default router; // export the router instance