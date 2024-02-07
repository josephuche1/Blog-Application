import { InferSchemaType, Schema, model } from "mongoose"; // import the InferSchemaType, Schema and model modules from mongoose


const postSchema = new Schema({ // create a new schema for the post model
    author: {type: String, required: true},
    text: {type: String, default: ""},
    likes: {type: Number, default: 0},
    comments: {type:[String], default: []},
    images: {type:[String], default: []},
    timestamp: {type: Date, default: Date.now},
});

export type TPost = InferSchemaType<typeof postSchema>; // create a type from the post schema

export default model<TPost>('Post', postSchema); // export the post model