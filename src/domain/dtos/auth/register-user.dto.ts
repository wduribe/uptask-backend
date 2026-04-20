import { regExp } from '../../../config';

export class RegisterUserDto {

    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
    ){}

    static create(object: {[key: string]: any}): [string?, RegisterUserDto?]{
        const {name, email, password} = object;

        if(!name) return ['El nombre es requerido'];
        if(!email) return ['El email es requerido'];
        if(!regExp.email.test(email)) return ['Email inválido'];
        if(!password) return ['La contraseña es requerida'];
        if(password.length < 8) return ['La contraseña minimo debe tener 8 caracteres'];

        return [undefined, new RegisterUserDto(name, email, password)];
    }

}