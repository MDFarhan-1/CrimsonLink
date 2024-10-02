import React from 'react'
import './navbar.css';
import {FaBars} from "react-icons/fa";
import {NavLink as Link} from "react-router-dom"; 
// import Explore from '../../pages/Explore/explore'
const Navbar = ()=>{
  
    return (
        <>
          <nav>
            <FaBars/>
            <div>
                <Link to="/register">Sign Up</Link>
                <Link to="/login">Login</Link>
                <Link to="/explore">Explore</Link>
                <button>Logout</button>
            </div>
          </nav>
        </>
    )
}

export default Navbar