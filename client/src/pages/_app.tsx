import { AppProps } from "next/app";
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastContainer } from 'react-toastify'; // Importando ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
        <Component {...pageProps} />
        <ToastContainer autoClose={3000} theme="colored"/>
    </AuthProvider>
  );
}

export default MyApp;
