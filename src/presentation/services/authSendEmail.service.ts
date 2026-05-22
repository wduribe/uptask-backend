import { envsAdapter, transporter } from '../../config';

interface IEmail {
    email: string,
    name: string,
    token: string,
}

export class AuthSendEmailService {

<<<<<<< HEAD


    sendConfirmationEmail = async ({ email, name, token }: IEmail) => {
        try {


=======
    sendConfirmationEmail = async ({ email, name, token }: IEmail) => {
        try {
            console.log({ email, name, token })
>>>>>>> aab4fc5f6237a51e5ec6e7f6c3764dd7c0a66aad
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

            return true;
<<<<<<< HEAD
        } catch (error) {
            return false;
        }

=======

        } catch (error) {
            return false;
        }

>>>>>>> aab4fc5f6237a51e5ec6e7f6c3764dd7c0a66aad
    }

    sendPasswordResetToken = async ({ email, name, token }: IEmail) => {
        try {
<<<<<<< HEAD

            console.log("TEST SMTP START");

            await transporter.verify();

            console.log("SMTP OK");

=======
>>>>>>> aab4fc5f6237a51e5ec6e7f6c3764dd7c0a66aad
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


            return true;
        } catch (error) {
<<<<<<< HEAD
            console.log(error)
=======
>>>>>>> aab4fc5f6237a51e5ec6e7f6c3764dd7c0a66aad
            return false;
        }

    }

}