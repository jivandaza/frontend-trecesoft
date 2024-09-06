import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setUserDetails} from "../store/userSlice.js";
import toastr from 'toastr';
import {Link, useNavigate} from "react-router-dom";
import AllUsers from "../components/AllUsers.jsx";

const Dashboard = () => {

    const navigation = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(state => state?.user?.user);

    const [showBtnUsers, setShowBtnUsers] = useState(false);
    const [displayUsers, setDisplayUsers] = useState(false);
    
    const handleBtnSecurity = () => {
        setShowBtnUsers(prevState => !prevState);
        setDisplayUsers(false);
    }

    const handleBtnUsers = () => {
        setDisplayUsers(true);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(setUserDetails(null));
        toastr.info('Session closed...');
        navigation('/');
    }

    return (
        <div className='h-full md:flex hidden'>
            <aside className='bg-white h-full w-full max-w-60 flex flex-col justify-between border-r border-black'>
                <div>
                    <div className='h-36 border-b border-black flex justify-center items-center gap-1 flex-col py-2'>
                        <p className='capitalize text-lg font-semibold'>Menu</p>
                    </div>

                    {/**     Navigation     */}
                    <nav className='grid'>
                        <button className='py-1 hover:bg-cyan-500 hover:text-white' onClick={handleBtnSecurity}>
                            Seguridad
                        </button>
                        {showBtnUsers && (
                            <button
                                className={
                                    `py-1 hover:bg-cyan-500 hover:text-white
                                    ${displayUsers ? 'bg-cyan-500 text-white' : ''}`
                                }
                                onClick={handleBtnUsers}
                            >
                                Usuarios
                            </button>
                        )}
                    </nav>
                </div>

                <div className='mb-4 mx-auto'>
                    <button className='max-w-[150px] px-4 py-2 bg-red-500 font-semibold text-white tracking-wider hover:opacity-80' onClick={handleLogout}>Logout</button>
                </div>
            </aside>
            <main className='min-h-screen w-full py-4 px-8'>
                {
                    displayUsers && (
                        <AllUsers />
                    )
                }
            </main>
        </div>
    );
};

export default Dashboard;
