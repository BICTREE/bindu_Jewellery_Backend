import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './dbConfig/connectDB.js';
import app from './app.js';


dotenv.config();

connectDB()

const PORT = process.env.PORT || 8080


app.listen(PORT, ()=> console.log(`Server started at http://localhost:${PORT}`))