'use client'
import { Box, Paper, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import UseAppContext from "@/component/UseContext";
import { useRouter } from 'next/navigation';
import {LockOpen } from "@mui/icons-material";
import { Button, TextInput } from "flowbite-react";
import Link from "next/link";
import toast from "react-hot-toast";



export default function Login() {

    const router = useRouter();

    const { setLoggedIn, setCurrentUser } = UseAppContext();

    const loginForm = useFormik({
        initialValues: {
            email: "",
            password: "",
        },

        onSubmit: async (values) => {
            console.log(values);

            const res = await fetch(`${process.env.backend}/user/authenticate`, {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                    'Content-type': 'application/json'
                }
            });

            console.log(res.status);

            if (res.status === 200) {
                toast.success('Login Successfull!');
                router.push('/');
                const data = await res.json();
                console.log(data);
                sessionStorage.setItem('user', JSON.stringify(data));
                setLoggedIn(true);
                setCurrentUser(data);
            }
            else if (res.status === 400) {
                toast.error("Email or Password is incorrect");
            }
            else {
                toast.error("Something went wrong");
            }
        },
    });
    return (
        <div className="bg-body py-16">
            <Box className='md:w-1/2 sm:w-4/5 p-8 m-auto'>
                <Paper elevation={16} className="p-10">
                    <h1 className="text-center font-bold text-3xl">Login Here</h1>
                    <form onSubmit={loginForm.handleSubmit}>
                        <label className="text-lg">Email</label>
                        <TextInput onChange={loginForm.handleChange} value={loginForm.values.email} required className="margin-vt" placeholder="Enter email" size="small" type="email" name="email" />
                        <label className="text-lg">Password</label>
                        <TextInput onChange={loginForm.handleChange} value={loginForm.values.password} required placeholder="Enter password" type="password" size="small" className="margin-vt" name="password" />
                        <Button className="w-full my-3" type="submit" color="purple"><LockOpen className="me-2"/>Submit</Button>
                        <font className="mt-5">Don't have an account yet?<Link href="/signup"><span className="ms-2" style={{color: 'blue'}}>Signup</span></Link></font>
                    </form>
                </Paper>
            </Box>


        </div>
    )
} 