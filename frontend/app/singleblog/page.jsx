'use client'
import UseAppContext from "@/component/UseContext";
import { AccountCircle, Delete, Edit, EditNote, Event, Person, Update, Visibility } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation"
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from "react";
import Swal from "sweetalert2";

function SingleBlog() {

    const { loggedIn, logout, currentUser } = UseAppContext();
    console.log(currentUser);

    const searchParams = useSearchParams()
    const blogid = searchParams.get('blogid');
    const router = useRouter();

    const [singleBlog, setSingleBlog] = useState();
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
        console.log(blogid);
        if (searchParams.get('blogid') && !singleBlog) {
            fetchSingleBlogData();
        }
    }, [searchParams, singleBlog]);

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

    const displayAvatar = () => {
        if (blogUser?.myFile !== undefined) {
            return <>
                <div className="inline-flex">
                    <img className="w-12 h-12 rounded-full me-3" src={blogUser?.myFile} />
                    <font className="font-bold text-xl">{blogUser?.firstname + blogUser?.lastname}</font>
                </div>
            </>
        } else {
            return <>
                <Person fontSize="large" /><font className=" ms-4 font-bold text-xl">{blogUser?.firstname + blogUser?.lastname}</font>
            </>
        }
    }

    const deleteAndUpdateButton = () => {
        if (currentUser?._id == singleBlog.userId) {
            return (
                <>
                    <div className="">
                        <Button color="error" onClick={() => { deleteBlog(singleBlog._id) }}><Delete fontSize="large" /></Button>
                        <Button color="success" onClick={() => { router.push(`/updateblog?blogid=${singleBlog._id}`) }}><Edit fontSize="large" /></Button>
                    </div>

                </>
            )
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
                            <div className="float-right me-5 mt-5">
                                <Visibility fontSize="large" /><font className='font-bold ms-2'>{singleBlog?.viewCount} Views</font>
                            </div>
                        </div>
                        <div className="ml-5">
                            <p className="text-xl"><font className='font-bold'>Description :</font> <font className='text-gray-900'>{singleBlog?.description}</font></p>
                            <p className="text-xl mt-10"><Event fontSize='large' className="me-3" /> <font className='text-gray-900'>{new Date(singleBlog?.createdAt).toLocaleDateString()}</font></p>
                            <div className="mt-8">{displayAvatar()}</div>
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