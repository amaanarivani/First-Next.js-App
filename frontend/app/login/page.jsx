'use client'
import { Box, Paper, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import Swal from "sweetalert2";
// import { motion } from 'framer-motion';
import UseAppContext from "@/component/UseContext";
import { useRouter } from 'next/navigation';
import { HowToReg, LockOpen } from "@mui/icons-material";
import { Button, TextInput } from "flowbite-react";
import Link from "next/link";


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

            const res = await fetch('http://localhost:5000/user/authenticate', {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                    'Content-type': 'application/json'
                }
            });

            console.log(res.status);

            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successfull',
                })
                    .then((result) => {
                        router.push('/');

                    }).catch((err) => {

                    });

                const data = await res.json();
                console.log(data);
                sessionStorage.setItem('user', JSON.stringify(data));
                setLoggedIn(true);
                setCurrentUser(data);
            }
            else if (res.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Email or Password is incorrect'
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong'
                })
            }
        },
    });
    return (
        <div className="bg-body py-16">
            <Box className='w-1/2 p-8 m-auto'>
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