import { GridFsStorage } from 'multer-gridfs-storage'; // For file upload
import env from './validateEnv'; // import the validateEnv function to validate the environment variables
import crypto from 'crypto'; // import the crypto module
import path from 'path'; // import the path module
import { Request } from 'express'; // import the Request type from the express module

export  const storage = new GridFsStorage({ // create a new instance of the GridFsStorage class
    url: env.MONGO_URI, // set the url property to the MONGO_URI environment variable
    file: (req: Request, file: Express.Multer.File) => { // set the file property to a function that takes a request and a file
        return new Promise((resolve, reject) => { // return a new promise
            crypto.randomBytes(16, (err, buf) => { // generate a random name for the file
                if (err) {
                    return reject(err); // reject the promise if there is an error
                }
                const filename = buf.toString("hex") + path.extname(file.originalname); // set the filename to the random name and the original file extension
                const fileInfo = { // create an object with the filename and the bucket name
                    filename: filename,
                    bucketName: env.BUCKET_NAME
                }
                resolve(fileInfo); // resolve the promise with the file info object
            });
        });
    }
});