import React from "react";
import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import Home from './pages/home/home';
import Register from './pages/register/register';
import Login from './pages/Login/login';
import Message from './pages/Message/message';
import Explore from './pages/Explore/explore';

function App(){
    return (
      <Router>
        <div className="App"> {/*App*/}
            <Navbar/>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/message/:userId" element={<Message/>}/>
              <Route path="/explore" element={<Explore/>}/>
            </Routes>
        </div>
      </Router>
    )
}

export default App;