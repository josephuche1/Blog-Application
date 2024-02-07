import { RequestHandler } from "express"; // import RequestHandler interface from express
import Post from "../models/postSchema"; // import the post model
import { IPost } from "../models/interfaceEnumsTypes"; // import the IPost interface from the interfaceModels file
import User from "../models/userSchema"; // import the user model
import { Error } from "mongoose"; // import the Error interface from mongoose
import {TPost} from "../models/postSchema"; // import the TPost type from the postSchema file
import { EUserActions, EServerResponseStatus } from "../models/interfaceEnumsTypes"; // import the EUserActions enum from the interfaceModels file

// create function to get a specific post by id
export const getPost: RequestHandler = async (req, res, next) => {
    try {
        if(req.isAuthenticated()){ // check if the user is authenticated
            const post = await Post.findById(req.params.id); // find a post by id
            if(post){ // check if a post was found
                res.json({post}); // send a response with the post
            }
            else{
                res.json({msg: EServerResponseStatus.NOT_FOUND}); // send a response if no post was found
            }
        }
        else{
            res.json({isAuthenticated: false, msg: EServerResponseStatus.NOT_AUTHENTICATED}); // send a response if the user is not authenticated
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
          res.json({msg: "No posts yet"}); // send a response if no posts were found
        }
    } catch(err){
         next(err); // pass the error to the error handling middleware
    }
};

// create function to create a new post
export const createPost: RequestHandler<unknown, unknown, IPost, unknown> = async (req, res, next) => {
    const {author, text, images} = req.body; // destructure the author and text from the request body 
    try{
        const author = await User.findById(req.user); // find the user by id
        if(author){ // check if the user was found
            const newPost = new Post({
                author: author.username, // set the author of the post to the user's username
                text,
                images,
            });
            await newPost.save(); // save the new post
            author.posts.push(newPost._id); // add the new post to the user's posts
            await author.save(); // save the user
            res.json({msg: EServerResponseStatus.SUCCESS, post: newPost}); // send a response if the post was created successfully
        } else{
            res.json({isAuthenticated: false, msg: EServerResponseStatus.NOT_FOUND}); // send a response if the user is not authenticated
        }

    } catch(err){
        next(err); // pass the error to the error handling middleware
    }
    
}

// create function to delete a post
export const deletePost: RequestHandler = async (req, res, next) => {
    try{
        Post.findByIdAndDelete(req.params.id, (err: Error, post: TPost) => { // find a post by id and delete it
            if(err){
                res.json({msg: EServerResponseStatus.ERROR}); // send a response if the post was not found
            }
            else{
                res.json({msg: EServerResponseStatus.SUCCESS}); // send a response if the post was deleted successfully
            }
        });
    } catch(err){
        next(err); // pass the error to the error handling middleware
    }
};

// create function to get post images, if any
export const getPostImages: RequestHandler = async (req, res, next) => {
    try{
        const post = await Post.findById(req.params.id); // find a post by id
        if(post){
            res.json({images: post.images, msg: EServerResponseStatus.SUCCESS}); // send a response with the images of the post
        } else{
            res.json({msg: EServerResponseStatus.NOT_FOUND}); // send a response if the post was not found
        }
    } catch(err){
        next(err); // pass the error to the error handling middleware
    }
};

// create function to like a post
export const likePost: RequestHandler = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.username); // find a user by username
        const post = await Post.findById(req.params.id); // find a post by id

        if(user && post){ // check if the user and post were found
            const postId = user.likedPosts.find((id) => id === post._id); // check if the user has already liked the post
            if(postId){
                post.likes -= 1; // decrement the likes of the post by 1
                await post.save(); // save the post
                user.likedPosts = user.likedPosts.filter(id => id !== post._id); // remove the post from the user's liked posts
                await user.save(); // save the user
                return res.json({action: EUserActions.UNLIKE, msg: EServerResponseStatus.SUCCESS}); // send a response if the post was unliked successfully
            }
            post.likes += 1; // increment the likes of the post by 1
            await post.save(); // save the post
            user.likedPosts.push(post._id); // add the post to the user's liked posts
            await user.save(); // save the user
            res.json({action:EUserActions.LIKE, msg: EServerResponseStatus.SUCCESS}); // send a response if the post was liked successfully
        }

    } catch(err){
        next(err); // pass the error to the error handling middleware
    }
}