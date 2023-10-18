import { Request, Response } from "express";
import userModel from "../model/userModel";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { statusCodes } from "../errors/statusCode";
import { envVar } from "../config/environment";
import { sendMail } from "../utils/emailer";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const value = crypto.randomBytes(10).toString("hex");
    const token = jwt.sign(value, envVar.TOKEN_SECRET);
    const user = await userModel.create({
      email,
      password: hashed,
      token,
    });

    const signInToken = jwt.sign({ id: user._id }, envVar.TOKEN_SECRET);

    sendMail(user, signInToken).then(() => {
      console.log("Mail has been sent...!");
    });

    return res.status(statusCodes.CREATED).json({
      message: "success registerUser",
      data: user,
      signInToken,
    });
  } catch (error: any) {
    return res.status(statusCodes.BAD_REQUEST).json({
      message: "error registerUser",
      data: error.message,
    });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const getUserID: any = jwt.verify(
      token,
      envVar.TOKEN_SECRET,
      (err: any, payload: any) => {
        if (err) {
          return err;
        } else {
          return payload;
        }
      }
    );

    const user = await userModel.findByIdAndUpdate(getUserID.id, {
      data: {
        verified: true,
        token: "",
      },
    });

    return res.status(statusCodes.OK).json({
      message: "Verified success",
      data: user,
    });
  } catch (error: any) {
    return res.status(statusCodes.BAD_REQUEST).json({
      message: "error verifyUser",
      data: error.message,
    });
  }
};

export const signInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (checkPassword) {
        if (user.verified && user.token === "") {
          return res.status(statusCodes.CREATED).json({
            message: "Welcome back",
          });
        } else {
          return res.status(statusCodes.BAD_REQUEST).json({
            message: "user has not been verified",
          });
        }
      } else {
        return res.status(statusCodes.BAD_REQUEST).json({
          message: "Invalid Passsword",
        });
      }
    } else {
      return res.status(statusCodes.BAD_REQUEST).json({
        message: "User is not found",
      });
    }
  } catch (error: any) {
    return res.status(statusCodes.BAD_REQUEST).json({
      message: "error signInUser",
      data: error.message,
    });
  }
};

export const viewAllUser = async (req: Request, res: Response) => {
  try {
    const all = await userModel.find();

    return res.status(statusCodes.OK).json({
      message: "success viewAllUser",
      data: all,
    });
  } catch (error: any) {
    return res.status(statusCodes.BAD_REQUEST).json({
      message: "error viewing all user",
      data: error.message,
    });
  }
};

export const viewOneUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const one = await userModel.findById(userID);

    return res.status(statusCodes.OK).json({
      message: "success viewOneUser",
      data: one,
    });
  } catch (error: any) {
    return res.status(statusCodes.BAD_REQUEST).json({
      message: "error viewOneUser",
      data: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const remove = await userModel.findByIdAndDelete(userID);

    return res.status(statusCodes.CREATED).json({
      message: "success deleteUser",
      data: remove,
    });
  } catch (error: any) {
    return res.status(statusCodes.BAD_REQUEST).json({
      message: "error deleteUser",
      data: error.message,
    });
  }
};
