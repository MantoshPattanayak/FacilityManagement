const db = require('../../../models/index');
const statusCode = require('../../../utils/statusCode');

const  QueryTypes= db.QueryTypes
const sequelize = db.sequelize
const stausCode = require('../../../utils/statusCode')
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' }); // Elasticsearch server URL


const displayMapData = async(req,res)=>{
    try{
        const [facilities,metadata] = await sequelize.query('select * from amabhoomi.parkfacility ')

        return res.status(statusCode.SUCCESS.code).json({
            message: `All park facilities`,
            data:facilities
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
        
        const [facilites,metadata] = await sequelize.query(`select * from amabhoomi.parkfacility where LOWER(facilityName) LIKE LOWER(:searchQuery)`,{
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


module.exports ={
    displayMapData,
    searchParkFacilities
}