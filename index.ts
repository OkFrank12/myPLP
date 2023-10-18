import express, { Application } from "express";
import { envVar } from "./config/environment";
import { dbConfig } from "./config/database";

const port: number = parseInt(envVar.PORT);
const app: Application = express();

const server = app.listen(process.env.PORT || port, () => {
  dbConfig();
});

process.on("uncaughtException", (error: Error) => {
  console.log("uncaughtException: ", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.log("unhandledRejection: ", reason);
  server.close(() => {
    process.exit(1);
  });
});
