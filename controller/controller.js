const User = require('../models/user');
const Feedback = require('../models/feedback');
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const Verify = require('../middleware/authentication');
const validate = require('../validate/verifydata');
const mongoose = require('mongoose');
const multer = require("multer");
global.atob = require('atob')

require('dotenv').config()

parseJwt = function(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(atob(base64));
}

const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: 'images/', 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() 
           + path.extname(file.originalname))
          // file.fieldname is name of the field (image)
          // path.extname get the uploaded file extension
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 6000000 // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) { 
       // upload only png and jpg format
       return cb(new Error('Please upload a Image'))
     }
   cb(undefined, true)
}
})


////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////API///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////


exports.getalldata = (req, res)=>{
    User.find({}, 'userid username password email userImage',function(err, result){
      if(err){
        console.log(err);
      }else{
        res.json(result)
      }
    })
 };


exports.register = async (req, res)=>{

  
    const {username, email} = req.body
    const {originalname} = req.file;


    const userid = Math.floor(Math.random() * 100);
    const random = Math.random().toString(16).slice(2)
    const password = await bcrypt.hash(random, 10)
    // console.log(password);
    const result = await validate.validateAsync(req.body)
    console.log(result);

    try {
        const response = await User.create({
           _id: new mongoose.Types.ObjectId(),
            userid, username, email, password, userImage:originalname
        })
        console.log(response);
    } catch (error) {
        console.log(error);
        alert("An error has been Occured")
        return res.json({status:'error'})
    }

    var mailOptions = {
        from: 'mkaif1999@eng.rizvi.edu.in',
        to: `${email}`,
        subject: 'Password for ur Login',
        text: `Welcome ${username}, you were just added to our database and your password for logging in is ${random}`
            };
    var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'mkaif1999@eng.rizvi.edu.in',
                  pass: 'mahim123'
                }
              });

    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });

    res.json({message:`${username} with Email: ${email} registered with our database. Password details has been sent to registered email id`})
};

exports.login = async(req, res)=>{

    const {email, password} = req.body
  
    var user = await User.findOne({email}).lean().populate({
      path: 'feedback',
      select: 'receiver_id, feedback_data'
    })

    if(!user){
      return res.json({status:'error', error:'Invalid Email/Password'})
    }
    
    if (await bcrypt.compare(password, user.password)){

      token = await Verify.createtoken(user)
      res.cookie('jwt', token);

      return res.json({status:'ok', data:{user, 
        // token
      }})
    }
  
    res.json({status:'error', error:'Invalid Username/Password'})
  }


/// https://stackoverflow.com/questions/34985846/mongoose-document-references-with-a-one-to-many-relationship

exports.addFeedback = async(req, res) =>{

  const feed = new Feedback();
  data = parseJwt(req.cookies.jwt);
  feed.sender_id = data.id;
  feed.receiver_id = req.body.receiver_id;
  feed.feedback_data = req.body.feedback_data;
  await feed.save().then((result) =>{
  User.findOne({userid: feed.receiver_id}, (err, user)=>{
      if (user){
        user.feedback.push(feed);
        user.save();
      }
    })
  })
  Feedback.find({receiver_id: req.body.receiver_id, 
    feedback_data: req.body.feedback_data}, 
    'receiver_id feedback_data',
    function(err, result){
    if(err){
      console.log(err);
    }else{
      res.json(result)
    }
  })
  // res.json(feed)
}


exports.getfeedback =  (req, res) =>{

  const user = req.cookies.jwt
  data = parseJwt(user)

  Feedback.find({receiver_id: data.id}, 'receiver_id feedback_data',function(err, result){
    if(err){
      console.log(err);
      res.json("No Feedbacks found")
    }else{
      res.json(result)
    }
  }).lean()
}

