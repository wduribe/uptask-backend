import { Router } from 'express';
import { ProjectController } from './project.controller';
import { ProjectService } from '../services/project.service';
import { TaskRoutes } from '../tasks/task.routes';
import { validateProjectExist, validateTaskExist } from '../middlewares';
import { TeamRoutes } from '../team/team.routes';
import { NoteRoutes } from '../notes/note.routes';

export class ProjectRoutes {

    static get routes(): Router {
        const router = Router();

        const projectController = new ProjectController(new ProjectService());

        router.post('/', projectController.createProject);
        router.get('/', projectController.getAllProjects);
        router.get('/:id', projectController.getProjectById);
        router.put('/:id', projectController.updateProject);
        router.delete('/:id', projectController.deleteProject);

        //Routes team
        router.use('/:projectId/team', [validateProjectExist], TeamRoutes.routes);

        //Routes task
        router.use('/', TaskRoutes.routes);

        //Routes note
        router.use('/:projectId/tasks/:taskId', [validateProjectExist, validateTaskExist],NoteRoutes.routes)

        return router;
    }

}