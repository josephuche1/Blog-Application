import { RequestHandler } from "express";



// create function to handle image upload
export const imageUpload: RequestHandler = (req, res, next) => {
    let imagesFilenames: string[] = []; // create an array to store the filenames of the uploaded files
    try{
        if(!req.files || req.files.length === 0){ // check if files were uploaded
            return res.json({msg: "No files were uploaded"}); // send a response if no files were uploaded
        }
        const images = req.files as Express.Multer.File[]; // get the uploaded files
        images.forEach((image: Express.Multer.File) => { // loop through the uploaded files
            imagesFilenames.push(image.filename); // add the filename of each file to the imagesFilenames array
        })
        res.json({msg: "Files uploaded successfully", imagesFilenames}); // send a response with the filenames of the uploaded files
    } catch(err){
        next(err); // pass the error to the error handling middleware
    }
};