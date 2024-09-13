import React, {useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {authApi} from "../common/index.js";
import toastr from "toastr";
import {jwtDecode} from "jwt-decode";

const ResetPassword = () => {

    const navigation = useNavigate();
    const { token } = useParams();

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

        const userDecoded = jwtDecode(token);

        const response = await fetch(`${authApi.resetPassword.url}/${userDecoded.id}`, {
            method: authApi.resetPassword.method,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const { message } = await response.json();

        if ( response.ok ) {
            toastr.success(message);
            navigation('/');
        } else
            toastr.error(message);
    };

    return (
        <div className='min-h-full flex justify-center items-center'>
            <section className='container mx-auto w-1/3 p-4 border border-black'>
                <form
                    onSubmit={handleSubmit}
                    className='flex flex-col gap-2 w-full'
                >
                    <h2 className='font-bold uppercase'>Reset Password</h2>

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

export default ResetPassword;
