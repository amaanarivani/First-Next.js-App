'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const AppContext = createContext();

export const AppProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState( null
    );
    const [loadingData, setLoadingData] = useState(true);

    console.log(currentUser, " current user data after reload");

    useEffect(() => {
        setLoadingData(true);
        console.log(JSON.parse(sessionStorage.getItem('user')), " wefjifmkl");
        setCurrentUser(JSON.parse(sessionStorage.getItem('user')))
        setLoggedIn(JSON.parse(sessionStorage.getItem('user'))? true: false)
        setLoadingData(false);
    },[]);

    const router = useRouter();

    const logout = () => {
        sessionStorage.removeItem('user');
        setLoggedIn(false);
        console.log('inside logout');
        setCurrentUser(null);
        router.push('/login');
    }

    const [loggedIn, setLoggedIn] = useState(currentUser ? true: false);

    return <AppContext.Provider value={{ loggedIn, setLoggedIn, logout, currentUser, setCurrentUser, loadingData, setLoadingData}}>
        {children}
    </AppContext.Provider>
};

const UseAppContext = () => useContext(AppContext);

export default UseAppContext;
