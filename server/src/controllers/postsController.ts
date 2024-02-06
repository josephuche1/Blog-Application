import { RequestHandler } from "express";
import Post from "../models/postSchema";

// create function to get a specific post by id
export const getPost: RequestHandler = async (req, res, next) => {
    try {
        if(req.isAuthenticated()){
            const post = await Post.findById(req.params.id);
            if(post){
                res.json({post});
            }
            else{
                res.json({message: `Post with id ${req.params.id} not found`});
            }
        }
        else{
            res.json({isAuthenticated: false});
        }
    } catch (error){
        next(error);
    }
};