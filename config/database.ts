import mongoose from "mongoose";
import { envVar } from "./environment";

const connectURL: string = envVar.MONGODB;

export const dbConfig = () => {
  mongoose.connect(connectURL).then(() => {
    console.log(`Database is connected`);
  });
};