'use client'

import { AccountCircle, Description } from "@mui/icons-material";
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
    const displayData = () => {
        if(!isLoading){
            return <div className="pt-20">
            <h1 className="text-center font-bold text-3xl mt-8">Here are Your Blogs</h1>
            <Box className='grid grid-cols-4 gap-4 p-8 m-auto'>
                {
                    myblogData.map((myblog) => {
                        return <div>
                            <Link href={`/singleblog?blogid=${myblog._id}`}>
                                <Paper elevation={16} className="p-10">
                                    <h3 className="text-xl mb-3 font-bold"><font>{myblog.title.substring(0, 10)}......</font></h3>
                                    <p className="mb-2"><Description /><font className='ms-4'>{myblog.description.substring(0, 10)}......</font></p>
                                    <p><AccountCircle style={{color: '#2196f3'}}/><font className='ms-4'>{myblog.userData.name}</font></p>
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
                <img src="https://usagif.com/wp-content/uploads/loading-87.gif" alt="" className='w-1/3 block m-auto pt-20'/>
            </div>
        }
    }
    return <div>
        {displayData()}
    </div>
    
}