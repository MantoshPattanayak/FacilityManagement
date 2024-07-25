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
}