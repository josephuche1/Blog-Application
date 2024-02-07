import { ObjectId } from 'mongodb';
import { Schema, model, Document } from 'mongoose'; // import the Schema, model and Document modules from mongoose
import passportLocalMongoose from 'passport-local-mongoose'; // import the passport-local-mongoose module

const userSchema = new Schema({ // create a new schema for the user model
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: String,
    googleId: String,
    facebookId: String,
    posts:{type: [String], default: []},
    profilePicture: String,
    likedPosts: {type: [ObjectId], default: []},
});

userSchema.plugin(passportLocalMongoose); // use the passport-local-mongoose plugin to hash and salt the password

export interface IUser extends Document { // create an interface for the user model
    email: string;
    username: string;
    password?: string;
    googleId?: string;
    facebookId?: string;
    posts: ObjectId[];
    profilePicture?: string;
    likedPosts: ObjectId[];
}  

const User  = model<IUser>("User", userSchema); // create the user model

export default User; // export the user model