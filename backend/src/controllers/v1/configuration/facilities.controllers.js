const db = require('../../../models/index');
const statusCode = require('../../../utils/statusCode');

const  QueryTypes= db.QueryTypes
const sequelize = db.sequelize
const stausCode = require('../../../utils/statusCode')

const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' }); // Elasticsearch server URL
const Sequelize = db.Sequelize

let facilitiesTable = db.facilities;
let facilitiesActivities = db.facilityactivities
let userActivity = db.useractivitymasters;
let facilityTariff = db.facilitytariff
let userBookmark = db.bookmarks
let eventActivities = db.eventActivities
let activitiesMaster = db.useractivitymasters
let servicesMaster = db.services
let amenitiesMaster = db.amenitiesmaster
let eventCategoriesMaster = db.eventCategoryMaster
const fs = require('fs');
const path = require('path');

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

// Function to URL-encode file paths in the array
function encodeUrls(facilitiesArray) {
    console.log(facilitiesArray,'facilities Array')
    return facilitiesArray.map(facility => {
        // Check if the facility object has a "url" property
        if (facility.url) {
            // Encode the URL
            facility.url = facility.url.split('/').map(segment=>{
                if(segment.includes(';')){
                    return segment
                }
                else{
                    return encodeURIComponent(segment)
                }
            }).join('/');

            // facility.url = encodeURIComponent(facility.url);
        }
        return facility;
    });
}



const viewParkDetails = async(req,res)=>{
    try{
        let userId = req.user?.userId || 1
        let givenReq = req.body.givenReq?req.body.givenReq:null
        let facilityTypeId = req.body.facilityTypeId?req.body.facilityTypeId:null
        let selectedFilter = req.body.selectedFilter?req.body.selectedFilter:null;
        console.log(givenReq,'givenReq ')
        console.log("fileid", facilityTypeId,'selected filter',selectedFilter)
        let facilityImagePurpose = 'singleFacilityImage'
        let facility = `select facilityId, facilityname,facilityTypeId,case 
        when Time(?) between operatingHoursFrom and operatingHoursTo then 'open'
        else 'closed'
        end as status, sun, mon, tue, wed, thu, fri, sat, address,latitude,longitude,areaAcres,ownership, fl.url
        from amabhoomi.facilities f left join amabhoomi.fileattachments ft on f.facilityId = ft.entityId left join amabhoomi.files fl on fl.fileId= ft.fileId `
        
        let facilities;

        if (selectedFilter) {
            console.log('selected filter')
            let filterConditions = [];
        
            if (selectedFilter.Amenities.length > 0) {
                console.log('1')
                filterConditions.push(`f.facilityId IN (SELECT facilityId FROM facilityamenities WHERE amenityId IN (${selectedFilter.Amenities.join(',')}))`);
            }
            
            if (selectedFilter.Activity.length > 0) {
                console.log('2')
                filterConditions.push(`f.facilityId IN (SELECT facilityId FROM facilityactivities WHERE activityId IN (${selectedFilter.Activity.join(',')}))`);
            }
            if (selectedFilter.EventCategories.length > 0) {
                let eventIds =[]
                for (let i of selectedFilter.EventCategories) {
                    console.log('i',i)
                    let eventActivity = await sequelize.query('SELECT eat.eventId FROM eventcategorymasters ecm INNER JOIN eventactivities eat ON eat.eventCategoryId = ecm.eventCategoryId WHERE ecm.eventCategoryId = ?', {
                        replacements: [i],
                        type:Sequelize.QueryTypes.SELECT
                    });
                    eventIds.push(eventActivity[0].eventId)
                    console.log('event ids',eventActivity)
                }
                filterConditions.push(`f.facilityId IN (SELECT facilityId FROM eventactivities WHERE eventId IN (${eventIds.join(',')}))`);

            }
        
            if (selectedFilter.Services.length > 0) {
                filterConditions.push(`f.facilityId IN (SELECT facilityId FROM servicefacilities WHERE serviceId IN (${selectedFilter.Services.join(',')}))`);
            }
            
            console.log('24')
            if (filterConditions.length > 0 && !facilityTypeId) {
                console.log('filter condn', filterConditions,facility)
                facility += ` WHERE ${filterConditions.join(' AND ')} and ft.filePurpose = ?`;
                console.log('facility',facility)
                 facilities = await sequelize.query(facility,{
                    replacements:[new Date(),facilityImagePurpose]
                })
            }
            if (facilityTypeId) {
                console.log('25')

                facility += ` WHERE f.facilityTypeId=? and ft.filePurpose = ?`;
            
                if (filterConditions.length) {
                    // Add selected filter conditions
                    facility += ` AND ${filterConditions.join(' AND ')}`;
                }
            
                facilities = await sequelize.query(facility, {
                    replacements: [new Date(),facilityTypeId,facilityImagePurpose]
                });
            }
        }
        if (facilityTypeId && !selectedFilter) {
            console.log('25')

            facility += ` WHERE f.facilityTypeId=? and ft.filePurpose = ? `;   
        
            facilities = await sequelize.query(facility, {
                replacements: [new Date(),facilityTypeId,facilityImagePurpose]
            });
        }

        if (!facilityTypeId && !selectedFilter) {
            console.log('25')
            facility += ` WHERE  ft.filePurpose = ?`;   
            console.log('facility query', facility)
            facilities = await sequelize.query(facility, {
                replacements: [new Date(),facilityImagePurpose]
            });
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
            
            // console.log(matchedData,'matchedData')

        }
        // const convertedData = convertImagesToBase64(matchedData);
        // Call the function to encode URLs in the facilities array
        const encodedFacilities = encodeUrls(matchedData);
        // fetch bookmark details
        let fetchBookmarkDetails = await userBookmark.findAll({
            where:{
                publicUserId:userId
            }
        })
        // console.log(encodedFacilities)
        // if selected filter comes 
        
        return res.status(statusCode.SUCCESS.code).json({
            message: `All park facilities`,
            data:encodedFacilities,
            bookmarkDetails:fetchBookmarkDetails
        })


    }
    catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message });

    }
        
}



const autoSuggestionForOverallSearch = async (req,res)=>{
    try {
        let givenReq = req.body.givenReq ? req.body.givenReq.toLowerCase() : null;

        
        let fetchFacilitiesData = await facilitiesTable.findAll({
            where: {
                statusId: 1
            }
        });
        
        let fetchEventsData = await eventActivities.findAll({
            where: {
                statusId: 1
            }
        });

        let fetchActivitiesData = await activitiesMaster.findAll({
            where: {
                statusId: 1
            }
        });

        let fetchServicesData = await servicesMaster.findAll({
            where: {
                statusId: 1
            }
        });

        let fetchAmenitiesData = await amenitiesMaster.findAll({
            where: {
                statusId: 1
            }
        });

        let fetchEventCategoriesData = await eventCategoriesMaster.findAll({
            where: {
                statusId: 1
            }
        })

        //  find in facility name, facility location
        let matchedFacilitiesData = fetchFacilitiesData.map((facility) => {
            if(facility.facilityname.toLowerCase().includes(givenReq)) {
                facility['suggestion'] = facility.facilityname;
                return facility['suggestion'];
            }
            if(facility.address.toLowerCase().includes(givenReq)){
                facility['suggestion'] = facility.address;
                return facility['suggestion'];
            }
        });
        //  find in event name, event location
        let matchedEventsData = await fetchEventsData.map((event) => {
            if(event.eventName.toLowerCase().includes(givenReq)) {
                event['suggestion'] = event.eventName;
                return event['suggestion'];
            }
            if(event.locationName.toLowerCase().includes(givenReq)) {
                event['suggestion'] = event.locationName;
                return event['suggestion'];
            }
        });
        //  find in activity master
        let matchedActivitiesData = await fetchActivitiesData.map((activity) => {
            if(activity.userActivityName.toLowerCase().includes(givenReq)) {
                activity['suggestion'] = activity.userActivityName;
                return activity['suggestion'];
            }
        });
        //  find in services master
        let matchedServicesData = await fetchServicesData.map((service) => {
            if(service.description.toLowerCase().includes(givenReq)) {
                service['suggestion'] = service.description;
                return service['suggestion'];
            }
        });
        //  find in amenity master
        let matchedAmenitiesData = await fetchAmenitiesData.map((amenity) => {
            if(amenity.amenityName.toLowerCase().includes(givenReq)) {
                amenity['suggestion'] = amenity.amenityName;
                return amenity['suggestion'];
            }
        });
        //  find in event category master
        let matchedEventCategoriesData = await fetchEventCategoriesData.map((eventCategory) => {
            if(eventCategory.eventCategoryName.toLowerCase().includes(givenReq)) {
                eventCategory['suggestion'] = eventCategory.eventCategoryName;
                return eventCategory['suggestion'];
            }
        });

        let matchedData = [...matchedFacilitiesData, ...matchedEventsData, ...matchedActivitiesData, ...matchedServicesData, ...matchedAmenitiesData, ...matchedEventCategoriesData];
        matchedData = [...new Set(matchedData)];

        res.status(statusCode.SUCCESS.code).json({
            message: "Suggestions",
            suggestions: matchedData
        });

    } catch (err) {
       return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message:err.message
       });
    }
}

const viewParkById = async (req,res)=>{
    try{
        let userId = req.user?.userId || 1;
        let multipleFacilityImage="multipleFacilityImage"
        let facilityId = req.params.facilityId? req.params.facilityId:null;
        let findFacilityTypeId = await facilitiesTable.findOne({
            where:{
                facilityId:facilityId
            }
        })
        if(facilityId){
            let fetchTheFacilitiesDetailsQuery = `select facilityId,facilityName,facilityTypeId,case 
            when Time(?) between operatingHoursFrom and operatingHoursTo then 'open'
            else 'closed'
            end as status,ft.filePurpose,address,latitude,longitude,areaAcres,helpNumber,additionalDetails as about,operatingHoursFrom, operatingHoursTo,f.sun,f.mon, f.tue, f.wed, f.thu, f.fri, f.sat,group_concat(fl.url separator  ';') as url
            from amabhoomi.facilities f left join amabhoomi.fileattachments ft on f.facilityId = ft.entityId left join amabhoomi.files fl on fl.fileId= ft.fileId where facilityId = ? and ft.filePurpose = ?
      
       `
           let fetchTheFacilitiesDetailsData = await sequelize.query(fetchTheFacilitiesDetailsQuery,
        {
            replacements:[new Date(), facilityId,multipleFacilityImage]
        })

        let fetchEventDetailsQuery = `
        select e.eventName, e.eventCategoryId, e.locationName, e.eventDate, e.eventStartTime,
        s.statusCode, e.eventEndTime, e.descriptionOfEvent,fl.url,fat.filePurpose ,fat.entityType
        from amabhoomi.eventactivities e
        inner join amabhoomi.statusmasters s on e.statusId = s.statusId
        left join amabhoomi.fileattachments fat on fat.entityId  = e.eventId and fat.filePurpose = 'Event Image' and fat.entityType = 'events' 
        left join amabhoomi.files fl on fl.fileId  = fat.fileId
        and facilityId=?`;

        let fetchEventDetailsData = await sequelize.query(fetchEventDetailsQuery,
            {
                replacements:[facilityId]
            })

        let fethAmenitiesDataQuery =  `select am.amenityName from amabhoomi.facilityamenities fa inner join amabhoomi.amenitymasters am on am.amenityId = fa.amenityId  where fa.facilityId = ? and fa.statusId=1`
        let fethAmenitiesDetailsDataData = await sequelize.query(fethAmenitiesDataQuery,
            {
                replacements:[facilityId]
            })
        

        let fetchServicesDataQuery = `select s.code, s.description from amabhoomi.services s inner join amabhoomi.servicefacilities sf on sf.serviceId = s.serviceId where sf.facilityId =? and sf.statusId =1`
        let fetchServicesDetailsData = await sequelize.query(fetchServicesDataQuery,
            {
                replacements:[facilityId]
            })
        // if the facilityType is playground then this facility activities will display some data
        
        let fetchfacilitiesActivities = await facilitiesActivities.findAll({
            where:{
                facilityTypeId:findFacilityTypeId.facilityTypeId
            },
            include:[
               { 
                model:facilitiesTable
                },
                {
                    model:userActivity
                }
            ]
        })

        let fetchTariff = await facilityTariff.findOne({
            where:{
                facilityId:facilityId
            }
        })
        let fetchBookmarkDetails = await userBookmark.findAll({
            where:{
                publicUserId:userId
            }
        })
        const encodedFacilities = encodeUrls(fetchTheFacilitiesDetailsData[0]);

        return res.status(statusCode.SUCCESS.code).json({message:
            "These are the required Data",
           facilitiesData: fetchTheFacilitiesDetailsData[0],
           eventDetails:fetchEventDetailsData[0],
            amenitiesData:fethAmenitiesDetailsDataData[0],
            serviceData:fetchServicesDetailsData[0],
            fetchfacilitiesActivities:fetchfacilitiesActivities,
            fetchTariffData:fetchTariff,
            fetchBookmarkDetails:fetchBookmarkDetails
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
        console.log(distance, "distance")
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




function convertImagesToBase64(dataArray) {
    return dataArray.map(item => {
        try {
            const imagePath = path.join(process.env.UPLOAD_DIR, item.url); // Construct absolute path to image
            console.log(imagePath, 'imagePath')
            const imageBuffer = fs.readFileSync(imagePath); // Read image file

            // Convert image buffer to base64 string
            const base64String = imageBuffer.toString('base64');

            // Replace the relative path with the base64 string
            return {
                ...item,
                url: base64String
            };
        } catch (error) {
            console.error(`Error converting image ${item.url}:`, error.message);
            return item; // Return the original item if an error occurs
        }
    });
}

const nearByDataInMap = async (req, res) => {
    try {
        let { latitude, longitude, facilityTypeId, range, popular, free, paid, order,selectedFilter } = req.body;
        let filePurpose = 'singleFacilityImage'
        let entityType = 'facilities'
        // Default range is set to 20 if not provided
        range = range ? range : 20;
        order = order ? order : 2;

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

        // if (free && paid && popular ) {
        //     console.log('free paid popular')
        //         fetchFacilitiesQuery += ` INNER JOIN amabhoomi.facilitybookings fb ON f.facilityId = fb.facilityId
        //         LEFT JOIN amabhoomi.facilitytariffmasters ft ON f.facilityId = ft.facilityId `;
        // }

        // if (free && paid && !popular ) {
        //     fetchFacilitiesQuery += ` LEFT JOIN amabhoomi.facilitytariffmasters ft ON f.facilityId = ft.facilityId `;
        // }
        // if (free && popular && !paid) {
        //     fetchFacilitiesQuery += ` LEFT JOIN amabhoomi.facilitytariffmasters ft ON f.facilityId = ft.facilityId
        //     INNER JOIN amabhoomi.facilitybookings fb ON f.facilityId = fb.facilityId `;
        // }

        // if (paid && popular && !free ) {
        //     fetchFacilitiesQuery += ` INNER JOIN amabhoomi.facilitytariffmasters ft ON f.facilityId = ft.facilityId
        //     INNER JOIN amabhoomi.facilitybookings fb ON f.facilityId = fb.facilityId `;
        // }

        // Apply filter conditions based on popular, free, paid

        // if (popular && !free && !paid) {
        //     fetchFacilitiesQuery += ` INNER JOIN amabhoomi.facilitybookings fb ON f.facilityId = fb.facilityId`;
        // }

        // if (free && !popular && !paid) {
        //     fetchFacilitiesQuery += ` LEFT JOIN amabhoomi.facilitytariffmasters ft ON f.facilityId = ft.facilityId `;
        // }
        // if (paid && !free && !popular) {
        //     fetchFacilitiesQuery += ` INNER JOIN amabhoomi.facilitytariffmasters ft ON f.facilityId = ft.facilityId`;
        // }

         if (popular) {
            fetchFacilitiesQuery += ` INNER JOIN amabhoomi.facilitybookings fb ON f.facilityId = fb.facilityId`;
        }

        if (selectedFilter) {
            console.log('selected filter')
            let filterConditions = [];
        
            if (selectedFilter.Amenities.length > 0) {
                console.log('1')
                filterConditions.push(`f.facilityId IN (SELECT facilityId FROM facilityamenities WHERE amenityId IN (${selectedFilter.Amenities.join(',')}))`);
            }
            
            if (selectedFilter.Activity.length > 0) {
                console.log('2')
                filterConditions.push(`f.facilityId IN (SELECT facilityId FROM facilityactivities WHERE activityId IN (${selectedFilter.Activity.join(',')}))`);
            }
            if (selectedFilter.EventCategories.length > 0) {
                let eventIds =[]
                for (let i of selectedFilter.EventCategories) {
                    console.log('i',i)
                    let eventActivity = await sequelize.query('SELECT eat.eventId FROM eventcategorymasters ecm INNER JOIN eventactivities eat ON eat.eventCategoryId = ecm.eventCategoryId WHERE ecm.eventCategoryId = ?', {
                        replacements: [i],
                        type:Sequelize.QueryTypes.SELECT
                    });
                    console.log('event ids',eventActivity)
                    if(eventActivity.length>0){
                        eventIds.push(eventActivity[0].eventId)
                    }
                }
                console.log('eventIds',eventIds)
                if(eventIds.length>0){
                    filterConditions.push(`f.facilityId IN (SELECT facilityId FROM eventactivities WHERE eventId IN (${eventIds.join(',')}))`);
                }

            }
        
            if (selectedFilter.Services.length > 0) {
                filterConditions.push(`f.facilityId IN (SELECT facilityId FROM servicefacilities WHERE serviceId IN (${selectedFilter.Services.join(',')}))`);
            }
            
            console.log('24')
            if (filterConditions.length > 0 && !facilityTypeId) {
                console.log('filter condn', filterConditions)
                fetchFacilitiesQuery += ` WHERE fa.filePurpose = ? and fa.entityType=? and ${filterConditions.join(' AND ')}`;
                console.log('facility')
                replacements.push(filePurpose,entityType);

            }
            if (facilityTypeId) {
                console.log('791')

                fetchFacilitiesQuery += ` WHERE f.facilityTypeId=? and fa.filePurpose = ? and fa.entityType=?`;
            
                if (filterConditions.length) {
                    // Add selected filter conditions
                    fetchFacilitiesQuery += ` AND ${filterConditions.join(' AND ')}`;
                }
            
                replacements.push(facilityTypeId,filePurpose,entityType);

            }
        }
          // Filter by facilityTypeId if provided
        //   if (facilityTypeId) {
        //     fetchFacilitiesQuery += ` WHERE f.facilityTypeId = ?`;
            // if(free && !paid){
            //     fetchFacilitiesQuery += ` and ft.facilityId IS NULL`
            // }
        //     replacements.push(facilityTypeId);
        // }

        // if(free && !facilityTypeId && !paid){
        //     fetchFacilitiesQuery += ` where ft.facilityId IS NULL`
        // }

        if (facilityTypeId && !selectedFilter) {
            console.log('818')

            fetchFacilitiesQuery += ` WHERE f.facilityTypeId=? and fa.filePurpose = ? and fa.entityType=?`;
            replacements.push(facilityTypeId,filePurpose,entityType);

        }
        if (!facilityTypeId && !selectedFilter) {
            console.log('826')

            fetchFacilitiesQuery += ` WHERE fa.filePurpose = ? and fa.entityType=?`;
            replacements.push(filePurpose,entityType);

        }
        

        // Group by facilityId
        fetchFacilitiesQuery += ` GROUP BY f.facilityId, imageURL`;
        // console.log(fetchFacilitiesQuery,'fetchFacilitiesQuery')
        // Sort order
        // if (order == 1) {
        //     // Ascending order
        //     fetchFacilitiesQuery += ` ORDER BY f.facilityname ASC`;
        // } else if (order == 2) {
        //     // Descending order
        //     fetchFacilitiesQuery += ` ORDER BY f.facilityname DESC`;
        // }

        // Execute the constructed query
        const fetchFacilities = await sequelize.query(fetchFacilitiesQuery, {
            replacements: replacements,
            type:Sequelize.QueryTypes.SELECT
        });

        // Process the fetched data as needed
        console.log('fetchFacilities',fetchFacilities)
                let getNearByData = [];
        for (const data of fetchFacilities) {
            // console.log('data',fetchFacilities,'fetchFacilitiesData')
            let distance = calculateDistance(latitude, longitude, data.latitude, data.longitude);
            if (distance <= range) {
                console.log('distance', distance)
                getNearByData.push({ facilityname: data.facilityname, distance, ownership: data.ownership, facilityTypeId:data.facilityTypeId,scheme:data.scheme,areaAcres:data.areaAcres, latitude:data.latitude,longitude:data.longitude,address:data.address, statusId:data.statusId,facilityId:data.facilityId,operatingHoursFrom:data.operatingHoursFrom,operatingHoursTo:data.operatingHoursTo,status:data.status,
                    sun:data.sun,mon:data.mon, tue:data.tue, wed:data.wed, thu: data.thu, fri:data.fri, sat:data.sat, url:data.imageURL
                });
            }
            // console.log(getNearByData,'getNearByData')
        }
        // console.log('fetchFacilities', fetchFacilities[0])
        console.log('getNearByData before ordering', getNearByData);
        
        if(order == 1){
            console.log('order', 11)
            // ascending
            getNearByData.sort(function(a, b) {
                // Convert names to lowercase for case-insensitive comparison
                // const nameA = a.facilityname.trim().toLowerCase();
                // const nameB = b.facilityname.trim().toLowerCase();
            
                // Use localeCompare for case-insensitive string comparison
                // return nameA.localeCompare(nameB);
                return a.distance - b.distance;
            });

            console.log(getNearByData, 'getNearByData')

            
        }
        else if(order == 2){
            // descending
            getNearByData.sort(function(a, b) {
                // Convert names to lowercase for case-insensitive comparison
                // const nameA = a.facilityname.trim().toLowerCase();
                // const nameB = b.facilityname.trim().toLowerCase();
            
            
                // Use localeCompare for case-insensitive string comparison
                // return nameB.localeCompare(nameA);
                return a.distance - b.distance;
            });
        }
        console.log('get near by data', getNearByData);
        // Construct response
        // const convertedData = convertImagesToBase64(getNearByData);
        const encodedFacilities = encodeUrls(getNearByData);

        return res.status(statusCode.SUCCESS.code).json({
            message: 'Nearby data retrieved successfully',
            data: encodedFacilities // Assuming fetchFacilities is an array with the result at index 0
        });
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
        });
    }
};

// api to fetch filter option based on facility type
const facilityFilterOption = async (req, res) => {
    let facilityTypeId = req.params.facilityTypeId;
    
    let fetchActivityMaster = await sequelize.query(`
        select * from amabhoomi.useractivitymasters u
    `);

    let fetchAmenitiesMaster = await sequelize.query(`
        select * from amabhoomi.amenitymasters a
    `);

    let fetchServicesMaster = await sequelize.query(`
        select * from amabhoomi.services s
    `);

    let fetchEventCategories = await sequelize.query(`
        select * from amabhoomi.eventcategorymasters e 
    `);

    // console.log('fetchActivityMaster, fetchAmenitiesMaster, fetchServicesMaster', { fetchActivityMaster, fetchAmenitiesMaster, fetchServicesMaster });

    res.status(statusCode.SUCCESS.code).json({
        message: 'Activity, Amenity, Services List',
        fetchActivityMaster, fetchAmenitiesMaster, fetchServicesMaster, fetchEventCategories
    })
}

let findOverallSearch = async (req,res)=>{
    try {
        let {latitude,longitude, range,givenReq} = req.body
        range = range ? range : 20; 
        let getNearByData=[];
        let eventQuery;
        let facilityFilePurpose = 'singleFacilityImage'
        let facilityEntityType = 'facilities'
        let eventFilePurpose = 'Event Image'
        let eventEntityType = 'events'
        console.log('givenReq',givenReq)
        givenReq = givenReq.toLowerCase();
        let findFacilityData = await sequelize.query(`select f.facilityId,f.facilityname, f.address from amabhoomi.facilities f `,{type:QueryTypes.SELECT
        },
            
        );
        console.log('232')
        let findFacilityActivity = await sequelize.query(`select u.userActivityName,f3.facilityId from amabhoomi.facilityactivities f3 inner join useractivitymasters u on u.userActivityId = f3.activityId 
    `,{type:QueryTypes.SELECT})
        let findServiceFacility = await sequelize.query(`select s.code,s2.facilityId from amabhoomi.servicefacilities s2 inner join services s on s.serviceId = s2.serviceId 
    `,{type:QueryTypes.SELECT})
        let findFacilityEvents = await sequelize.query(`select e.locationName, e.eventName,f4.facilityId from amabhoomi.facilityevents f4 inner join eventactivities e on f4.eventCategoryId  = e.eventCategoryId
    `,{type:QueryTypes.SELECT})
        let findFacilityAmenities = await sequelize.query(`select a.amenityName,f5.facilityId from amabhoomi.facilityamenities f5 inner join amenitymasters a on  f5.amenityId = a.amenityId 
    `,{type:QueryTypes.SELECT})
        let findAllInventoryFacility = await sequelize.query(`select i2.code, i.facilityId from amabhoomi.inventoryfacilities i inner join inventorymasters i2 on i.equipmentId = i2.equipmentId 
    `,{type:QueryTypes.SELECT})
        
        // Determine which queries have results
        const matchingFacilityIds = new Set();
        if(findFacilityActivity.length>0){
            console.log('inside facilityActivity')
            findFacilityActivity.forEach(row => {
                console.log('row.userActivityName.toLowerCase()',row.userActivityName.toLowerCase().includes(givenReq))
                if(row.userActivityName!=null && row.userActivityName.toLowerCase().includes(givenReq) ){
                     matchingFacilityIds.add(row.facilityId)
                }
            });
        }
        if(findServiceFacility.length>0){
            console.log('inside service')

            findServiceFacility.forEach(row => {
                if(row.code!=null && row.code.toLowerCase().includes(givenReq) ){
                matchingFacilityIds.add(row.facilityId)
        }});
        }
        if(findFacilityEvents.length>0){
            console.log('inside events')
            findFacilityEvents.forEach(row =>{
                if(row.locationName!=null && row.locationName.toLowerCase().includes(givenReq) || row.eventName!=null && row.eventName.toLowerCase().includes(givenReq)){
                matchingFacilityIds.add(row.facilityId)
           }});
        }
        if(findFacilityAmenities.length>0){
            console.log('inside amenities')
            findFacilityAmenities.forEach(row => {
                if(row.amenityName!=null && row.amenityName.toLowerCase().includes(givenReq) ){
                matchingFacilityIds.add(row.facilityId)
        }});
        }   
        if(findAllInventoryFacility.length>0){
            console.log('inside inventory')

            findAllInventoryFacility.forEach(row => {
                if(row.code!=null && row.code.toLowerCase().includes(givenReq) ){
                matchingFacilityIds.add(row.facilityId)
           }});
        }
       if(findFacilityData.length>0){
        console.log('inside facility')

        findFacilityData.forEach(row => {
            console.log(row.facilityname,'findfacilitydata',row.facilityname.toLowerCase().includes(givenReq))
            if(row.facilityname != null && row.facilityname.toLowerCase().includes(givenReq) ||row.address != null &&row.address.toLowerCase().includes(givenReq)){
                // console.log('facilityData121',row.facilityname,row.facilityId)
                matchingFacilityIds.add(row.facilityId)
       }});
       }
       
       console.log('near set conversion to array ')
        // Convert Set to array of facilityIds
        const facilityIds = Array.from(matchingFacilityIds);

        // Fetch facility data based on matched facilityIds
        if(facilityIds.length>0){
            const facilities = await sequelize.query(`
                SELECT f.*,fl.url as imageURL
                FROM amabhoomi.facilities f  
                inner join fileattachments fa on fa.entityId = f.facilityId 
                inner join files fl on fa.fileId = fl.fileId 
                where facilityId IN (:facilityIds) and fa.filePurpose = :filePurpose and fa.entityType = :entityType
                 
            `, {
                replacements: { facilityIds,
                    filePurpose:facilityFilePurpose,
                    entityType:facilityEntityType
                 },
                type: Sequelize.QueryTypes.SELECT
            });
            if(facilities.length>0){
                for (const data of facilities) {
                    console.log('data',data,'fetchFacilitiesData')
                    let distance = calculateDistance(latitude, longitude, data.latitude, data.longitude);
                    if (distance <= range) {
                        console.log('distance', distance)
                        getNearByData.push({ facilityname: data.facilityname, distance, ownership: data.ownership, facilityTypeId:data.facilityTypeId,scheme:data.scheme,areaAcres:data.areaAcres, latitude:data.latitude,longitude:data.longitude,address:data.address, statusId:data.statusId,facilityId:data.facilityId,operatingHoursFrom:data.operatingHoursFrom,operatingHoursTo:data.operatingHoursTo,status:data.status,
                            sun:data.sun,mon:data.mon, tue:data.tue, wed:data.wed, thu: data.thu, fri:data.fri, sat:data.sat, url:data.imageURL
                        });
                    }
                    // console.log(getNearByData,'getNearByData')
                }
                let facilityIdsAfterNearByData = getNearByData.map(id => id.facilityId);
                if(facilityIdsAfterNearByData.length>0){
                    console.log('inside facilityIds',facilityIds)
                    eventQuery = await sequelize.query(`select e.*, fl.url from amabhoomi.eventactivities e inner join fileattachments fa on fa.entityId = e.eventId inner join files fl on fa.fileId = fl.fileId where e.facilityId in (:facilityIdsAfterNearByData) and fa.filePurpose = :filePurpose and fa.entityType = :entityType `,{
                        type:QueryTypes.SELECT,
                        replacements:{facilityIdsAfterNearByData,
                            filePurpose:eventFilePurpose,
                            entityType:eventEntityType
                        }
                    })
                    console.log(eventQuery,'data')
                }
                let findPark = getNearByData.filter(result=>result.facilityTypeId==1)
                let findPlayground = getNearByData.filter(result=>result.facilityTypeId==2)
                let findMultiPurposeGround = getNearByData.filter(result=>result.facilityTypeId==3)
                let findBluewayData = getNearByData.filter(result=>result.facilityTypeId==4)
                let findGreenwayData = getNearByData.filter(result=>result.facilityTypeId==5)
                return res.status(stausCode.SUCCESS.code).json({
                    message:"Here is the overall search data",
                    parkData: findPark.map((data) => {
                        return { ...data, ["url"]: encodeURI(data.url) };
                    }),
                    playgroundData: findPlayground?.map((data) => {
                        return { ...data, ["url"]: encodeURI(data.url) };
                    }),
                    multipurposeData: findMultiPurposeGround?.map((data) => {
                        return { ...data, ["url"]: encodeURI(data.url) };
                    }),
                    bluewayData: findBluewayData?.map((data) => {
                        return { ...data, ["url"]: encodeURI(data.url) };
                    }),
                    greenwayData: findGreenwayData?.map((data) => {
                        return { ...data, ["url"]: encodeURI(data.url) };
                    }),
                    eventData: eventQuery?.map((data) => {
                        return { ...data, ["url"]: encodeURI(data.url) };
                    })
                })
            }
            else{
                return res.status(stausCode.BAD_REQUEST.code).json({
                   message: "No data available"
                })
            }
        }
        else{
            return res.status(stausCode.BAD_REQUEST.code).json({
               message: "No data available"
            })
        }
       
       
      
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}

module.exports ={
    displayMapData,
    searchParkFacilities,
    viewParkDetails,
    viewParkById,
    nearByDataInMap,
    facilityFilterOption,
    findOverallSearch,
    autoSuggestionForOverallSearch
}