import { Router } from 'express';
import { TeamController } from './team.controller';
import { TeamService } from '../services/team.service';

export class TeamRoutes {
    static get routes(): Router {
        const routes = Router();

        const teamController = new TeamController(new TeamService());

        //Find a member
        routes.post('/find-member', teamController.findMemberById);
        routes.post('/', teamController.addMember);
        routes.delete('/:member', teamController.deleteMember);
        routes.get('/', teamController.getMembersTeam);

        return routes;
    }


} 