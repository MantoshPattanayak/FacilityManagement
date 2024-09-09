const db = require("../../../models/index");
const statusCode = require("../../../utils/statusCode");

const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const facilites = db.facilities
const logger = require('../../../logger/index.logger')


const viewParkDetails = async(req,res)=>{
    try{
        let givenReq = req.body.givenReq?req.body.givenReq:null
        console.log(givenReq,'givenReq ')

        const [facilities,metadata] = await sequelize.query(`
        select facilityName,facilityTypeId,case 
            when time(now()) between operatingHoursFrom and operatingHoursTo then 'open'
            else 'closed'
        end as status, address 
        from amabhoomi.facilities f`)

        let matchedData = facilities;
        if(givenReq){
             matchedData = facilities.filter((mapData)=>
                (mapData.parkName && mapData.parkName.toLowerCase().includes(givenReq.toLowerCase()))||
                (mapData.Scheme && mapData.Scheme.toLowerCase().includes(givenReq.toLowerCase()))||
                (mapData.Ownership && mapData.Ownership.toLowerCase().includes(givenReq.toLowerCase()))||
                (mapData.areaAcres && mapData.areaAcres.toString()==givenReq)||
                (mapData.latitude && mapData.latitude.toString()==givenReq)||
                (mapData.longitude && mapData.longitude.toString()==givenReq)||
                // (mapData.parkId && mapData.parkId.toString()==givenReq)
                (!isNaN(Number(givenReq)) && (
                    (mapData.areaAcres && Math.abs(parseFloat(mapData.areaAcres) - parseFloat(givenReq)) < 0.1) ||
                    (mapData.latitude && Math.abs(parseFloat(mapData.latitude) - parseFloat(givenReq)) < 0.1) ||
                    (mapData.longitude && Math.abs(parseFloat(mapData.longitude) - parseFloat(givenReq)) < 0.1) ||
                    (mapData.parkId && mapData.parkId.toString() == givenReq)
                ))
            )
            
            console.log(matchedData,'matchedData')

        }
  
        return res.status(statusCode.SUCCESS.code).json({
            message: `All park facilities`,
            data:matchedData
        })


    }
    catch(err){
        logger.error(`An error occurred: ${err.message}`); // Log the error

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message });

    }
        
}
