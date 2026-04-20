import { Request, Response } from 'express';
import { CustomError, FindMemberDto, MemberDto } from '../../domain';
import { TeamService } from '../services/team.service';
import { isValidMongoId } from '../../config';

export class TeamController {

    constructor(
        private readonly teamService: TeamService,
    ) { }

    private handlerErrors = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    getMembersTeam = (req: Request, res: Response) => {
        
        this.teamService.getMembersTeam(req.project.id)
            .then(resp => res.json(resp))
            .catch(error => this.handlerErrors(error, res));
            
    } 

    findMemberById = (req: Request, res: Response) => {

        const [error, findMemberDto] = FindMemberDto.create(req.body);

        if (error) {
            res.status(400).json({ error });
            return;
        }

        this.teamService.findMemberById(findMemberDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handlerErrors(error, res));

    }

    addMember = (req: Request, res: Response) => {

        const [error, addMemberDto] = MemberDto.create({
            member: req.body.member,
            project: req.project,
            manager: req.manager,
        });

        if (error) {
            res.status(400).json({ error });
            return;
        }

        this.teamService.addMember(addMemberDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handlerErrors(error, res));

    }

    deleteMember = (req: Request, res: Response) => {
        const [error, addMemberDto] = MemberDto.create({
            member: req.params.member,
            project: req.project,
            manager: req.manager,
        });

        if (error) {
            res.status(400).json({ error });
            return;
        }

        this.teamService.deleteMember(addMemberDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handlerErrors(error, res));


    }
}