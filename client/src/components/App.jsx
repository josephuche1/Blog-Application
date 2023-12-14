import React from "react";
import ReactDOM from "react-dom";
import Feed from "../pages/Feed";
import Login from "../pages/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Signup from "../pages/Signup";

function App() {

    return (
      <BrowserRouter>
            <Routes>
                <Route index exact path="/" element={<Feed />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
     </BrowserRouter>
    );
}

export default App;