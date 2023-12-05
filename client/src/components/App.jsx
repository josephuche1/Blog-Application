import React, {useState, useEffect} from "react";
import Home from "../pages/Home";
import Login from "../pages/Login";
import {BrowserRouter, Route, Routes, Link} from "react-router-dom";
import axios from "axios";



function App() {
     const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
      <BrowserRouter>
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
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