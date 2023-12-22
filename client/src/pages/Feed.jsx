
import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Sidebar from '../components/Sidebar';
import MiddleSection from '../components/MiddleSection';
import OffCanvasSidebar from '../components/OffcanvasSidebar';
import PostForm from '../components/PostForm';

const Feed= () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, [navigate]);

  function checkAuthentication(){
    console.log("checking authentication");
    axios.get("http://localhost:5000/", {withCredentials: true})
    .then((response) => {
      const data  = response.data;
      console.log(response.status);
      if(data.isAuthenticated){
         navigate("/feed");
      }
      else{
        navigate("/login");
      }
    })
    .catch((err) => console.log("Error: "+err));
  }


  return (
    <div id="feed" className="container mx-0 position-fixed">
        <div className="row">
          <div className='col-0 col-md-4 col-lg-3 p-0 '>
            <div className="d-none d-md-block border-bottom">
              <Sidebar />
            </div>
            <div className=" d-md-none d-block">
              <OffCanvasSidebar />
            </div>
          </div>
          <div className='col-12 col-md-8 p-0 border-md-end middle'>
             <MiddleSection />
          </div>
       </div>
       <PostForm />
    </div>
  );
};

export default Feed;
