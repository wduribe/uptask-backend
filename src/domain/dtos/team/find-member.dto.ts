import { regExp } from '../../../config';

export class FindMemberDto {

    constructor( public readonly email: string ){}

    static create(object: {[key: string]: any}): [string?, FindMemberDto?]{
        const { email } = object;

        if(!email) return ['El email es requerido'];
        if(!regExp.email.test(email)) return ['Email inválido'];
        
        return [undefined, new FindMemberDto(email)];
    }

}