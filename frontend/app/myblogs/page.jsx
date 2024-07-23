'use client'

import UseAppContext from "@/component/UseContext";
import { Comment, Description, Person, Telegram, ThumbUpAlt, Visibility } from "@mui/icons-material";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { Card } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';


export default function MyBlogs() {

    const [myblogData, setMyblogData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

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

    const fetchMyblogData = async () => {
        console.log(currentUser?._id, " cudsbns");
        try {
            const res = await axios.post(`${process.env.backend}/blog/getbyid`, {
                userId: currentUser?._id
            });
            console.log(res, " res");
            console.log(res.status);
            console.log(res.data.data);
            setMyblogData(res.data.data);
            console.log(myblogData, " myblog");
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (currentUser?._id) {
            fetchMyblogData();
        }
    }, [currentUser?._id]);

    const displayData = () => {
        if (!isLoading) {
            return (
                <div className="p-5">
                    {
                        (myblogData.length > 0) ? (
                            <>
                                <Box className='w-full grid md:grid-cols-3 sm:grid-cols-1 gap-x-8 p-3'>
                                    {
                                        myblogData?.map((myblog) => {
                                            return <div>
                                                <Link href={`/singleblog?blogid=${myblog._id}`}>
                                                    <Card className="mb-5" style={{ backgroundColor: "#EEEEEE" }}>
                                                        <h3 className="text-xl font-bold mb-2">{myblog?.title}</h3>
                                                        <img src={myblog.blogFile} alt="" className="object-cover w-full h-44" />
                                                        <div className="mt-4 inline-flex">
                                                            {
                                                                currentUser?.myFile ? (
                                                                    <img className="w-10 h-10 rounded-full" src={currentUser?.myFile} alt="" />

                                                                ) : <img className="w-8 h-7 rounded-full" src="./User image.png" alt="" />
                                                            }
                                                            <font className="font-bold mx-2">{currentUser?.firstname}</font>
                                                            <ThumbUpAlt fontSize="medium" className="me-1" /><font className='font-medium'>{myblog?.likeCount} </font>
                                                            <Comment fontSize="medium" className="ms-2" /><font className='font-medium ms-1'>{myblog?.commentCount} </font>
                                                            <Visibility fontSize="medium" className="ms-2" /><font className='font-medium ms-1'>{myblog?.viewCount} </font>
                                                        </div>
                                                        <p className="my-2 text-large"><Description /><font className='ms-4'>{myblog?.description.substring(0, 30)}......</font></p>
                                                    </Card>
                                                </Link>
                                            </div>
                                        })
                                    }
                                </Box>
                            </>
                        ) : <>
                            {/* <div>
                            <img src="https://www.kpriet.ac.in/asset/frontend/images/nodata.png" className="m-auto w-3/5" alt="" />
                        </div> */}
                            <h1 className="text-center text-4xl font-bold mt-40">No Blogs Found Please Add Some...</h1>
                        </>
                    }
                </div>
            )
        } else {
            return <div>
                <h1 className="pt-36 text-center font-bold text-3xl">Loading</h1>
                <img src="https://usagif.com/wp-content/uploads/loading-87.gif" alt="" className='md:w-1/3 sm:1/2  block m-auto pt-20' />
            </div>
        }
    }
    return <div className="container">
        {displayData()}
    </div>

}