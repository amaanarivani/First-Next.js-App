'use client'
import { AccountCircle, Description, Event, Person, ThumbUp, Title } from "@mui/icons-material";
import { Box, Button, CircularProgress, Paper, TextField } from "@mui/material";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function Home() {
  const [blogData, setBlogData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [blogList, setBlogList] = useState([]);
  const fetchBlogData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/blog/getall');
      console.log(res);

      if (res.status === 200) {
        setIsLoading(false);
        const data = await res.json();
        console.log(data);
        setBlogData(data);
        setBlogList(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

  };
  useEffect(() => {
    fetchBlogData();
  }, [])

  const searchBlog = (e) => {
    const search = e.target.value;
    const result = blogList.filter((blog) => { return blog.title.toLowerCase().includes(search.toLowerCase()) })
    setBlogData(result);
  };

  const likeBlog = async(blogId, userId) => {
    try {
      const res = await fetch("http://localhost:5000/blog/blog-like", {
        method: 'Post',
        body: JSON.stringify({
          blogId,
          userId
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(res);

      
    } catch (error) {
      
    } 
  }



  const dsiplayData = () => {
    if (!isLoading) {
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
        <div className="mt-5 w-11/12">
          <TextField onChange={searchBlog} id="outlined" variant="outlined" placeholder='Search Blogs' size="large" className="float-right rounded-none border-none" style={{ backgroundColor: 'white' }} />
          <h1 className="text-3xl font-extrabold text-center mb-10">Welcome! You can Browse all the Blogs here</h1>

          <Box className='grid grid-cols-1 gap-y-10'>

            {
              blogData.map((blog) => {
                return <div className="container">
                  <Paper elevation={16} style={{ backgroundColor: '#ffffff8b' }} className="p-10 mb-3">
                    <Link href={`/singleblog?blogid=${blog._id}`}>
                      <div className="grid grid-cols-2">
                        <div className="mr-9">
                          <img src={blog.blogFile} alt="" className="img-fluid" />
                        </div>
                        <div className="">
                          <h3 className="text-3xl font-extrabold mb-5"><font>{blog.title}</font></h3>
                          <p className="mb-2 text-lg"><Description /><font className='text-lg'>{blog.description}</font></p>
                          <div className="grid grid-cols-4 mt-4">
                            <div className="inline-flex">
                              <img className="w-2/5 rounded-full" src={blog.userData.myFile} />
                              <p className="text-xl font-bold float-left mt-3"><font className='ms-4'>{blog.userData.firstname}</font></p>
                            </div>
                            <div className="col-span-2 mt-5">

                            </div>
                            <div className="mt-5">
                              <Event fontSize='large' className="me-3" /> <font className='text-gray-900'>{new Date(blog?.createdAt).toLocaleDateString()}</font>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div>
                    </div>
                    <ThumbUp onClick={() => { likeBlog(blog?._id, blog?.userData?._id) }} />
                  </Paper>
                </div>
              })
            }
          </Box>
        </div >
      </main >
    } else {
      return <div>
        <h1 className="pt-36 text-center font-bold text-4xl">Loading <CircularProgress size='1.5rem' color='success' /></h1>
        <img src="https://usagif.com/wp-content/uploads/loading-87.gif" alt="" className='w-1/3 block m-auto pt-20' />
      </div>
    }
  }

  return (
    <div>{dsiplayData()}</div>

  );
}