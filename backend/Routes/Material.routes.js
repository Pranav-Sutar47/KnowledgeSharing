const express = require('express');
const { verifyJWT } = require('../Middlewares/Token');
const upload  = require('../Config/MulterConfig');
const { addMaterial, removeItem, removeMaterial, updateMaterial, getMaterialList, getMaterial, getMaterialListFromFolder, getFacultyFoldersAndMaterials } = require('../Controllers/Material.controller');

const router = express.Router();

//Add material
//upload.array('material',10),
router.route('/add').post(verifyJWT,addMaterial);

//Remove item from material
router.route('/remove-item').delete(verifyJWT,removeItem);

//Remove material
router.route('/remove').delete(verifyJWT,removeMaterial);

//Update material
//upload.array('material',10)
router.route('/update').put(verifyJWT,updateMaterial);

//To get Folders and materials of student or faculty
router.route('/get').get(verifyJWT,getMaterialList);

//To get item from material
router.route('/get-item').get(verifyJWT,getMaterial);

//To get folders and material fo specified faculty
router.route('/get-faculty-material-list').get(verifyJWT,getFacultyFoldersAndMaterials);

//Get material list from folder
router.route('/get-material-folder').get(verifyJWT,getMaterialListFromFolder);

module.exports = router;