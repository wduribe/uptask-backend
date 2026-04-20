import { Request, Response } from 'express';
import { CreateTaskDto, CustomError, UpdateStatusDto, UpdateTaskDto } from '../../domain';
import { TaskService } from '../services/tasks.service';
import { isValidMongoId } from '../../config';
import { IProject } from '../../database/mongo';



export class TaskController {

    constructor(
        private readonly taskService: TaskService,
    ) { }

    private handlerErrors = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    createTask = (req: Request, res: Response) => {
 
        const task = {
            ...req.body,
            project: req.project,
        }

        const [error, createTaskDto] = CreateTaskDto.create(task);

        if (error) {
            res.status(400).json({ error });
            return;
        }

        this.taskService.createTask(createTaskDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handlerErrors(error, res));

    }

    getProjectTasks = (req: Request, res: Response) => {

        this.taskService.getProjectTasks(req.project.id)
            .then(tasks => res.json(tasks))
            .catch(error => this.handlerErrors(error, res));

    }

    getTaskById = (req: Request, res: Response) => {

        if (!isValidMongoId(req.params.taskId)) {
            res.status(400).json({ error: 'Id de tarea inválido' });
            return;
        }

        this.taskService.getTaskById(req.params.taskId, req.params.projectId)
            .then(task => res.json(task))
            .catch(error => this.handlerErrors(error, res));


    } 

    updateTask = (req: Request, res: Response) => {

        const task = {
            ...req.body,
            task: req.task,
        }

        const [error, updateTaskDto] = UpdateTaskDto.create(task);

        if (error) {
            res.status(400).json({ error });
            return;
        }

        this.taskService.updateTask(updateTaskDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handlerErrors(error, res));

    }

    deleteTask = (req: Request, res: Response) => {

        this.taskService.deleteTask(req.task, req.project)
            .then(resp => res.json(resp))
            .catch(error => this.handlerErrors(error, res));

    }

    updateStatus = (req: Request, res: Response) => {

        const [error, updateStatusDto] = UpdateStatusDto.create({ ...req.body, task: req.task, completedBy: req.manager });

        if (error) {
            res.status(400).json({ error });
            return;
        }

        this.taskService.updateStatus(updateStatusDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handlerErrors(error, res));


    }

}