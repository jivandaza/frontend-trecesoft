import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";
import {userApi} from "../common/index.js";
import {setUserDetails} from "../store/userSlice.js";
import toastr from "toastr";
import {GrSearch} from "react-icons/gr";
import moment from "moment";
import {ROLE} from "../constants/index.js";
import FormUser from "./FormUser.jsx";
import {FaEdit, FaTrash} from "react-icons/fa";
import useSessionHandler from "../hooks/useSessionHandler.jsx";

const AllUsers = () => {

    const { handleSessionClosure } = useSessionHandler();

    const navigation = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(state => state?.user?.user);
    const isSuperAdmin = user?.role?.description === ROLE.ADMIN;

    const [users, setUsers] = useState([]);
    const [userUpdate, setUserUpdate] = useState({});
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [showUpdateUser, setShowUpdateUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleSearch = async (e)  => {
        const { value } = e.target;

        if ( value.trim() )
            await fetchSearchUser(value);
        else
            await fetchAllUsers();
    };

    const fetchSearchUser = async (search) => {
        setIsLoading(true);

        const token = localStorage.getItem('token');

        if (token) {
            const response = await fetch(`${userApi.getAllUserBySearch.url}/${search}`, {
                method: userApi.getAllUserBySearch.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();
            const status = response.status;

            if ( response.ok )
                setUsers(data);
            else if ( status === 403 || status === 401 ) {
                handleSessionClosure(data.message);
            } else if ( status === 500 ) {
                toastr.error(data.message);
            }
        } else {
            handleSessionClosure('Session closed');
        }

        setIsLoading(false);
    };

    const fetchAllUsers = async () => {
        setIsLoading(true);

        const token = localStorage.getItem('token');

        if (token) {
            const response = await fetch(userApi.getAllUser.url, {
                method: userApi.getAllUser.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();
            const status = response.status;

            if ( response.ok )
                setUsers(data);
            else if ( status === 403 || status === 401 ) {
                handleSessionClosure(data.message);
            } else if ( status === 500 ) {
                toastr.error(data.message);
            }
        } else {
            handleSessionClosure('Session closed');
        }

        setIsLoading(false);
    };

    const fetchCreateUser = async (data) => {
        const token = localStorage.getItem('token');

        if (token) {
            const response = await fetch(userApi.createUser.url, {
                method: userApi.createUser.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const { message } = await response.json();
            const status = response.status;

            if ( response.ok ) {
                toastr.success('Created successfully');
                setShowCreateUser(false);
                await fetchAllUsers();
            } else if (status === 400 ) {
                toastr.error(message);
            } else if ( status === 403 || status === 401 ) {
                handleSessionClosure(message);
            } else if ( status === 500 ) {
                toastr.error(message);
            }
        } else {
            handleSessionClosure('Session closed');
        }
    };

    const fetchUpdateUser = async (data, id) => {
        const token = localStorage.getItem('token');

        if (token) {
            data.role = data.role?._id;

            const response = await fetch(`${userApi.updateUser.url}/${id}`, {
                method: userApi.updateUser.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const { message } = await response.json();
            const status = response.status;

            if ( response.ok ) {
                toastr.success('Update successfully');
                setShowUpdateUser(false);
                await fetchAllUsers();
            } else if ( status === 404 || status === 400 ) {
                toastr.error(message);
            } else if ( status === 403 || status === 401 ) {
                handleSessionClosure(message);
            } else if ( status === 500 ) {
                toastr.error(message);
            }
        } else {
            handleSessionClosure('Session closed');
        }
    };

    const handleDeleteUser = async (id, role) => {
        if (role === ROLE.ADMIN){
            toastr.error('Unable to delete user');
        } else {
            const token = localStorage.getItem('token');

            if (token) {

                const response = await fetch(`${userApi.deleteUser.url}/${id}`, {
                    method: userApi.deleteUser.method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });

                const { message } = await response.json();
                const status = response.status;

                if ( response.ok ) {
                    toastr.success('Delete successfully');
                    await fetchAllUsers();
                } else if ( status === 404) {
                    toastr.error(message);
                    await fetchAllUsers();
                } else if ( status === 403 || status === 401 ) {
                    handleSessionClosure(message);
                } else if ( status === 500 ) {
                    toastr.error(message);
                }
            } else {
                handleSessionClosure('Session closed');
            }
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    return (
        <section className='flex flex-col h-full'>

            <div className='flex items-center justify-between mb-4 p-2 w-60 border border-black ml-auto'>
                <input
                    type='text'
                    placeholder='Search'
                    className='h-full w-full outline-none bg-transparent'
                    onChange={handleSearch}
                />
                <div
                    className='text-lg min-w-[20px] flex items-center justify-center text-black'
                >
                    <GrSearch />
                </div>
            </div>

            {
                isSuperAdmin && (
                    <button
                        className='bg-cyan-400 text-white text-center font-semibold tracking-wider p-2 my-4 max-w-[100px] hover:scale-110 transition-all ml-auto'
                        onClick={() => setShowCreateUser(true)}
                    >
                        New User
                    </button>
                )
            }

            <div className='h-full overflow-y-scroll'>
                <table className='w-full'>
                    <thead>
                    <tr className='bg-cyan-400 text-white uppercase'>
                        <th>#</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Creation Date</th>
                        {
                            isSuperAdmin && (
                                <th>Actions</th>
                            )
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        !isLoading && (
                            users.map((user, index) => {
                                return (
                                    <tr key={index} className='text-center border'>
                                        <td className='border'>{index+1}</td>
                                        <td className='border'>{user?.username}</td>
                                        <td className='border'>{user?.email}</td>
                                        <td className='border'>{user?.name}</td>
                                        <td className='border'>{user?.role?.description}</td>
                                        <td className='border'>{user?.status ? 'Active' : 'Inactive'}</td>
                                        <td className='border'>{moment(user?.createdAt).format('LL')}</td>
                                        {
                                            isSuperAdmin && (
                                                <td className='text-center py-2'>
                                                    <button
                                                        className='p-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 mr-4'
                                                        onClick={() => {
                                                            setShowUpdateUser(true);
                                                            setUserUpdate(user);
                                                        }}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className='p-2 bg-red-400 text-white rounded hover:bg-red-500'
                                                        onClick={() => handleDeleteUser(user?._id, user?.role.description)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            )
                                        }
                                    </tr>
                                )
                            })
                        )
                    }
                    </tbody>
                </table>
                {
                    isLoading && (
                        <section className='flex justify-center items-center h-full'>
                            <span className='loader'></span>
                        </section>
                    )
                }
            </div>
            {
                showCreateUser && (
                    <FormUser
                        onClose={() => setShowCreateUser(false)}
                        title={'Create User'}
                        fetchData={fetchCreateUser}
                        user={null}
                        isCreateForm={true}
                    />
                )
            }
            {
                showUpdateUser && (
                    <FormUser
                        onClose={() => setShowUpdateUser(false)}
                        title={'Update User'}
                        fetchData={fetchUpdateUser}
                        user={userUpdate}
                        isCreateForm={false}
                    />
                )
            }
        </section>
    );
};

export default AllUsers;
