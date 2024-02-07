import {Router} from 'express'; // import the Router class from the express module
import * as imageController from '../controllers/imageController'; // import all functions from the imageController module
import upload from '../utils/gridFsConfig'; // import the upload function from the gridFsConfig module


const router = Router(); // create an instance of the Router class

router.post("/upload", upload.array("images", 4), imageController.imageUpload); // create a route to handle image upload
router.delete("/delete", imageController.imageDelete); // create a route to handle image delete
router.get("/get/:filename", imageController.imageGet); // create a route to get and display an image

export default router; // export the router instance