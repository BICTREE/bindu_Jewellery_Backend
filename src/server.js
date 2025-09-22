import dotenv from 'dotenv';
import { connectDB } from './config/connectDB.js';
import app from './app.js';
import ServerlessHttp from 'serverless-http';


dotenv.config();

connectDB()

const PORT = process.env.PORT || 8080
// ✅ instead export handler for Vercel
// export const handler = ServerlessHttp(app);

app.listen(PORT, ()=> console.log(`Server started at http://localhost:${PORT}`))