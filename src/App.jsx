import React, {useEffect, useState} from 'react'
import Context from './context'
import {Outlet, useNavigate} from "react-router-dom";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import {useDispatch, useSelector} from "react-redux";
import {setUserDetails} from "./store/userSlice.js";
import {userApi} from "./common/index.js";
import { jwtDecode } from 'jwt-decode';
import Loader from "./components/Loader.jsx";

// Componente principal
function App() {

    const navigation = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(state => state?.user?.user);

    //const displayComponent = !user || user?.role === ROLE.GENERAL;

    const [isLoading, setIsLoading] = useState(true);

    const fetchUserDetails = async () => {
        setIsLoading(true);

        const token = localStorage.getItem('token');

        if (token) {
            const userDecoded = jwtDecode(token);

            const response = await fetch(`${userApi.getUserById.url}/${userDecoded.id}`, {
                method: userApi.getUserById.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();

            if ( response.ok )
                dispatch(setUserDetails(data));
            else {
                localStorage.removeItem('token');
                dispatch(setUserDetails(null));
                toastr.info('Session closed...');
                navigation('/');
            }
        }

        setIsLoading(false);
    };

    useEffect(() => {
        /**     Toastr Options     */
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-left',
            preventDuplicates: true,
            timeOut: 3000
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (!user && window.location.pathname === '/dashboard'){
            navigation('/');
        } else if (user) {
            navigation('/dashboard');
        }
    }, [user]);

    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <Context.Provider value={{
                        fetchUserDetails
                    }} >

                        <main className='h-screen'>
                            <Outlet />
                        </main>

                    </Context.Provider>
                )
            }
        </>
    )
}

export default App