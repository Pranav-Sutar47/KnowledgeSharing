const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const APIError = require('./Utils/APIError');

const app = express();

require('dotenv').config();

require('./Config/DBConnection');

app.use(cors({
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization, source",
    credentials: true
}));

app.use(cookieParser());

app.use(express.json());

app.use('/api/v1/user',require('./Routes/User.routes'));


app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(process.env.PORT,()=>{
    console.log(`Server is up and listing on port ${process.env.PORT}`);
});