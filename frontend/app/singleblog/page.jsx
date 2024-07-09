'use client'
import UseAppContext from "@/component/UseContext";
import { AccountCircle, Comment, Delete, Edit, EditNote, Event, Person, Telegram, ThumbUpAlt, Update, Visibility } from "@mui/icons-material";
import { Box, Button, CircularProgress, Paper, } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
import { useSearchParams } from "next/navigation"
import { useRouter } from 'next/navigation';
import { comment } from "postcss";
import { Suspense, useEffect, useState } from "react";
import Swal from "sweetalert2";

function SingleBlog() {

    const { loggedIn, logout, currentUser } = UseAppContext();
    const [userComment, setUserComment] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);
    console.log(currentUser);

    const searchParams = useSearchParams()
    const blogid = searchParams.get('blogid');
    const router = useRouter();

    const [singleBlog, setSingleBlog] = useState();
    // const [isLoading, setIsLoading] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [blogCommentData, setblogCommentData] = useState([]);


    const [blogUser, setBlogUser] = useState();
    const fetchSingleBlogData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/blog/getsingleblog/${searchParams.get('blogid')}`);
            let singleBlogdata = res.data.finalResult;
            let userData = res.data.userResult
            console.log(singleBlogdata);
            console.log(userData);
            setSingleBlog(singleBlogdata);
            setBlogUser(userData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // console.log(blogid);
        if (searchParams.get('blogid') && !singleBlog) {
            fetchSingleBlogData();
        }
    }, [searchParams, singleBlog]);

    const fetchCommentData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/blog/get-comment/${searchParams.get('blogid')}`);
            console.log(res);
            let commentData = res.data.finalResult;
            console.log(commentData);
            setblogCommentData(commentData);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchCommentData()
    }, []);

    const deleteBlog = async () => {
        try {
            const res = await fetch(`http://localhost:5000/blog/delete/${blogid}`, { method: 'DELETE' });
            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Blog deleted Successfully',
                });
                router.back();
                console.log('task deleted');
                fetchSingleBlogData();
            }
        } catch (error) {

        }
    }
    console.log(loggedIn);


    const deleteAndUpdateButton = () => {
        if (currentUser?._id == singleBlog?.userId) {
            return (
                <>
                    <div className="">
                        <Button color="error" onClick={() => { deleteBlog(singleBlog._id) }}><Delete fontSize="large" /></Button>
                        <Button color="success" onClick={() => { router.push(`/updateblog?blogid=${singleBlog?._id}`) }}><Edit fontSize="large" /></Button>
                    </div>

                </>
            )
        }
    }

    const blogComment = useFormik({
        initialValues: {
            comment: ''
        },
        onSubmit: async (comment, { setSubmitting , resetForm}) => {
            setSubmitting(true);
            setTimeout(() => {
                console.log(comment);
                setSubmitting(false);
            }, 3000);

            try {
                const res = await axios.post("http://localhost:5000/blog/blog-comment", {

                    commentOn: singleBlog._id,
                    commentBy : currentUser._id,
                    comment
                    
                })
                if (res.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Comment Recorded Successfully',
                    });
                    resetForm();
                    // router.push(`/singleblog?blogid=${blogid}`);
                }
                setblogCommentData((e => {
                    // if (e._id == singleBlog._id) {
                    //     console.log(e, "finddddd");
                    //     // let newlikedByList = [e.likedBy]
                    //     return { ...e, comment : e.comment}
                    // } else { return e }
                    return[...e, res.data.data];
                }));
                setIsCommenting(false);
                console.log(res + "comment done");
            } catch (error) {
                console.log(error);
                setIsCommenting(false);
            }
        }
    });

    const likeBlog = async (blogId, userId) => {
        console.log(blogId, 'blog liked');
        setIsLikeLoading(true);
        if (currentUser == null) {
            return Swal.fire({
                icon: 'error',
                title: 'Not Permitted!',
                text: 'Please Login to continue.',
            })
                .then(() => {
                    router.push('/login');

                })
        }
        try {
            const res = await axios.post("http://localhost:5000/blog/blog-like", {
                blogId,
                userId
            })
            console.log(blogData + "blogdata");
            setSingleBlog(previous => { previous }, (e => {
                if (e._id == blogId) {
                    console.log(e, "finddddd");
                    // let newlikedByList = [e.likedBy]
                    return { ...e, likeCount: e.likeCount + 1, likedBy: currentUser?._id ? [...e.likedBy, currentUser._id] : e.likedBy }
                } else { return e }
            }));
            setIsLikeLoading(false);
            console.log(res + 'like');
        } catch (error) {
            setSingleBlog(previous => { previous }, (e => {
                if (e._id == blogId) {
                    console.log(e, "finddddd");
                    return { ...e, likeCount: e.likeCount - 1, likedBy: currentUser?._id ? e.likedBy.filter(sId => (sId != currentUser._id)) : e.likedBy }
                } else { return e }
            }));
            setIsLikeLoading(false);
        }
    };

    const displayData = () => {
        if (singleBlog) {
            return <div className="pt-10">
                <div className="ms-20">
                    <h1 className="text-center font-bold text-3xl mb-4">Blog Details</h1>
                    {/* <div className="grid grid-cols-3 w-1/2"> */}
                    <div className="inline-flex">
                        <h1 className="mt-3 font-bold text-3xl"><font className='text-gray-700'>{singleBlog?.title}</font></h1>
                    </div>
                    <div className="inline-flex">
                        {deleteAndUpdateButton()}
                    </div>
                    <div className="inline-flex ms-12">
                        {/* <Event fontSize='medium' className="mt-3" />*/}
                        <font className='mt-4 text-xl font-bold text-gray-900'>{DateTime.fromISO(singleBlog?.createdAt).toFormat('LLL dd, yyyy, HH:mm')}</font>
                        <Event className="mt-3 ms-2 " fontSize="large" />
                    </div>
                    {/* </div> */}
                    <div className="grid grid-cols-2 mt-5">
                        <div>
                            <img src={singleBlog?.blogFile} alt="" className="img-fluid" />
                            <div className="mt-1 inline-flex w-full">
                                <div className="mt-3 inline-flex">
                                    {
                                        blogUser.myFile ? (
                                            <img className="w-12 h-12 rounded-full me-3" src={blogUser?.myFile} />
                                        ) : <Person fontSize="large" />
                                    }
                                    <font className="ms-2 mt-1 font-bold text-xl">{blogUser?.firstname + blogUser?.lastname}</font>
                                </div>
                                <div className="ms-3">
                                    <button style={{ color: (singleBlog.likedBy.includes(currentUser?._id)) ? '#1A56DB' : "grey" }} disabled={isLikeLoading} onClick={() => { likeBlog(singleBlog?._id, currentUser?._id) }} type="button" className="ms-2 text-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                                        {
                                            isLikeLoading ? (
                                                <>
                                                    <CircularProgress size='1.5rem' />
                                                </>
                                            ) :
                                                <>
                                                    <font className='font-bold text-xl mt-1'>{singleBlog?.likeCount}</font>
                                                    <ThumbUpAlt fontSize="large" />
                                                </>
                                        }
                                    </button>


                                    <button type="button" className="focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                                        <font className='font-bold text-xl me-1'>{singleBlog?.commentCount}</font>
                                        <Telegram fontSize="large" />
                                    </button>


                                    <font className='font-bold text-xl mx-2'>{singleBlog?.viewCount}</font>
                                    <Visibility fontSize="large" className="mb-1" />
                                </div>
                            </div>
                            <p className="mt-5 text-xl text-gray-900">{singleBlog?.description}</p>
                        </div>
                        <div className="">
                            <Box className='px-5'>
                                <Paper elevation={12} className="p-5 w-full">
                                    <h1 className="text-xl font-bold text-center">Comments</h1>
                                    {
                                        blogCommentData.map((blogComment) => {
                                            return <div className="">
                                                {
                                                    blogComment?.userResult?.myFile ? (
                                                        <>
                                                            <img src={blogComment?.userResult.myFile} className="inline-flex rounded-full w-12 h-12" alt="" />
                                                        </>
                                                    ) : <>
                                                        <Person fontSize="large" className="" />
                                                    </>
                                                }

                                                <p className="inline-flex ms-2">{blogComment?.userResult?.firstname}</p>
                                                <div className="inline-flex">
                                                    <button
                                                        id="dropdownMenuIconButton"
                                                        data-dropdown-toggle="dropdownDots"
                                                        className=" ms-2 inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                                        type="button"
                                                    >
                                                        <svg
                                                            className="w-4 h-4"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                            viewBox="0 0 4 15"
                                                        >
                                                            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                                        </svg>
                                                    </button>
                                                    {/* Dropdown menu */}
                                                    <div
                                                        id="dropdownDots"
                                                        className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                                                    >
                                                        <ul
                                                            className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                                            aria-labelledby="dropdownMenuIconButton"
                                                        >
                                                            <li>
                                                                <a
                                                                    href="#"
                                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                >
                                                                    Dashboard
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    href="#"
                                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                >
                                                                    Settings
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    href="#"
                                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                >
                                                                    Earnings
                                                                </a>
                                                            </li>
                                                        </ul>
                                                        <div className="py-2">
                                                            <a
                                                                href="#"
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                                            >
                                                                Separated link
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="mb-7 ms-12 text-medium">{blogComment?.comment}</p>
                                            </div>
                                        })
                                    }
                                    {
                                        currentUser ? (
                                            <>
                                                <div className="ms-4 w-4/5">
                                                    <form onSubmit={blogComment.handleSubmit} className="">
                                                        <label for="message" className="block mb-2 font-bold text-md text-gray-900 dark:text-white">Your Comments</label>
                                                        <textarea required name="comment" onChange={blogComment.handleChange} value={blogComment.values.comment} id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your Comment here..." />
                                                        <button disabled={blogComment.isSubmitting} type="submit" className="p-2 rounded mt-2 text-white bg-blue-700 hover:bg-blue-800">
                                                            {
                                                                blogComment.isSubmitting ? (
                                                                    <>
                                                                        <CircularProgress color="inherit" size='1.3rem' className="" /><font className='ms-3'>Comment</font><Telegram />
                                                                    </>
                                                                ) :
                                                                    <>
                                                                        <font>Comment</font><Telegram />
                                                                    </>
                                                            }
                                                        </button>
                                                    </form>
                                                </div>
                                            </>
                                        ) : ""
                                    }
                                </Paper>
                            </Box>
                            {/* </div> */}
                            {/* <div className="">
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        } else {
            return <div>
                <h1 className="pt-20 text-center font-bold text-3xl">Loading <CircularProgress size='1.5rem' color='success' /></h1>
                <img src="https://usagif.com/wp-content/uploads/loading-87.gif" alt="" className='w-1/3 block m-auto pt-20' />
            </div>
        }
    }


    return <div className="py-20">
        <div>
            {displayData()}
        </div>

    </div>
}

export default function Page() {
    return <Suspense>
        <SingleBlog />
    </Suspense>
}