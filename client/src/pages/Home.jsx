
import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Home = () => {
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
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is a basic home page for your blog application.</p>
    </div>
  );
};

export default Home;
