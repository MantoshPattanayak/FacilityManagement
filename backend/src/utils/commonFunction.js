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





// let utilFunction = (fn)=>{
//     return (req,res,next)=>{
//     Promise.resolve(fn(req,res,next)).catch((err)=>next(err))

// }
// }

module.exports ={
    utilFunction
}