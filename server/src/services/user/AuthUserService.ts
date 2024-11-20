import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import {sign} from 'jsonwebtoken'

interface AuthRequest{
    user: string;
    password: string;
}

class AuthUserService{
    async execute({user, password}: AuthRequest){
        //Verificar se o email existe
        const users = await prismaClient.usuario.findFirst({
            where: {
                user: user,
            }
        })

        if(!users){
            throw new Error("User/Password incorrect")
        }

        // Verifica se a senha  que ele mandou está correta
        const passwordMatch = await compare(password, users.password)

        if(!passwordMatch){
            throw new Error("User/Password incorrect")
        }

        // Se deu tudo certo vamos gerar o token pro usuario
        const token = sign(
            {
                name: users.name,
                user: users.user,
            },

            process.env.JWT_SECRET,
            {
                subject: users.id,
                expiresIn: '30d'
            }
        )

        return {
            id: users.id,
            name: users.name,
            user: users.user,
            token: token
        }

    }
}

export {AuthUserService}