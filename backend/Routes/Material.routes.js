const express = require('express');
const { verifyJWT } = require('../Middlewares/Token');
const upload  = require('../Config/MulterConfig');
const { addMaterial, removeItem, removeMaterial, updateMaterial, getMaterialList, getMaterial, getFacultyMaterialListAsPerAccess } = require('../Controllers/Material.controller');

const router = express.Router();

router.route('/add').post(verifyJWT,upload.array('material',10),addMaterial);

router.route('/remove-item').delete(verifyJWT,removeItem);

router.route('/remove').delete(verifyJWT,removeMaterial);

router.route('/update').put(verifyJWT,upload.array('material',10),updateMaterial);

router.route('/get').get(verifyJWT,getMaterialList);

router.route('/get-item').get(verifyJWT,getMaterial);

router.route('/get-faculty-list').get(verifyJWT,getFacultyMaterialListAsPerAccess);


module.exports = router;