import dotenv from "dotenv";
dotenv.config();

export const envVar = {
  PORT: process.env.PORT!,
  MONGODB: process.env.MONGO_URL!,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
};
