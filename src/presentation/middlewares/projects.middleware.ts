import { NextFunction, Request, Response } from 'express';
import { IProject, ProjectModel } from '../../database/mongo';
import { isValidMongoId } from '../../config';

declare global {
    namespace Express {
        interface Request {
            project: IProject,
        }
    }
}

export const validateProjectExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!isValidMongoId(`${req.params.projectId}`)) return res.status(400).json({ error: 'El id del proyecto es inválido' });

        const project = await ProjectModel.findById(req.params.projectId);
        if (!project) return res.status(400).json({ error: 'Proyecto no encontrado' });

        //* New Property
        req.project = project;

        next();

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
