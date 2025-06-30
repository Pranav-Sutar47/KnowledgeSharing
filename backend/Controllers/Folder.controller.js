const FolderModel = require("../Models/Folder.model");
const MaterialModel = require("../Models/Material.model");
const APIError = require("../Utils/APIError");
const APIResponse = require("../Utils/APIResponse");
const asyncHandler = require("../Utils/asyncHandler");
const fse = require('fs-extra');
const cloudinary = require('../Config/Cloudinary');

const createFolder = asyncHandler(async(req,res)=>{
    const {name,
      description,
      access,
      allowedBranches,
      allowedClasses} = req.body;
    const user = req.user;

    const fileFolder = new FolderModel({
        name,
        description,
        createdBy:user.id,
        access,
        allowedBranches,
        allowedClasses
    });

    const result = await fileFolder.save();

    if(result)
        return res.status(201).json(new APIResponse(201,fileFolder,'Folder created successfully'));
    else 
        throw new APIError(404,'Error while creating folder');
});

const updateFolder = asyncHandler(async(req,res)=>{
    const {
      name,
      description,
      access,
      allowedBranches,
      allowedClasses} = req.body;
    const user = req.user;
    const {id} = req.query;
    const folderInfo = await FolderModel.findById(id);

    if(!folderInfo)
        throw new APIError(404,'Folder not found');

    if(name) folderInfo.name = name;
    if(description) folderInfo.description = description;
    if(access) folderInfo.access = access;
    if(allowedBranches) folderInfo.allowedBranches = allowedBranches;
    if(allowedClasses) folderInfo.allowedClasses = allowedClasses;

    const updatedFolder = await folderInfo.save();

    if(updateFolder)
        return res.status(200).json(new APIResponse(200,updatedFolder,'Folder updated successfully'));
    else 
        throw new APIError(404,'Error while updating folder');
});

const removeFolder = asyncHandler(async (req, res) => {
    const { folderId } = req.query;

    const folder = await FolderModel.findById(folderId);
    if (!folder) {
        throw new APIError(404, "Folder not found");
    }

    // Fetch all materials in this folder
    const materials = await MaterialModel.find({ folder: folderId });

    for (const material of materials) {
        for (const item of material.items) {
            // Remove locally
            try {
                if (item.localPath && await fse.pathExists(item.localPath)) {
                    await fse.remove(item.localPath);
                    console.log(`Removed locally: ${item.localPath}`);
                }
            } catch (err) {
                console.error("Error removing local file:", err);
            }

            // Remove from Cloudinary
            try {
                let publicId = item.cloudinaryPublicId;
                if (!publicId && item.cloudinaryUrl) {
                    const urlParts = item.cloudinaryUrl.split("/");
                    const fileName = urlParts[urlParts.length - 1];
                    publicId = fileName.split(".")[0];
                }

                const resourceType = item.resourceType || "image";

                if (publicId) {
                    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
                    console.log(`Removed from Cloudinary: ${publicId} (${resourceType})`);
                }
            } catch (err) {
                console.error("Error removing from Cloudinary:", err);
            }
        }

        await material.deleteOne();
        console.log(`Material removed: ${material._id}`);
    }

    await folder.deleteOne();
    console.log(`Folder removed: ${folderId}`);

    res.status(200).json(new APIResponse(200, null, "Folder and all associated materials/items removed successfully"));
});


module.exports = {
    createFolder,
    updateFolder,
    removeFolder
}