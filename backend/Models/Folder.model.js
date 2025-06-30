const mongoose = require('mongoose');
const { USERDB } = require('../Config/DBConnection');

const FolderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    access: {
    type: String,
    enum: ['facultyOnly', 'allStudents', 'specificBranchOrClass', 'both'],
    default: 'allStudents',
    },
    allowedBranches: [String],
    allowedClasses: [String]
});

const FolderModel = USERDB.model('Folder', FolderSchema);
module.exports = FolderModel;
