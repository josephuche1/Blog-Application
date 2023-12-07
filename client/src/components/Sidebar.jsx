
import React from 'react';
import { Link } from 'react-router-dom';
const Sidebar = () => {
  return (
  <div className='sidebar'>
    <div className="sidebar-header mx-4 fs-3 fw-bold">Blog</div>
    <div className='d-flex flex-column px-5'>
      <div className="my-2 mx-3">
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
        <Link to="/post" className="text-decoration-none btn btn-primary rounded-pill p-2 w-100 shadow">Post</Link>
      </div>
      <div className="sidebar-footer p-3 fixed-bottom w-25 border-top">
        <img src="https://picsum.photos/300" alt="profile" className="rounded-circle mx-2" style={{width: "35px"}}/>
        <span className="fs-5 fw-bold mx-3">Username</span>
      </div>
    </div>
  </div>
  );
};

export default Sidebar;
