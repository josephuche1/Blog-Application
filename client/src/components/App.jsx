import React from "react";
import ReactDOM from "react-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Signup from "../pages/Signup";
import About from "../pages/About";
import {SocketProvider} from "./SocketContext";
import { Notifications } from 'react-push-notification';

function App() {
    return (
       <SocketProvider>
            <BrowserRouter>
              <Routes>
                <Route index exact path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home/>} />
              </Routes>
           </BrowserRouter>
           <Notifications />
       </SocketProvider>
    );
}

export default App;