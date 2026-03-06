const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const APIError = require('./Utils/APIError');
const axios = require("axios");


const app = express();

require('dotenv').config();

require('./Config/DBConnection');

app.use(cors({
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173','https://edushare-pccoe.netlify.app'],
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization, source",
    credentials: true
}));

//app.use(cors())

app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
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


if (process.env.NODE_ENV === "production") {
  const SELF_URL = process.env.RENDER_EXTERNAL_URL;

  setInterval(async () => {
    try {
      const res = await axios.get(SELF_URL);
      console.log("Self ping success:", res.status);
    } catch (error) {
      console.error("Self ping failed:", error.message);
    }
  }, 10 * 60 * 1000);
}


app.listen(process.env.PORT,()=>{
    console.log(`Server is up and listing on port ${process.env.PORT}`);
});