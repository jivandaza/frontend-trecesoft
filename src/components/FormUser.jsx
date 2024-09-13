import React, {useEffect, useState} from 'react';
import {IoMdClose} from "react-icons/io";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {jwtDecode} from "jwt-decode";
import {roleApi, userApi} from "../common/index.js";
import {setUserDetails} from "../store/userSlice.js";
import toastr from "toastr";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const FormUser = ({
    onClose,
    title,
    fetchData,
    user,
    isCreateForm
}) => {

    const navigation = useNavigate();
    const dispatch = useDispatch();

    const [status, setStatus] = useState([true, false]);
    const [roles, setRoles] = useState([]);
    const [data, setData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        name: user?.name || '',
        role: user?.role || '',
        status: user?.status
    });

    const handleOneChange = (e) => {
        const { name, value } = e.target;

        if (name === 'role' && !isCreateForm) {
            const selectedRole = roles.find((role) => role._id === value);
            setData((previousValue) => ({
                ...previousValue,
                role: selectedRole
            }));
        } else {
            setData((previousValue) => ({
                ...previousValue,
                [name]: value
            }));
        }
    };

    const fetchAllRoles = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            const response = await fetch(roleApi.getAllRoles.url, {
                method: roleApi.getAllRoles.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();

            if ( response.ok )
                setRoles(data);
            else {
                localStorage.removeItem('token');
                dispatch(setUserDetails(null));
                toastr.info('Session closed...');
                navigation('/');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetchData(data, user?._id);
    }

    useEffect(() => {
        fetchAllRoles();
    }, []);

    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 letf-0 right-0 bottom-0 flex justify-center items-center'>
            <div className='bg-white p-4 shadow-md rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden pb-12'>
                <div className='relative flex items-center pt-2 pb-4'>
                    <button className='absolute right-0 p-0.5 text-red-600 text-lg rounded-full hover:bg-red-600 hover:text-white' onClick={onClose}>
                        <IoMdClose />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='grid p-4 overflow-y-scroll h-full pb-8'>
                    <h2 className='font-bold uppercase'>{title}</h2>

                    <hr className='border-t-2 border-gray-300 my-2' />

                    <label htmlFor='username'>Username:</label>
                    <div className='bg-slate-100 p-2 border border-black'>
                        <input
                            type='text'
                            id='username'
                            name='username'
                            className='w-full h-full outline-none bg-transparent'
                            onChange={handleOneChange}
                            value={data.username}
                        />
                    </div>

                    <label htmlFor='email'>Email:</label>
                    <div className='bg-slate-100 p-2 border border-black'>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            placeholder='example@email.com'
                            className='w-full h-full outline-none bg-transparent'
                            onChange={handleOneChange}
                            value={data.email}
                        />
                    </div>

                    <label htmlFor='name'>Name:</label>
                    <div className='bg-slate-100 p-2 border border-black'>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            className='w-full h-full outline-none bg-transparent'
                            onChange={handleOneChange}
                            value={data.name}
                        />
                    </div>

                    <label
                        htmlFor="role"
                        className='mb-1'
                    >Role:</label>
                    <select
                        id='role'
                        name='role'
                        className='mb-4 py-2 cursor-pointer outline-none bg-slate-100 flex items-center border border-black'
                        value={data.role}
                        onChange={handleOneChange}
                    >
                        {
                            isCreateForm ? (
                                <option value=''>Select role</option>
                            ) : (
                                <option value={data?.role?._id}>{data?.role?.description}</option>
                            )
                        }
                        {
                            roles.map((role, index) => {
                                if ( isCreateForm || role?._id !== data?.role?._id) {
                                    return (
                                        <option
                                            value={role?._id}
                                            key={role?._id+index}
                                        >{role?.description}</option>
                                    )
                                }
                            })
                        }
                    </select>

                    {
                        !isCreateForm && (
                            <select
                                id='status'
                                name='status'
                                className='mb-4 py-2 cursor-pointer outline-none bg-slate-100 flex items-center border border-black'
                                value={data.status}
                                onChange={handleOneChange}
                            >
                                {
                                    status.map((item, index) => {
                                        const result = item === data?.status;
                                        return (
                                            <option
                                                value={result}
                                                key={index}
                                            >{result ? 'active' : 'Inactive'}</option>
                                        )
                                    })
                                }
                            </select>
                        )
                    }

                    <button
                        className='px-3 py-2 mt-6 bg-cyan-400 text-white font-semibold hover:bg-cyan-600'
                        onClick={handleSubmit}
                    >Save</button>
                </form>
            </div>
        </div>
    );
};

export default FormUser;
