import { InferSchemaType, Schema, model } from "mongoose";


const postSchema = new Schema({
    author: {type: String, required: true},
    text: {type: String, default: ""},
    likes: {type: Number, default: 0},
    comments: {type:[String], default: []},
    image: {type:[String], default: []},
    timestamp: {type: Date, default: Date.now},
});

type Post = InferSchemaType<typeof postSchema>;

export default model<Post>('Post', postSchema);