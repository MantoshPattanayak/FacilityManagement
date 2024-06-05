
// import css
import "./Facility_Reg.css"
// Facility Reg funcation -----------------------------
import { useState, useEffect } from "react";
import axiosHttpClient from "../../../utils/axios";
const Facility_Reg = () => {
    // useSate for page -----------------------------------------------
    const [currentStep, setCurrentStep] = useState(1);
    // Facility Data --------------------------
    const [GetServiceData, setGetServiceData] = useState([])
    const [GetAmenitiesData, setGetAmenitiesData] = useState([])
    const [GetfetchInventory, setGetfetchInventory] = useState([])
    // here call the api for get the initial data -----------------------------------------
    async function GetFacilityIntailData() {
        try {
            let res = await axiosHttpClient('Get_Facility_Intail_Data', 'get')
            setGetServiceData(res.data.fetchServices)
            setGetAmenitiesData(res.data.fetchAmenities)
            setGetfetchInventory(res.data.fetchInventory)
            console.log(" Facility Intial Data", res)
        } catch (err) {
            console.log("here error of Facility intail data ", err)
        }
    }
    //useEffect (Update data)-------------------------------
    useEffect(() => {
        GetFacilityIntailData()
    }, [])
    // here Prev and next page ---------------------------------------------------------------------
    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };
    // Prev (Button) --------------------------------------------------------------------------------
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <div>
            <div className="all_From_conatiner">
                {currentStep === 1 && (
                    <form className="event-host_1st_Page">
                        <div className="HostEvent_container">
                            <div className="HostEvent_Heading">
                                <h1 className="verify_name_text">Step-1 (Facility details)</h1>
                                <div className="HeadingTitle9">
                                    <div></div>
                                    <h2>Facility details</h2>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Facility Type <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" className="input_padding" id="input1" name="organisationName"
                                        />
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Facility Name <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder=" Please Enter the Facility Name" name="organisationPanCardNumber"
                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Longitude <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" className="input_padding" id="input1" name="organisationName" placeholder="Please enter the Longitude "
                                        />
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Latitude<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder=" Please Enter the Latitude" name="organisationPanCardNumber"
                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Address<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter address of your facility" name="organisationAddress"

                                        />

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Pin <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" className="input_padding" id="input1" placeholder="Enter Pin  " name="organisationName"
                                        />
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Area <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder="Enter Area"
                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Operating From Time <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="time" className="input_padding" id="input1" placeholder="Enter Pin  " name="organisationName"
                                        />
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Operating To Time<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="time" id="input2" className="input_padding" placeholder="Enter Area"
                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Operating Days<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day">
                                            <button class="button-4" role="button">Sun</button>
                                            <button class="button-4" role="button">Mon</button>
                                            <button class="button-4" role="button">Tues</button>
                                            <button class="button-4" role="button">Wed</button>
                                            <button class="button-4" role="button">Thurs</button>
                                            <button class="button-4" role="button">Fri</button>
                                            <button class="button-4" role="button">Sat</button>
                                        </span>

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Services<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day">
                                            {GetServiceData?.length > 0 && GetServiceData?.map((item, index) => (
                                                <span key={index}>
                                                    <button className="button-4" role="button">{item.code}</button>
                                                </span>
                                            ))}
                                        </span>


                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Other Services<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter some other amenities if you have"

                                        />

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Amenities*<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day">
                                            {GetAmenitiesData?.length > 0 && GetAmenitiesData?.map((data, index) => (
                                                <span key={index}>
                                                    <button class="button-4" role="button">{data.amenityName}</button>
                                                </span>
                                            ))}
                                        </span>

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Amenities Events<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter some other amenities if you have"
                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Events*<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day">
                                            <button class="button-4" role="button">parking</button>
                                            <button class="button-4" role="button">swimming</button>
                                            <button class="button-4" role="button">yoga</button>
                                            <button class="button-4" role="button">open gym</button>
                                            <button class="button-4" role="button">running track</button>
                                            <button class="button-4" role="button">parking</button>
                                            <button class="button-4" role="button">swimming</button>
                                        </span>

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Other Events<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter some other amenities if you have"

                                        />

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Game<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day">
                                            <button class="button-4" role="button">parking</button>
                                            <button class="button-4" role="button">swimming</button>
                                            <button class="button-4" role="button">yoga</button>
                                            <button class="button-4" role="button">open gym</button>
                                            <button class="button-4" role="button">running track</button>
                                            <button class="button-4" role="button">parking</button>
                                            <button class="button-4" role="button">swimming</button>
                                        </span>

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Other Games<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter some other amenities if you have"

                                        />

                                    </div>
                                </div>
                                
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">About the Facility<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="About the Facility"

                                        />
                                    </div>
                                </div>

                                {/* Two more similar rows for Heading 1 */}
                            </div>
                            <div className="buttons-container">
                                <button type="submit" className="next_button" onClick={nextStep}>Next</button>
                            </div>
                        </div>

                    </form>
                )}
                {/*------------------------------------------------------- 2nd Step from ----------------------------------------------------------- */}
                {currentStep === 2 && (
                    <form onSubmit={nextStep}>

                        <h1> From2</h1>
                        <div className="buttons-container">
                            <button type="button" className="prev_button" onClick={prevStep}>Previous</button>
                            <button type="submit" className="next_button">Next</button>
                        </div>
                    </form>
                )}
                {/*           ----------------------------------- step-3 (show the data and Submit--------------------------------------------------------------------------------------------) */}
                {currentStep === 3 && (
                    <form>
                        <h1> From3</h1>
                        {/* ----------------------------------------2nd from ------------------------------------------------ */}
                        <div className="buttons-container">
                            <button type="button" className="prev_button" onClick={prevStep}>Previous</button>
                            <button type="submit" className="next_button">Submit</button>
                        </div>
                    </form>
                )}
            </div>


        </div>
    )
}
export default Facility_Reg;