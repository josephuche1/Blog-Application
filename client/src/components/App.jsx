import React from "react";
import Home from "../pages/Home";
import Login from "../pages/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {

    return (
      <BrowserRouter>
            <Routes>
                <Route index exact path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
     </BrowserRouter>
    );
}

export default App;