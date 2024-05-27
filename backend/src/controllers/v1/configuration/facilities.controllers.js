const db = require('../../../models/index');
const statusCode = require('../../../utils/statusCode');

const  QueryTypes= db.QueryTypes
const sequelize = db.sequelize
const stausCode = require('../../../utils/statusCode')

const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' }); // Elasticsearch server URL
const Sequelize = db.Sequelize

let facilitiesTable = db.facilities;

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
        console.log('22')
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

        let facility = `select facilityId, facilityname,facilityTypeId,case 
        when Time(?) between operatingHoursFrom and operatingHoursTo then 'open'
        else 'closed'
        end as status, sun, mon, tue, wed, thu, fri, sat, address,latitude,longitude,areaAcres,ownership, fl.url
        from amabhoomi.facilities f left join amabhoomi.fileattachments ft on f.facilityId = ft.entityId left join amabhoomi.files fl on fl.fileId= ft.fileId`
   
        let facilities = await sequelize.query(facility,{
            replacements:[new Date()]
        })

       if(facilityTypeId){
        console.log(1)
         facility = `select facilityId, facilityname,facilityTypeId,case 
            when Time(?) between operatingHoursFrom and operatingHoursTo then 'open'
            else 'closed'
        end as status, address,latitude,longitude,areaAcres,ownership, sun, mon, tue, wed, thu, fri, sat, fl.url
        from amabhoomi.facilities f left join amabhoomi.fileattachments ft on f.facilityId = ft.entityId left join amabhoomi.files fl on fl.fileId= ft.fileId where f.facilityTypeId=?`
       
        facilities = await sequelize.query(facility,{
            replacements:[new Date(),facilityTypeId]
        })
        console.log(2,facilities)
    }

        let matchedData = facilities[0];
        console.log('givenReq',givenReq)
        if(givenReq){
             matchedData = facilities[0].filter((mapData)=>
                (mapData.facilityname && mapData.facilityname.toLowerCase().includes(givenReq.toLowerCase()))||
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



const autoSuggestionForViewParkDetails = async (req,res)=>{
    try {
        let givenReq = req.params.givenReq?req.params.givenReq:null;

    } catch (err) {
       return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message:err.message
       }) 
    }
}

const viewParkById = async (req,res)=>{
    try{
        let facilityId = req.params.facilityId? req.params.facilityId:null;
        if(facilityId){
            let fetchTheFacilitiesDetailsQuery = `select facilityId,facilityName,facilityTypeId,case 
            when Time(?) between operatingHoursFrom and operatingHoursTo then 'open'
            else 'closed'
            end as status, address,latitude,longitude,areaAcres,helpNumber,about,operatingHoursFrom, operatingHoursTo,f.sun,f.mon, f.tue, f.wed, f.thu, f.fri, f.sat,fl.url 
            from amabhoomi.facilities f left join amabhoomi.fileattachments ft on f.facilityId = ft.entityId left join amabhoomi.files fl on fl.fileId= ft.fileId where facilityId = ? `
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

        let fethAmenitiesDataQuery =  `select am.amenityName from amabhoomi.facilityamenities fa inner join amabhoomi.amenitymasters am on am.amenityId = fa.amenityId  where fa.facilityId = ? and fa.statusId=1`
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

let calculateDistance = (lat1, long1, lat2, long2) => {
   
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
        return distance;

};

// const nearByDataInMap = async(req,res)=>{
//     try {
//         let {latitude,longitude,facilityTypeId,range,popular,free,paid, order} = req.body;
//         console.log('1',req.body)
//         // here range is bydefault set to 10
//         range = range?range:20;
//         let fetchFacilitiesQuery;
//         let fetchFacilities;
        
//         if(facilityTypeId){

//         //     fetchFacilities = await facilitiesTable.findAll({attributes:['facilityId','facilityname','facilityTypeId','latitude','longitude','address','areaAcres','operatingHoursFrom','operatingHoursTo',
//         //     [Sequelize.literal('CASE WHEN TIME(?) between operatingHoursFrom and operatingHoursTo THEN open ELSE closed END'), 'status']],
//         //     where:{
//         //     facilityTypeId:facilityTypeId
//         // },
//         // replacements:[new Date()]
//     // })
//             console.log('23')
        
//         if(popular){
//             console.log('24')
//             fetchFacilitiesQuery  = `select count(fb.facilityBookingId)as noOfBookings,f.facilityId, f.facilityname,f.facilityTypeId,case 
//             when Time(?) between f.operatingHoursFrom and f.operatingHoursTo then 'open'
//             else 'closed'
//             end as status, f.address,f.latitude,f.longitude,f.areaAcres,f.ownership,f.sun,f.mon, f.tue, f.wed, f.thu, f.fri, f.sat,max(fl.url) as url 
//             from amabhoomi.facilities f inner join amabhoomi.facilitybookings fb on f.facilityId = fb.facilityId left join amabhoomi.fileattachments ft on fb.facilityId = ft.entityId left join amabhoomi.files fl on fl.fileId= ft.fileId  group by fb.facilityId having f.facilityTypeId = ?
//             order by noOfBookings`,
    
//             fetchFacilities = await sequelize.query(fetchFacilitiesQuery,
//             {
//                 replacements:[new Date(),facilityTypeId]
                 
//             }
//             ) 
       
//         }
//         if(paid){
            
//             fetchFacilitiesQuery =  `select count(ft.tariffMasterId)as paidDetails,f.facilityId, f.facilityname,f.facilityTypeId,case 
//             when Time(?) between f.operatingHoursFrom and f.operatingHoursTo then 'open'
//             else 'closed'
//             end as status, f.address,f.latitude,f.longitude,f.areaAcres,f.ownership,f.sun,f.mon, f.tue, f.wed, f.thu, f.fri, f.sat,max(fl.url) as url 
//             from amabhoomi.facilities f inner join amabhoomi.facilitytariffmasters ft on f.facilityId = ft.facilityId left join amabhoomi.fileattachments fa on ft.facilityId = fa.entityId left join amabhoomi.files fl on fl.fileId= fa.fileId group by ft.facilityId having f.facilityTypeId =? `
           

//             fetchFacilities = await sequelize.query(fetchFacilitiesQuery,
//                 {
//                     replacements:[new Date(),facilityTypeId]
                     
//                 }
//                 )         
               
//             }
//         if(free){
//             console.log('27')
//             fetchFacilitiesQuery =
//             `   
//             SELECT 
//         f.facilityId, 
//         f.facilityname, 
//         f.facilityTypeId,
//         CASE 
//             WHEN TIME(?) BETWEEN f.operatingHoursFrom AND f.operatingHoursTo THEN 'open'
//             ELSE 'closed'
//         END AS status, 
//         f.address, 
//         f.latitude, 
//         f.longitude, 
//         f.areaAcres, 
//         f.ownership,
//         f.sun, f.mon, f.tue, f.wed, f.thu, f.fri, f.sat, 
//         (select fl.url from files fl inner join fileattachments fa on fl.fileId=fa.fileId where fa.entityId = f.facilityId)as url
//     FROM 
//         amabhoomi.facilities f 
//     LEFT JOIN 
//         amabhoomi.facilitytariffmasters ft ON f.facilityId = ft.facilityId 

//         WHERE 
//         f.facilityTypeId = ?
//         AND ft.facilityId IS NULL 
//         group by f.facilityId `
//             fetchFacilities = await sequelize.query(fetchFacilitiesQuery,
//                 {
//                     replacements:[new Date(),facilityTypeId]
                     
//                 }
//                 )         
             

//         }
//         if(!free && !paid && !popular){
//         fetchFacilitiesQuery  = `    
//         select facilityId, facilityname,facilityTypeId,case 
//             when Time(?) between operatingHoursFrom and operatingHoursTo then 'open'
//             else 'closed'
//             end as status, address,latitude,longitude,areaAcres,ownership,f.sun,f.mon, f.tue, f.wed, f.thu, f.fri, f.sat,fl.url  
//             from amabhoomi.facilities f left join amabhoomi.fileattachments fa on fa.entityId = f.facilityId left join amabhoomi.files fl on 
//             fl.fileId = fa.fileId where facilityTypeId = ?
//         `,

//         fetchFacilities = await sequelize.query(fetchFacilitiesQuery,
//         {
//             replacements:[new Date(),facilityTypeId]
             
//         }
//         )
//         }
//         console.log(fetchFacilitiesQuery, 'fetchFacilitiesQuery')
//     }
//         else
//         {
//             if(popular){
//                 fetchFacilitiesQuery  = `select count(fb.facilityBookingId)as noOfBookings,f.facilityId, f.facilityname,f.facilityTypeId,case 
//                 when Time(?) between f.operatingHoursFrom and f.operatingHoursTo then 'open'
//                 else 'closed'
//                 end as status, f.address,f.latitude,f.longitude,f.areaAcres,f.ownership,f.sun,f.mon, f.tue, f.wed, f.thu, f.fri, f.sat,max(fl.url) as url  
//                 from amabhoomi.facilities f inner join amabhoomi.facilitybookings fb on f.facilityId = fb.facilityId left join amabhoomi.fileattachments ft on fb.facilityId = ft.entityId left join amabhoomi.files fl on fl.fileId= ft.fileId  group by fb.facilityId
//                 order by noOfBookings`,
        
//                 fetchFacilities = await sequelize.query(fetchFacilitiesQuery,
//                 {
//                     replacements:[new Date()]
                     
//                 }
//                 ) 
            
        
//             }
//             if(paid){
//                 console.log('fd')
                
//                 fetchFacilitiesQuery =  `select count(ft.tariffMasterId)as paidDetails,f.facilityId, f.facilityname,f.facilityTypeId,case 
//                 when Time(?) between f.operatingHoursFrom and f.operatingHoursTo then 'open'
//                 else 'closed'
//                 end as status, f.address,f.latitude,f.longitude,f.areaAcres,f.ownership,f.sun,f.mon, f.tue, f.wed, f.thu, f.fri, f.sat,max(fl.url) as url 
//                 from amabhoomi.facilities f inner join amabhoomi.facilitytariffmasters ft on f.facilityId = ft.facilityId left join amabhoomi.fileattachments fa on ft.facilityId = fa.entityId left join amabhoomi.files fl on fl.fileId= fa.fileId group by ft.facilityId
//                  `
               
    
//                 fetchFacilities = await sequelize.query(fetchFacilitiesQuery,
//                     {
//                         replacements:[new Date()]
                         
//                     }
//                     )         
                 
//                 }
//             if(free){
//                 console.log('f')
//                 fetchFacilitiesQuery =
//                 `SELECT 
//                 f.facilityId, 
//                 f.facilityname, 
//                 f.facilityTypeId,
//                 CASE 
//                     WHEN TIME(?) BETWEEN f.operatingHoursFrom AND f.operatingHoursTo THEN 'open'
//                     ELSE 'closed'
//                 END AS status, 
//                 f.address, 
//                 f.latitude, 
//                 f.longitude, 
//                 f.areaAcres, 
//                 f.ownership,
//                 f.sun, f.mon, f.tue, f.wed, f.thu, f.fri, f.sat, 
//                 (select fl.url from files fl inner join fileattachments fa on fl.fileId=fa.fileId where fa.entityId = f.facilityId)as url
//             FROM 
//                 amabhoomi.facilities f 
//             LEFT JOIN 
//                 amabhoomi.facilitytariffmasters ft ON f.facilityId = ft.facilityId 
//                 WHERE 
//                  ft.facilityId IS NULL 
//                 group by f.facilityId`
//                 fetchFacilities = await sequelize.query(fetchFacilitiesQuery,
//                     {
//                         replacements:[new Date()]
                         
//                     }
//                     )         
                  
    
//             }

//             console.log('without facility type id')
//             if(!paid && !free && !popular){
//              fetchFacilitiesQuery  = `select facilityId, facilityname,facilityTypeId,case 
//              when Time(?) between operatingHoursFrom and operatingHoursTo then 'open'
//              else 'closed'
//              end as status, address,latitude,longitude,areaAcres,ownership,f.sun,f.mon, f.tue, f.wed, f.thu, f.fri, f.sat,fl.url  
//              from amabhoomi.facilities f left join amabhoomi.fileattachments fa on fa.entityId = f.facilityId left join amabhoomi.files fl on 
//              fl.fileId = fa.fileId  `,

//             fetchFacilities = await sequelize.query(fetchFacilitiesQuery,
//             {
//                 replacements:[new Date()]
               
//             }, 
//         )
//     }
//             // fetchFacilities = await facilitiesTable.findAll(
//             //     {attributes:['facilityId','facilityname','facilityTypeId','latitude','longitude','address','areaAcres','operatingHoursFrom','operatingHoursTo',
//             //     [
//             //         Sequelize.literal('CASE WHEN TIME(?) BETWEEN operatingHoursFrom AND operatingHoursTo THEN "open" ELSE "closed" END'),
//             //         'status'
//             //       ]
//             //     ],
//             //     replacements: [new Date()] // Pass current time as a replacement
//             //   });
//         }
//         // console.log('3' ,fetchFacilities[0])

//         let getNearByData = [];
//         for (const data of fetchFacilities[0]) {
//             // console.log('data',data.latitude,data.longitude)
//             let distance = calculateDistance(latitude, longitude, data.latitude, data.longitude);
//             if (distance <= range) {
//                 getNearByData.push({ facilityname: data.facilityname, distance, ownership: data.ownership, facilityTypeId:data.facilityTypeId,scheme:data.scheme,areaAcres:data.areaAcres, latitude:data.latitude,longitude:data.longitude,address:data.address, statusId:data.statusId,facilityId:data.facilityId,operatingHoursFrom:data.operatingHoursFrom,operatingHoursTo:data.operatingHoursTo,status:data.status,
//                     sun:data.sun,mon:data.mon, tue:data.tue, wed:data.wed, thu: data.thu, fri:data.fri, sat:data.sat, url:data.url
//                 });
//             }
//             // console.log(getNearByData,'getNearByData')
//         }

//         if(order == 1){
//             console.log('order', 11)
//             // ascending
//             getNearByData.sort(function(a, b) {
//                 // Convert names to lowercase for case-insensitive comparison
//                 const nameA = a.facilityname.trim().toLowerCase();
//                 const nameB = b.facilityname.trim().toLowerCase();
            
//                 // Use localeCompare for case-insensitive string comparison
//                 return nameA.localeCompare(nameB);
//             });

//             console.log(getNearByData, 'getNearByData')

            
//         }
//         else if(order == 2){
//             // descending
//             getNearByData.sort(function(a, b) {
//                 // Convert names to lowercase for case-insensitive comparison
//                 const nameA = a.facilityname.trim().toLowerCase();
//                 const nameB = b.facilityname.trim().toLowerCase();
            
            
//                 // Use localeCompare for case-insensitive string comparison
//                 return nameB.localeCompare(nameA);
//             });
//         }

//     //    console.log('get near by data',getNearByData)
//        return res.status(statusCode.SUCCESS.code).json({
//         message:'These are the near by data', data:getNearByData
//        })

//     } catch (err) {
//         return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
//             message:err.message
//         })
//     }
// }

const nearByDataInMap = async (req, res) => {
    try {
        let { latitude, longitude, facilityTypeId, range, popular, free, paid, order } = req.body;

        // Default range is set to 20 if not provided
        range = range ? range : 20;

        // Initialize query and replacements array
        let fetchFacilitiesQuery = '';
        let replacements = [new Date()]; // Always pass current time as a replacement

        // Construct base query
        fetchFacilitiesQuery = `SELECT 
            f.facilityId, 
            f.facilityname, 
            f.facilityTypeId,
            CASE 
                WHEN TIME(?) BETWEEN f.operatingHoursFrom AND f.operatingHoursTo THEN 'open'
                ELSE 'closed'
            END AS status, 
            f.address, 
            f.latitude, 
            f.longitude, 
            f.areaAcres, 
            f.ownership,
            f.sun, f.mon, f.tue, f.wed, f.thu, f.fri, f.sat, 
            fl.url AS imageURL
        FROM 
            amabhoomi.facilities f 
        LEFT JOIN 
            amabhoomi.fileattachments fa ON fa.entityId = f.facilityId 
        LEFT JOIN 
            amabhoomi.files fl ON fl.fileId = fa.fileId`;

        if (free && paid && popular ) {
            console.log('free paid popular')
                fetchFacilitiesQuery += ` INNER JOIN amabhoomi.facilitybookings fb ON f.facilityId = fb.facilityId
                LEFT JOIN amabhoomi.facilitytariffmasters ft ON f.facilityId = ft.facilityId `;
        }

        if (free && paid && !popular ) {
            fetchFacilitiesQuery += ` LEFT JOIN amabhoomi.facilitytariffmasters ft ON f.facilityId = ft.facilityId `;
        }
        if (free && popular && !paid) {
            fetchFacilitiesQuery += ` LEFT JOIN amabhoomi.facilitytariffmasters ft ON f.facilityId = ft.facilityId
            INNER JOIN amabhoomi.facilitybookings fb ON f.facilityId = fb.facilityId `;
        }

        if (paid && popular && !free ) {
            fetchFacilitiesQuery += ` INNER JOIN amabhoomi.facilitytariffmasters ft ON f.facilityId = ft.facilityId
            INNER JOIN amabhoomi.facilitybookings fb ON f.facilityId = fb.facilityId `;
        }
        // Apply filter conditions based on popular, free, paid
        if (popular && !free && !paid) {
            fetchFacilitiesQuery += ` INNER JOIN amabhoomi.facilitybookings fb ON f.facilityId = fb.facilityId`;
        }
        if (free && !popular && !paid) {
            fetchFacilitiesQuery += ` LEFT JOIN amabhoomi.facilitytariffmasters ft ON f.facilityId = ft.facilityId `;
        }
        if (paid && !free && !popular) {
            fetchFacilitiesQuery += ` INNER JOIN amabhoomi.facilitytariffmasters ft ON f.facilityId = ft.facilityId`;
        }
          // Filter by facilityTypeId if provided
          if (facilityTypeId) {
            fetchFacilitiesQuery += ` WHERE f.facilityTypeId = ?`;
            if(free && !paid){
                fetchFacilitiesQuery += ` and ft.facilityId IS NULL`
            }
            replacements.push(facilityTypeId);
        }

        if(free && !facilityTypeId && !paid){
            fetchFacilitiesQuery += ` where ft.facilityId IS NULL`
        }

        // Group by facilityId
        fetchFacilitiesQuery += ` GROUP BY f.facilityId, imageURL`;
        console.log(fetchFacilitiesQuery,'fetchFacilitiesQuery')
        // Sort order
        if (order == 1) {
            // Ascending order
            fetchFacilitiesQuery += ` ORDER BY f.facilityname ASC`;
        } else if (order == 2) {
            // Descending order
            fetchFacilitiesQuery += ` ORDER BY f.facilityname DESC`;
        }

        // Execute the constructed query
        const fetchFacilities = await sequelize.query(fetchFacilitiesQuery, {
            replacements: replacements
        });

        // Process the fetched data as needed

                let getNearByData = [];
        for (const data of fetchFacilities[0]) {
            // console.log('data',data.latitude,data.longitude)
            let distance = calculateDistance(latitude, longitude, data.latitude, data.longitude);
            if (distance <= range) {
                getNearByData.push({ facilityname: data.facilityname, distance, ownership: data.ownership, facilityTypeId:data.facilityTypeId,scheme:data.scheme,areaAcres:data.areaAcres, latitude:data.latitude,longitude:data.longitude,address:data.address, statusId:data.statusId,facilityId:data.facilityId,operatingHoursFrom:data.operatingHoursFrom,operatingHoursTo:data.operatingHoursTo,status:data.status,
                    sun:data.sun,mon:data.mon, tue:data.tue, wed:data.wed, thu: data.thu, fri:data.fri, sat:data.sat, url:data.url
                });
            }
            // console.log(getNearByData,'getNearByData')
        }

        if(order == 1){
            console.log('order', 11)
            // ascending
            getNearByData.sort(function(a, b) {
                // Convert names to lowercase for case-insensitive comparison
                const nameA = a.facilityname.trim().toLowerCase();
                const nameB = b.facilityname.trim().toLowerCase();
            
                // Use localeCompare for case-insensitive string comparison
                return nameA.localeCompare(nameB);
            });

            console.log(getNearByData, 'getNearByData')

            
        }
        else if(order == 2){
            // descending
            getNearByData.sort(function(a, b) {
                // Convert names to lowercase for case-insensitive comparison
                const nameA = a.facilityname.trim().toLowerCase();
                const nameB = b.facilityname.trim().toLowerCase();
            
            
                // Use localeCompare for case-insensitive string comparison
                return nameB.localeCompare(nameA);
            });
        }
        // Construct response
        return res.status(statusCode.SUCCESS.code).json({
            message: 'Nearby data retrieved successfully',
            data: getNearByData // Assuming fetchFacilities is an array with the result at index 0
        });
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
        });
    }
};


module.exports ={
    displayMapData,
    searchParkFacilities,
    viewParkDetails,
    viewParkById,
    nearByDataInMap
}