import React from "react";

const Signup = () => {
    return (
        <div className="d-flex justify-content-center vw-100 border vh-100 align-items-center">
        <div className="w-25">
          <h1 className="text-center fw-bold">Login</h1>
          <form action="/register" method="post">
            <div className="my-3">
              <label for="username" className="form-label">Username</label>
              <input type="text" name="username" className="form-control " id="username" placeholder="Username" required />
            </div>
            <div className="my-3">
               <label for="password" className="form-label">Password</label>
               <input type="password" name="password" className="form-control" id="password" placeholder="Password" required />
            </div>
            <div className="my-3">
               <label for="password" className="form-label">Confirm Password</label>
               <input type="password" name="confirm_password" className="form-control" id="confirm_password" placeholder="Password" required />
            </div>
            <div className="my-1">
              <small className="text-secondary fw-lighter">By click "submit" you agree to our Terms and Conditions</small>
              <input type="submit" className="btn btn-outline-primary w-100 my-3 " value="Register" />
            </div>
          </form>
        </div>
      </div>
    )
}