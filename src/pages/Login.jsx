import React, {useContext, useState} from 'react';
import {authApi} from "../common/index.js";
import {Link, useNavigate} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import toastr from 'toastr';
import Context from "../context/index.js";

const Login = () => {

    const navigation = useNavigate();

    const { fetchUserDetails } = useContext(Context);

    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({
        username: '',
        password: '',
    });

    const handleOneChange = (e) => {
        const { name, value } = e.target;

        setData((previousValue) => {
            return {
                ...previousValue,
                [name]: value
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(authApi.login.url, {
            method: authApi.login.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const { message, token, error } = await response.json();

        if ( response.ok ) {
            localStorage.setItem('token', token);
            await fetchUserDetails();
            navigation('/dashboard');
            toastr.success(message);
        } else if (response.status === 400 || response.status === 500)
            toastr.error(error);
    };

    return (
        <div className='min-h-full flex justify-center items-center'>
            <section className='container mx-auto w-1/3 p-4 border border-black'>
                <form
                    onSubmit={handleSubmit}
                    className='flex flex-col gap-2 w-full'
                >
                    <h2 className='font-bold uppercase'>Sign In</h2>

                    <hr className='border-t-2 border-gray-300 my-2' />

                    <label htmlFor='username'>Username:</label>
                    <div className='bg-slate-100 p-2 mb-2 border border-black'>
                        <input
                            type='text'
                            id='username'
                            name='username'
                            className='w-full h-full outline-none bg-transparent'
                            value={data.username}
                            onChange={handleOneChange}
                        />
                    </div>

                    <label htmlFor='password'>Password:</label>
                    <div className='bg-slate-100 p-2 border border-black flex items-center'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id='password'
                            name='password'
                            className='w-full h-full outline-none bg-transparent'
                            value={data.password}
                            onChange={handleOneChange}
                        />
                        <div className='cursor-pointer text-xl' onClick={
                            () => setShowPassword((value) => !value)
                        }>
                        <span>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        </div>
                    </div>

                    <button className='bg-cyan-400 text-white text-center font-semibold tracking-wider p-2 mt-4 max-w-[100px] hover:scale-110 transition-all'>
                        SIGN IN
                    </button>

                    <Link
                        to='/forgot-password'
                        className='text-sky-600 mt-1 block w-fit font-semibold underline'
                    >
                        Forgot password?
                    </Link>

                    <hr className='border-t-2 border-gray-300 my-2' />

                    <p className='font-semibold'>
                        New User
                    </p>

                    <Link
                        to='/register'
                        className='bg-cyan-400 text-white text-center font-semibold tracking-wider p-2 max-w-[100px] hover:scale-110 transition-all'
                    >SIGN UP</Link>
                </form>
            </section>
        </div>
    );
};

export default Login;
