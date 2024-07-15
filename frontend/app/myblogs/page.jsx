'use client'

import UseAppContext from "@/component/UseContext";
import { Description, Person, Telegram, ThumbUpAlt, Visibility } from "@mui/icons-material";
import { Box, CircularProgress } from "@mui/material";
import { Card } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function MyBlogs() {

    const { loggedIn, logout, currentUser, setCurrentUser } = UseAppContext();
    console.log(currentUser);

    const [myblogData, setMyblogData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const fetchMyblogData = async () => {

        const res = await fetch(`http://localhost:5000/blog/getbyid/${currentUser?._id}`);
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

    const displayData = () => {
        if (!isLoading) {
            return <div className="p-5">
                <Box className='w-full grid md:grid-cols-3 sm:grid-cols-1 gap-x-8 p-3'>
                    {
                        myblogData.map((myblog) => {
                            return <div>
                                <Link href={`/singleblog?blogid=${myblog._id}`}>
                                    <Card className="mb-5" style={{backgroundColor: "#EEEEEE"}}>
                                        <h3 className="text-xl font-bold mb-2">{myblog?.title}</h3>
                                        <img src={myblog.blogFile} alt="" className="object-cover w-full h-44" />
                                        <div className="mt-4 inline-flex">
                                            {
                                                currentUser?.myFile ? (
                                                    <img className="w-10 h-10 rounded-full" src={currentUser?.myFile} alt="" />

                                                ) : <Person fontSize="medium" />
                                            }
                                            <font className="font-bold mx-2">{currentUser?.firstname}</font>
                                            <ThumbUpAlt fontSize="medium" className="me-1" /><font className='font-medium'>{myblog?.likeCount} </font>
                                            <Telegram fontSize="medium" className="ms-2" /><font className='font-medium ms-1'>{myblog?.commentCount} </font>
                                            <Visibility fontSize="medium" className="ms-2" /><font className='font-medium ms-1'>{myblog?.viewCount} </font>
                                        </div>
                                        <p className="my-2 text-large"><Description /><font className='ms-4'>{myblog?.description.substring(0, 30)}......</font></p>
                                    </Card>
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
    return <div className="container">
        {displayData()}
    </div>

}