import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection : ConnectionObject = {};

export default async function dbConnect() : Promise<void>{
    // Check if we have a connection to the database or if it's currently connecting
     if(connection.isConnected){
         console.log('Already connected to the database');
        return;
     }

     try{
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        connection.isConnected = db.connections[0].readyState;

        console.log("succesfully connected database");
     }catch(error){
        console.error(error);
        process.exit(1);
     }
}