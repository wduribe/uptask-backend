import nodemailer from 'nodemailer';
import { envsAdapter } from './envs.adapter';

const { MAILER_SECRET_KEY, MAILER_EMAIL, MAILER_SERVICE } = envsAdapter;

const config = () => {
    return {
        service: MAILER_SERVICE,
        auth: {
            user: MAILER_EMAIL,
            pass: MAILER_SECRET_KEY
        }
    }
}

export const transporter = nodemailer.createTransport(config());