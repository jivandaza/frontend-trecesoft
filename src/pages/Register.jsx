import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {authApi} from "../common/index.js";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import toastr from 'toastr';

const Register = () => {

    const navigation = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({
        username: '',
        email: '',
        password: '',
        name: ''
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

        const response = await fetch(authApi.register.url, {
            method: authApi.register.method,
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const { message, error } = await response.json();

        if ( response.ok ) {
            toastr.success(message);
            navigation('/');
        } else if ( response.status === 400 )
            toastr.error(error);
    }

    return (
        <div className='h-full flex justify-center items-center'>
            <section className='container mx-auto w-1/3 p-4 border border-black'>
                <form
                    onSubmit={handleSubmit}
                    className='flex flex-col gap-2 w-full'
                >
                    <h2 className='font-bold uppercase'>Sign Up</h2>

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

                    <label htmlFor='password' className='mb-1'>Password:</label>
                    <div className='bg-slate-100 p-2 flex items-center border border-black'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id='password'
                            name='password'
                            className='w-full h-full outline-none bg-transparent'
                            onChange={handleOneChange}
                            value={data.password}
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
                        SIGN UP
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

export default Register;
