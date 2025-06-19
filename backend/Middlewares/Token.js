const jwt = require('jsonwebtoken');

const verifyJWT = (req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) 
        return res.status(401).json({message:'Middleware error'});

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err){
            console.error("JWT Verify Error:", err.message); 
            return res.sendStatus(403);
        }
        req.user = decoded;
        next();
    });
};

module.exports = {
    verifyJWT
};