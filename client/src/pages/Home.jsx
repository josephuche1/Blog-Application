
import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Sidebar from '../components/Sidebar';
import MiddleSection from '../components/MiddleSection';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   checkAuthentication();
  // }, [navigate]);

  // async function checkAuthentication(){
  //   await axios.get("http://localhost:5000/")
  //   .then((response) => {
  //     const data  = response.data;
  //     if(data.isAuthenticated){
  //        setIsAuthenticated(true);
  //        navigate("/");
  //     }
  //     else{
  //         navigate("/login");
  //     }
  //   })
  //   .catch((err) => console.log(err));
  // }


  return (
    <div id="home" className="container ms-0 pb-0">
       <div className="row">
          <div className='col-1 p-0 border-end'>
            <Sidebar />
          </div>
          <div className='sidebar-home col-10 p-0 border d-flex justify-content-center'>
             <MiddleSection />
          </div>
       </div>
    </div>
  );
};

export default Home;
