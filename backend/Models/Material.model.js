const { USERDB } = require("../Config/DBConnection");

const MaterialSchema = new mongoose.Schema({
  title: String,
  description: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  access: {
    type: String,
    enum: ['facultyOnly', 'allStudents', 'specificBranchOrClass'],
    default: 'allStudents',
  },
  allowedBranches: [String],
  allowedClasses: [String],

  items: [
    {
      type: { type: String, enum: ['pdf', 'ppt', 'video', 'note', 'link'], required: true },
      originalFileName: String,   // the real name of the file uploaded
      storedFileName: String,     // the renamed/stored filename on server/cloud
      fileUrl: String,            // location or URL
      size: Number,               // optional: file size in bytes
      noteContent: String,        // optional: for note type, raw text/markdown
      linkUrl: String,            // optional: for link type
      uploadedAt: { type: Date, default: Date.now },
    }
  ],

  createdAt: { type: Date, default: Date.now },
});

const MaterialModel = USERDB.model('Material',MaterialSchema);

module.exports = MaterialModel;