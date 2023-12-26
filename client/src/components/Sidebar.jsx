import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sidebar = (props) => {
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
        <div onClick={() => {
          props.handleSection("feed");
        }} className="text-decoration-none fw-bold fs-4 ">Home</div>
      </div>
      <div className="my-2 mx-3">
        <div onClick={() => {
          props.handleSection("about");
        }} className="text-decoration-none fw-bold fs-4">About</div>
      </div>
      <div className="my-2 mx-3">
        <div onClick={() => {
          props.handleSection("profile");
        }} className="text-decoration-none fw-bold fs-4 ">Profile</div>
      </div>
      <div className="my-2 mx-3">
        <div onClick={() => {
          props.handleSection("notifications");
        }} className="text-decoration-none fw-bold fs-4 ">Notifications</div>
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
