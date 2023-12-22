import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {
  const navigate = useNavigate();

  // function to handle logout
  const handleLogout = async () => {
    await axios.get("http://localhost:5000/logout", {withCredentials: true})
      .then(res => {
          console.log(res.data);
          if(res.data.isAuthenticated === false){
            navigate("/login");
          } else {
            navigate("/home");
          }
      })
      .catch(err => {
        console.log(err);
      })
  };
  
  return (
  <div className='sidebar'>
    <div className="sidebar-header mx-4 fs-3 fw-bold">Blog</div>
    <div className='d-flex flex-column px-5'>
       
      <div className="my-2 mx-3 ">
        <Link to="/home" className="text-decoration-none fw-bold fs-4 ">Home</Link>
      </div>
      <div className="my-2 mx-3">
        <Link to="/about" className="text-decoration-none fw-bold fs-4">About</Link>
      </div>
      <div className="my-2 mx-3">
        <Link to="/profile" className="text-decoration-none fw-bold fs-4 ">Profile</Link>
      </div>
      <div className="my-2 mx-3">
        <Link to="/notifications" className="text-decoration-none fw-bold fs-4 ">Notifications</Link>
      </div>
      <div className="my-2 mx-3">
        <button className="text-decoration-none btn btn-primary rounded-pill p-2 w-100 shadow" data-bs-toggle="modal" data-bs-target="#postForm">Post</button>
      </div>
      <div className="dropdown">
        <div className="sidebar-footer p-3 fixed-bottom w-25 dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://picsum.photos/300" alt="profile" className="rounded-circle mx-2" style={{width: "35px"}}/>
          <span className="fs-5 fw-bold mx-3">Username</span>
        </div>
        <ul className="dropdown-menu px-2 mx-5 w-100">
          <button onClick={handleLogout} className="text-decoration-none w-100 dropdown-item">Log out</button>
        </ul>
      </div>
    </div>
  </div>
  );
};

export default Sidebar;
