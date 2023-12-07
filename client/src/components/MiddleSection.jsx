import React from "react";
import Post from "./Post";

const MiddleSection = () => {
    return (
        <div>
          <div className="mini-navbar navbar container">
            <div className="row w-100 d-flex flex-row justify-content-around ">
                <div className="col-4 text-center fs-5 fw-bold">Posts</div>
                <div className="col-4 text-center fs-5 fw-bold" >Settings</div>
            </div>
          </div>
          <div className="posts-container">
             <div className="posts container overflow-y-auto mt-0">
                <div className="row">
                  <div className="mini-navbar-placeholder pt-5"></div>
                  <Post />
                  <Post />
                  <Post />
                </div>
              </div>
          </div>
    </div>
    );
};

export default MiddleSection; 