
import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

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
    <div>
      <Sidebar />
      <Navbar />
    </div>
  );
};

export default Home;
