import { Router } from 'express';
import { NoteController } from './note.controller';
import { NoteService } from '../services/note.service';



export class NoteRoutes {

    static get routes (): Router {
        const router = Router();

        const noteController = new NoteController( new NoteService());
        router.post('/notes', noteController.createNote);
        router.get('/notes', noteController.getTaskNote);
        router.delete('/notes/:noteId', noteController.deleteNote);

        return router;
    }

} 