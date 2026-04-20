import { isValidMongoId } from '../../../config';
import { IProject } from '../../../database/mongo';

export class MemberDto {

    constructor(
        public readonly member: string,
        public readonly project: IProject,
        public readonly manager: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, MemberDto?] {
        const { member, project, manager } = object;

        if (!member) return ['El id del miembro es requerido'];
        if (!manager) return ['El id del manager es requerido'];
        if (!isValidMongoId(member)) return ['El id del miembro es inválido'];
        if (!isValidMongoId(manager)) return ['El id del manager es inválido'];

        return [undefined, new MemberDto(member, project, manager)];
    }

}