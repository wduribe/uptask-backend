import { envsAdapter, transporter } from '../../config';

interface IEmail {
    email: string,
    name: string,
    token: string,
}

export class AuthSendEmailService {

    sendConfirmationEmail = async ({email, name, token}: IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <urbina153@gmail.com>',
            to: email,
            subject: 'UpTask - Confirma tu cuenta',
            text: 'UpTask - Confirma tu cuenta',
            html: `<p>Hola: ${name}, has creado tu cuenta en Uptask, ya casi esta todo listo, solo debes confirmar tu cuenta </p>
                <p>Visita el siguiente enlace</p>
                <a href="${envsAdapter.FRONTED_URL}/public/confirm-account">Confirmar cuenta</a>
                <p>E ingresa el código: <b>${token}</b></p>
                <p>Este token expira en 10 minutos</p>   
            `
        });

     }

     sendPasswordResetToken = async ({email, name, token}: IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <urbina153@gmail.com>',
            to: email,
            subject: 'UpTask - Reestablece tu contraseña',
            text: 'UpTask - Reestablece tu contraseña',
            html: `<p>Hola: ${name}, has solicitado cambiar tu contraseña </p>
                <p>Visita el siguiente enlace</p>
                <a href="${envsAdapter.FRONTED_URL}/public/set-new-password">Reestablecer contraseña</a>
                <p>E ingresa el código: <b>${token}</b></p>
                <p>Este token expira en 10 minutos</p>   
            `
        });

     }

}