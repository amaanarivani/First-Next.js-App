'use client'

import { Box, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MyBlogs() {

    const { id } = useParams();
    const [myblogData, setMyblogData] = useState([]);
    const fetchMyblogData = async () => {
        const res = await fetch(`http://localhost:5000/blog/getbyid/${id}`);
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
            <Paper elevation={16} className="p-10">
            {
              myblogData.map((myblog) => {
                return <div>
                  <Paper elevation={16} className="p-10">
                  <h3><font>Title : </font><font>{myblog.title}</font></h3>
                  <p><font>Description : </font><font>{myblog.description.substring(0,10)}......</font></p>
                  {/* <p><font>CreatedBy : </font><font>{myblogData.userData.name}</font></p> */}
                  </Paper>
                </div>
              })
            }
            </Paper>
        </Box>
    </div>
}