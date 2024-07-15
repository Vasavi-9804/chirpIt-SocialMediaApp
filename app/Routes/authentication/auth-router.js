const express = require("express");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
const {refreshToken} = require ("../../models/token");
authRouter.post("/login",

    (req,res,next) =>{
        const username = req.body.username;
        const password =  req.body.password;
        const user ={ username : username,password:password};
        //check if the user already exists
        const accessToken = generateAccessToken(user);
        const rToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
        refreshToken.create({token:rToken});
        res.json({accessToken:accessToken,refreshToken:rToken});
        next();
    }

)

function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn : '10s'})
}

authRouter.post("/token",
    
    (req,res,next) =>{
        const refToken = req.body.token;
        if (refToken == null) return res.sendStatus(401);
        try{
            refreshToken.findOne({token : refToken})
         } catch(e){
            console.log(e.message);
            return res.sendStatus(403);
         }
        jwt.verify(refToken,process.env.REFRESH_TOKEN_SECRET,(err,user) => {
            if(err) return refToken.sendStatus(403);
            const accessToken = generateAccessToken({username : user.username,password :user.password});
            res.json({accessToken :accessToken});
        })
        next();
    }
)
authRouter.delete("/logout",
    (req,res,next) =>{
        refreshToken.deleteOne({token : req.body.token}
         ).then(()=>{
            res.status(200).send({ message: "Logout successful" });
         }).catch(err=>{
            console.log(err.message);
            res.sendStatus(403);
         })
         
    
    }

)
function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  
    if(token == null) {return res.sendStatus(401)};

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET , (err,user)=>{
        if(err) return res.sendStatus(403)
        req.user = user;
        next();
    });

}
module.exports = {authRouter,authenticateToken};