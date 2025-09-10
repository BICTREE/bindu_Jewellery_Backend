import mongoose from "mongoose";
 
export const connectDB = async () => {
    try {
       const cloudDB = await mongoose.connect(
  'mongodb+srv://ananthurs619_db_user:aTWm1VRvVRBJR8nJ@cluster0.jsb8nuy.mongodb.net/BinduTestDB?retryWrites=true&w=majority&appName=Cluster0'
);
	console.log(`MongoDB Connected: ${cloudDB.connection.host}`);

    } catch (error) {
        console.error(`Error: ${error.message}`);

		process.exit(1);
    }
}
