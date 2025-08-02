exports.errHandle = (req,res,next) =>{
    return res.status(400).json({status:false,message:'Invalid path'})
}