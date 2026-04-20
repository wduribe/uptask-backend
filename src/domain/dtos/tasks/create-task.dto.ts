import { isValidMongoId } from '../../../config';
import { IProject } from '../../../database/mongo';

export class CreateTaskDto {
    
    constructor(
        public readonly project: IProject,
        public readonly name: string,
        public readonly description: string,
    ){}

    static create(object: {[key: string]: any}): [string?, CreateTaskDto?]{
        const {name, description, project} = object;

        if(!name) return ['El nombre de la tarea es requerida'];
        if(!description) return ['La descripción de la tarea es requerida'];

        return [undefined, new CreateTaskDto(project, name, description )];
    }
}