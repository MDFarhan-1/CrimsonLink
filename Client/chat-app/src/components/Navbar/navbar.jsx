import React from 'react'
import './navbar.css'
import {FaBars} from "react-icons/fa"
import {NavLink as Link} from "react-router-dom"
const Navbar = () => {
  return (
   <>
        <nav>
            <FaBars/>
            <div>
                <Link to="/register">Sign Up</Link>
                <Link to="/login">Login</Link>
                <button>Logout</button>
            </div>
        </nav>
   </>
  )
}

export default Navbar