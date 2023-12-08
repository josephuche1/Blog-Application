import React from "react";
import Post from "./Post";
import OffcanvasToggleButton from "./OffcanvasToggleButton";
import PostScrollSection from "./PostsScrollSection";

const MiddleSection = () => {
    return (
        <div className="border position-fixed ps-0"> 
          <div className="mini-navbar navbar position-absolute container bg-body-secondary justify-content-center ps-0">
            <div className="row w-md-75 w-100 d-flex justify-content-between justify-content-md-center align-items-center flex-row ps-0">
                <div  className="d-md-none col-2 mx-0 pb-2">
                  <OffcanvasToggleButton />
                </div>
                <div className="d-flex flex-row w-75 justify-content-between me-3 px-5">
                   <div className="text-center fs-4 display-4 ">Posts</div>
                   <div className="text-center fs-4 display-4 ">Settings</div>
                </div>
            </div>
          </div>
         <div className="PostsScrollSection">
            <PostScrollSection />
         </div>
    </div>
    );
};

export default MiddleSection; 