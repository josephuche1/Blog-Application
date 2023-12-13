
import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Sidebar from '../components/Sidebar';
import MiddleSection from '../components/MiddleSection';
import OffCanvasSidebar from '../components/OffcanvasSidebar';

const Feed= () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, [navigate]);

  async function checkAuthentication(){
    await axios.get("http://localhost:5000/")
    .then((response) => {
      const data  = response.data;
      if(data.isAuthenticated){
         setIsAuthenticated(true);
         navigate("/");
      }
      else{
          navigate("/login");
      }
    })
    .catch((err) => console.log(err));
  }


  return (
    <div id="feed" className="container mx-0 position-fixed">
        <div className="row">
          <div className='col-0 col-md-4 col-lg-3 p-0'>
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
    </div>
  );
};

export default Feed;
