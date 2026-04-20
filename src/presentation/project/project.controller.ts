import { Request, Response } from 'express';
import { CustomError, UpdateProjectDto } from '../../domain';
import { CreateProjectDto } from '../../domain/';
import { ProjectService } from '../services/project.service';
import { isValidMongoId } from '../../config';


export class ProjectController {

    constructor(
        private readonly projectService: ProjectService,
    ){}

    private handlerErrors = (error: unknown, res: Response) => {
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message});
        }
        return res.status(500).json({error: 'Internal Server Error'}); 
    }

    createProject = (req: Request, res: Response) => {

        const [error, createProjectDto] = CreateProjectDto.create({
            ...req.body,
            manager: req.manager,
        });
        
        if(error){
            res.status(400).json({error});
            return;
        }

        this.projectService.createProject(createProjectDto!)
            .then(resp => res.json(resp) )
            .catch(error => this.handlerErrors(error, res));

    }
 
    getAllProjects = (req: Request, res: Response) => {

        this.projectService.getAllProjects(req.manager)
            .then(projects => res.json(projects))
            .catch(error => this.handlerErrors(error, res));

    }

    getProjectById = (req: Request, res: Response) => {
        const isValidId = isValidMongoId(req.params.id);
        
        if(!isValidId){
            res.status(400).json({error: 'Id proyecto inválido'});
            return;
        }

        this.projectService.getProjectById(req.params.id, req.manager)
            .then(project => res.json(project))
            .catch(error => this.handlerErrors(error, res));  
    }

    updateProject = (req: Request, res: Response) => {

        const project = {
            ...req.body,
            id: req.params.id,
            manager: req.manager,
        }

        const [error, updateProjectDto] = UpdateProjectDto.create(project);
        
        if(error){
            res.status(400).json({error});
            return;
        }

        this.projectService.updateProject(updateProjectDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handlerErrors(error, res));
    
    }    

    deleteProject = (req: Request, res: Response) => {
        
        if(!isValidMongoId(req.params.id)){
            res.status(400).json({error: 'Id proyecto inválido'});
            return;
        }
        
        this.projectService.deleteProject(req.params.id, req.manager)
            .then(resp => res.json(resp))
            .catch(error => this.handlerErrors(error, res));
    }

        
    
}