'use client'
import UseAppContext from "@/component/UseContext";
import { AccountCircle, Delete, Edit, EditNote, Event, Person, Update } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation"
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from "react";
import Swal from "sweetalert2";

function SingleBlog() {

    const { loggedIn, logout, currentUser } = UseAppContext();

    // const [currentUser, setCurrentUser] = useState(
    //     JSON.parse(sessionStorage.getItem('user'))
    // );
    console.log(currentUser);

    const searchParams = useSearchParams()
    const blogid = searchParams.get('blogid');
    const router = useRouter();

    const [singleBlog, setSingleBlog] = useState();
    const fetchSingleBlogData = async () => {
        const res = await fetch(`http://localhost:5000/blog/getsingleblog/${blogid}`);
        if (res.status === 200) {
            const data = await res.json();
            console.log(data);
            setSingleBlog(data);
        }
    };

    useEffect(() => {
        fetchSingleBlogData();
    }, [blogid]);

    const deleteBlog = async () => {
        try {
            const res = await fetch(`http://localhost:5000/blog/delete/${blogid}`, { method: 'DELETE' });
            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Task deleted Successfully',
                });
                router.back();
                console.log('task deleted');
                fetchSingleBlogData();
            }
        } catch (error) {

        }
    }
    console.log(loggedIn);
    console.log(singleBlog?.userData.myFile);

    const displayAvatar = () => {
        if (singleBlog?.userData.myFile !== undefined) {
            return <>
            <div className="grid grid-cols-3 w-1/5">
            <div>
            <img className="w-12 h-12 rounded-full" src={singleBlog?.userData?.myFile} />
            </div>
            <div className="col-span-2 mt-2">
            <h2 className="font-bold text-xl">{currentUser?.firstname + currentUser?.lastname}</h2>
            </div>
            </div>
                 
            </>
        } else {
            return <>
                <Person fontSize="large" /><font className=" ms-4 font-bold text-xl">{singleBlog?.userData?.name}</font>
            </>
        }
    }

    const deleteAndUpdateButton = () => {
        if (currentUser?._id == singleBlog.userId) {
            return (
                <>
                    <div className="">
                        <Button  color="error" onClick={() => { deleteBlog(singleBlog._id) }} style={{}}><Delete fontSize="large"/></Button>
                        <Button  color="success" onClick={() => { router.push(`/updateblog?blogid=${singleBlog._id}`) }}><Edit fontSize="large"/></Button>
                    </div>

                </>
            )
        }
    }

    const displayData = () => {
        if (singleBlog) {
            return <div className="pt-10">
                <div className="ms-20">
                    {/* <div className="grid grid-cols-2 mb-10">
                        <div className="">
                            <h1 className="text-center font-bold text-3xl">Blog Details</h1>
                        </div>
                        <div className="">
                            {deleteAndUpdateButton()}
                        </div>
                    </div> */}
                    <h1 className="text-center font-bold text-3xl">Blog Details</h1>
                    <div className="grid grid-cols-3 w-1/2">
                        <div>
                        <h1 className="mt-3 font-bold text-3xl"><font className='text-gray-700'>{singleBlog?.title}</font></h1>
                        </div>
                        <div className="col-span-2 mt-2">
                        {deleteAndUpdateButton()} 
                        </div>
                    </div>
                    
                    <p className="text-xl mt-10"><font className='font-bold'>Description :</font> <font className='text-gray-900'>{singleBlog?.description}</font></p>
                    <p className="text-xl mt-10"><Event fontSize='large' className="me-3" /> <font className='text-gray-900'>{new Date(singleBlog?.createdAt).toLocaleDateString()}</font></p>
                    <div className="mt-8">{displayAvatar()}</div>
                </div>
            </div>
        } else {
            return <div>
                <h1 className="pt-20 text-center font-bold text-3xl">Loading <CircularProgress size='1.5rem' color='success' /></h1>
                <img src="https://usagif.com/wp-content/uploads/loading-87.gif" alt="" className='w-1/3 block m-auto pt-20' />
            </div>
        }
    }


    return <div className="pt-20">
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