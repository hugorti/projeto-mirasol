import prismaClient from "../../prisma";
import {hash} from 'bcryptjs'

interface UserRequest {
    name: string;
    user: string;
    password: string;
}

class CreateUserService {
    async execute({name, user, password}: UserRequest){
        
        //verificar se ele enviou um email
        if(!user){
            throw new Error("User incorrect")
        }

        //verificar se esse usuario ja existe
        const userExists = await prismaClient.usuario.findFirst({
            where:{
                user: user
            }
        })

        if(userExists){
            throw new Error("User Exists")
        }

        const passwordHash = await hash(password, 8)

        const users = await prismaClient.usuario.create({
            data: {
                name: name,
                user: user,
                password: passwordHash,
            }

        })

        return(users)
    }
}

export {CreateUserService}