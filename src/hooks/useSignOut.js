import { auth } from '../firebase/config.js';
import { signOut } from 'firebase/auth';
import { useAuthContext } from './useAuthContext';

export const useSignOut = () => {
    const { dispatch } = useAuthContext();

    const signOutUser = () => {
        return signOut(auth)
            .then(() => {
                dispatch({ type: 'LOGOUT' });
                console.log('signed out')
            })
            .catch((error) => {
                console.error('Error during sign-out:', error);
            });
    };

    return signOutUser;
};