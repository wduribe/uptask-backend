import { NextFunction, Request, Response } from 'express';




export const validManager = async (req: Request, res: Response, next: NextFunction) => {
    
    if(req.manager.toString() !== req.project.manager?.toString()) return res.status(400).json({error: 'Acción no válida'});

    next();

}