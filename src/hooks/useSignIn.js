import { auth, provider } from '../firebase/config.js';
import { signInWithPopup } from 'firebase/auth';
import { useAuthContext } from './useAuthContext.js';

export const useSignIn = () => {
    const { dispatch } = useAuthContext();

    return () => {
        return signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                dispatch({ type: 'login', payload: user });
                console.log('로그인되었습니다', user)
                if (!user) {
                    throw new Error('로그인에 실패했습니다.');
                }
            })
            .catch((error) => {
                console.error('Error during Google sign-in:', error);
            });
    };
};