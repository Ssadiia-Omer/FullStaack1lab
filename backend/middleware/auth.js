const jwt=require("jsonwebtoken")

const verifyToken=async(req,res,next)=>{
    let token=req.headers["authorization"]

    if(token){
        // Handle both "Bearer token" and just "token" formats
        if(token.startsWith("Bearer ")){
            token=token.slice(7)
        }
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(err){
                return res.status(400).json({message:"Invalid token"})
            }
            else{
                console.log(decoded)
                req.user=decoded
                next()
            }
        })
    }
    else{
        return res.status(400).json({message:"Invalid token"})
    }
}
module.exports=verifyToken