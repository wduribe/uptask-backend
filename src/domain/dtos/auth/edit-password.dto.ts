

export class EditPasswrodDto {
    constructor(
        public readonly token: string,
        public readonly newPassword: string,
    ){}

    static create(object: {[key: string]: any}): [string?, EditPasswrodDto?]{
        const {token, newPassword} = object;            
        if(!token) return ['El token es requerido'];
        if(!newPassword) return ['La nueva contraseña es requerida']; 
        return [undefined, new EditPasswrodDto(token, newPassword)];
    }
}