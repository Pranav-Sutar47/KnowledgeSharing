const mongoose = require('mongoose');
const {USERDB} = require('../Config/DBConnection');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim: true,
        lowercase: true,
        unique: true,
        index: true
    },
    password: {
        type : String,
        required : true 
    },
    role: { 
        type: String, 
        enum: ['student', 'faculty'], 
        required: true 
    },
    branch: {
        type :String,
        enum: [
            'Electrical Engineering',
            'Artificial Intelligence And Machine Learning (AIML)',
            'Civil Engineering',
            'Mechanical Engineering',
            'Electronic and Computer Science Engineering (ECS)',
            'Computer Science Engineering (AIML)',
            'Mechanical and Mechatronics Engineering',
            'Computer Science and Engineering & Artificial Intelligence and Machine Learning',
            'Computers Science Engineering'
        ],
        required : function () {
            return this.role === 'student'
        }
    },
    year: {
        type : String,
        enum: ['FE', 'SE', 'TE', 'BE'],
        required : function () {
            return this.role === 'student'
        }
    },
    refreshToken: String,      
});

const UserModel = USERDB.model('Users',userSchema);

module.exports = UserModel;