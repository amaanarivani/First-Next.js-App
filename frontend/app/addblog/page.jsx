'use client'
import { useFormik } from "formik";
import { Box, Button, Paper, TextField, TextareaAutosize, Textarea } from '@mui/material';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation'


export default function AddBlog() {
    const router = useRouter();
    const [selFile, setSelFile] = useState('');
    const [convertedFile, setConvertedFile] = useState('');

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
            blogFile : '',
        },
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            values.blogFile = selFile;
            setTimeout(() => {
                console.log(values);
                console.log(values.blogFile);
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
                    title: 'Blog Added Successfully',
                })
                    .then((result) => {
                        router.push('http://localhost:3000/', { scroll: false })

                    }).catch((err) => {

                    });
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
        fd.append('blogFile', converted);

        const res = await fetch('http://localhost:5000/utils/uploadfile', {
            method: 'POST',
            body: JSON.stringify({blogFile: converted}),
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
        setSelFile({ ...selFile, blogFile: base64 });
        // uploadFile();
      };
    return <div className="pt-20">
        <Box className='w-1/2 p-8 m-auto'>
            <Paper elevation={16} className="p-10">
                <h1 className="font-bold text-3xl text-center my-3">Add your Blogs here!</h1>
                <form onSubmit={Blog.handleSubmit}>
                    <label className="text-lg">Title</label>
                    <TextField required fullWidth className="margin-vt" name="title" label="Enter Title" variant="outlined" size="small" onChange={Blog.handleChange} value={Blog.values.title} />
                    <label className="text-lg mb-10">Description</label><br />
                    <TextareaAutosize required style={{ width: "100%" }} name="description" minRows={3} placeholder="Enter Description" className="margin-vt" onChange={Blog.handleChange} value={Blog.values.description} />
                    <label className="text-lg">Blog Image</label><br />
                    <input type="file" onChange={uploadFile} />
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