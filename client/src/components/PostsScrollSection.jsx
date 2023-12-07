import React from "react";
import Post from "./Post";

const PostScrollSection = () => {
    return (
        <div className="posts-container">
           <div className="posts container overflow-y-auto mx-auto my-auto vh-100 w-100">
              <div className="row w-100  ms-1">
                <div className="mini-navbar-placeholder pt-5"></div>
                <Post />
                <Post />
                <Post />
              </div>
            </div>
        </div>
    );
}
export default PostScrollSection;