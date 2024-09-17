const moment = require("moment");
let utilFunction = (fn)=>  async function(req,res,next){
    try{
        await fn(req,res,next)
        
    }
    catch(err){
        res.status(err.code||500).json({
            success: false,
            message: err.message
        })
    }
}

/**
 * Converts Excel time serial number to time string (HH:MM:SS)
 * @param {number} excelSerialNumber - Excel time serial number
 * @returns {string} - Time string (HH:MM:SS)
 */
function excelSerialToTime(excelSerialNumber) {
    const fractionalDay = excelSerialNumber - Math.floor(excelSerialNumber);
    const totalSeconds = Math.round(86400 * fractionalDay);

    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    // console.log("time", `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * function to validate and convert to YYYY-MM-DD
 * @param {string} dateString 
 * @returns {boolean, string} isValid, data
 */
function validateAndConvertDate(dateString) {
    // Define the acceptable date formats
    // console.log("validateAndConvertDate func dateString", dateString);
    const formats = [
        "DD/MM/YYYY",
        "DD-MM-YYYY",
        "MM/DD/YYYY",
        "MM-DD-YYYY"
    ];

    // Check if the date string is valid according to any of the specified formats
    const isValid = formats.some(format => moment(dateString, format, true).isValid());
    
    if (isValid) {
        // Attempt to parse the date and convert it to YYYY-MM-DD format
        const parsedDate = moment(dateString, formats, true);
        
        if (parsedDate.isValid()) {
            // console.log("date parsing", parsedDate.format("YYYY-MM-DD"));
            return { isValid: true, data: parsedDate.format("YYYY-MM-DD") }; // Return the converted date
        } else {
            return { isValid: false, data: null }; // Return an error message if parsing fails
        }
    }
    else {
        return { isValid: false, data: null };
    }
}

/**
 * function to validate time input
 * @param {string} timeString 
 * @returns 
 */
function validateTimeFormat(timeString) {
    // Define the acceptable time format
    const timeFormat = "HH:mm:ss";

    // Check if the time string is valid according to the specified format
    const isValid = moment(timeString, timeFormat, true).isValid();

    return isValid;
}

function calculateDistance (lat1, long1, lat2, long2) {
   
    console.log('Input Coordinates:', lat1, long1, lat2, long2);

    const earthRadius = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
    const dLong = (long2 - long1) * Math.PI / 180; // Convert degrees to radians

    // console.log('Delta Longitude (radians):', dLong);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);

    // console.log('Intermediate Calculation:', a);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c; // Distance in kilometers

    // console.log('Calculated Distance:', distance);
    console.log(distance, "distance")
    return distance;

};

function formatDateYYYYMMDD(date) { //format input date as DD-MM-YYYY
    if (!date) return;

    const [year, month, day] = date.split('-');
    console.log(`${year}-${month}-${day}`);
    return `${year}-${month}-${day}`;
}


// let utilFunction = (fn)=>{
//     return (req,res,next)=>{
//     Promise.resolve(fn(req,res,next)).catch((err)=>next(err))

// }
// }

module.exports ={
    utilFunction
    ,excelSerialToTime
    ,validateAndConvertDate
    ,validateTimeFormat
    ,calculateDistance
    ,formatDateYYYYMMDD
}