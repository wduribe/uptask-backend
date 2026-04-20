import { Router } from 'express';
import { TaskController } from './task.controller';
import { TaskService } from '../services/tasks.service';
import { validateProjectExist, validateTaskExist } from '../middlewares';
import { validManager } from '../middlewares/valid-manager.midleware';

export class TaskRoutes {
    static get routes(): Router{
        const router = Router();

        const taskController = new TaskController(new TaskService());
        
        router.post('/:projectId/tasks', validateProjectExist, taskController.createTask);
        router.get('/:projectId/tasks', validateProjectExist, taskController.getProjectTasks);
        router.get('/:projectId/tasks/:taskId', validateProjectExist, taskController.getTaskById);
        
        router.put('/:projectId/tasks/:taskId', [validateProjectExist, validateTaskExist, validManager], taskController.updateTask);
        router.delete('/:projectId/tasks/:taskId', [validateProjectExist, validateTaskExist, validManager], taskController.deleteTask);
        router.post('/:projectId/tasks/:taskId/status', [validateProjectExist, validateTaskExist], taskController.updateStatus);

        return router;
    }
} 