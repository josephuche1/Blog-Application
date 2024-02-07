import {Router} from 'express';
import * as imageController from '../controllers/imageController';
import upload from '../utils/gridFsConfig';


const router = Router();

router.post("/upload", upload.array("images", 4), imageController.imageUpload);

export default router;