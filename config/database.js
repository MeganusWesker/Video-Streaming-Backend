import mongoose from "mongoose";

const connectToDataBase =async()=>{
   try {
    const {connection} =await mongoose.connect(process.env.URI);
    console.log(`Server started with ${connection.host}`);
   } catch (error) {
    console.log(error.message);
   }
}


export default connectToDataBase;