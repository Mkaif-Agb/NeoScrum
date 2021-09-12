const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    userid: {type:Number, required:true, unique:true},
    username: {type:String,required:true},
    email: {type:String, required:true, unique:true},
    password:{type:String},
    userImage:{type:String},
    date: {type:Date, default:Date.now()},
    feedback: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "feedback"
        }
    ]
})



const model = mongoose.model('user', userSchema)
module.exports = model
