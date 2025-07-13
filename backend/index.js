const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const APIError = require('./Utils/APIError');
const { default: axios } = require('axios');

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

app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

app.use('/api/v1/user',require('./Routes/User.routes'));

app.use('/api/v1/material',require('./Routes/Material.routes'));

app.use('/api/v1/folder',require('./Routes/Folder.routes'));

app.use('/api/v1/doubt',require('./Routes/Doubt.routes'));

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

// app.listen(process.env.PORT,()=>{
//     console.log(`Server is up and listing on port ${process.env.PORT}`);
// });

const SERVER_URL = `http://localhost:${process.env.PORT}/ping`;

app.listen(process.env.PORT,'0.0.0.0',()=>{
    console.log(`Server Up and Listen on ${process.env.PORT}`);
    setInterval(() => {
            axios
            .get(SERVER_URL)
            .then(() => console.log("Self-ping successful"))
            .catch((err) => console.error("Self-ping failed:", err.message));
    },  3*60*1000);
});