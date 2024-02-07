import { RequestHandler } from "express";



// create function to handle image upload
export const imageUpload: RequestHandler = (req, res, next) => {
    let imagesFilenames: string[] = [];
    try{
        if(!req.files || req.files.length === 0){
            return res.json({msg: "No files were uploaded"});
        }
        const images = req.files as Express.Multer.File[];
        images.forEach((image: Express.Multer.File) => {
            imagesFilenames.push(image.filename);
        })
        res.json({msg: "Files uploaded successfully", imagesFilenames});
    } catch(err){
        next(err);
    }
};