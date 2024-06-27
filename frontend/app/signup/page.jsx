'use client'
import { Card, Paper, Button, Box, TextField } from "@mui/material";
import { useFormik } from "formik";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation'

export default function Signup() {

    const router = useRouter()

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
                Swal.fire({
                    icon: 'error',
                    title: 'oops!!',
                    text: 'Password Not Matched'
                  })
                return;
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
                Swal.fire({
                  icon: 'success',
                  title: 'Nice',
                  text: 'You have signed up successfully'
                })
                  .then((result) => {
                    //navigate('http://localhost:3000/login');
                    router.push('http://localhost:3000/login', { scroll: false })
        
                  }).catch((err) => {
        
                  });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'oops!!',
                  text: 'Something went wrong'
                })
              }
        },
    });
    return (
        <div className="pt-20">
            <Box className='w-1/2 p-8 m-auto'>
                <Paper elevation={16} className="p-10">
                    <h1 className="font-bold text-3xl text-center">Signup Here</h1>
                    <form onSubmit={signupform.handleSubmit}>
                        <label className="text-lg">Full Name</label>
                        <TextField name="name" required className="margin-vt" fullWidth id="outlined" label="Enter Name" variant="outlined" size="small" onChange={signupform.handleChange} value={signupform.values.name} />
                        <label className="text-lg">Email</label>
                        <TextField type="email" name="email" required className="margin-vt" fullWidth id="outlined" label="Enter Email" variant="outlined" size="small" onChange={signupform.handleChange} value={signupform.values.email} />
                        <label className="text-lg">Password</label>
                        <TextField name="password" required fullWidth id="outlined-password-input" label="Enter Password" type="password" size="small" className="margin-vt" onChange={signupform.handleChange} value={signupform.values.password} />
                        <label className="text-lg">Confirm Password</label>
                        <TextField name="confirmpassword" required fullWidth id="outlined-password-input" label="Re-Enter Password" type="password" size="small" className="margin-vt" onChange={signupform.handleChange} value={signupform.values.confirmpassword} />
                        <Button disabled={signupform.isSubmitting} fullWidth type="submit" className="mt-2" style={{ backgroundColor: 'black', color: 'white', marginTop: '2rem' }}>
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