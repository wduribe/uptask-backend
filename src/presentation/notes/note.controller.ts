import { Request, Response } from 'express';
import { CreateNoteDto, CustomError } from '../../domain';
import { NoteService } from '../services/note.service';
import { isValidMongoId } from '../../config';


export class NoteController {

    constructor(
        private readonly noteService: NoteService,
    ) { }

    private handlerErrors = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    createNote = (req: Request, res: Response) => {

        const content = req.body.content;
        const user = req.manager;
        const task = req.task;

        const [error, createNoteDto] = CreateNoteDto.create({
            content,
            user,
            task,
        });

        if (error) {
            res.status(400).json({ error });
            return;
        }

        this.noteService.createNote(createNoteDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handlerErrors(error, res));

    }

    getTaskNote = (req: Request, res: Response) => {
        const id = req.task.id;

        this.noteService.getTaskNote(id)
            .then(resp => res.json(resp))
            .catch(error => this.handlerErrors(error, res));

    }

    deleteNote = (req: Request, res: Response) => {
        const noteId = req.params.noteId;
        
        if(!isValidMongoId(noteId)){
            res.status(400).json({error: 'Id de nota inválido'});
            return; 
        }

        this.noteService.deleteNote(noteId, req.manager.toString(), req.task)
            .then(resp => res.json(resp))
            .catch(error => this.handlerErrors(error, res));

    }
     

}