import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const Login = () => {
   const[user, setUser]=  useState({
      username:"",
      password:"",
   });
   const navigate = useNavigate();

   function handleChange(event){
    const {name, value} = event.target;
    setUser ((user) => {
      return {
         ...user, 
         [name]:value,
      }
    })
   }

   function handleSubmit(event){
    event.preventDefault();
    axios.post("http://localhost:5000/login", user, {
      headers:{
        "content-Type": "application/json"
      }, withCredentials: true
    })
    .then((res) => {
      if(res.data.isAuthenticated){
        navigate("/feed");
      } else {
        alert(res.data.error);
      }
    })
    .catch((err) => {
      console.log(err);
    });
   }

  return (
    <div className="d-flex justify-content-center vw-100 border vh-100 align-items-center">
      <div className="w-auto">
        <h1 className="text-center fw-bold">Login</h1>
        <form onSubmit={handleSubmit} method="post">
          <div className="my-3">
            <label className="form-label">Username</label>
            <input onChange={handleChange} type="text" name="username" className="form-control " placeholder="Username" required />
          </div>
          <div className="my-3">
             <label className="form-label">Password</label>
             <input onChange={handleChange} type="password" name="password" className="form-control" placeholder="Password" required />
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