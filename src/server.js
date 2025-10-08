import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './config/connectDB.js';
import app from './app.js';
import ServerlessHttp from 'serverless-http';



connectDB()

const PORT = process.env.PORT || 8081
// ✅ instead export handler for Vercel
// export const handler = ServerlessHttp(app);

app.listen(PORT, ()=> console.log(`Server started at http://localhost:${PORT}`))