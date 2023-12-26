
import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Sidebar from '../components/Sidebar';
import MiddleSection from '../components/MiddleSection';
import OffCanvasSidebar from '../components/OffcanvasSidebar';
import PostForm from '../components/PostForm';
import About from './About';

const Home= () => {
  const navigate = useNavigate();
  const initialSection = localStorage.getItem("section") || "feed"
  const [section, setSection] = useState(initialSection); // ["feed", "about", "notification", profile]
  const [feedSection, setFeed] = useState(true);
  const [aboutSection, setAbout] = useState(false);
  const [notificationSection, setNotification] = useState(false);
  const [profileSection, setProfile] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, [navigate]);

  useEffect(() => {
        if(section === "feed"){
      setFeed(true);
      setAbout(false);
      setNotification(false);
    }
    else if(section === "about"){
      setFeed(false);
      setAbout(true);
      setNotification(false);
    }
    else if(section === "notification"){
      setFeed(false);
      setAbout(false);
      setNotification(true);
    }
    else if(section === "profile"){
      setFeed(false);
      setAbout(false);
      setNotification(false);
      setProfile(true);
    }

    return () => {
      setFeed(true);
      setAbout(false);
      setNotification(false);
      setProfile(false);
    }
  }, [section]);

  function checkAuthentication(){
    console.log("Authenticating user");
    axios.get("http://localhost:5000/", {withCredentials: true})
    .then((response) => {
      const data  = response.data;
      console.log(response.status);
      if(data.isAuthenticated){
         navigate("/");
      }
      else{
        navigate("/login");
      }
    })
    .catch((err) => console.log("Error: "+err));
  }

  function handleSection(newSection){
     setSection(newSection);
     localStorage.setItem("section", newSection);
  }
  
  console.log(section)

  return (
    <div id="feed" className="container mx-0 position-fixed">
        <div className="row">
          <div className='col-0 col-md-4 col-lg-3 p-0 '>
            <div className="d-none d-md-block border-bottom">
              <Sidebar 
               handleSection={handleSection}
              />
            </div>
            <div className=" d-md-none d-block">
              <OffCanvasSidebar
                handleSection={handleSection}
              />
            </div>
          </div>
          <div className='col-12 col-md-8 p-0 border-md-end middle'>
             {feedSection && <MiddleSection />}
             {aboutSection && <About />}
             {/* {notificationSection && <div>Notification</div>} */}
          </div>
       </div>
       <PostForm />
    </div>
  );
};

export default Home;
