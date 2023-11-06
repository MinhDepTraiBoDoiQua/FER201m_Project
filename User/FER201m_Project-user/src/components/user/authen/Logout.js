import { useContext, useEffect } from 'react';
import UserContext from './UserContext';
export default function Logout() {
    const { logout } = useContext(UserContext);
    useEffect(() => {
        logout();
        window.location.href = '/';
    }, [logout]);
}
