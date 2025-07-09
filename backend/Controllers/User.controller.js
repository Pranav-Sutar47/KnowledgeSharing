const UserModel = require('../Models/User.model');
const {generateAccessToken, generateRefreshToken} = require('../Utils/TokenUtils');
const bcrypt = require('bcrypt');
const APIResponse = require('../Utils/APIResponse');
const asyncHandler = require('../Utils/asyncHandler');
const APIError = require('../Utils/APIError');
const jwt = require('jsonwebtoken');

const login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const user = await UserModel.findOne({email});

    if(!user)
        return res.status(400).json(new APIResponse(400,null,'User not found'));

    const valid = await bcrypt.compare(password,user.password);

    if(!valid)
        return res.status(400).json(new APIResponse(401,null,'Password is incorrect'));
        
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;

    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
    });

    const data = {
        accessToken,
        role : user.role
    };

    return res.status(200).json(new APIResponse(200,data,'User logged in'));
});

function getRoleFromEmail(email) {
    // check first 2digit letter before @
    const studentPattern = /\d{2}@/;

    if (studentPattern.test(email)) {
      return 'student';
    } else {
      return 'faculty';
    }
}

const signUp = asyncHandler(async(req,res)=>{
    const {name,email,password,role,branch,year} = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) 
      throw new APIError(400, 'User with this email already exists');

    const hashedPassword = await bcrypt.hash(password, 12);

    const predicatedRole = getRoleFromEmail(email);

    if(predicatedRole !== role)
        throw new APIError(400,'Invalid role');

    const newUser = await UserModel.create({
        name,
        email,
        password : hashedPassword,
        role,
        branch: role === 'student' ? branch : undefined,
        year: role === 'student' ? year : undefined,
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });

    res.status(201).json(new APIResponse(201,{
        user:{
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            branch: newUser.branch,
            class: newUser.class,
        },
        accessToken
        },'User registered successfully')
    );

});

const logout = asyncHandler(async(req,res)=>{
    const cookies = req.cookies;
    if (!cookies?.refreshToken) 
        return res.status(204).send(new APIResponse(204,null,'No cookies'));
    
    const user = await UserModel.findOne({ refreshToken: cookies.refreshToken });
    if (user) {
        user.refreshToken = null;
        await user.save();
    }

    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
    return res.sendStatus(204); // sucessfully logout
});

const refresh = asyncHandler(async(req,res)=>{
    const cookies = req.cookies;
    if (!cookies?.refreshToken) 
        return res.status(401).json({message:'Cookies not found'});

    const refreshToken = cookies.refreshToken;
    const user = await UserModel.findOne({ refreshToken });

    if (!user) 
        return res.status(403).json({message:'User not found'});

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || user._id.toString() !== decoded.id) 
            return res.status(403).json({message:'Error while creating refresh token',err,decoded});

        const accessToken = generateAccessToken(user);
        res.status(200).json(new APIResponse(200,accessToken,'New token generated'));
    });
});

const getAllFaculty = asyncHandler(async (req, res) => {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;   // default page 1
    const limit = parseInt(req.query.limit) || 10; // default 10 per page
    const skip = (page - 1) * limit;

    let filter = { role: 'faculty' };
    if (user.role === 'faculty') {
        filter._id = { $ne: user.id }; // exclude current faculty
    }

    const [faculty, total] = await Promise.all([
        UserModel.find(filter, { name: 1, email: 1, _id: 1 })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        UserModel.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json(new APIResponse(200, {
        faculty,
        total,
        page,
        totalPages
    }, "Faculty list fetched successfully with pagination"));
});


const getAllStudent = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'student') {
        throw new APIError(400, 'Faculty has no access to view students list');
    }

    const page = parseInt(req.query.page) || 1;   // default page = 1
    const limit = parseInt(req.query.limit) || 10; // default limit = 10
    const skip = (page - 1) * limit;

    const filter = {
        role: 'student',
        _id: { $ne: user.id } // exclude current student
    };

    const [students, total] = await Promise.all([
        UserModel.find(filter, { name: 1, email: 1, _id: 1 })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        UserModel.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json(new APIResponse(200, {
        students,
        total,
        page,
        totalPages
    }, "Student list fetched successfully with pagination"));
});

const getFaculty = asyncHandler(async(req,res)=>{
    const {name} = req.query;
    if (!name) 
        throw new APIError(404,'Name is required');
    const faculties = await UserModel.find({
        name: { $regex: name, $options: 'i' },
        role: 'faculty'
    });
    return res.status(200).json(new APIResponse(200,faculties,'Fetched sucessfully'));
});

const getStudent = asyncHandler(async(req,res)=>{
    const {name} = req.query;
    if (!name) 
        throw new APIError(404,'Name is required');
    const students = await UserModel.find({
        name: { $regex: name, $options: 'i' },
        role: 'student'
    });
    return res.status(200).json(new APIResponse(200,students,'Fetched sucessfully'));
});

const updateStudentProfile = asyncHandler(async(req,res)=>{
    const {year,branch} = req.body;
    const user = req.user;
    const student = await UserModel.findById(user.id);
    if(!student)
        throw new APIError(404,'Student not found');
    
    const currentYear = student.year;
    if(branch){
        if(currentYear === 'FE')
            student.branch = branch;
        else
            throw new APIError(400,'Branch can not be updated after SE');
    }
    if(year)
        student.year = year;
    await student.save();
    
    return res.status(200).json(new APIResponse(200, student, 'Student profile updated successfully'));
});

module.exports = {
    login,
    refresh,
    logout,
    signUp,
    getAllFaculty,
    getAllStudent,
    getStudent,
    getFaculty,
    updateStudentProfile
};