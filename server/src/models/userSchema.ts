import { InferSchemaType, Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    googleId: String,
    facebookId: String,
    posts:{type: [String], default: []},
    profilePicture: String,
    likedPosts: {type: [String], default: []},
});

type TUserSchema = InferSchemaType<typeof userSchema>;

const User  = model<TUserSchema>("User", userSchema);

export default User;