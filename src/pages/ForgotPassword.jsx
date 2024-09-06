import React, {useState} from 'react';
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {Link} from "react-router-dom";
import {authApi} from "../common/index.js";
import toastr from "toastr";

const ForgotPassword = () => {

    const [data, setData] = useState({
        email: ''
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

        const response = await fetch(authApi.forgotPassword.url, {
            method: authApi.forgotPassword.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const { message, error } = await response.json();

        if ( response.ok ) {
            toastr.success(message);
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

                    <button className='bg-cyan-400 text-white text-center font-semibold tracking-wider p-2 mt-4 max-w-[100px] hover:scale-110 transition-all'>
                        ACCEPT
                    </button>

                    <p className='mt-4'>
                        ¿You already have an account?
                        &nbsp;
                        <Link
                            to='/'
                            className='text-black font-semibold hover:underline'
                        >Login</Link>
                    </p>
                </form>
            </section>
        </div>
    );
};

export default ForgotPassword;
