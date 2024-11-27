import * as nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: `.env` });
export const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: parseInt(process.env.NODEMAILER_PORT, 10),
  secure: true,
  auth: {
    user: process.env.NODEMAILER_AUTH_USER,
    pass: process.env.NODEMAILER_AUTH_PASS,
  },
});

transporter.verify().then(() => console.log(`APP LISTA PARA ENVIAR EMAILS.`));
