import React, { useState } from 'react';
import '../assets/css/sidebar.css';
import { Link } from "react-router-dom";
import {
    FaCubesStacked,
    FaUser,
    FaRegAddressCard,
    FaPowerOff,
    FaAddressCard,
} from 'react-icons/fa6';

export const Sidebar = () => {
    const [activeLink, setActiveLink] = useState(1);

    return (
        <div className="sidebar">
            <div className='sidebar-item'>
                <FaCubesStacked className="top-icon" />
            </div>
            <div className={`sidebar-item ${activeLink === 0 ? "active" : ""}`} onClick={() => setActiveLink(0)}>
                <Link to='/profile' className="sidebar-link">
                    <FaUser className="icon" /> Profile
                </Link>
            </div>
            <div className={`sidebar-item ${activeLink === 1 ? "active" : ""}`} onClick={() => setActiveLink(1)}>
                <Link to='/dashboard/contacts' className="sidebar-link">
                    <FaAddressCard className="icon" /> Contacts
                </Link>
            </div>
            <div className={`sidebar-item ${activeLink === 2 ? "active" : ""}`} onClick={() => setActiveLink(2)}>
                <Link to='/dashboard/add-contacts' className="sidebar-link">
                    <FaRegAddressCard className="icon" /> Add Contacts
                </Link>
            </div>
            <div className={`sidebar-item ${activeLink === 3 ? "active" : ""}`} onClick={() => setActiveLink(3)}>
                <Link to='/logout' className="sidebar-link">
                    <FaPowerOff className="icon" /> Exit
                </Link>
            </div>
        </div>
    );
};
