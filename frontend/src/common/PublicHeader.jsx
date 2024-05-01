import React from 'react';
import AppLogo from '../assets/ama-bhoomi_logo.png';
import '../components/Public/Landing.css';

export default function PublicHeader() {
    let isUserLoggedIn = sessionStorage.getItem('isUserLoggedIn') ? sessionStorage.getItem('isUserLoggedIn') : 0;

    return (
        <header className="header">
            <header className="header-content">
                <div className="logo">
                    
                </div>
                <nav>
                    <ul>
                        <li><a href="/">HOME</a></li>
                        <li><a href="#">ABOUT</a></li>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="/facilities">FACILITIES</a></li>
                        <li><a href="#">EVENTS</a></li>
                        <li><a href="#">HOST EVENT</a></li>
                        {
                            isUserLoggedIn ? 
                            <li><a className='login-button' href="/login-signup">LOGIN</a></li>
                            :
                            <li><a className='login-button' href="#">Profile</a></li>
                        }
                    </ul>
                </nav>
            </header>
        </header>
    )
}
