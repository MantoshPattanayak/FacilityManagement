import React from 'react'
import './CommonHeader.css'

const CommonHeader = () => {
  return (
    <div>
                     <header className="header">
                    <header className="header-content">
                        <div class="logo">

                        </div>
                        <nav>
                            <ul>
                                <li><a href="#">ABOUT</a></li>
                                <li><a href="#">FAQ</a></li>
                                <li><a href="#">FACILITIES</a></li>
                                <li><a href="#">EVENTS</a></li>
                                <li><a href="#">HOST EVENT</a></li>
                                <li><a className='login-button' href="#">LOGIN</a></li>
                            </ul>
                        </nav>
                    </header>
                </header>
    </div>
  )
}

export default CommonHeader
