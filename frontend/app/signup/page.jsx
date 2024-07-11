'use client'
import { Paper, Box,  } from "@mui/material";
import { useFormik } from "formik";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { HowToReg } from "@mui/icons-material";
import { Button, TextInput } from "flowbite-react";
import Link from "next/link";

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
        <div className="bg-body">
            <Box className='w-3/5 p-8 m-auto'>
                <Paper elevation={16} className="p-10">
                    <h1 className="font-bold text-3xl text-center">Signup Here</h1>
                    <form onSubmit={signupform.handleSubmit}>
                        <div className="grid grid-cols-2 gap-5 mt-3">
                            <div>
                                <label className="text-lg">First Name</label>
                                <TextInput name="firstname" required className="w-75 margin-vt" placeholder="Enter first name"  size="small" onChange={signupform.handleChange} value={signupform.values.firstname} />
                            </div>
                            <div>
                                <label className="text-lg">Last Name</label>
                                <TextInput name="lastname"  className="margin-vt" placeholder="Enter last name"  size="small" onChange={signupform.handleChange} value={signupform.values.lastname} />
                            </div>
                        </div>
                        <label className="text-lg">Email</label>
                        <TextInput type="email" name="email" required className="margin-vt"  placeholder="Enter Email"  size="small" onChange={signupform.handleChange} value={signupform.values.email} />
                        <label className="text-lg">Password</label>
                        <TextInput name="password" required placeholder="Enter Password" type="password" size="small" className="margin-vt" onChange={signupform.handleChange} value={signupform.values.password} />
                        <label className="text-lg">Confirm Password</label>
                        <TextInput name="confirmpassword" required placeholder="Re-Enter Password" type="password" size="small" className="margin-vt" onChange={signupform.handleChange} value={signupform.values.confirmpassword} />
                        <label className="text-lg">Avatar</label><br />
                        <input type="file" onChange={uploadFile} className="mb-4"/>

                        <Button disabled={signupform.isSubmitting} type="submit" className="my-3 w-full" color="purple" >
                            {
                                signupform.isSubmitting ? (
                                    <>
                                        Loading...
                                    </>
                                ) : <>
                                <HowToReg className="me-2"/> Submit
                                </>
                            }
                        </Button>
                        <p className="mt-3">Already have an account?<Link href='/login'><span className="ms-2" style={{color: 'blue'}}>Login</span></Link></p>
                    </form>
                </Paper>
            </Box>
        </div>
    )
} 