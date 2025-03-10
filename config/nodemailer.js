import nodemailer from "nodemailer";

import {EMAIL_PASSWORD} from "../config/env.js";

export const ACCOUNT_EMAIL = "adi.sharma187@gmail.com";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ACCOUNT_EMAIL,
        pass: EMAIL_PASSWORD
    }
});

export default transporter;
