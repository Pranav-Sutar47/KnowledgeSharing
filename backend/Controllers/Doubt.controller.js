const DoubtModel = require("../Models/Doubt.model");
const APIError = require("../Utils/APIError");
const APIResponse = require("../Utils/APIResponse");
const asyncHandler = require("../Utils/asyncHandler");

const addDoubt = asyncHandler(async (req, res) => {
    const { materialId, content } = req.body;
    const userId = req.user.id;
    const doubt = await DoubtModel.create({
        material: materialId,
        postedBy: userId,
        content
    });

    res.status(201).json(new APIResponse(201, doubt, "Doubt posted successfully"));
});

const replyToDoubt = asyncHandler(async (req, res) => {
    const { doubtId } = req.query;
    const { content } = req.body;
    const userId = req.user.id;

    const doubt = await DoubtModel.findById(doubtId);
    if (!doubt) throw new APIError(404, "Doubt not found");

    doubt.replies.push({
        postedBy: userId,
        content
    });

    await doubt.save();
    res.status(200).json(new APIResponse(200, doubt, "Reply added successfully"));
});

const getDoubtsForMaterial = asyncHandler(async (req, res) => {
    const { materialId } = req.query;
    const doubts = await DoubtModel.find({ material: materialId })
        .populate('postedBy', 'name role')
        .populate('replies.postedBy', 'name role')
        .sort({ createdAt: -1 });

    res.status(200).json(new APIResponse(200, doubts, "Doubts fetched successfully"));
});


module.exports = {
    addDoubt,
    replyToDoubt,
    getDoubtsForMaterial
};