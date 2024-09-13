import React, {useEffect, useState} from 'react'
import Context from './context'
import {Outlet, useNavigate} from "react-router-dom";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import {useDispatch, useSelector} from "react-redux";
import useSessionHandler from './hooks/useSessionHandler.jsx';
import {setUserDetails} from "./store/userSlice.js";
import {userApi} from "./common/index.js";
import { jwtDecode } from 'jwt-decode';
import Loader from "./components/Loader.jsx";

// Componente principal
function App() {

    const navigation = useNavigate();
    const dispatch = useDispatch();

    const { handleSessionClosure } = useSessionHandler();

    const user = useSelector(state => state?.user?.user);

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

            const status = response.status;

            if ( response.ok ){
                dispatch(setUserDetails(data));
                navigation('/dashboard');
            } else if ( status === 403 || status === 401 || status === 404 ) {
                handleSessionClosure(data.message);
            } else if ( status === 500 ) {
                toastr.error(data.message);
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
    }, [

    ]);

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