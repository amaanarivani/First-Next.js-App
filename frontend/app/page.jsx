'use client'
import { AccountCircle, Description, Event, Title } from "@mui/icons-material";
import { Box, CircularProgress, Paper, TextField } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [blogData, setBlogData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogList, setBlogList] = useState([]);
  const fetchBlogData = async () => {
    const res = await fetch('http://localhost:5000/blog/getall');
    console.log(res.status);

    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      setBlogData(data);
      setIsLoading(false);
      setBlogList(data);
    }
  };
  useEffect(() => {
    fetchBlogData();
  }, [])

  const searchBlog = (e) => {
    const search = e.target.value;
    const result = blogList.filter((blog) => { return blog.title.toLowerCase().includes(search.toLowerCase()) })
    setBlogData(result);
  }

  const dsiplayData = () => {
    if(!isLoading){
      return <main className="flex min-h-screen flex-col items-center justify-between pt-20">
      <svg
        className="background--custom"
        id="demo"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          fill="#FFFF00"
          fillOpacity="0.8"
          d="M-100 -100L200 -100L200 60L-100 60Z"
          style={{ animation: "path0 2.9585798816568047s linear infinite alternate" }}
        />
        <path
          fill="#00FFFF"
          fillOpacity="0.7"
          d="M-100 -100L200 -100L200 50L-100 50Z"
          style={{ animation: "path1 6.944444444444445s linear infinite alternate" }}
        />
        <path
          fill="#D7FF00"
          fillOpacity="0.8"
          d="M-100 -100L200 -100L200 30L-100 30Z"
          style={{ animation: "path2 2.9761904761904763s linear infinite alternate" }}
        />
        <path
          fill="#34BECE"
          fillOpacity="0.3"
          d="M-100 -100L200 -100L200 20L-100 20Z"
          style={{ animation: "path3 15.625s linear infinite alternate" }}
        />
      </svg>
      <div className="mt-5">
        <TextField onChange={searchBlog} id="outlined" variant="outlined" placeholder='Search Blogs' size="large" className="float-right" style={{backgroundColor: 'white'}}/>
        <h1 className="text-3xl font-extrabold text-center mb-10">Welcome! You can Browse all the Blogs here</h1>

        <Box className='grid grid-cols-1 gap-y-10'>

          {
            blogData.map((blog) => {
              return <div className="container">
                <Link href={`/singleblog?blogid=${blog._id}`}>
                  <Paper elevation={16} style={{ backgroundColor: '#ffffff8b' }} className="p-10 mb-3">

                    <h3 className="text-3xl font-extrabold mb-5"><font>{blog.title}</font></h3>
                    <p className="mb-2 text-lg"><Description /><font className='ms-4 text-lg'>{blog.description}</font></p>
                    <p className="text-xl font-bold mt-5"><AccountCircle fontSize='large' style={{ color: "#7c4dff" }} /><font className='ms-4'>{blog.userData.name}</font></p>
                    <p className="text-md mt-8"><Event fontSize='large' className="me-3" /> <font className='text-gray-900'>{blog.createdAt}</font></p>
                  </Paper>
                </Link>
              </div>
            })
          }
        </Box>
      </div >
    </main >
    }else{
      return <div>
                <h1 className="pt-36 text-center font-bold text-4xl">Loading <CircularProgress size='1.5rem' color='success' /></h1>
                <img src="https://i.pinimg.com/originals/78/5b/ff/785bffb987465e9348c1d6d48a6e4b31.gif  " alt="" className='w-1/3 block m-auto pt-36'/>
            </div>
    }
  }
    
  return (
    <div>{dsiplayData()}</div>
  );
}