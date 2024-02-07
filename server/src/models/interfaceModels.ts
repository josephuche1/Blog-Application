// Interface models for the user models
export interface IRegisterUser {
    email: string;
    username: string;
    password: string;
}

export interface ILoginUser {
    username: string;
    password: string;
}


//  Interface models for the post models

export interface IPost {
    author: string,
    text?: string, 
    image?: string[],
}