'use client'
import UseAppContext from "@/component/UseContext"
import { Box, Button, CircularProgress, Paper, TextField, TextareaAutosize, DatePicker } from "@mui/material";
import axios from "axios";
import { Form, Formik } from "formik";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

function UpdateBlog() {
    const { currentUser } = UseAppContext();
    console.log(currentUser);

    const searchParams = useSearchParams()
    const blogid = searchParams.get('blogid');
    const router = useRouter();
    const [singleBlog, setSingleBlog] = useState(null);
    const [blogUser, setBlogUser] = useState();
    
    const fetchSingleBlogData = async () => {
        try {
            const res = await axios.get(`${process.env.backend}/blog/getsingleblog/${searchParams.get('blogid')}`);
            let singleBlogdata = res.data.finalResult;
            let userData = res.data.userResult;
            console.log(singleBlogdata);
            console.log(userData);
            setSingleBlog(singleBlogdata);
            setBlogUser(userData);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchSingleBlogData();
    }, [blogid]);

    useEffect(() => {
        let user = JSON.parse(sessionStorage.getItem('user'));

        console.log(singleBlog?.userId);

        if (singleBlog && (user?._id !== singleBlog?.userId || !user)) {
            toast.error("You can only update your created blogs")
            router.back()
        }
    }, [singleBlog])

    const submitForm = async (values, { setSubmitting }) => {
        console.log(values);
        const res = await fetch(`${process.env.backend}/blog/update/${blogid}`, {
            method: 'PUT',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(res.status);

        if (res.status === 200) {
            toast.success("Blog Updated Successfully")
            router.back()
        }
        setSubmitting(false);
    }

    return <div className="bg-body">
        <Box className='md:w-1/2 sm:w-4/5 p-8 m-auto'>
            <Paper elevation={16} className="p-10">
                <h1 className="font-bold text-3xl text-center my-3">Update your Blogs here!</h1>
                {
                    singleBlog !== null ? (
                        <Formik initialValues={singleBlog} onSubmit={submitForm}>
                            {(singleBlog) => (
                                <form onSubmit={singleBlog.handleSubmit}>
                                <label className="text-lg">Title</label>
                                <TextField required fullWidth className="margin-vt" name="title" label="Enter Title" variant="outlined" size="small" onChange={singleBlog.handleChange} value={singleBlog?.values?.title} />
                                <label className="text-lg mb-10">Description</label><br />
                                <TextareaAutosize required style={{ width: "100%" }} name="description" minRows={3} placeholder="Enter Description" className="margin-vt" onChange={singleBlog.handleChange} value={singleBlog?.values?.description} />
                                <label className="text-lg">Date</label><br />
                                <input type="date" name="createdAt" onChange={singleBlog.handleChange} value={singleBlog?.values?.createdAt} />
                                <Button fullWidth disabled={singleBlog.isSubmitting} type='submit' style={{ backgroundColor: 'black', color: 'white', marginTop: '2rem' }}>
                                    {
                                        singleBlog.isSubmitting ? (
                                            <>
                                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: '10px' }}></span>Loading...
                                            </>
                                        ) : 'Submit'
                                    }</Button>
                            </form>
                            )}
                        </Formik>
                    ) : <CircularProgress style={{float: 'center'}} size='1.5rem' color='success' />
                }
            </Paper>
        </Box>
    </div>
}

export default function RenderedPage(){
    return <Suspense>
        <UpdateBlog/>
    </Suspense>
};