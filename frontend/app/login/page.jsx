'use client'
import { Box, Paper, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import UseAppContext from "@/component/UseContext";
import { useRouter } from 'next/navigation';
import { LockOpen } from "@mui/icons-material";
import { Button, TextInput } from "flowbite-react";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";



export default function Login() {

    const router = useRouter();

    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();

    const loginForm = useFormik({
        initialValues: {
            email: "",
            password: "",
        },

        onSubmit: async (values) => {
            console.log(values.email);
            try {
                const res = await axios.post(`${process.env.backend}/user/authenticate`, {
                    email: values.email.toLowerCase(),
                    password: values.password
                })
                toast.success('Login Successfull!');
                router.push('/');
                console.log(res.data.data, " user after login");
                sessionStorage.setItem('user', JSON.stringify(res.data.data));
                setLoggedIn(true);
                setCurrentUser(res.data.data);
                setLoadingData(false);
                console.log(currentUser, ' current user after login');
            } catch (error) {
                if (error.response.data.message) {
                    toast.error(error.response.data.message)
                }
            }
        },
    });
    return (
        <div className="bg-body pt-10 pb-96">
            <Box className='md:w-1/2 sm:w-4/5 p-8 m-auto'>
                <Paper elevation={16} className="p-10">
                    <h1 className="text-center font-bold text-3xl">Login Here</h1>
                    <form onSubmit={loginForm.handleSubmit}>
                        <label className="text-lg">Email</label>
                        <TextInput onChange={loginForm.handleChange} value={loginForm.values.email} required className="margin-vt" placeholder="Enter email" size="small" type="email" name="email" />
                        <label className="text-lg">Password</label>
                        <TextInput onChange={loginForm.handleChange} value={loginForm.values.password} required placeholder="Enter password" type="password" size="small" className="margin-vt" name="password" />
                        <Button className="w-full my-5" type="submit" color="purple"><LockOpen className="me-2" />Submit</Button>
                        <font className="mt-5">Don't have an account yet?<Link href="/signup"><span className="ms-2" style={{ color: 'blue' }}>Signup</span></Link></font>
                    </form>
                    
                </Paper>
            </Box>


        </div>
    )
} 