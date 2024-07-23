'use client'
import UseAppContext from "@/component/UseContext";
import { Comment, Delete, Edit, EditNote, Event, MoreVert, Navigation, NearMe, Person, Send, Telegram, ThumbUpAlt, Update, Visibility } from "@mui/icons-material";
import { Box, CircularProgress, Paper, } from "@mui/material";
import axios from "axios";
import { Card, Dropdown, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation"
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from "react";
import { Button } from "flowbite-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
// import { confirmAlert } from '@sweetalert2/react';


function SingleBlog() {

    // const { loggedIn, logout, currentUser } = UseAppContext();
    const [isCommenting, setIsCommenting] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editCommentId, setEditCommentId] = useState();
    const [editedComment, setEditedComment] = useState("");

    const searchParams = useSearchParams();
    const blogid = searchParams.get('blogid');
    const router = useRouter();

    const [singleBlog, setSingleBlog] = useState();
    // const [isLoading, setIsLoading] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [blogCommentData, setblogCommentData] = useState([]);


    const [blogUser, setBlogUser] = useState();

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
            const res = await axios.get(`${process.env.backend}/blog/get-comment/${searchParams.get('blogid')}`);
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
            const res = await fetch(`${process.env.backend}/blog/delete/${blogid}`, { method: 'DELETE' });
            if (res.status === 200) {
                toast.success("Blog deleted Successfully")
                router.back();
                console.log('task deleted');
                fetchSingleBlogData();
            }
        } catch (error) {

        }
    }
    console.log(loggedIn);

    const deleteBlogAlert = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this blog?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBlog(singleBlog?._id)
            }
        });
    }

    const deleteAndUpdateButton = () => {
        if (currentUser?._id == singleBlog?.userId) {
            return (
                <>
                    <div className="inline-flex mt-3">
                        <Button size="sm" className="mx-3 mt-3" outline gradientDuoTone="purpleToPink" onClick={() => { deleteBlogAlert() }}><Delete fontSize="medium" />Delete Blog</Button>
                        <Button size="sm" className="mt-3" outline gradientDuoTone="purpleToPink" onClick={() => { router.push(`/updateblog?blogid=${singleBlog?._id}`) }}><Edit fontSize="medium" />Update Blog</Button>
                    </div>

                </>
            )
        }
    }

    const blogComment = useFormik({
        initialValues: {
            comment: ""
        },
        onSubmit: async (comment, { setSubmitting, resetForm }) => {
            try {
                const trimmedComment = comment.comment.trim();
                console.log(comment, " comment adding");
                if (!trimmedComment) {
                    return toast.error("Comment can't be empty")
                }
                setSubmitting(true);
                setTimeout(() => {
                    console.log(trimmedComment);
                    setSubmitting(false);
                }, 5000);

                //send data to server

                const res = await axios.post(`${process.env.backend}/blog/blog-comment`, {

                    commentOn: singleBlog._id,
                    commentBy: currentUser._id,
                    comment: trimmedComment

                })
                if (res.status === 200) {
                    toast.success("Comment Added")
                    resetForm();
                }
                setblogCommentData((e => {
                    return [...e, res.data.data];
                }));
                setIsCommenting(false);
                console.log(res + "comment done");
            } catch (error) {
                console.log(error);
                setIsCommenting(false);
            }
        }
    });

    const deleteComment = async (commentId, commentBy) => {
        console.log(commentId + " comment id");
        console.log(commentBy + " commentBy");
        if (currentUser?._id == commentBy || currentUser?._id == singleBlog?.userId) {
            try {
                const res = await axios.delete(`${process.env.backend}/blog/delete-comment/${commentId}`)
                if (res.status == 200) {
                    toast.success("Comment Deleted")
                }
                setblogCommentData(e => {
                    return e.filter(singleComment => singleComment._id != commentId)
                });
                console.log('comment deleted');
            } catch (error) {
                console.log(error);
            }
        }
    }

    const deleteCommentAlert = (commentId, commentBy) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this comment?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteComment(commentId, commentBy)
            }
        });
    }

    const editComment = async (commentId, editedComment) => {
        try {
            const res = await axios.put(`${process.env.backend}/blog/update-comment/${commentId}`, {
                comment: editedComment
            })
            if (res.status == 200) {
                toast.success("Comment Updated")
                setIsEdit(false);
                setblogCommentData(e => e.map((singleComment) => {
                    if (singleComment._id == commentId) {
                        return { ...singleComment, comment: editedComment }
                    } else { return singleComment }
                }));
                console.log(res + " updated comment");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const likeBlog = async (blogId, userId) => {
        console.log(blogId, 'blog liked');
        setIsLikeLoading(true);
        if (currentUser == null) {
            toast.success("Please Login to continue")
            router.push('/login');
        }
        try {
            const res = await axios.post(`${process.env.backend}/blog/blog-like`, {
                blogId,
                userId
            })
            // console.log(blogData + "blogdata");
            setSingleBlog((e => {
                if (e._id == blogId) {
                    return { ...e, likeCount: e.likeCount + 1, likedBy: currentUser?._id ? [...e.likedBy, currentUser._id] : e.likedBy }
                } else { return e }
            }));
            setIsLikeLoading(false);
            // console.log(res + 'like');
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
            return <div className="p-10">
                <div className="">
                    {/* <h1 className="text-center font-bold text-3xl pb-8">Blog Details</h1> */}
                    <div className="grid md:grid-cols-3 sm:grid-cols-1">
                        <div className="">
                            {deleteAndUpdateButton()}
                        </div>
                        <div className="md:col-span-2">
                            <h1 className="mt-6 ms-6 font-bold text-3xl"><font className='text-gray-700'>{singleBlog?.title}</font></h1>
                        </div>
                    </div>
                    <div className="mt-8">
                        {
                            blogUser.myFile ? (
                                <img className="w-10 h-10 rounded-full inline-flex" src={blogUser?.myFile} />
                            ) : <img className="w-11 h-10 rounded-full inline-flex" src="./User image.png" />
                        }
                        <font className="ms-2 mt-1 font-bold text-xl">{blogUser?.firstname + " " + blogUser?.lastname}</font>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-6 my-5">
                    <div>
                        <img src={singleBlog?.blogFile} alt="" className="img-fluid" />
                        <div className="mt-1 w-full md:grid grid-cols-2 sm:grid-cols-1">
                            <div className="">
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
                                    <Comment fontSize="large" />
                                </button>


                                <font className='font-bold text-xl mx-2'>{singleBlog?.viewCount}</font>
                                <Visibility fontSize="large" className="mb-1" />
                            </div>
                            <div className="mt-2">
                                <Event className="mx-4" fontSize="large" />
                                <font className='mt-4 text-xl font-bold text-gray-900'>{DateTime.fromISO(singleBlog?.createdAt).toFormat('LLL dd, yyyy, HH:mm')}</font>
                            </div>
                        </div>
                        <p className="mt-5 text-xl text-gray-900">{singleBlog?.description}</p>
                    </div>
                    <div className="">
                        <Box className=''>
                            <Card className="p-5 w-full" style={{ backgroundColor: '#EEEEEE' }}>
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
                                                    <img src="./User image.png" className="inline-flex rounded-full w-12 h-11" alt="" />
                                                </>
                                            }

                                            <p className="inline-flex text-lg ms-2">{blogComment?.userResult?.firstname}</p>
                                            {
                                                ((currentUser?._id == blogComment?.commentBy) || (currentUser?._id == singleBlog?.userId)) ? (
                                                    <>
                                                        <div className="inline-flex">
                                                            <Dropdown label={<MoreVert fontSize="small" className="mt-2" />} arrowIcon={false} inline >
                                                                <Dropdown.Item onClick={() => { deleteCommentAlert(blogComment?._id, blogComment?.commentBy) }}>Delete</Dropdown.Item>
                                                                <Dropdown.Item onClick={() => { setIsEdit(true), setEditCommentId(blogComment?._id) }}>Edit</Dropdown.Item>
                                                            </Dropdown>
                                                        </div>
                                                    </>
                                                ) : <>
                                                </>
                                            }
                                            {
                                                (isEdit && (currentUser?._id == blogComment?.commentBy) && (blogComment._id == editCommentId)) ? (
                                                    <>
                                                        <div className="">
                                                            <TextInput className='w-1/2 my-2 ms-4 inline-flex' onChange={(e) => setEditedComment(e.target.value)} placeholder={blogComment?.comment} />
                                                            <Button className="ms-2 inline-flex" color="blue" onClick={() => editComment(editCommentId, editedComment)}>Edit</Button>
                                                        </div>
                                                    </>
                                                ) : <>
                                                    <p className="mb-7 ms-12 text-medium">{blogComment?.comment}</p>
                                                </>
                                            }

                                        </div>
                                    })
                                }
                                {
                                    currentUser ? (
                                        <>
                                            <div className="w-full">
                                                <form onSubmit={blogComment.handleSubmit} className="">
                                                    <label for="message" className="block mb-2 font-bold text-md text-gray-900 dark:text-white">Your Comments</label>
                                                    <textarea required name="comment" onChange={blogComment.handleChange} value={blogComment?.values?.comment} id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your Comment here..." />
                                                    <button disabled={blogComment.isSubmitting} type="submit" className="p-2 rounded mt-4 text-white bg-blue-700 hover:bg-blue-800">
                                                        {
                                                            blogComment.isSubmitting ? (
                                                                <>
                                                                    <font className='mx-3'>Loading....</font>
                                                                </>
                                                            ) :
                                                                <>
                                                                    <font className='me-2'>Send</font><NearMe />
                                                                </>
                                                        }

                                                    </button>
                                                </form>
                                            </div>
                                        </>
                                    ) : ""
                                }
                            </Card>
                        </Box>
                    </div>
                </div>
            </div>
        } else {
            return <div>
                <h1 className="pt-20 text-center font-bold text-3xl">Loading</h1>
                <img src="https://usagif.com/wp-content/uploads/loading-87.gif" alt="" className='md:w-1/3 sm:1/2 block m-auto pt-20' />
            </div>
        }
    }


    return <div className="">
        {displayData()}
    </div>
}

export default function Page() {
    return <Suspense>
        <SingleBlog />
    </Suspense>
}