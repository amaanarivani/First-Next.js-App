'use client'
import { Box, Button, Paper, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import Swal from "sweetalert2";
// import { motion } from 'framer-motion';
import UseAppContext from "@/component/UseContext";
import { useRouter } from 'next/navigation';


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
        <div className="p-20">
            <Box className='w-1/2 p-8 m-auto'>
                <Paper elevation={16} className="p-10">
                    <h1 className="text-center font-bold text-3xl">Login Here</h1>
                    <form onSubmit={loginForm.handleSubmit}>
                        <label className="text-lg">Email</label>
                        <TextField onChange={loginForm.handleChange} value={loginForm.values.email} required className="margin-vt" fullWidth id="outlined" label="Enter Name" variant="outlined" size="small" type="email" name="email" />
                        <label className="text-lg">Password</label>
                        <TextField onChange={loginForm.handleChange} value={loginForm.values.password} required fullWidth id="outlined-password-input" label="Enter Password" type="password" size="small" className="margin-vt" name="password" />
                        <Button fullWidth type="submit" style={{ backgroundColor: 'black', color: 'white', marginTop: '2rem' }}>Submit</Button>
                        <p className="mt-3">Does'nt have an account?<Button href="http://localhost:3000/signup">Signup</Button></p>
                    </form>
                </Paper>
            </Box>


        </div>
    )
} 