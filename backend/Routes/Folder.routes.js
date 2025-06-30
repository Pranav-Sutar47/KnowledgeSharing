const express = require('express');
const { verifyJWT } = require('../Middlewares/Token');
const { createFolder, updateFolder, removeFolder } = require('../Controllers/Folder.controller');
const router = express.Router();

router.route('/create').post(verifyJWT,createFolder);

router.route('/update').put(verifyJWT,updateFolder);

router.route('/remove').delete(verifyJWT,removeFolder);

module.exports = router;