const multer = require('multer'); // For file upload
import env from './validateEnv'; // import the validateEnv function to validate the environment variables
import {conn} from '../server'; // import the conn object from the server module
import {GridFSBucket} from 'mongodb'; // import the GridFSBucket class from the mongodb module
import { storage } from './storageSetUp'; // import the storage object from the storageSetUp module


let gfs: GridFSBucket; // create a variable to store the GridFSBucket object

export const initializeGridFs = () => { // create a function to initialize the GridFSBucket
    conn.once('open', () => { // listen for the open event on the connection
        gfs = new GridFSBucket(conn.db, { // create a new instance of the GridFSBucket class
            bucketName: env.BUCKET_NAME
        });
    });
};

const upload = multer({ storage }); // create an instance of the multer middleware with the storage configuration

export default upload; // export the upload middleware

