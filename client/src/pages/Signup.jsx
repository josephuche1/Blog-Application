import React, {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import axios from "axios";


const Signup = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
      username:"",
      password: "",
      confirm_password:"",
    });
    const [info, setInfo] = useState("");

    function handleChange(event){
      const {name, value}  = event.target;
      setUser(user => {
        return {
          ...user,
          [name]:value,
        }
      })
    }

    function handleSubmit(event){
      event.preventDefault();
      if(user.password !== user.confirm_password){
        setInfo("Passwords don't match");
      } else{
         axios.post("http://localhost:5000/register", user, {
          headers: {
            "Content-Type": "application/json"
          }, withCredentials: true 
        }).then(res => {
            if(res.data.isAuthenticated){
              navigate("/feed");
            } else{
              console.log(res.data.error);
              navigate("/signup");
            }
          })
          .catch(err => {
            console.log("ERROR: ", err);
          })
      }
    }

    return (
        <div className="d-flex justify-content-center vw-100 border vh-100 align-items-center">
        <div className="w-auto">
          <h1 className="text-center fw-bold">Sign Up</h1>
          <form onSubmit={handleSubmit} >
            <div className="my-3">
              <label className="form-label">Username</label>
              <input 
                  onChange={handleChange} 
                  type="text" 
                  name="username" 
                  className="form-control "
                  placeholder="Username" 
                  required 
                  value={user.username}/>
            </div>
            <div className="my-3">
               <label className="form-label">Password</label>
               <input 
                   onChange={handleChange}
                   type="password" 
                   name="password" 
                   className="form-control"
                   placeholder="Password" 
                   required 
                   value={user.password}/>
            </div>
            <div className="my-3">
               <label className="form-label">Confirm Password</label>
               <input 
                 onChange={handleChange}
                 type="password" 
                 name="confirm_password" 
                 className="form-control"
                 placeholder="Confirm Password" 
                 required 
                 value={user.confirm_password}/>
            </div>
            <div className="my-1">
              <small className="text-secondary fw-lighter">By click "submit" you agree to our Terms and Conditions</small><br />
              <small className="text-secondary fw-lighter">Already have an account? <Link to="/login">Log In</Link></small>
              <input type="submit" className="btn btn-outline-primary w-100 my-3 " value="Sign Up" />
            </div>
          </form>
          <small className="text-warning fw-lighter">{info}</small>
        </div>
      </div>
    )
}

export default Signup;