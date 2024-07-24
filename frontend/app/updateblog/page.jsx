'use client'
import UseAppContext from "@/component/UseContext"
import { Box, Button, CircularProgress, Paper, TextField, TextareaAutosize, DatePicker } from "@mui/material";
import axios from "axios";
import { TextInput, Textarea} from "flowbite-react";
import { Form, Formik } from "formik";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

function UpdateBlog() {

    const searchParams = useSearchParams()
    const blogid = searchParams.get('blogid');
    const router = useRouter();
    const [singleBlog, setSingleBlog] = useState(null);
    const [blogUser, setBlogUser] = useState();
    const [selFile, setSelFile] = useState('');
    const [isValid, setIsValid] = useState(false);

    const { loggedIn, logout, currentUser, setCurrentUser, loadingData } = UseAppContext();
    console.log(currentUser);

    console.log(currentUser, " current user");
    useEffect(() => {
        console.log(currentUser, " current user data ");
        if (!currentUser && !loadingData) {
            toast.error("Please Login to continue")
            router.push("/login")
        }
    }, [loadingData, currentUser]);

    const fetchSingleBlogData = async () => {
        try {
            const res = await axios.get(`${process.env.backend}/blog/getsingleblog/${searchParams.get('blogid')}`);
            let singleBlogdata = res.data.finalResult;
            let userData = res.data.userResult;
            console.log(singleBlogdata);
            console.log(userData);
            setSingleBlog(singleBlogdata);
            setBlogUser(userData);
            setSelFile(singleBlog?.blogFile)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchSingleBlogData();
    }, [blogid]);

    useEffect(() => {
        // let user = JSON.parse(sessionStorage.getItem('user'));

        console.log(singleBlog?.userId);

        if (singleBlog && (currentUser?._id !== singleBlog?.userId || !currentUser)) {
            toast.error("You can only update your created blogs")
            router.back()
        }
    }, [singleBlog])

    const validateImage = (filename) => {
        const allowedExt = ["png", "jpeg", "jpg", "gif", "webp"];

        // Get the extension of the uploaded file
        const ext = filename.split('.');
        const extension = ext[1];

        //Check if the uploaded file is allowed
        return allowedExt.includes(extension);
    };

    const uploadFile = async (e) => {
        if (!e.target.files) return;

        let file = e.target.files[0];
        console.log(file.name, " blog file");
        const isFileValid = validateImage(file.name);
        console.log(isFileValid, "validation result");

        if (isFileValid) {
            let converted = await convertToBase64(file);
            console.log(converted);
            console.log(file, 'abc');
            setSelFile(converted);
        }

        setIsValid(isFileValid);
        console.log(isFileValid, "final validation result");
        console.log(isValid, "updated state value");
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

    const submitForm = async (values, { setSubmitting }) => {
        try {
            values.title = values.title.trim();
            values.description = values.description.trim();
            if(!values.title || !values.description){
                return toast.error("Blog title or description can't be empty")
            }
            if (!isValid) {
                return toast.error("Invalid File");
            }
            const res = await axios.post(`${process.env.backend}/blog/update`, {
                Title: values.title,
                Description: values.description,
                myFile: selFile,
                blogId: singleBlog?._id
            });
            console.log(res.status);
            if (res.status === 200) {
                toast.success("Blog Updated Successfully")
                router.back()
            }
            setSubmitting(false);

        } catch (error) {
            console.log(error);
        }
    }

    return <div className="bg-body pb-60">
        <Box className='md:w-1/2 sm:w-4/5 p-8 m-auto'>
            <Paper elevation={16} className="p-10">
                <h1 className="font-bold text-3xl text-center my-3">Update your Blogs here!</h1>
                {
                    singleBlog !== null ? (
                        <Formik initialValues={singleBlog} onSubmit={submitForm}>
                            {(singleBlog) => (
                                <form onSubmit={singleBlog.handleSubmit}>
                                    <label className="text-lg">Title</label>
                                    <TextInput required className="margin-vt" name="title" placeholder="Enter Title" onChange={singleBlog.handleChange} value={singleBlog?.values?.title} />
                                    <label className="text-lg mb-10">Description</label><br />
                                    <Textarea required style={{ width: "100%" }} name="description" rows={3} placeholder="Enter Description" className="margin-vt" onChange={singleBlog.handleChange} value={singleBlog?.values?.description} />
                                    <label className="text-lg">Blog Image</label><br />
                                    <input type="file" onChange={uploadFile} className="mb-4" />
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
                    ) : <CircularProgress style={{ float: 'center' }} size='1.5rem' color='success' />
                }
            </Paper>
        </Box>
    </div>
}

export default function RenderedPage() {
    return <Suspense>
        <UpdateBlog />
    </Suspense>
};