const { USERDB } = require("../Config/DBConnection");
const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  title: String,
  description: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },

  access: {
    type: String,
    enum: ['facultyOnly', 'allStudents', 'specificBranchOrClass', 'both'],
    default: 'allStudents',
  },
  allowedBranches: [String],
  allowedClasses: [String],

  items: [
    {
      type: { type: String, enum: ['pdf', 'ppt', 'video', 'note', 'link'], required: true },
      originalFileName: String,   // the real name of the file uploaded
      storedFileName: String,     // the renamed/stored filename on server/cloud
      cloudinaryUrl: String,            // location or URL
      localPath: String,        // optional: for note type, raw text/markdown
      linkUrl: String,            // optional: for link type
      resourceType:String,
      uploadedAt: { type: Date, default: Date.now },
    }
  ],

  createdAt: { type: Date, default: Date.now },
});

const MaterialModel = USERDB.model('Material',MaterialSchema);

module.exports = MaterialModel;