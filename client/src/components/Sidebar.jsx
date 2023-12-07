
import React from 'react';
import { Link } from 'react-router-dom';
const Sidebar = () => {
  return (
    <div className="sidebar z-2">
      <button class="btn sidebar-header mx-4 fs-3 fw-bold" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">Blog</button>

      <div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
        <div class="offcanvas-header">
          <div className="p-2">
              <img src="https://picsum.photos/300" alt="profile" className="home-profile-img rounded-circle mx-auto" />
              <span className="fs-5 fw-bold mx-3">Username</span>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <div>
            <div className='d-flex flex-column px-1'>
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
            </div>
          </div>
        </div>
      </div>  
  </div>

  );
};

export default Sidebar;
