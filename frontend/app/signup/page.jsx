'use client'
import { Card, Paper, Button, Box, TextField } from "@mui/material";
import { useFormik } from "formik";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function Signup() {

    const router = useRouter();
    const [selFile, setSelFile] = useState('');
    const [convertedFile, setConvertedFile] = useState('');

    const signupform = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmpassword: '',
            myFile: ''
        },
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            values.myFile = selFile;
            setTimeout(() => {
                console.log(values);
                console.log(values.myFile);
                setSubmitting(false);
            }, 3000);

            if (values.password != values.confirmpassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'oops!!',
                    text: 'Password Not Matched'
                })
                return;
            }



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
    const uploadFile = async (e) => {
        if (!e.target.files) return;

        let file = e.target.files[0];
        let converted = await convertToBase64(file);
        console.log(converted);
        // console.log(file, 'abc');
        setSelFile(converted);


        const fd = new FormData();
        fd.append('myfile', converted);

        const res = await fetch('http://localhost:5000/utils/uploadfile', {
            method: 'POST',
            body: JSON.stringify({ myFile: converted }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(res.status);
    }
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setSelFile({ ...selFile, myFile: base64 });
        // uploadFile();
    };
    return (
        <div className="pt-20">
            <Box className='w-1/2 p-8 m-auto'>
                <Paper elevation={16} className="p-10">
                    <h1 className="font-bold text-3xl text-center">Signup Here</h1>
                    <form onSubmit={signupform.handleSubmit}>
                        <div className="grid grid-cols-2 mt-3">
                            <div>
                                <label className="text-lg">First Name</label>
                                <TextField name="firstname" required className="w-75 margin-vt" id="outlined" label="Enter Name" variant="outlined" size="small" onChange={signupform.handleChange} value={signupform.values.firstname} />
                            </div>
                            <div>
                                <label className="text-lg">Last Name</label>
                                <TextField name="lastname"  className="margin-vt" fullWidth id="outlined" label="Enter Name" variant="outlined" size="small" onChange={signupform.handleChange} value={signupform.values.lastname} />
                            </div>
                        </div>
                        <label className="text-lg">Email</label>
                        <TextField type="email" name="email" required className="margin-vt" fullWidth id="outlined" label="Enter Email" variant="outlined" size="small" onChange={signupform.handleChange} value={signupform.values.email} />
                        <label className="text-lg">Password</label>
                        <TextField name="password" required fullWidth id="outlined-password-input" label="Enter Password" type="password" size="small" className="margin-vt" onChange={signupform.handleChange} value={signupform.values.password} />
                        <label className="text-lg">Confirm Password</label>
                        <TextField name="confirmpassword" required fullWidth id="outlined-password-input" label="Re-Enter Password" type="password" size="small" className="margin-vt" onChange={signupform.handleChange} value={signupform.values.confirmpassword} />
                        <label className="text-lg">Avatar</label><br />
                        <input type="file" onChange={uploadFile} />
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