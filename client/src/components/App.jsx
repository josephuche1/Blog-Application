import React, {useState} from "react";
import Home from "../pages/Home";
import Login from "../pages/Login";
import {BrowserRouter, Route, Routes, Link, redirect} from "react-router-dom";
import axios from "axios";



function App() {
     const [isAuthenticated, setIsAuthenticated] = useState(false);

     async function checkAuthenticated() {
        await axios.get("http://localhost:5000/api/isAuthenticated")
           .then((response) => {
              response.data.isAuthenticated && setIsAuthenticated(true);
              console.log(response.data.isAuthenticated);
           })
           .catch((err) => {
            console.log(err);
           }); 
           handleIsAuthenticated(isAuthenticated);
     }

     const handleIsAuthenticated = (isAuthenticated) => {
         if(!isAuthenticated){
            return redirect("/login");
         }
         return null;
     }
    return (
      <BrowserRouter>
        <div>
            <nav>
                <ul>
                    <li>
                        <Link onClick={checkAuthenticated} to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route index exact path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
     </BrowserRouter>
    );
}

export default App;