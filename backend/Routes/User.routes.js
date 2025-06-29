const express = require('express');
const { login, logout, refresh, signUp } = require('../Controllers/User.controller');
const { verifyJWT } = require('../Middlewares/Token');
const userValidation = require('../Middlewares/User.middleware');

const router = express.Router();

router.route('/signup').post(userValidation,signUp);
router.route('/login').post(login);
router.route('/logout').get(verifyJWT,logout);
router.route('/refresh').get(refresh);

module.exports = router;