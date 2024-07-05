'use client'
import UseAppContext from "@/component/UseContext";
import { AccountCircle, Comment, Delete, Edit, EditNote, Event, Person, Telegram, ThumbUpAlt, Update, Visibility } from "@mui/icons-material";
import { Button, CircularProgress, } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import { useSearchParams } from "next/navigation"
import { useRouter } from 'next/navigation';
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
    const [blogCommentData, setblogCommentData] = useState([]);
    const [blogCommentUser, setblogCommentUser] = useState([]);

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
            let userData = res.data.finalResult[0].userResult;
            console.log(commentData);
            console.log(userData);
            setblogCommentData(commentData);
            setblogCommentUser(userData);

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

    const blogComment = async (commentOn, commentBy, comment) => {
        setIsCommenting(true);
        try {
            const res = await axios.post("http://localhost:5000/blog/blog-comment", {
                commentOn,
                commentBy,
                comment
            })
            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Comment Recorded Successfully',
                });
                // router.push(`/singleblog?blogid=${blogid}`);
            }
            setIsCommenting(false);
            console.log(res + "comment done");
        } catch (error) {
            console.log(error);
            setIsCommenting(false);
        }
    }

    const displayData = () => {
        if (singleBlog) {
            return <div className="pt-10">
                <div className="ms-20">
                    <h1 className="text-center font-bold text-3xl">Blog Details</h1>
                    <div className="grid grid-cols-3 w-1/2">
                        <div>
                            <h1 className="mt-3 font-bold text-3xl"><font className='text-gray-700'>{singleBlog?.title}</font></h1>
                        </div>
                        <div className="col-span-2 mt-2">
                            {deleteAndUpdateButton()}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mt-5">
                        <div>
                            <img src={singleBlog?.blogFile} alt="" className="img-fluid" />
                            <div className="mt-5 inline-flex w-full">
                                <div className="">
                                    <ThumbUpAlt fontSize='large' className="me-1" /><font className='font-bold me-3'>{singleBlog?.likeCount} Likes</font>
                                    <Visibility fontSize="large" /><font className='font-bold ms-2'>{singleBlog?.viewCount} Views</font>
                                </div>
                                {
                                    currentUser ? (
                                        <>
                                            <div className="ms-4 w-3/5">
                                                <label for="message" className="block mb-2 font-bold text-md text-gray-900 dark:text-white">Your Comments</label>
                                                <textarea  onChange={(e) => { setUserComment(e.target.value) }} name="comment" id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your Comments here..." required  />
                                                <button disabled={isCommenting} onClick={() => { blogComment(singleBlog._id, currentUser._id, userComment) }} type="button" className="p-2 rounded mt-2 text-white bg-blue-700 hover:bg-blue-800">
                                                    {
                                                        isCommenting ? (
                                                            <>
                                                                <CircularProgress color="inherit" size='1.3rem' className="" /><font className='ms-3'>Comment</font><Telegram />
                                                            </>
                                                        ) :
                                                            <>
                                                                <font>Comment</font><Telegram />
                                                            </>
                                                    }
                                                </button>
                                            </div>
                                        </>
                                    ) : ""
                                }

                            </div>
                        </div>
                        <div className="ml-5">
                            <p className="text-xl"><font className='font-bold'>Description :</font> <font className='text-gray-900'>{singleBlog?.description}</font></p>
                            <p className="text-xl mt-10"><Event fontSize='large' className="me-3" /> <font className='text-gray-900'>{new Date(singleBlog?.createdAt).toLocaleDateString()}</font></p>
                            <div className="mt-8 inline-flex">
                                {
                                    blogUser.myFile ? (
                                        <img className="w-12 h-12 rounded-full me-3" src={blogUser?.myFile} />
                                    ) : <Person fontSize="large" />
                                }
                                <font className="ms-3 font-bold text-xl">{blogUser?.firstname + blogUser?.lastname}</font>
                            </div>
                            <div className="mt-5">
                            </div>
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