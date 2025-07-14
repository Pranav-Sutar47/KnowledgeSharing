const asyncHandler = require("../Utils/asyncHandler");
const cloudinary = require("../Config/Cloudinary");
const fs = require("fs");
const MaterialModel = require("../Models/Material.model");
const APIResponse = require("../Utils/APIResponse");
const APIError = require("../Utils/APIError");
const fse = require("fs-extra");
const UserModel = require("../Models/User.model");
const FolderModel = require("../Models/Folder.model");
const streamifier = require("streamifier");

// const addMaterial = asyncHandler(async(req,res)=>{
//     console.log('alo');
//     console.log(req.body);
//     let {title,
//       description,
//       access,
//       allowedBranches,
//       allowedClasses,
//       folderId
//     } = req.body;

//     if (folderId) {
//         const folderInfo = await FolderModel.findById(folderId);
//         if (!folderInfo) {
//             throw new APIError(404, 'Folder not found');
//         }

//         access = folderInfo.access || access;
//         allowedBranches = folderInfo.allowedBranches || allowedBranches;
//         allowedClasses = folderInfo.allowedClasses || allowedClasses;
//     }

//       const files = [];

//     for (let i = 0; i < req.files.length; i++) {
//       const file = req.files[i];

//       // Upload to Cloudinary
//       const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
//         resource_type: "auto",
//         folder: "KnowledgeSharingMaterials"
//       });

//       files.push({
//         originalFileName: file.originalname,
//         localPath: file.path || null,
//         cloudinaryUrl: cloudinaryResult.secure_url,
//         type:'note', // fallback to 'note'
//         resourceType:cloudinaryResult.resource_type
//       });
//     }

//     const newMaterial = new MaterialModel({
//       title,
//       description,
//       uploadedBy: req.user.id,
//       access,
//       allowedBranches,
//       allowedClasses,
//       items: files,
//       folder:folderId || undefined
//     });

//     const result =  await newMaterial.save();
//     if(result)
//         return res.status(201).json(new APIResponse(201,newMaterial,'Material Uploaded successfully'));
//     else
//         throw new APIError(400,'Error while uploading material');
// });

const addMaterial = asyncHandler(async (req, res) => {
  let {
    title,
    description,
    access,
    allowedBranches,
    allowedClasses,
    folderId,
  } = req.body;

  if (folderId) {
    const folderInfo = await FolderModel.findById(folderId);
    if (!folderInfo) {
      throw new APIError(404, "Folder not found");
    }
    access = folderInfo.access || access;
    allowedBranches = folderInfo.allowedBranches || allowedBranches;
    allowedClasses = folderInfo.allowedClasses || allowedClasses;
  }

  const files = [];

  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];

    const streamUpload = (file) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "KnowledgeSharingMaterials",
            public_id: file.originalname.split(".")[0],
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    };

    const cloudinaryResult = await streamUpload(file);

    files.push({
      originalFileName: file.originalname,
      localPath: null,
      cloudinaryUrl: cloudinaryResult.secure_url,
      type: "note",
      resourceType: cloudinaryResult.resource_type,
    });
  }

  const newMaterial = new MaterialModel({
    title,
    description,
    uploadedBy: req.user.id,
    access,
    allowedBranches,
    allowedClasses,
    items: files,
    folder: folderId || undefined,
  });

  const result = await newMaterial.save();
  if (result)
    return res
      .status(201)
      .json(
        new APIResponse(201, newMaterial, "Material Uploaded successfully")
      );
  else throw new APIError(400, "Error while uploading material");
});

const removeItem = asyncHandler(async (req, res) => {
  const { materialId, itemId } = req.body;
  const material = await MaterialModel.findById(materialId);
  if (!material) {
    throw new APIError(404, "Material not found");
  }

  const item = material.items.id(itemId);
  if (!item) {
    throw new APIError(404, "Item not found in material");
  }

  try {
    if (item.localPath && (await fse.pathExists(item.localPath))) {
      await fse.remove(item.localPath);
      console.log(`Local file removed: ${item.localPath}`);
    }
  } catch (err) {
    console.error("Error removing local file:", err);
  }

  try {
    let publicId = item.cloudinaryPublicId;
    if (!publicId && item.cloudinaryUrl) {
      const urlParts = item.cloudinaryUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      publicId = fileName.split(".")[0];
    }

    if (publicId) {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: item.resourceType,
      });
      console.log(`Cloudinary file removed: ${publicId}`);
    }
  } catch (err) {
    console.error("Error removing from Cloudinary:", err);
  }

  material.items.pull(itemId);
  await material.save();

  return res
    .status(200)
    .json(
      new APIResponse(200, null, "Item removed successfully from material")
    );
});

const removeMaterial = asyncHandler(async (req, res) => {
  const { materialId } = req.body;

  const material = await MaterialModel.findById(materialId);
  if (!material) {
    throw new APIError(404, "Material not found");
  }

  for (const item of material.items) {
    //Remove from locally
    try {
      if (item.localPath && (await fse.pathExists(item.localPath))) {
        await fse.remove(item.localPath);
        console.log(`Removed locally: ${item.localPath}`);
      }
    } catch (err) {
      console.error("Error removing local file:", err);
    }

    //Remove from Cloudinary
    try {
      let publicId = item.cloudinaryPublicId;
      if (!publicId && item.cloudinaryUrl) {
        const urlParts = item.cloudinaryUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        publicId = fileName.split(".")[0];
      }

      const resourceType = item.resourceType || "image";

      if (publicId) {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: resourceType,
        });
        console.log(`Removed from Cloudinary: ${publicId} (${resourceType})`);
      }
    } catch (err) {
      console.error("Error removing from Cloudinary:", err);
    }
  }

  // Remove material document from DB
  await material.deleteOne();

  res
    .status(200)
    .json(
      new APIResponse(200, null, "Material and all items removed successfully")
    );
});

// const updateMaterial = asyncHandler(async (req, res) => {
//   const { materialId } = req.body;
//   let {
//     title,
//     description,
//     access,
//     allowedBranches,
//     allowedClasses,
//     folderId,
//   } = req.body;

//   const material = await MaterialModel.findById(materialId);
//   if (!material) {
//     throw new APIError(404, "Material not found");
//   }

//   // Update fields if provided
//   if (title) material.title = title;
//   if (description) material.description = description;
//   if (folderId) {
//     const folderInfo = await FolderModel.findById(folderId);
//     if (!folderInfo) throw new APIError(404, "Folder not found");
//     material.access = folderInfo.access || undefined;
//     material.allowedBranches = folderInfo.allowedBranches || undefined;
//     material.allowedClasses = folderInfo.allowedClasses || undefined;
//   } else {
//     if (access) material.access = access;
//     if (allowedBranches) material.allowedBranches = allowedBranches;
//     if (allowedClasses) material.allowedClasses = allowedClasses;
//   }

//   // Add new files if provided
//   if (req.files && req.files.length > 0) {
//     for (const file of req.files) {
//       const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
//         resource_type: "auto",
//         folder: "KnowledgeSharingMaterials",
//       });

//       material.items.push({
//         originalName: file.originalname,
//         localPath: file.path || null,
//         cloudinaryUrl: cloudinaryResult.secure_url,
//         resourceType: cloudinaryResult.resource_type,
//         type: "note",
//       });
//     }
//   }

//   const updatedMaterial = await material.save();

//   res
//     .status(200)
//     .json(
//       new APIResponse(200, updatedMaterial, "Material updated successfully")
//     );
// });

// To fetch list of all uploads of student or faculty

const updateMaterial = asyncHandler(async (req, res) => {
    const { materialId } = req.body;
    let {
        title,
        description,
        access,
        allowedBranches,
        allowedClasses,
        folderId,
    } = req.body;

    const material = await MaterialModel.findById(materialId);
    if (!material) {
        throw new APIError(404, "Material not found");
    }

    // Update fields if provided
    if (title) material.title = title;
    if (description) material.description = description;
    if (folderId) {
        const folderInfo = await FolderModel.findById(folderId);
        if (!folderInfo) throw new APIError(404, "Folder not found");
        material.access = folderInfo.access || material.access;
        material.allowedBranches = folderInfo.allowedBranches || material.allowedBranches;
        material.allowedClasses = folderInfo.allowedClasses || material.allowedClasses;
        material.folder = folderId;
    } else {
        if (access) material.access = access;
        if (allowedBranches) material.allowedBranches = allowedBranches;
        if (allowedClasses) material.allowedClasses = allowedClasses;
    }

    // Add new files if provided
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const streamUpload = (file) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: "auto",
                            folder: "KnowledgeSharingMaterials",
                            public_id: file.originalname.split(".")[0],
                        },
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(stream);
                });
            };

            const cloudinaryResult = await streamUpload(file);

            material.items.push({
                originalFileName: file.originalname,
                localPath: null,
                cloudinaryUrl: cloudinaryResult.secure_url,
                resourceType: cloudinaryResult.resource_type,
                type: "note",
            });
        }
    }

    const updatedMaterial = await material.save();

    res
        .status(200)
        .json(
            new APIResponse(200, updatedMaterial, "Material updated successfully")
        );
});

const getMaterialList = asyncHandler(async (req, res) => {
  const uid = req.user.id;

  // Fetch all folders of the user
  const folders = await FolderModel.find({ createdBy: uid })
    .select("name _id access createdAt")
    .sort({ createdAt: -1 });

  // Fetch materials uploaded by user without folder
  const materialsWithoutFolder = await MaterialModel.find(
    {
      uploadedBy: uid,
      folder: { $exists: false },
    },
    {
      title: 1,
      _id: 1,
      access: 1,
      createdAt: 1,
    }
  ).sort({ createdAt: -1 });

  return res.status(200).json(
    new APIResponse(
      200,
      {
        folders,
        materialsWithoutFolder,
      },
      "Folders and materials without folder fetched successfully"
    )
  );
});

//Get materials from specified folder
const getMaterialListFromFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.query;
  if (!folderId) {
    throw new APIError(400, "Folder ID is required");
  }

  const materialsList = await MaterialModel.find({ folder: folderId })
    .select("title _id access createdAt")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new APIResponse(200, materialsList, "Material from folder"));
});

// To fetch specified material from the all uploades
const getMaterial = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) throw new APIError(404, "Provide material id");
  const item = await MaterialModel.findById(id);
  if (!item) throw new APIError(404, "Invalid id item not found");
  return res
    .status(200)
    .json(new APIResponse(200, item, "Item fetched successfully"));
});

// To fetch list of material uploded by faculty as per access
// Can be use by both student and faculty
const getFacultyFoldersAndMaterials = asyncHandler(async (req, res) => {
  const user = req.user;
  const { id } = req.query; // faculty id

  if (!id) {
    throw new APIError(400, "Faculty ID is required");
  }

  let folderFilter = { createdBy: id };
  let materialFilter = { uploadedBy: id };

  if (user.role === "student") {
    const student = await UserModel.findById(user.id).select("branch year");

  materialFilter.$or = [
    { access: "allStudents" },
    {
      access: "specificBranchOrClass",
      allowedBranches: student.branch,
      allowedClasses: student.year,
    },
  ];

  folderFilter.$or = [
    { access: "allStudents" },
    {
      access: "specificBranchOrClass",
      allowedBranches: student.branch,
      allowedClasses: student.year,
    },
  ];

  } else {
    // for faculty or admin
    materialFilter.access = { $in: ["both", "facultyOnly"] };
    folderFilter.access = { $in: ["both", "facultyOnly"] };
  }

  const folders = await FolderModel.find(folderFilter)
    .select("name _id access description createdAt")
    .sort({ createdAt: -1 });

  const materials = await MaterialModel.find(materialFilter)
    .select("title _id access description folder createdAt")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new APIResponse(
        200,
        { folders, materials },
        "Faculty folders and materials fetched successfully"
      )
    );
});

module.exports = {
  addMaterial,
  removeItem,
  removeMaterial,
  updateMaterial,
  getMaterialList,
  getMaterial,
  getFacultyFoldersAndMaterials,
  getMaterialListFromFolder,
};
