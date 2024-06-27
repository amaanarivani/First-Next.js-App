'use client'
import { useFormik } from "formik";
import { Box, Button, Paper, TextField, TextareaAutosize, Textarea } from '@mui/material';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation'


export default function AddBlog() {
    const router = useRouter()

    const [currentUser, setCurrentUser] = useState(
        JSON.parse(sessionStorage.getItem('user'))
    );
    console.log(currentUser);

    useEffect(() => {
        let user = JSON.parse(sessionStorage.getItem('user'));
        // console.log(user, "inside use effect");
        if (!user) {
            Swal.fire({
                icon: 'error',
                title: 'Not Permitted!',
                text: 'Please Login to continue.'
            });
            router.push("/login")
        }
    }, [])

    const Blog = useFormik({
        initialValues: {
            title: '',
            description: '',
        },
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            setTimeout(() => {
                console.log(values);
                setSubmitting(false);
            }, 3000);

            // send the data to the server
            const res = await fetch('http://localhost:5000/blog/add', {
                method: 'POST',
                body: JSON.stringify({
                    values, userId: currentUser._id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(res.status);
            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Task Added Successfully',
                })
                    .then((result) => {
                        router.push('http://localhost:3000/', { scroll: false })

                    }).catch((err) => {

                    });
            }
        },
    });
    return <div className="pt-20">
        <Box className='w-1/2 p-8 m-auto'>
            <Paper elevation={16} className="p-10">
                <h1 className="font-bold text-3xl text-center my-3">Add your Blogs here!</h1>
                <form onSubmit={Blog.handleSubmit}>
                    <label className="text-lg">Title</label>
                    <TextField required fullWidth className="margin-vt" name="title" label="Enter Title" variant="outlined" size="small" onChange={Blog.handleChange} value={Blog.values.title} />
                    <label className="text-lg mb-10">Description</label><br />
                    {/* <TextField className="margin-vt"  name="description" required fullWidth  label="Enter Description" variant="outlined" size="small" onChange={Blog.handleChange} value={Blog.values.description}  /> */}
                    <TextareaAutosize required style={{ width: "100%" }} name="description" minRows={3} placeholder="Enter Description" className="margin-vt" onChange={Blog.handleChange} value={Blog.values.description} />
                    <Button fullWidth disabled={Blog.isSubmitting} type='submit' style={{ backgroundColor: 'black', color: 'white', marginTop: '2rem' }}>
                        {
                            Blog.isSubmitting ? (
                                <>
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: '10px' }}></span>Loading...
                                </>
                            ) : 'Submit'
                        }</Button>
                </form>
            </Paper>
        </Box>
    </div>
}