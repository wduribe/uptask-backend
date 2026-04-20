import { Schema, Document, model, PopulatedDoc , Types} from 'mongoose';
import { ITask, TaskModel } from './task.model';
import { IUser } from './user.model';
import { NoteModel } from './note.model';

export interface IProject extends Document {
	projectName: string,
	clientName: string,
	description: string,
	tasks: PopulatedDoc<ITask & Document>[],
	manager: PopulatedDoc<IUser & Document>,
	team: PopulatedDoc<IUser & Document>[],
}

const projectSchema: Schema = new Schema({
	projectName: {
		type: String,
		required: [true, 'El nombre del projecto es requerido'],
		trim: true,
	},
	clientName: {
		type: String,
		required: [true, 'El nombre del cliente es requerido'],
		trim: true,
	}, 
	description: {
		type: String,
		required: [true, 'La descripción del projecto es requerida'],
		trim: true,
	},
	tasks: [
		{
			type: Types.ObjectId,
			ref: 'Task', 
		}
	],
	manager: {
		type: Types.ObjectId,
		ref: 'User'
	},
	team: [
		{
			type: Types.ObjectId,
			ref: 'User', 
		}
	],
}, {timestamps: true});

projectSchema.pre('deleteOne', { document: true }, async function () {
	const projectId = this._id;
	if(!projectId) return;
	//Eliminamos las notas primero
	const tasks = await TaskModel.find({project: projectId});
	for(const task of tasks){
		await NoteModel.deleteMany({task: task.id});
	}
	//Luego eliminamos la tarea
	await TaskModel.deleteMany({project: projectId});
});

export const ProjectModel = model<IProject>('Project', projectSchema);