import React, { useState } from 'react';
import '../Public/Login.css';
import AdminHeader from '../../common/AdminHeader';
import Footer from '../../common/Footer';

const Login = () => {
    const [login, setLogin] = useState(true);
    



// here Post the data of Loging---------------------------------


    async function handleLogin(e) {
        e.preventDefault();
        setLogin(false);
    }

    return (
        <div>
            <AdminHeader />

            {login && (
                <div className="signup-container">
                    <div className="context">
                        <div className="inputs">
                            <div className="text">
                                <label htmlFor="">Enter Email/Mobile Number</label>
                            </div>
                            <input className='input-field' type="text" placeholder='Enter Email/Mobile Number' />
                        </div><br />

                        <div className="inputs">
                            <div className="text">
                                <label htmlFor="">Enter Password</label>
                            </div>
                            <input className='input-field' type="password" placeholder='Enter Password' />
                        </div>

                        <div className="otp-btn">
                            <button className="sendotp-btn" onClick={handleLogin}>Login</button>
                        </div>
                        <div className='login-options'>
                            {/* Option for Forgot Password */}
                            <div className="forgot-password">
                                <a href="#">Forgot Password?</a>
                            </div>

                            {/* Option for Login with OTP */}
                            <div className="login-otp">
                                <a href="#">Login with OTP</a>
                            </div>
                        </div>


                        {/* Option for SignUp */}
                        <div className="no-account">
                            <p>Don't have an account?</p>
                            <a href="#">SignUp</a>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default Login;
