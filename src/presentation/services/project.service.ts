import { Types } from 'mongoose';
import { IProject, ProjectModel } from '../../database/mongo';
import { CreateProjectDto, CustomError, UpdateProjectDto } from '../../domain';


export class ProjectService {

    constructor() { }

    async createProject(createProjectDto: CreateProjectDto): Promise<string> {

        const project = new ProjectModel(createProjectDto);

        try {
            await project.save();
            return 'Proyecto creado con exito';
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    async getAllProjects(manager: Types.ObjectId): Promise<IProject[]> {
        try {
            const projects = await ProjectModel.find({
                $or: [
                    { manager: { $in: manager } },
                    { team: { $in: manager } },
                ]
            });

            return projects;

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getProjectById(id: string, manager: Types.ObjectId): Promise<IProject> {
        try {
 
            const project = await ProjectModel.findById(id).populate('tasks');
            if (!project) throw CustomError.badRequest('Proyecto no encontrado');

            if (project.manager?.toString() !== manager.toString() && !project.team.includes(manager)) throw CustomError.badRequest('Usuario no autorizado')

            return project;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateProject(updateProjectDto: UpdateProjectDto): Promise<string> {
        try {
            const existProject = await ProjectModel.findById(updateProjectDto.id);
            if (!existProject) throw CustomError.badRequest('Proyecto no encontrado');
            if (existProject.manager?.toString() !== updateProjectDto.manager.toString()) throw CustomError.badRequest('Usuario no autorizado');

            await ProjectModel.findByIdAndUpdate(updateProjectDto.id, updateProjectDto);

            return 'Proyecto actualizado con exito';
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
 
    async deleteProject(id: string, manager: Types.ObjectId): Promise<string> {
        try {
            const project = await ProjectModel.findById(id);
            if (!project) throw CustomError.badRequest('Proyecto no encontrado');
            if (project.manager?.toString() !== manager.toString()) throw CustomError.badRequest('Usuario no autorizado');

            await project.deleteOne();
            return 'Proyecto eliminado correctamente';
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

}