const User = require ('../model/User');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();

const secretKey = process.env.MyNameIsMySecretKey 

const VerifyToken = async(req, res, next)=>{
    const token = req.headers.token;

    if(!token){
        return res.status(403).json({message:"Token is required"})
    }
    
    try {
        const decoded = jwt.verify(token,secretKey)
        const user = await User.findById(decoded.userId)
        if(!user){
            return res.status(400).json({message:"user is not found"})
        }

        req.userId = user._id

        next();
        
    } catch (error) {
        
        console.error(error);
        res.status(401).json({error:"invalid token"})
    }
}

module.exports = VerifyToken;