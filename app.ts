import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

export const appConfig = (app: Application) => {
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.set("view engine", "ejs");

  app.get("/", (req: Request, res: Response) => {
    try {
      return res.status(200).json({
        message: "API is ready!!!",
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "error getting api",
        data: error.message,
      });
    }
  });
};
