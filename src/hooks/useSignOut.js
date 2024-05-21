import { auth } from '../firebase/config.js';
import { signOut } from 'firebase/auth';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

export const useSignOut = () => {
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const signOutUser = () => {
        return signOut(auth)
            .then(() => {
                dispatch({ type: 'LOGOUT' });
                console.log('signed out');
                navigate('/')
            })
            .catch((error) => {
                console.error('Error during sign-out:', error);
            });
    };

    return signOutUser;
};