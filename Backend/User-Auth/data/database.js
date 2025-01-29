import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect("mongodb+srv://rijanspatoliyacg:event123@cluster0.ms4no.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { dbName: "EventTracker" })
    .then(() => console.log("Database Connected"))
    .catch((e) => console.log("Error in connecting to database: ", e));
};
