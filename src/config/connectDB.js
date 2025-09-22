import mongoose from "mongoose";
 
export const connectDB = async () => {
    try {
       const cloudDB = await mongoose.connect(process.env.MongoURI);
	console.log(`MongoDB Connected: ${cloudDB.connection.host}`);

    } catch (error) {
        console.error(`Error: ${error.message}`);

		process.exit(1);
    }
}
