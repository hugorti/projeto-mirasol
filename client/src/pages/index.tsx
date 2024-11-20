import { canSSRGuest } from '@/utils/canSSRGuest';
import Head from 'next/head';

export default function Home() {
  
    return (
        <>
            <Head>
                <title>Faça seu login</title>
            </Head>
            <div>
                 <h1>TELA DE LOGIN</h1>
            </div>
        </>
    );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return {
        props: {}
    };
});
