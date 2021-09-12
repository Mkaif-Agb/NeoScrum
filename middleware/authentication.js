const jwt = require('jsonwebtoken');
const User = require('../models/user');

const createtoken = async(user) =>{
    const tokens = jwt.sign({
        id: user.userid,
        email: user.email
    }, process.env.ACCESS_TOKEN_SECRET);
    return tokens
}

const auth = async(req, res, next) =>{

    try {
        const token = req.cookies.jwt
        const verifyUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log(verifyUser);
        const user = await User.findOne({id:verifyUser._id});
        // console.log(user);
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({
            error:{
                mssg:"Invalid Token or Login"
            }
        })
    }    
};


module.exports.createtoken = createtoken
module.exports.auth = auth;