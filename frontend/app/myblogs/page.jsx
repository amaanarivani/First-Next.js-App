'use client'

import { AccountCircle, Description, Person, Telegram, ThumbUpAlt, Visibility } from "@mui/icons-material";
import { Box, CircularProgress, Paper } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function MyBlogs() {

    const [currentUser, setCurrentUser] = useState(
        JSON.parse(sessionStorage.getItem('user'))
    );
    console.log(currentUser);

    const [myblogData, setMyblogData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const fetchMyblogData = async () => {
        // console.log(id);
        const res = await fetch(`http://localhost:5000/blog/getbyid/${currentUser._id}`);
        console.log(res.status);

        if (res.status === 200) {
            const data = await res.json();
            console.log(data);
            setMyblogData(data);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyblogData();
    }, []);

    // console.log(currentUser?.myFile);

   

    const displayData = () => {
        if (!isLoading) {
            return <div className="pt-20">
                <h1 className="text-center font-bold text-3xl mt-8">Here are Your Blogs</h1>
                <Box className='grid grid-cols-3 gap-4 p-8 m-auto'>
                    {
                        myblogData.map((myblog) => {
                            return <div>
                                <Link href={`/singleblog?blogid=${myblog._id}`}>
                                    <Paper elevation={16} className="p-10">
                                        <h3 className="text-xl font-bold mb-2">{myblog?.title}</h3>
                                        <img src={myblog.blogFile} alt="" className="object-cover w-full h-44" />
                                        <div className="my-4">
                                            <ThumbUpAlt fontSize="medium" className="me-1" /><font className='font-medium'>{myblog?.likeCount} Likes</font>
                                            <Telegram fontSize="medium" className="ms-2" /><font className='font-medium ms-1'>{myblog?.commentCount} Comments</font>
                                            <Visibility fontSize="medium" className="ms-2" /><font className='font-medium ms-1'>{myblog?.viewCount} Views</font>
                                        </div>
                                        <p className="mb-2 text-large"><Description /><font className='ms-4'>{myblog.description.substring(0, 30)}......</font></p>
                                        <div className="mt-4 inline-flex">
                                            {
                                                currentUser?.myFile ? (
                                                    <img className="w-10 h-10 rounded-full" src={currentUser?.myFile} alt="" />

                                                ) : <Person fontSize="medium" />
                                            }
                                            <font className="font-bold ms-2">{currentUser.firstname + currentUser.lastname}</font>
                                        </div>
                                    </Paper>
                                </Link>
                            </div>
                        })
                    }
                </Box>
            </div>
        } else {
            return <div>
                <h1 className="pt-36 text-center font-bold text-3xl">Loading <CircularProgress size='1.5rem' color='success' /></h1>
                <img src="https://usagif.com/wp-content/uploads/loading-87.gif" alt="" className='w-1/3 block m-auto pt-20' />
            </div>
        }
    }
    return <div>
        {displayData()}
    </div>

}