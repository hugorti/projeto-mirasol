import prismaClient from "../../prisma";

class DetailUserService{
    async execute(user_id: string){

        const user = await prismaClient.usuario.findFirst({
            where: {
                id: user_id 
            },
            select: {
                id: true,
                name: true,
                user: true, 
            }
        })
        return user;
    }
}

export {DetailUserService}