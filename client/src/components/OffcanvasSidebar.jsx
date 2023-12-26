import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OffCanvasSidebar = (props) => {
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
        <div>
            <div className="offcanvas-sidebar">
 
               <div class="offcanvas offcanvas-start w-50" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
                    <div class="offcanvas-header">
                        <div className="p-1">
                            <img src="https://picsum.photos/300" alt="profile" className="rounded-circle d-inline"  style={{width:"25px"}}/>
                            <p className="fs-6 mx-3 text-wrap text-break d-inline display-4">Username</p>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <div>
                            <div className='d-flex flex-column px-1'>
                                <div className="my-2 mx-3">
                                    <div onClick={
                                        () => {
                                            props.handleSection("feed");
                                        }
                                    } className="text-decoration-none fw-bold fs-4 ">Home</div>
                                </div>
                                <div className="my-2 mx-3">
                                    <div onClick={
                                        () => {
                                            props.handleSection("about");
                                        }
                                    } className="text-decoration-none fw-bold fs-4">About</div>
                                </div>
                                <div className="my-2 mx-3">
                                    <div onClick={
                                        () => {
                                            props.handleSection("profile");
                                        }
                                    } className="text-decoration-none fw-bold fs-4 ">Profile</div>
                                </div>
                                <div className="my-2 mx-3">
                                    <div onClick={
                                        () => {
                                            props.handleSection("notifications");
                                        }
                                    
                                    } className="text-decoration-none fw-bold fs-4 ">Notifications</div>
                                </div>
                                <div className="my-2 mx-3">
                                    <button className="text-decoration-none btn btn-primary rounded-pill p-2 w-100 shadow" data-bs-toggle="modal" data-bs-target="#postForm">Post</button>
                                </div>
                                <div className="my-2 mx-3 fixed-bottom w-50 ps-5">
                                   <button onClick={handleLogout} className="btn btn-primary rounded-pill p-2 w-75 shadow">Log out</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>  
            </div>  
        </div>
    )
};

export default OffCanvasSidebar;