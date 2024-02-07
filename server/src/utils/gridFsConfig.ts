const multer = require('multer');
import env from './validateEnv';
import {conn} from '../server';
import {GridFSBucket} from 'mongodb';
import { storage } from './storageSetUp';


let gfs: GridFSBucket;
conn.once('open', () => {
    gfs = new GridFSBucket(conn.db, {
        bucketName: env.BUCKET_NAME
    });
});



const upload = multer({ storage });

export default upload;

