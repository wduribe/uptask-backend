import nodemailer from 'nodemailer';
import { envsAdapter } from './envs.adapter';

const { MAILER_SECRET_KEY, MAILER_EMAIL, MAILER_SERVICE } = envsAdapter;

const config = () => {
    return {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        service: MAILER_SERVICE,
        auth: {
            user: MAILER_EMAIL,
            pass: MAILER_SECRET_KEY
        },
        connectionTimeout: 10000,
        socketTimeout: 10000,
        family: 4,
    }
}

export const transporter = nodemailer.createTransport(config());