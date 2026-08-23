import React from 'react'
import { Outlet } from "react-router-dom";
import Navbar from "../components/LoginNavbar";
import Login from '../components/auth/Login';
export default function loginLayout() {
  return (
    <div className='min-h-dvh'>
      <Navbar/>
      <div className='flex-1'>
        <Outlet/>
      </div>
    </div>
  )
}
