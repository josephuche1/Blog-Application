export interface IUser {
    email: string,
    username: string,
    password: string,
    googleId?: string| number,
    facebookId?: string| number,
    posts?: string[] | number[],
    profilePicture?: string,
    likedPosts?: string[] | number[],
};

export interface IPost {
    text?: string,
    likes: number,
    comments: string[] | number[],
    image?: string[],
    timestamp: Date,
    author: string,
};