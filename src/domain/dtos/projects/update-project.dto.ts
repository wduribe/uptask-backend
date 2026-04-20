import { isValidMongoId } from '../../../config';


export class UpdateProjectDto {
    constructor(
        public readonly id: string,
        public readonly projectName: string,
        public readonly clientName: string,
        public readonly description: string,
        public readonly manager: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateProjectDto?] {

        if (!object) return ['Error en la petición del cliente'];

        const { id, projectName, clientName, description, manager } = object;

        if (!id) return ['El id del proyecto es requerido'];
        if (!isValidMongoId(id)) return ['El id del proyecto es inválido'];
        if (!projectName) return ['El nombre del projecto es requerido'];
        if (!projectName) return ['El nombre del cliente es requerido'];
        if (!projectName) return ['La descripción del projecto es requerida'];
        if (!manager) return ['El id manager es requerido'];
        if (!isValidMongoId(manager)) return ['Id manager inválido'];

        return [undefined, new UpdateProjectDto(id, projectName, clientName, description, manager)];

    }
}


