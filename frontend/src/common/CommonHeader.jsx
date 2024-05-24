import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './CommonHeader.css';

const CommonHeader = () => {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState('');

    useEffect(() => {
        setActiveLink(path);
    }, [location.pathname]);

    return (
        <div>
            <header className="header">
                <div className="header-content">
                    <div className="logo"></div>
                    <nav>
                        <ul>
                            <li><NavLink exact to="/about" className={activeLink === 'about' ? 'active' : ''}>ABOUT</NavLink></li>
                            <li><NavLink to="/faq" className={activeLink === 'faq' ? 'active' : ''}>FAQ</NavLink></li>
                            <li><NavLink to="/facilities" className={activeLink === 'facilities' ? 'active' : ''}>FACILITIES</NavLink></li>
                            <li><NavLink to="/events" className={activeLink === 'events' ? 'active' : ''}>EVENTS</NavLink></li>
                            <li><NavLink to="/host-event" className={activeLink === 'host-event' ? 'active' : ''}>HOST EVENT</NavLink></li>
                            <li><NavLink className={`login-button ${activeLink === 'login' ? 'active' : ''}`} to="/login">LOGIN</NavLink></li>
                        </ul>
                    </nav>
                </div>
            </header>
        </div>
    );
};

export default CommonHeader;
