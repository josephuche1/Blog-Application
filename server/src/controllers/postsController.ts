import { RequestHandler } from "express";
import Post from "../models/postSchema";

// create function to get a specific post by id
export const getPost: RequestHandler = async (req, res, next) => {
    try {
        if(req.isAuthenticated()){ // check if the user is authenticated
            const post = await Post.findById(req.params.id); // find a post by id
            if(post){ // check if a post was found
                res.json({post}); // send a response with the post
            }
            else{
                res.json({message: `Post with id ${req.params.id} not found`}); // send a response if no post was found
            }
        }
        else{
            res.json({isAuthenticated: false}); // send a response if the user is not authenticated
        }
    } catch (error){
        next(error); // pass the error to the error handling middleware
    }
};

// create function to get all posts
export const getPosts: RequestHandler = async (req, res, next) => {
    try{
        const posts = await Post.find({}); // find all posts
        if(posts.length !== 0){ // check if posts were found
           res.json(posts); // send a response with the posts
        }
        else{
          res.json({message: "No posts yet"}); // send a response if no posts were found
        }
    } catch(err){
         next(err); // pass the error to the error handling middleware
    }
};

// create function to create a new post
export const createPost: RequestHandler = async (req, res, next) => {
    
}