import mongoose from "mongoose";

// configuration
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
const url: string = `mongodb://${DB_HOST}:${DB_PORT}`;
const options = {
  dbName: DB_NAME,
  user: DB_USER,
  pass: DB_PASSWORD,
  authSource: "admin",
  autoIndex: false,
};

// connect to mongodb
export const connect = async () => {
  try {
    await mongoose.connect(url, options);
    console.log("MongoDB is connected");
  } catch (e) {
    console.log("MongoDB connection unsuccessful", e);
  }
};
