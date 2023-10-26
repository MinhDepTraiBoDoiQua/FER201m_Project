import { createContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [accountEmail, setAccountEmail] = useState(
        sessionStorage.getItem('accountEmail')
    );
    const [accountId, setAccountId] = useState(
        sessionStorage.getItem('accountId') === null
            ? '0'
            : sessionStorage.getItem('accountId')
    );
    const [isLoggedin, setIsLoggedin] = useState(false);

    const login = (email, id) => {
        setAccountEmail(email);
        setAccountId(id);
        sessionStorage.setItem('accountEmail', email);
        sessionStorage.setItem('accountId', id);
        setIsLoggedin(true);
    };

    const logout = () => {
        setAccountEmail(null);
        setAccountId(null);
        sessionStorage.clear();
        setIsLoggedin(false);
    };

    return (
        <UserContext.Provider
            value={{ accountEmail, accountId, login, logout, isLoggedin }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
