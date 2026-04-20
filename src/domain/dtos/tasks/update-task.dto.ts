import { Types } from 'mongoose';
import { ITask } from '../../../database/mongo';

export class UpdateTaskDto {

    constructor(
        public readonly task: ITask,
        public readonly name: string,
        public readonly description: string,   
    ){}
 
    static create(object: {[key: string]: any}): [string?, UpdateTaskDto?]{
        const { task, name, description } = object;

        if(!name) return ['El nombre de la tarea es requerida'];
        if(!description) return ['La descripción de la tarea es requerida'];

        return [undefined, new UpdateTaskDto(task, name, description)];
    }

}