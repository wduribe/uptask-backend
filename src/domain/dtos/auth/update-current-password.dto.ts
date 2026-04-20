import { Types } from 'mongoose';

export class UpdateCurrentPasswordDto {
    
    constructor(
        public readonly user: Types.ObjectId,
        public readonly currentPassword: string,
        public readonly newPassword: string,
    ){}

    static create(object: {[key: string]: any}): [string?, UpdateCurrentPasswordDto?]{
        const {user, currentPassword, newPassword} = object;

        if(!currentPassword) return ['La contraseña actual es obligatoria'];
        if(!newPassword) return ['La nueva contraseña es obligatoria'];
        if(newPassword.length < 8) return ['La contraseña minimo debe tener 8 caracteres'];

        return [undefined, new UpdateCurrentPasswordDto(user, currentPassword, newPassword)];
    }
    
}