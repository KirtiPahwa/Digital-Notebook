// Middle ware is used whenever there is need of (user logged in) required in any endpoint.Foreg:in getUser endpoint user logged in required so there we will use middleware
const jwt=require('jsonwebtoken');
const JWT_SECRET = "I am a good girl";

const fetchuser=(req,res,next)=>{   //here next function to be call is async function of get user endpoint (route3)
    // Get the user from the jwt token and add id to req object
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"});
    }
    try{
    const data=jwt.verify(token,JWT_SECRET);
    req.user=data.user;
    next();
    }catch(error){
        res.status(401).send({error:"Please authenticate using a valid token"});
    }
}


module.exports=fetchuser;