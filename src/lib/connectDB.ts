import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

const connectDB = async (): Promise<void> => {

    if (connection.isConnected) {
        console.log("Already Connected to database");
        return;
    }

    try {

        // Create a new database connection
        const db = await mongoose.connect(process.env.MONGODB_URI as string);

        // Update the connection object with the new connection state
        connection.isConnected = db.connections[0].readyState;

        console.log("DB Connected Successfully");

    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);   //Connecting to the database failed, exit the process 
    }

};

export default connectDB;