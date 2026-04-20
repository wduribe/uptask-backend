import 'dotenv/config';
import { get } from 'env-var';

export const envsAdapter = {
    PORT: get('PORT').required().asPortNumber(),
    MONGO_URL: get('MONGO_URL').required().asString(),
    MONGO_USER_NAME: get('MONGO_USER_NAME').required().asString(),
    MONGO_USER_PASS: get('MONGO_USER_PASS').required().asString(),
    FRONTED_URL: get('FRONTED_URL').required().asString(),
    MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
    MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
    MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
    JSON_SECRET_KEY: get('JSON_SECRET_KEY').required().asString(),
}