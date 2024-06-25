'use client'
import { AccountCircle, Description, Title } from "@mui/icons-material";
import { Box, Paper } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [blogData, setBlogData] = useState([]);
  const fetchBlogData = async () => {
    const res = await fetch('http://localhost:5000/blog/getall');
    console.log(res.status);

    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      setBlogData(data);
    }
  };
  useEffect(() => {
    fetchBlogData();
  }, [])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-20">
      <svg
  className="background--custom"
  id="demo"
  viewBox="0 0 100 100"
  preserveAspectRatio="none"
>
  <path
    fill="#FFFF00"
    fillOpacity="0.4"
    d="M-100 -100L200 -100L200 60L-100 60Z"
    style={{ animation: "path0 3.3557046979865772s linear infinite alternate" }}
  />
  <path
    fill="#00FFFF"
    fillOpacity="0.6"
    d="M-100 -100L200 -100L200 60L-100 60Z"
    style={{ animation: "path1 4.716981132075472s linear infinite alternate" }}
  />
  <path
    fill="#FF00FF"
    fillOpacity="0.2"
    d="M-100 -100L200 -100L200 50L-100 50Z"
    style={{ animation: "path2 4.9504950495049505s linear infinite alternate" }}
  />
</svg>

      <div className="mt-5">
        <h1 className="text-3xl font-bold text-center mb-10">Welcome! You can Browse all the Blogs here</h1>
        
          <Box className='grid grid-cols-4 gap-x-6 gap-y-6'>

            {
              blogData.map((blog) => {
                return <div>
                  <Link href={`/singleblog?blogid=${blog._id}`}>
                  <Paper elevation={16} className="p-10 mb-3">
                    <h3 className="text-xl font-bold mb-2"><font>{blog.title.substring(0, 10)}......</font></h3>
                    <p className="mb-2"><Description /><font className='ms-4'>{blog.description.substring(0, 10)}......</font></p>
                    <p><AccountCircle fontSize='medium' style={{color: "#7c4dff"}}/><font className='ms-4'>{blog.userData.name}</font></p>
                  </Paper>
                  </Link>
                </div>
              })
            }
          </Box>
      </div>
    </main>
  );
}
