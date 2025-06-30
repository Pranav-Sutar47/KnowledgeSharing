const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../Middlewares/Token');
const { getDoubtsForMaterial, addDoubt, replyToDoubt } = require('../Controllers/Doubt.controller');

router.route('/get').get(verifyJWT,getDoubtsForMaterial);

router.route('/add').post(verifyJWT,addDoubt);

router.route('/reply').post(verifyJWT,replyToDoubt);

module.exports = router;