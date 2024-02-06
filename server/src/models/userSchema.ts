import { Schema, model, Document } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: String,
    googleId: String,
    facebookId: String,
    posts:{type: [String], default: []},
    profilePicture: String,
    likedPosts: {type: [String], default: []},
});

userSchema.plugin(passportLocalMongoose);

export interface IUser extends Document {
    email: string;
    username: string;
    password?: string;
    googleId?: string;
    facebookId?: string;
    posts: string[];
    profilePicture?: string;
    likedPosts: string[];
}  

const User  = model<IUser>("User", userSchema);

export default User;