'use client'
import { Card, Paper, Button, Box, TextField } from "@mui/material";
import { useFormik } from "formik";

export default function Signup() {
    const signupform = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmpassword: ''
        },
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);

            if (values.password != values.confirmpassword) {
                
            }

            setTimeout(() => {
                console.log(values);
                setSubmitting(false);
            }, 3000);

            //send data to the server
            const res = await fetch("http://localhost:5000/user/add", {
                method: 'Post',
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(res.status);
            if (res.status === 200) {
                enqueueSnackbar('Sign Up Successfull', {
                    anchorOrigin: {
                        horizontal: 'right',
                        vertical: 'top'
                    },
                    variant: 'success'
                });
            } else {
                enqueSnackbar('Oops Something went wrong', {
                    anchorOrigin: {
                        horizontal: 'right',
                        vertical: 'top'
                    },
                });
            }
        },
    })
    return (
        <div className="pt-20">
            <Box className='w-1/2 p-8 m-auto'>
                <Paper elevation={16} className="p-10">
                    <h1 className="font-bold text-3xl text-center">Signup Here</h1>
                    <form onSubmit={signupform.handleSubmit}>
                        <label className="text-lg">Full Name</label>
                        <TextField name="name" required className="my-3" fullWidth id="outlined" label="Enter Name" variant="outlined" size="small" onChange={signupform.handleChange} value={signupform.values.name} />
                        <label className="text-lg">Email</label>
                        <TextField name="email" required className="my-3" fullWidth id="outlined" label="Enter Email" variant="outlined" size="small" onChange={signupform.handleChange} value={signupform.values.email} />
                        <label className="text-lg">Password</label>
                        <TextField name="password" required fullWidth id="outlined-password-input" label="Enter Password" type="password" size="small" className="my-3" onChange={signupform.handleChange} value={signupform.values.password} />
                        <label className="text-lg">Confirm Password</label>
                        <TextField name="confirmpassword" required fullWidth id="outlined-password-input" label="Re-Enter Password" type="password" size="small" className="my-3" onChange={signupform.handleChange} value={signupform.values.confirmpassword} />
                        <Button disabled={signupform.isSubmitting} fullWidth type="submit" className="mt-2" style={{ backgroundColor: 'black', color: 'white' }}>
                            {
                                signupform.isSubmitting ? (
                                    <>
                                        Loading...
                                    </>
                                ) : 'Submit'
                            }
                        </Button>
                        <p className="mt-3">Already have an account?<Button href="http://localhost:3000/login">Login</Button></p>
                    </form>
                </Paper>
            </Box>
        </div>
    )
} 