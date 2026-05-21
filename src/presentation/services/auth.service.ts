import { Types } from 'mongoose';
import { bcryptAdapter, generateToken, jwtAdapter, transporter } from '../../config';
import { TokenModel, UserModel } from '../../database/mongo';
import { ConfirmationCodeDto, CustomError, EditPasswrodDto, LoginUserDto, RegisterUserDto, UpdateCurrentPasswordDto, UpdateProfileDto } from '../../domain';
import { AuthSendEmailService } from './authSendEmail.service';


export class AuthService {

    constructor(
        private readonly authSendEmailService: AuthSendEmailService,
    ) { }

    async register(registerUserDto: RegisterUserDto) {
        try {

            const userExists = await UserModel.findOne({ email: registerUserDto.email });
            if (userExists) throw CustomError.badRequest('Email ya registrado');

            const newUser = new UserModel(registerUserDto);

            const passwordHashed = bcryptAdapter.hash(registerUserDto.password);
            newUser.password = passwordHashed;

            const token = new TokenModel();
            token.token = generateToken();
            token.user = newUser.id;

            await this.authSendEmailService.sendConfirmationEmail({ email: newUser.email, name: newUser.name, token: token.token });

            await Promise.allSettled([newUser.save(), token.save()]);

            return 'Cuenta creada, revisa tu email';

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async confirmAccount(token: string) {
        try {
            const tokenExists = await TokenModel.findOne({ token });
            if (!tokenExists) throw CustomError.badRequest('Token inválido');

            const user = await UserModel.findById(tokenExists.user);
            if (!user) throw CustomError.badRequest('Usuario no existe');

            user.confirmed = true;

            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

            return 'Cuenta confirmada correctamente';

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async login(loginUserDto: LoginUserDto) {
        try {

            const user = await UserModel.findOne({ email: loginUserDto.email });
            if (!user) throw CustomError.badRequest('Contraseña o email inválidos');

            const passwordMatch = bcryptAdapter.compareHash(loginUserDto.password, user.password);
            if (!passwordMatch) throw CustomError.badRequest('Contraseña o email inválidos');

            if (!user.confirmed) {
                const token = new TokenModel();
                token.user = user.id;
                token.token = generateToken();
                await token.save();

                //Enviando email
                await this.authSendEmailService.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                });


                throw CustomError.badRequest('La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación');

            }

            const token = await jwtAdapter.generateToken<string>({ id: user.id });

            return { token };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async requestConfirmationCode(confirmationCodeDto: ConfirmationCodeDto) {
        try {

            const user = await UserModel.findOne({ email: confirmationCodeDto.email });
            if (!user) throw CustomError.badRequest('El usuario no existe');
            if (user.confirmed) throw CustomError.badRequest('Usuario ya está confirmado');

            const token = new TokenModel();
            token.user = user.id;
            token.token = generateToken();

            //Enviando email
            await this.authSendEmailService.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });

            await Promise.allSettled([user.save(), token.save()]);

            return 'Se envió un nuevo token a tu email';
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async forgotPassword(confirmationCodeDto: ConfirmationCodeDto) {
        try {
            const user = await UserModel.findOne({ email: confirmationCodeDto.email });
            if (!user) throw CustomError.badRequest('El usuario no existe');

            const token = new TokenModel();
            token.user = user.id;
            token.token = generateToken();
            await token.save();

            //Enviando email
            await this.authSendEmailService.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            });

            return 'Revisa tu email para reestablecer contraseña';

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    async validateToken(token: string) {
        try {
            const tokenExists = await TokenModel.findOne({ token });
            if (!tokenExists) throw CustomError.badRequest('Token inválido');

            return 'Token válido, define tu nueva contraseña';

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async editPassword(editPasswrodDto: EditPasswrodDto) {
        try {
            const token = await TokenModel.findOne({ token: editPasswrodDto.token });
            if (!token) throw CustomError.badRequest('Token inválido');

            const user = await UserModel.findById(token.user);
            if (!user) throw CustomError.badRequest('Usuario no encontrado');

            const passwordHashed = bcryptAdapter.hash(editPasswrodDto.newPassword);
            user.password = passwordHashed;

            await Promise.allSettled([user.save(), token.deleteOne()]);

            return 'La contraseña se modificó correctamente';
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async user(manager: Types.ObjectId) {
        try {
            const user = await UserModel.findById(manager).select('_id name email');
            if (!user) throw CustomError.badRequest('Usuario no encontrado');

            return user;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateProfile(updateProfileDto: UpdateProfileDto) {
        const { email, name, user } = updateProfileDto;

        try {
            const userFinded = await UserModel.findById(user);
            if (!userFinded) throw CustomError.badRequest('Usuario no encontrado');

            const emailExist = await UserModel.findOne({ email });

            if (emailExist && user.toString() !== emailExist.id.toString()) throw CustomError.badRequest('Email ya está registrado en una cuenta');

            userFinded.name = name;
            userFinded.email = email;

            await userFinded.save();

            return 'Usuario actualizado correctamente';
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateCurrentPassword(updateCurrentPasswordDto: UpdateCurrentPasswordDto) {
        const { currentPassword, newPassword, user: id } = updateCurrentPasswordDto;
        try {
            const user = await UserModel.findById(id);
            if (!user) throw CustomError.badRequest('Usuario no encontrado');

            const passwordMatch = bcryptAdapter.compareHash(currentPassword, user.password);
            if (!passwordMatch) throw CustomError.badRequest('Las contraseñas originales no son iguales');

            const newPasswordHashed = bcryptAdapter.hash(newPassword);
            user.password = newPasswordHashed;

            await user.save();

            return 'Contraseña actualizada correctamente';
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async checkPassword(password: string, userId: string) {
        try {
            const user = await UserModel.findById(userId);
            const isMatch = bcryptAdapter.compareHash(password, user?.password!)
            if (!isMatch) throw CustomError.badRequest('Contraseña incorrecta');

            return 'Contraseña correcta';

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
} 