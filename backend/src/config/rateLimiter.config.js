


const { sequelize, Sequelize } = require('../models')
const db = require('../models')
const QueryTypes = db.QueryTypes
console.log('inside rate limit config')
let rateLimitModel = db.rateLimitModel

const rateLimitStore = {
    async get(key){
        const entry = await rateLimitModel.findOne({
            where:{
                key:key
            }
        })
        if(entry){
            return {
                points:entry.points,
                expiry:entry.expiry
            }
        }
        return null ;
    },
    async set(key,points,expiry){
        // insert a new record or update the existing one
        await rateLimitModel.upsert({
            key:key,
            points:points,
            expiry:expiry
        });
    },
    async delete(key){
        // it works internally by the rate limit
        await rateLimitModel.delete({
            where:{
                key:key
            }
        })
    }
}
// Query for a record



module.exports = rateLimitStore;