import {isValidObjectId} from 'mongoose';

export const isValidMongoId = (id: string) => isValidObjectId(id);