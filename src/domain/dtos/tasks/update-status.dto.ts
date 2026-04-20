import { Types } from 'mongoose';
import { ITask, taskStatus, TaskStatus } from '../../../database/mongo';
import { isValidMongoId } from '../../../config';


export class UpdateStatusDto {

    constructor(
        public readonly task: ITask,
        public readonly status: TaskStatus,
        public readonly completedBy: Types.ObjectId,  
    ){}

    static create(object: {[key: string]: any}): [string?, UpdateStatusDto?]{
        const {task, status, completedBy} = object;

        if(!status) return ['El estatus es requerido'];
        if(!Object.values(taskStatus).includes(status)) return ['Estatus inválido para la tarea'];
        if(!completedBy) return ['El id del usuario es requerido'];
        if(!isValidMongoId(completedBy)) return ['Id de usuario inválido'];
        return [undefined, new UpdateStatusDto(task, status, completedBy)];

    }

}