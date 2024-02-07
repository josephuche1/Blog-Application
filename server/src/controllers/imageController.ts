import { RequestHandler } from "express";
import formidable from "formidable";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import {getGfs} from "../utils/gridFsConfig";

const gfs = getGfs();


// create function to handle image upload
export const uploadImage: RequestHandler = async (req, res, next) => {
    try {
        if (!req.files) {
            return res.json({ success: false, message: "No files were uploaded" });
        }

        const images = Object.values(req.files) as formidable.File;
        images.forEach(image => {
            const filename = crypto.randomBytes(16).toString("hex") + path.extname(image.originalname);

            const readStream = fs.createReadStream(image.path);

            const writestream = gfs.openUploadStream(filename, {
                chunkSizeBytes: 1048576,
                metadata: {
                    originalName: image.originalname,
                    size: image.size,
                    type: image.mimetype
                }
            });
            readStream.pipe(writestream);
            writestream.on("finish", () => {
                console.log("File uploaded successfully");
            });
        });

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}