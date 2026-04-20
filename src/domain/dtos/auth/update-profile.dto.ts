import { Types } from 'mongoose';
import { regExp } from '../../../config';

export class UpdateProfileDto {

    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly user: Types.ObjectId,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateProfileDto?] {
        const { name, email, user } = object;

        if (!name) return ['El nombre es requerido'];
        if (!email) return ['El email es requerido'];
        if (!regExp.email.test(email)) return ['Email inválido'];

        return [undefined, new UpdateProfileDto(name, email, user)];
    }

}