// Interface models for the user models
export interface IRegisterUser { // create an interface for the register user model
    email: string;
    username: string;
    password: string;
}

export interface ILoginUser { // create an interface for the login user model
    username: string;
    password: string;
}

//  Interface models for the post models
export interface IPost { // create an interface for the post model
    author: string,
    text?: string, 
    images?: string[],
}

// Interface models for the image models
export interface IImage{
    images: string[]
}

// Enum for user actions
export enum EUserActions {
    LIKE="like",
    UNLIKE="unlike",
}

// Enum for server response status
export enum EServerResponseStatus {
    SUCCESS="success",
    ERROR="error",
    NOT_FOUND="not found",
    NOT_AUTHENTICATED="not authenticated",
    NO_FILES="no files",
    EXISTING_USERNAME="Username already exists",
    EXISTING_EMAIL="Email already exists",
}