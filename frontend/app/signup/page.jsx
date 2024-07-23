'use client'
import { Paper, Box, } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { HowToReg } from "@mui/icons-material";
import { Button, TextInput } from "flowbite-react";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";

export default function Signup() {

    const router = useRouter();
    const [selFile, setSelFile] = useState('');
    const [validFile, setValidFile] = useState(false);

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
            try {
                values.firstname = values.firstname.trim();
                values.lastname = values.lastname.trim();
                if (!values.firstname) {
                    return toast.error("User first name can't be empty")
                }
                if (!validFile) {
                    return toast.error("Invalid File")
                }
                setSubmitting(true);
                values.myFile = selFile;
                console.log(values.email, " email ");
                values.email = values.email.toLowerCase();
                setTimeout(() => {
                    console.log(values);
                    console.log(values.myFile);
                    console.log(values.email, " email aa ");
                    setSubmitting(false);
                }, 3000);

                if (values.password != values.confirmpassword) {
                    toast.error("Password Not Matched");
                    return;
                }
                //send data to the server
                const res = await axios.post(`${process.env.backend}/user/add`, {
                    values
                });
                console.log(res.status);
                toast.success("You have signed up successfully")
                router.push('/login')
            } catch (error) {
                if (error.response.data.message) {
                    toast.error(error.response.data.message)
                }
            }
        },
    });

    const validateImage = (filename) => {
        const allowedExt = ["png", "jpeg", "jpg", "gif"];

        // Get the extension of the uploaded file
        const ext = filename.split('.');
        const extension = ext[1];

        //Check if the uploaded file is allowed
        return allowedExt.includes(extension);
    };

    const uploadFile = async (e) => {
        if (!e.target.files) return;

        let file = e.target.files[0];
        console.log(file.name, " user file");
        const isFileValid = validateImage(file.name);
        console.log(isFileValid, "validation result");

        if (isFileValid) {
            let converted = await convertToBase64(file);
            console.log(converted);
            console.log(file, 'abc');
            setSelFile(converted);
        }

        setValidFile(isFileValid);
        console.log(isFileValid, "final validation result");
        console.log(validFile, "updated state value");
    };


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

    return (
        <div className="bg-body pb-36">
            <Box className='md:w-3/5 sm:w-11/12 p-8 m-auto'>
                <Paper elevation={16} className="p-10">
                    <h1 className="font-bold text-3xl text-center">Signup Here</h1>
                    <form onSubmit={signupform.handleSubmit}>
                        <div className="grid grid-cols-2 gap-5 mt-3">
                            <div>
                                <label className="text-lg">First Name</label>
                                <TextInput name="firstname" required className="w-75 margin-vt" placeholder="Enter first name" size="small" onChange={signupform.handleChange} value={signupform.values.firstname} />
                            </div>
                            <div>
                                <label className="text-lg">Last Name</label>
                                <TextInput name="lastname" className="margin-vt" placeholder="Enter last name" size="small" onChange={signupform.handleChange} value={signupform.values.lastname} />
                            </div>
                        </div>
                        <label className="text-lg">Email</label>
                        <TextInput type="email" name="email" required className="margin-vt" placeholder="Enter Email" size="small" onChange={signupform.handleChange} value={signupform.values.email} />
                        <label className="text-lg">Password</label>
                        <TextInput name="password" required placeholder="Enter Password" type="password" size="small" className="margin-vt" onChange={signupform.handleChange} value={signupform.values.password} />
                        <label className="text-lg">Confirm Password</label>
                        <TextInput name="confirmpassword" required placeholder="Re-Enter Password" type="password" size="small" className="margin-vt" onChange={signupform.handleChange} value={signupform.values.confirmpassword} />
                        <label className="text-lg">Avatar</label><br />
                        <input required type="file" accept="image/gif, image/jpeg, image/png, image/jpg" onChange={uploadFile} className="mb-4" />

                        <Button disabled={signupform.isSubmitting} type="submit" className="my-3 w-full" color="purple" >
                            {
                                signupform.isSubmitting ? (
                                    <>
                                        Loading...
                                    </>
                                ) : <>
                                    <HowToReg className="me-2" /> Submit
                                </>
                            }
                        </Button>
                        <p className="mt-3">Already have an account?<Link href='/login'><span className="ms-2" style={{ color: 'blue' }}>Login</span></Link></p>
                    </form>
                </Paper>
            </Box>
        </div>
    )
} 