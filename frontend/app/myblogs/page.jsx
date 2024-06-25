'use client'

import { Box, Paper } from "@mui/material";
import { useEffect, useState } from "react";


export default function MyBlogs() {

    const [currentUser, setCurrentUser] = useState(
        JSON.parse(sessionStorage.getItem('user'))
    );
    console.log(currentUser);

    const [myblogData, setMyblogData] = useState([]);
    const fetchMyblogData = async () => {
        // console.log(id);
        const res = await fetch(`http://localhost:5000/blog/getbyid/${currentUser._id}`);
        console.log(res.status);

        if(res.status === 200){
            const data = await res.json();
            console.log(data);
            setMyblogData(data);
        }
    };

    useEffect(() => {
        fetchMyblogData();
    }, []);
    return <div className="pt-20">
        <h1 className="text-center font-bold text-3xl mt-8">Here's Your Blogs</h1>
        <Box className='grid grid-cols-4 gap-4 p-8 m-auto'>
            {
              myblogData.map((myblog) => {
                return <div>
                  <Paper elevation={16} className="p-10">
                  <h3><font>Title : </font><font>{myblog.title}</font></h3>
                  <p><font>Description : </font><font>{myblog.description.substring(0,10)}......</font></p>
                  <p><font>CreatedBy : </font><font>{myblog.userData.name}</font></p>
                  </Paper>
                </div>
              })
            }
        </Box>
    </div>
}