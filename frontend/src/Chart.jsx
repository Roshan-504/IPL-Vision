import React from 'react'
import {useState, useEffect} from 'react'
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import Login from './Login';
import { useStore } from '../useStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import Logout from './Logout';
// import { useAuth } from '../context/AuthProvider';

const Navbar = () => {
    const {authUser,setUser} = useStore();
    const navigate = useNavigate();
    // const [authUser, setAuthUser] = useAuth()
    // console.log(authUser);
    

    // const[theme, setTheme] = useState(localStorage.getItem("theme")?localStorage.getItem("theme"):"light")
    // const element = document.documentElement;
    const handleLogout= async()=>{
        try {
            await axios.post('http://localhost:3000/api/auth/logout')
            toast.success("Logged Out!");
            setUser(null)
            navigate('/');
            
        } catch (error) {
            toast.error("Error: " + error.message);
            setTimeout(()=>{},1000);
        }
    }



    
    const [sticky, setSticky]=useState(false);

    useEffect(()=>{
        const handleScroll = () =>{
            if(window.scrollY>0){
                setSticky(true)
            } else{
                setSticky(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return()=>{
            window.removeEventListener('scroll',handleScroll)
        }

    },[])
    
    const navItems = (
      <>
        <li><a href="/" >Home</a></li>
        <li><a href='/dashboard' >Dashboard</a></li>
        <li><a href='/contact' >Contact</a></li>
        <li><a href='/about' >About</a></li>
      </>
    );

  return (
    <>
    <div className={`max-w-screen-2xl container mx-auto md:px-20 px-4 fixed top-0 left-0 right-0 z-50 dark:bg-slate-100 dark:text-black ${
        sticky? "sticky-navbar shadow-md bg-base-200 duration-300 transition-all ease-in-out": "bg-transparent"
    }`}>
<div className="navbar">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        {navItems}
      </ul>
    </div>
    <div className='p-2 text-xl text-black'><FaMoneyBillTrendUp /></div>
    <a className="cursor-pointer font-bold text-2xl mt-1">Smart Expense Tracker</a>
  </div> 
  <div className="navbar-end space-x-3">
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      {navItems}
    </ul>
  </div>
    {
        authUser ? <>
        <button className='btn mt-2 bg-red-600 border-none text-white  hover:bg-slate-800 duration-300 cursor-pointer'
        onClick={handleLogout} >Logout</button></> : <>
        <button className="btn mt-2 bg-primary border-none text-white  hover:bg-slate-800 duration-300 cursor-pointer" onClick={() => document.getElementById('my_modal_3').showModal()}>Login</button>
    <Login/></>
    }
  
</div>
</div>
</div>
    </>
  )
}

export default Navbar