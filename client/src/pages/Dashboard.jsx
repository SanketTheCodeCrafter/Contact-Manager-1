// import React from 'react'
import '../assets/css/dashboard.css'
import Navbar from "../components/Navbar";
import {Sidebar} from '../components/Sidebar'
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
  return (
  <>
  <Navbar/>
  <div className="dashboard">
    <div className="sidebar-container">
    <Sidebar/>
    </div>
    <div className="content-container">
     <Outlet/>
    </div>
  </div>
  </>
  )
}
