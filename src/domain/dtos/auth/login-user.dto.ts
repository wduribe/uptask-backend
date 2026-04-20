
export class LoginUserDto {

    constructor(
        
        public readonly email: string,
        public readonly password: string,
    ){}

    static create(object: {[key: string]: any}): [string?, LoginUserDto?]{
        const {email, password} = object;

        if(!email) return ['El email es requerido'];
        if(!password) return ['La contraseña es requerida'];
        
        return [undefined, new LoginUserDto(email, password)];
    }

}