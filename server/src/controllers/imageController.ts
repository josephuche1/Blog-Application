import { RequestHandler } from "express";
import { IImage } from "../utils/interfaceEnumsTypes";
import { gfs } from "../server";
import { EServerResponseStatus } from "../utils/interfaceEnumsTypes";

// create function to handle image upload
export const imageUpload: RequestHandler = (req, res, next) => {
    let imagesFilenames: string[] = []; // create an array to store the filenames of the uploaded files
    try{
        if(!req.files || req.files.length === 0){ // check if files were uploaded
            return res.json({msg: EServerResponseStatus.NO_FILES}); // send a response if no files were uploaded
        }
        const images = req.files as Express.Multer.File[]; // get the uploaded files
        images.forEach((image: Express.Multer.File) => { // loop through the uploaded files
            imagesFilenames.push(image.filename); // add the filename of each file to the imagesFilenames array
        })
        res.json({msg: EServerResponseStatus.SUCCESS, imagesFilenames}); // send a response with the filenames of the uploaded files
    } catch(err){
        next(err); // pass the error to the error handling middleware
    }
};

// create function to handle image delete
export const imageDelete: RequestHandler<unknown, unknown, IImage, unknown> = (req, res, next) => {
    const {images} = req.body;
    try{
        if(images.length === 0){
            return res.json({msg: EServerResponseStatus.NO_FILES}); // send a response if no images were provided
        }
        images.forEach(async (image: string) => {
            const file = await gfs.find({filename: image}).toArray(); // find the file in the database
            if(file && file.length !== 0){ // check if the file exists
                await gfs.delete(file[0]._id); // delete the file from the database
            }
        })
        res.json({msg: EServerResponseStatus.SUCCESS});
    } catch(err){
        next(err); // pass the error to the error handling middleware
    }
}

// create function to get and display an image
export const imageGet: RequestHandler = async (req, res, next) => {
    try{
        const file = await gfs.find({filename: req.params.filename}).toArray(); // find the file in the database
        if(file && file.length !== 0){
            gfs.openDownloadStreamByName(req.params.filename).pipe(res); // create a read stream and pipe it to the response
        } else {
            res.json({msg: EServerResponseStatus.NOT_FOUND}); // send a response if the file was not found
        }
    } catch(err){
        next(err); // pass the error to the error handling middleware
    }
};

// create funvction to delete a single image