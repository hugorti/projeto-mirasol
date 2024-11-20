import { createContext, ReactNode, useState, useEffect } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';
import { api } from '@/services/apiClient';
import { toast } from 'react-toastify';

type UserProps = {
  id: string;
  name: string;
  user: string;

};

type SignInProps = {
  email?: string;
  user?: string;
  password: string;
};

type SignUpProps = {
  name: string;
  user: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextData = {
  user: UserProps | undefined;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, '@nextauth.token');
    Router.push('/');
  } catch (error) {
    console.error("Error ao deslogar", error);
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { '@nextauth.token': token } = parseCookies();

    if (token) {
      api.get('/me')
        .then(response => {
          const { id, name, user } = response.data;
          setUser({
            id,
            name,
            user,
          });
        })
        .catch(() => {
          signOut();
        });

      // Verifica se o token deve expirar após um dia
      const tokenExpirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas a partir de agora
      const timeUntilExpiration = tokenExpirationDate.getTime() - Date.now();

      // Desloga o usuário automaticamente após 24 horas
      const timeoutId = setTimeout(() => {
        signOut();
        toast.info("Sessão expirada. Você foi deslogado automaticamente.");
      }, timeUntilExpiration);

      // Limpa o timeout quando o componente é desmontado
      return () => clearTimeout(timeoutId);
    }
  }, []); // Remover 'user' das dependências para evitar o loop

  async function signIn({ user, password }: SignInProps) {
    try {
      const response = await api.post('/session', {
        user: user || '',
        password
      });

      const { id, name, token, role } = response.data;

      setCookie(undefined, '@nextauth.token', token, {
        maxAge: 60 * 60 * 24, // Expirar em 1 dia
        path: "/"
      });

      setUser({
        id,
        name,
        user: user || '',
      });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      toast.success("Logado com sucesso!");

    } catch (err) {
      toast.error("Erro ao acessar, usuário / senha inválidos!");
      console.error("Erro ao acessar", err);
    }
  }

  async function signUp({ name, user, password }: SignUpProps) {
    try {
      await api.post('/user', {
        name,
        user,
        password
      });

      toast.success("Cadastrado com sucesso!");
      Router.push('/');
    } catch (err) {
      toast.error("Erro ao cadastrar!");
      console.error("Erro ao cadastrar", err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}
