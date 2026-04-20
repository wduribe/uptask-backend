import { IProject, ITask, TaskModel } from '../../database/mongo';
import { CreateTaskDto, CustomError, UpdateStatusDto, UpdateTaskDto } from '../../domain';



export class TaskService {

    constructor() { }

    async createTask(createTaskDto: CreateTaskDto): Promise<string> {
        try {

            const task = new TaskModel(createTaskDto);

            createTaskDto.project.tasks.push(task.id);

            await Promise.allSettled([task.save(), createTaskDto.project.save()]);

            return 'Tarea creada con exito';

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getProjectTasks(id: string): Promise<ITask[]> {
        try {
            const projectTasks = await TaskModel.find({ project: id }).populate('project');
            if (!projectTasks) throw CustomError.badRequest('Proyecto no existe');

            return projectTasks;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getTaskById(taskId: string, projectId: string): Promise<ITask> {
        try {
            const task = await TaskModel.findById(taskId)
                .populate({ path: 'completedBy.user', select: 'id name email' })
                .populate({ path: 'notes', populate: { path: 'createdBy', select: 'id name email' } });
                
            if (!task) throw CustomError.badRequest('Tarea no existe');

            if (task.project.toString() !== projectId) throw CustomError.badRequest('Acción inválida');

            return task;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateTask(updateTaskDto: UpdateTaskDto): Promise<string> {
        try {

            updateTaskDto.task.name = updateTaskDto.name;
            updateTaskDto.task.description = updateTaskDto.description;
            await updateTaskDto.task.save();

            return 'Tarea actualizada correctamente';

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async deleteTask(task: ITask, project: IProject): Promise<string> {
        try {

            project.tasks = project.tasks.filter(id => id!.toString() !== task.id);
            await Promise.allSettled([task.deleteOne(), project.save()]);

            return 'Tarea eliminada correctamente';

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    async updateStatus(updateStatusDto: UpdateStatusDto): Promise<string> {

        try {

            const data = {
                user: updateStatusDto.completedBy,
                status: updateStatusDto.status,
            }
            console.log(data);
            updateStatusDto.task.status = updateStatusDto.status;
            updateStatusDto.task.completedBy.push(data);

            await updateStatusDto.task.save();

            return 'Status de tarea actualizado con exito';
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

}