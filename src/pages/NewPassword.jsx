import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {authApi} from "../common/index.js";
import toastr from "toastr";

const NewPassword = () => {

    const navigation = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({
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

        const response = await fetch(authApi.newPassword.url, {
            method: authApi.newPassword.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const { message, error } = await response.json();

        if ( response.ok ) {
            toastr.success(message);
            navigation('/');
        } else if (response.status === 400)
            toastr.error(error);
    };

    return (
        <div className='min-h-full flex justify-center items-center'>
            <section className='container mx-auto w-1/3 p-4 border border-black'>
                <form
                    onSubmit={handleSubmit}
                    className='flex flex-col gap-2 w-full'
                >
                    <h2 className='font-bold uppercase'>Forgot Password</h2>

                    <hr className='border-t-2 border-gray-300 my-2' />

                    <label htmlFor='password'>New Password:</label>
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
                        ACCEPT
                    </button>
                </form>
            </section>
        </div>
    );
};

export default NewPassword;
