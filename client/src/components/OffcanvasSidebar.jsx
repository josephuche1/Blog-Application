import React from 'react';
import { Link } from 'react-router-dom';
import OffcanvasToggleButton from './OffcanvasToggleButton';

const OffCanvasSidebar = () => {
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
                                <div className="my-2 mx-3 fixed-bottom w-50 ps-5">
                                   <Link className="btn btn-primary rounded-pill p-2 w-75 shadow">Log out</Link>
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