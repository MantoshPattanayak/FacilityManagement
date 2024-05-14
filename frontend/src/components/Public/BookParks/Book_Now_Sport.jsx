
import React from "react";
import { useState, useEffect } from "react";
import PublicHeader from "../../../common/PublicHeader";
import CommonFooter from "../../../common/CommonFooter";
// Import Css file here ---------------------------------
import './Book_Now_Sport.css'
const Book_Now_Sport = () => {
    return (
        <div className="Book_sport_Main_conatiner" >
            <PublicHeader />
            <div className="Book_sport_Child_conatiner">
                <div className="Add_sport_form">
                    <div className="sport_name_Book">
                        <h1>Netaji Sports Field,</h1>
                        <p>Bargada Brit Colony </p>
                    </div>
                    <div class="bookingFormWrapper">
                       
                        <form class="bookingForm">
                            <div class="formGroup">
                                <span class="fieldName">Sport:</span>
                                <select class="formSelect">
                                    <option value="football">Football</option>
                                    <option value="basketball">Basketball</option>
                                    <option value="tennis">Tennis</option>
                                    <option value="swimming">Swimming</option>
                                </select>
                            </div>
                            <div class="formGroup">
                                <span class="fieldName">Date:</span>
                                <input type="date" class="formInput" />
                            </div>
                            <div class="formGroup">
                                <span class="fieldName">Time:</span>
                                <input type="time" class="formInput" />
                            </div>
                            
                            <div class="formGroup">
                                <span class="fieldName">Player Limit:</span>
                                <input type="number" class="formInput" />
                            </div>
                            <div class="formGroup">
                                <span class="fieldName">Price</span>
                                <h1 className="price_Sport">78478/_</h1>
                            </div>
                            <button type="submit" class="submitButton">Book Now</button>
                        </form>
                    </div>





                </div>
            </div>
            <CommonFooter />
        </div>
    )
}
export default Book_Now_Sport;