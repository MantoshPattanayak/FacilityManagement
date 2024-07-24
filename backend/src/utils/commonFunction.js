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

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}




// let utilFunction = (fn)=>{
//     return (req,res,next)=>{
//     Promise.resolve(fn(req,res,next)).catch((err)=>next(err))

// }
// }

module.exports ={
    utilFunction
    ,excelSerialToTime
}