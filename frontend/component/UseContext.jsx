'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const AppContext = createContext();

export const AppProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState(
    );

    useEffect(() => {
        setCurrentUser(JSON.parse(sessionStorage.getItem('user')))
    },[]);

    const router = useRouter();

    const logout = () => {
        sessionStorage.removeItem('user');
        setLoggedIn(false);
        console.log('inside logout');
        setCurrentUser(null);
        router.push('/login');
    }

    const [loggedIn, setLoggedIn] = useState(currentUser!==null);

    return <AppContext.Provider value={{ loggedIn, setLoggedIn, logout, currentUser, setCurrentUser}}>
        {children}
    </AppContext.Provider>
};

const UseAppContext = () => useContext(AppContext);

export default UseAppContext;
