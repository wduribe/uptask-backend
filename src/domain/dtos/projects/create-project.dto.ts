import { isValidMongoId } from '../../../config';


export class CreateProjectDto {
    constructor(
        public readonly projectName: string,
        public readonly clientName: string,
        public readonly description: string,
        public readonly manager: string,
    ){}

    static create( object: {[key: string]: any} ): [string?, CreateProjectDto?]{
       
        if(!object) return ['Error en la petición del cliente'];

       const {projectName, clientName, description, manager} = object;

       if(!projectName) return ['El nombre del projecto es requerido'];
       if(!projectName) return ['El nombre del cliente es requerido'];
       if(!projectName) return ['La descripción del projecto es requerida'];
       if(!manager) return ['El id manager es requerido'];
       if(!isValidMongoId(manager)) return ['Id manager inválido'];

       return [undefined, new CreateProjectDto(projectName, clientName, description, manager)];

    }
}


