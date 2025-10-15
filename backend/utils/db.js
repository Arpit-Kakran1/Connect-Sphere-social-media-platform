import mongoose from "mongoose";
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conected Mongo db sucess");
  } catch (error) {
    console.log(error, "ERROR OCCURED");
  }
}

export default connectDb;