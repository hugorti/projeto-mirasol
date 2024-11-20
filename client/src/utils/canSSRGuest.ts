import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";


//funcao para paginas que so podem ser acessadas por visitantes
export function canSSRGuest<P extends { [key: string]: any }>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);


        //se o cara tentar acessar a pagina porem tendo já um login salvo redirecionamos
        if(cookies['@nextauth.token']){
            return {
                redirect: {
                    destination: '/home',
                    permanent: false
                }
            }
        }

        return await fn(ctx);

    }
}