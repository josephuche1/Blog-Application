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
    image?: string[],
}