import React from "react";
import {Link} from "react-router-dom";

const Login = () => {
  return (
    <div className="d-flex justify-content-center vw-100 border vh-100 align-items-center">
      <div className="w-25">
        <h1 className="text-center fw-bold">Login</h1>
        <form action="/login" method="post">
          <div className="my-3">
            <label className="form-label">Username</label>
            <input type="text" name="username" className="form-control " placeholder="Username" required />
          </div>
          <div className="my-3">
             <label className="form-label">Password</label>
             <input type="password" name="password" className="form-control" placeholder="Password" required />
          </div>
          <div className="my-1">
            <small className="text-secondary fw-lighter">Don't have an account? <Link to="/signup">Sign Up</Link></small>
            <input type="submit" className="btn btn-outline-primary w-100 my-3 " value="Log In" />
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;