import {Router} from 'express';
import * as postController from "../controllers/postsController";

const router = Router();

router.get("/:id", postController.getPost); // create a route to get a specific post by id


export default router;