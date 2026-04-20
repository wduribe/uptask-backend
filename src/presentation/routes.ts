import { Router } from 'express';
import { ProjectRoutes } from './project/project.routes';
import { AuthRoutes } from './auth/auth.routes';
import { ValidateTokenUser } from './middlewares/validateTokenUser.middleware';

export class AppRoutes {

    static get routes(): Router{

        const router = Router();

        
        //Routes project and task
        router.use('/api/projects', [ValidateTokenUser.validateToken], ProjectRoutes.routes);

        //Routes authentication
        router.use('/api/auth', AuthRoutes.routes);

        return router

    }

}