import dotenv from "dotenv";
dotenv.config();

export const envVar = {
  PORT: process.env.PORT!,
  MONGODB: process.env.MONGO_URL!,
  TOKEN_SECRET: process.env.TOKEN_SECRET!,
  ID: process.env.ID,
  SECRET: process.env.SECRET,
  URL: process.env.URL,
  REFRESH: process.env.REFRESH,
};
