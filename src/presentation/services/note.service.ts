import { ITask } from '../../database/mongo';
import { NoteModel } from '../../database/mongo/models/note.model';
import { CreateNoteDto, CustomError } from '../../domain';



export class NoteService {

    constructor() { }

    async createNote(createNoteDto: CreateNoteDto) {
        const { content, task, user } = createNoteDto;

        const note = new NoteModel({
            content, createdBy: user, task: task.id
        });

        task.notes.push(note.id);

        try {

            await Promise.allSettled([
                note.save(),
                task.save(),
            ]);

            return 'Nota creada correctamente';

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getTaskNote(id: string) {
        try {
            const notes = await NoteModel.find({ task: id })

            return notes;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async deleteNote(noteId: string, user: string, task: ITask) {
        try {
            const note = await NoteModel.findById(noteId);
            if (!note) throw CustomError.badRequest('No existe la nota');

            if (note.createdBy.toString() !== user) throw CustomError.badRequest('Usuario no autorizado');

            task.notes = task.notes.filter(note => note.toString() !== noteId);

            await Promise.allSettled([
                note.deleteOne(),
                task.save(),
            ]);

            return 'Nota eliminada correctamente';
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}