import { FC, ReactNode, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { AuthContext, authReducer } from './';
import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import axios, { AxiosError } from 'axios';
import { jwt } from '../../utils';

interface Props {
  children: ReactNode;
}

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
}

export const AuthProvider: FC<Props> = ({ children }) => {

  const { data, status } = useSession();
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)
  const router = useRouter();

  useEffect(() => {
    if ( status === 'authenticated' ) {
      dispatch({ type: '[Auth] - Login', payload: data?.user as IUser });
    }
  }, [status, data])


  // useEffect(() => {
  //   checkToken();
  // }, [])

  const checkToken = async () => {

    if ( !Cookies.get('token') ) return;
    try {

      const { data } = await tesloApi.get('/user/validate-token');
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      
    } catch (error) {
      Cookies.remove('token');
    }

  }

  const loginUser = async ( email: string, password: string ): Promise<boolean> => {

    try {

      const { data } = await tesloApi.post('/user/login', { email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user});
      return true;

    } catch (error) {
      return false;
    }

  }

  const registerUser = async ( name: string, email: string, password: string ): Promise<{hasError: boolean; message?: string;}> => {

    try {

      const { data } = await tesloApi.post('/user/register', { name, email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user});
      return {
        hasError: false
      }

    } catch (error) {

      if ( axios.isAxiosError(error) ) {
        const err = error as AxiosError;
        return {
          hasError: true,
          message: err.message
        };
      }

      return {
        hasError: true,
        message: 'Error al crear usuario. Por favor intente de nuevo en unos minutos.'
      }

    }

  }

  const logout = () => {
    Cookies.remove('cart');
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('zip');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('phone');

    signOut();
  }

  return (
    <AuthContext.Provider value={
    {
      ...state,

      // Methods
      loginUser,
      registerUser,
      logout,
    }
  }>
    { children }
  </AuthContext.Provider>
  )
}