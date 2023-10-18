import nodemailer from "nodemailer";
import { google } from "googleapis";
import { envVar } from "../config/environment";
import path from "path";
import ejs from "ejs";

const G_ID = envVar.ID;
const G_SECRET = envVar.SECRET;
const G_REFRESH = envVar.REFRESH;
const G_URL = envVar.URL;

const oAuth = new google.auth.OAuth2(G_ID, G_SECRET, G_URL);
oAuth.setCredentials({ access_token: G_REFRESH });

const URL: string = `http://localhost:1000`;

export const sendMail = async (user: any, token: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "cfoonyemmemme@gmail.com",
        clientId: G_ID,
        clientSecret: G_SECRET,
        refreshToken: G_REFRESH,
        accessToken,
      },
    });

    const passedData = {
      email: user.email,
      url: `${URL}/api/${token}/verify`,
    };

    const locateFile = path.join(__dirname, "../views/verifyNote.ejs");
    const readData = await ejs.renderFile(locateFile, passedData);

    const mailer = {
      from: "verifier <cfoonyemmemme@gmail.com>",
      to: user.email,
      subject: "verify-mail",
      html: readData,
    };

    transport.sendMail(mailer);
  } catch (error: any) {
    console.log(error);
  }
};
