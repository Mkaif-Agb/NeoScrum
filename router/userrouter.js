const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const Verify = require('../middleware/authentication')
const multer  = require('multer');
const { verify } = require('jsonwebtoken');
const upload = multer()

router.get('/dev', Verify.auth, controller.getalldata) 

router.post('/api/register', upload.single('image') ,controller.register)

router.post('/api/login',controller.login)

router.post('/addfeedback', Verify.auth, controller.addFeedback)

router.get('/feedback', Verify.auth, controller.getfeedback)

router.get('/dashboard', Verify.auth, controller.dashboard)

router.get('/data', Verify.auth, controller.chron);

module.exports = router