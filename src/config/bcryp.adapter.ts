import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const bcryptAdapter = {
    hash: (password: string) => hashSync(password, genSaltSync(10)),
    compareHash: (password: string, passwordHashed: string) => compareSync(password, passwordHashed),
}