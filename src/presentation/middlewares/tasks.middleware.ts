import { NextFunction, Request, Response } from 'express';
import { isValidMongoId } from '../../config';
import { ITask, TaskModel } from '../../database/mongo';


declare global {
    namespace Express {
        interface Request {
            task: ITask,
        }
    }
}

export const validateTaskExist = async (req: Request, res: Response, next: NextFunction) => {

    try {
        if(!isValidMongoId(`${req.params.taskId}`)) return res.status(400).json({error: 'Id inválido de tarea'});

        const task = await TaskModel.findById(req.params.taskId);
        if(!task) return res.status(400).json({error: 'Tarea no encontrada'});
        
        if(task.project.toString() !== req.project.id) res.status(400).json('Acción inválida');

        req.task = task;

        next();

    }catch(error){
        res.status(500).json({error: 'Error interno del servidor'});
    }


}