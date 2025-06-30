const mongoose = require('mongoose');
const { USERDB } = require('../Config/DBConnection');

const DoubtSchema = new mongoose.Schema({
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'Materials', required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    content: { type: String, required: true },
    replies: [
        {
            postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

const DoubtModel = USERDB.model('Doubt', DoubtSchema);
module.exports = DoubtModel;