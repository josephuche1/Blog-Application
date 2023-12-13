import React from "react";
import Feed from "../pages/Feed";
import Login from "../pages/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {

    return (
      <BrowserRouter>
            <Routes>
                <Route index exact path="/" element={<Feed />} />
                <Route path="/home" element={<Feed />} />
                <Route path="/login" element={<Login />} />
            </Routes>
     </BrowserRouter>
    );
}

export default App;