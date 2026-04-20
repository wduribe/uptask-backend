import { Schema, Document, model, Types } from 'mongoose';
import { NoteModel } from './note.model';

export const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed',
} as const;

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus];

export interface ITask extends Document {
    name: string,
    description: string,
    project: Types.ObjectId,
    status: TaskStatus,
    completedBy: {
        user: Types.ObjectId,
        status: TaskStatus,
    }[],
    notes: Types.ObjectId[],
}

const taskSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la tarea es requerido'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'La descripción de la tarea es requerida'],
        trim: true,
    },
    project: {
        type: Types.ObjectId,
        ref: 'Project',
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING,
    }, 
    completedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: 'User',
                default: null,
            },
            status: {

                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING,
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note',
        }
    ]
}, { timestamps: true });


//Para eliminar las notas de la tarea que estamos eliminando
taskSchema.pre('deleteOne', { document: true }, async function () {
    const taskId = this._id;
    if(!taskId) return;
    await NoteModel.deleteMany({task: taskId});
});

export const TaskModel = model<ITask>('Task', taskSchema);