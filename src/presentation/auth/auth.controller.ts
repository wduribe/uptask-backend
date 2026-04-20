import { Request, Response } from 'express';
import { ConfirmationCodeDto, CustomError, EditPasswrodDto, LoginUserDto, RegisterUserDto, UpdateCurrentPasswordDto, UpdateProfileDto } from '../../domain';
import { AuthService } from '../services/auth.service';



export class AuthController {
	constructor(
		private readonly authService: AuthService
	) { }

	private handlerErrors = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ error: error.message });
		}
		return res.status(500).json({ error: 'Internal Server Error' });
	}

	//name, password, email
	register = (req: Request, res: Response) => {

		const [error, registerUserDto] = RegisterUserDto.create(req.body);

		if (error) {
			res.status(400).json({ error });
			return;
		}

		this.authService.register(registerUserDto!)
			.then(resp => res.json(resp))
			.catch(error => this.handlerErrors(error, res));

	}

	confirmAccount = (req: Request, res: Response) => {
		const token = req.body;

		if (!token) {
			res.status(400).json({ error: 'Token es requerido' });
			return;
		}
		this.authService.confirmAccount(token.token)
			.then(resp => res.json(resp))
			.catch(error => this.handlerErrors(error, res));

	}

	login = (req: Request, res: Response) => {

		const [error, loginUserDto] = LoginUserDto.create(req.body);
		if (error) {
			res.status(400).json({ error });
			return;
		}

		this.authService.login(loginUserDto!)
			.then(resp => res.json(resp))
			.catch(error => this.handlerErrors(error, res));

	} 

	requestConfirmationCode = (req: Request, res: Response) => {
		const [error, confirmationCodeDto] = ConfirmationCodeDto.create(req.body);

		if (error) {
			res.status(400).json({ error });
			return;
		}

		this.authService.requestConfirmationCode(confirmationCodeDto!)
			.then(resp => res.json(resp))
			.catch(error => this.handlerErrors(error, res));

	}
 
	forgotPassword = (req: Request, res: Response) => {
		const [error, confirmationCodeDto] = ConfirmationCodeDto.create(req.body);

		if (error) {
			res.status(400).json({ error });
			return;
		}

		this.authService.forgotPassword(confirmationCodeDto!)
			.then(resp => res.json(resp))
			.catch(error => this.handlerErrors(error, res));

	}

	validateToken = (req: Request, res: Response) => {
		const token = req.body;

		if (!token) {
			res.status(400).json({ error: 'Token es requerido' });
			return;
		}
		this.authService.validateToken(token.token)
			.then(resp => res.json(resp))
			.catch(error => this.handlerErrors(error, res));

	}

	editPassword = (req: Request, res: Response) => {
		const token = req.params.token;
		const { newPassword } = req.body;

		const [error, editPasswrodDto] = EditPasswrodDto.create({
			token, newPassword
		});

		if (error) {
			res.status(400).json({ error });
			return;
		}

		this.authService.editPassword(editPasswrodDto!)
			.then(resp => res.json(resp))
			.catch(error => res.json(error));

	}

	user = (req: Request, res: Response) => {

		this.authService.user(req.manager)
			.then(resp => res.json(resp))
			.catch(error => this.handlerErrors(error, res));
	}

	updateProfile = (req: Request, res: Response) => {
		const [error, updateProfileDto] = UpdateProfileDto.create({
			...req.body,
			user: req.manager,
		});

		if (error) {
			res.status(400).json({ error });
			return;
		}

		this.authService.updateProfile(updateProfileDto!)
			.then(resp => res.json(resp))
			.catch(error => this.handlerErrors(error, res));
	}

	updateCurrentPassword = (req: Request, res: Response) => {

		const [error, updateCurrentPasswordDto] = UpdateCurrentPasswordDto.create({
			...req.body,
			user: req.manager,
		});

		if (error) {
			res.status(400).json({ error });
			return;
		}
 
		this.authService.updateCurrentPassword(updateCurrentPasswordDto!)
			.then(resp => res.json(resp))
			.catch(error => this.handlerErrors(error, res));

	}

	checkPassword = (req: Request, res: Response) => {
		const password = req.body.password;
		
		if (!password) {
			res.status(400).json({ error: 'La contraseña es obligatoria para eliminar proyecto' });
			return;
		}

		this.authService.checkPassword(password, req.manager.toString())
			.then(resp => res.json(resp))
			.catch(error => this.handlerErrors(error, res));

	}
}