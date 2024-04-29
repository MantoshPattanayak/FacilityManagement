const db = require('../../../models/index');
const statusCode = require('../../../utils/statusCode');

const  QueryTypes= db.QueryTypes
const sequelize = db.sequelize
const stausCode = require('../../../utils/statusCode')

const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' }); // Elasticsearch server URL


const displayMapData = async(req,res)=>{
    try{
        let givenReq = req.body.givenReq?req.body.givenReq:null
        console.log(givenReq,'givenReq ')

        const [facilities,metadata] = await sequelize.query('select * from amabhoomi.parks ')

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
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message });

    }
        
}



const searchParkFacilities = async (req, res) => {
    try {
        const { searchQuery } = req.query;
        console.log(searchQuery)
        
        const [facilites,metadata] = await sequelize.query(`select * from amabhoomi.parks where LOWER(parkName) LIKE LOWER(:searchQuery)`,{
            replacements:{searchQuery:`%${searchQuery}%`}
        })

        console.log(facilites,'facilities')
        return res.status(statusCode.SUCCESS.code).json({
            message: `Filtered park facilities`,
            data:facilites
        })

        
     
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const viewParkDetails = async(req,res)=>{
    try{
        let givenReq = req.body.givenReq?req.body.givenReq:null
        let facilityTypeId = req.body.facilityTypeId?req.body.facilityTypeId:null
        console.log(givenReq,'givenReq ')
        console.log("fileid", facilityTypeId)

        let facility = `select facilityName,facilityTypeId,case 
        when Time(?) between operatingHoursFrom and operatingHoursTo then 'open'
        else 'closed'
        end as status, address,latitude,longitude,areaAcres 
        from amabhoomi.facilities f `
   
        let facilities = await sequelize.query(facility,{
            replacements:[new Date()]
        })

       if(facilityTypeId){
        console.log(1)
         facility = `select facilityName,facilityTypeId,case 
            when Time(?) between operatingHoursFrom and operatingHoursTo then 'open'
            else 'closed'
        end as status, address,latitude,longitude,areaAcres 
        from amabhoomi.facilities f where facilityTypeId=?`
       
        facilities = await sequelize.query(facility,{
            replacements:[new Date(),facilityTypeId]
        })
        console.log(2,facilities)
    }

        let matchedData = facilities[0];
        if(givenReq){
             matchedData = facilities[0].filter((mapData)=>
                (mapData.facilityName && mapData.facilityName.toLowerCase().includes(givenReq.toLowerCase()))||
                (mapData.Scheme && mapData.Scheme.toLowerCase().includes(givenReq.toLowerCase()))||
                (mapData.Ownership && mapData.Ownership.toLowerCase().includes(givenReq.toLowerCase()))||
                (mapData.status && mapData.status.toLowerCase().includes(givenReq.toLowerCase()))||
                (!isNaN(Number(givenReq)) && (
                    (mapData.areaAcres && Math.abs(parseFloat(mapData.areaAcres) - parseFloat(givenReq)) < 0.1) ||
                    (mapData.latitude && Math.abs(parseFloat(mapData.latitude) - parseFloat(givenReq)) < 0.1) ||
                    (mapData.longitude && Math.abs(parseFloat(mapData.longitude) - parseFloat(givenReq)) < 0.1) ||
                    (mapData.facilityId && mapData.facilityId.toString() == givenReq)
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
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message });

    }
        
}


const viewParkById = async (req,res)=>{
    try{
        let facilityId = req.params.facilityId? req.params.facilityId:null;
        if(facilityId){
            let fetchTheFacilitiesDetailsQuery = `select facilityName,facilityTypeId,case 
            when Time(?) between operatingHoursFrom and operatingHoursTo then 'open'
            else 'closed'
            end as status, address,latitude,longitude,areaAcres,helpNumber,about,operatingHoursFrom, operatingHoursTo 
            from amabhoomi.facilities f where facilityId = ? `
           let fetchTheFacilitiesDetailsData = await sequelize.query(fetchTheFacilitiesDetailsQuery,
        {
            replacements:[new Date(), facilityId]
        })

        let fetchEventDetailsQuery = `select eventName, eventCategory,locationName,eventDate,eventStartTime,
        eventEndTime, descriptionOfEvent from amabhoomi.eventactivities where facilityId=? and ticketSalesEnabled =1 `

        let fetchEventDetailsData = await sequelize.query(fetchEventDetailsQuery,
            {
                replacements:[facilityId]
            })

        let fethAmenitiesDataQuery =  `select am.amenityName from amabhoomi.facilityamenities fa inner join amabhoomi.amenitymasters am on am.amenityId = fa.amenityId  where fa.facilityId = ? and fa.status=1`
        let fethAmenitiesDetailsDataData = await sequelize.query(fethAmenitiesDataQuery,
            {
                replacements:[facilityId]
            })
        

        let fetchServicesDataQuery = `select s.code from amabhoomi.services s inner join amabhoomi.servicefacilities sf on sf.serviceId = s.serviceId where sf.serviceFacilityId =? and sf.statusId =1`
        let fetchServicesDetailsData = await sequelize.query(fetchServicesDataQuery,
            {
                replacements:[facilityId]
            })
        return res.status(statusCode.SUCCESS.code).json({message:
            "These are the required Data",
           facilitiesData: fetchTheFacilitiesDetailsData[0],
           eventDetails:fetchEventDetailsData[0],
            amenitiesData:fethAmenitiesDetailsDataData[0],
            serviceData:fetchServicesDetailsData[0]
        })
        }
        else{
            return res.status(statusCode.BAD_REQUEST.code).json({message:"please provide the facility type id"})
        }
    }
    catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:err.message})

    }
}


module.exports ={
    displayMapData,
    searchParkFacilities,
    viewParkDetails,
    viewParkById
}