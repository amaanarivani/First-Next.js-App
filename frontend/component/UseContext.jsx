'use client'
import { createContext, useContext, useState } from "react";
import { useRouter } from 'next/navigation';

const AppContext = createContext();

export const AppProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState(
        JSON.parse(sessionStorage.getItem('user'))
    );

    const router = useRouter();

    const logout = () => {
        sessionStorage.removeItem('user');
        setLoggedIn(false);
        router.push('/login');
    }

    const [loggedIn, setLoggedIn] = useState(currentUser!==null);

    return <AppContext.Provider value={{ loggedIn, setLoggedIn, logout }}>
        {children}
    </AppContext.Provider>
};

const UseAppContext = () => useContext(AppContext);

export default UseAppContext;
