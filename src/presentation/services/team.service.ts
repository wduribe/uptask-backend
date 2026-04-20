import { ProjectModel, UserModel } from '../../database/mongo';
import { CustomError, FindMemberDto, MemberDto } from '../../domain';


export class TeamService {

    constructor() { }

    async findMemberById(findMemberDto: FindMemberDto) {
        try {

            const member = await UserModel.findOne(findMemberDto).select('id name email');
            if (!member) throw CustomError.badRequest('Usuario no encontrado');

            return member;

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getMembersTeam(projectId: string) {
        try {
            const project = await ProjectModel.findById(projectId).populate({
                path: 'team',
                select: 'id name email',
            });

            if(!project) throw CustomError.badRequest('Proyecto no encontrado');
            
            return project.team

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
    
    async addMember(memberDto: MemberDto) {

        const { member, project, manager } = memberDto;

        try {

            if (member.toString() === manager.toString()) throw CustomError.badRequest('Eres el manager, no puedes agregarte al equipo');
            if (project.manager?.toString() !== manager.toString()) throw CustomError.badRequest('Usuario no autorizado');

            const existMember = project.team.find(memberId => memberId?.toString() === member.toString());
            if (existMember) throw CustomError.badRequest('Miembro ya fué agregado al proyecto');

            const memberToAdd = await UserModel.findById(member);
            if (!memberToAdd) throw CustomError.badRequest('Miembro no encontrado');

            project.team.push(memberToAdd.id);
            await project.save();

            return 'Miembro agregado correctamente';

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    } 

    async deleteMember(memberDto: MemberDto) {
        try {
            const { member, project, manager } = memberDto;
            if (project.manager?.toString() !== manager.toString()) throw CustomError.badRequest('Usuario no autorizado');
            
            if(!project.team.some(memberId => memberId?.toString() === member.toString())) throw CustomError.badRequest('El usuario no existe en el proyecto');

            project.team = project.team.filter(memberId => memberId?.toString() !== member?.toString() );
            await project.save();

            return 'Miembro eliminado correctamente';

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }


}