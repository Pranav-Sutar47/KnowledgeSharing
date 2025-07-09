const express = require('express');
const { login, logout, refresh, signUp, getAllFaculty, getAllStudent, getStudent, getFaculty, updateStudentProfile } = require('../Controllers/User.controller');
const { verifyJWT } = require('../Middlewares/Token');
const userValidation = require('../Middlewares/User.middleware');

const router = express.Router();

router.route('/signup').post(userValidation,signUp);
router.route('/login').post(login);
router.route('/logout').get(verifyJWT,logout);
router.route('/refresh').get(refresh);
router.route('/get-faculty').get(verifyJWT,getAllFaculty);
router.route('/get-student').get(verifyJWT,getAllStudent);
router.route('/student').get(verifyJWT,getStudent);
router.route('/faculty').get(verifyJWT,getFaculty);
router.route('/update').put(verifyJWT,updateStudentProfile);

module.exports = router;