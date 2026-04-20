import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { AuthSendEmailService } from '../services/authSendEmail.service';
import { ValidateTokenUser } from '../middlewares/validateTokenUser.middleware';

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();

        const authSendEmailService = new AuthSendEmailService();
        const authController = new AuthController(new AuthService(authSendEmailService));

        router.post('/register', authController.register);
        router.post('/login', authController.login);
        router.post('/confirm-account', authController.confirmAccount);
        router.post('/request-code', authController.requestConfirmationCode);
        router.post('/forgot-password', authController.forgotPassword);
        router.post('/validate-token', authController.validateToken);
        
        router.post('/update-password/:token', authController.editPassword);
        router.put('/profile', [ValidateTokenUser.validateToken], authController.updateProfile);
        router.put('/update-password', [ValidateTokenUser.validateToken], authController.updateCurrentPassword);
        router.post('/check-password', [ValidateTokenUser.validateToken], authController.checkPassword);
        router.get('/user', [ValidateTokenUser.validateToken], authController.user);

        return router;
    }
}