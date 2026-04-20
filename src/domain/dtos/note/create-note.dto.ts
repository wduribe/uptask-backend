


import { isValidMongoId } from '../../../config';
import { ITask } from '../../../database/mongo';


export class CreateNoteDto {

    constructor(
        public readonly content: string,
        public readonly user: string,
        public readonly task: ITask,
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateNoteDto?] {
        const { content, user, task } = object;

        if (!content) return ['El contenido de la nota es obligatorio'];
        
        if(!user) return ['Id de usuario es obligatorio'];
        if(!isValidMongoId(user)) return ['Id de usuario inválido'];

        return [undefined, new CreateNoteDto(content, user, task)];
    }

}