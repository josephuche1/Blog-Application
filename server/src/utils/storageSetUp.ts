import { GridFsStorage } from 'multer-gridfs-storage'; // Update this line
import env from './validateEnv';
import crypto from 'crypto';
import path from 'path';
import { Request } from 'express';

export  const storage = new GridFsStorage({
    url: env.MONGO_URI,
    file: (req: Request, file: Express.Multer.File) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: env.BUCKET_NAME
                }
                resolve(fileInfo);
            });
        });
    }
});