'use client'
import { AccountCircle, Description, Event, Person, ThumbUp, ThumbUpOffAlt, Title, Visibility } from "@mui/icons-material";
import { Box, Button, CircularProgress, Paper, TextField } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Home() {

  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem('user'))
  );

  const [blogData, setBlogData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [blogList, setBlogList] = useState([]);
  const [isLikeLoading, setIsLikeLoading] = useState(false);


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

  const likeBlog = async (blogId, userId) => {
    console.log(blogId, 'blog liked');
    setIsLikeLoading(true);
    if (currentUser == null) {
      return Swal.fire({
        icon: 'error',
        title: 'Not Permitted!',
        text: 'Please Login to continue.',
      })
        .then(() => {
          router.push('/login');

        })
    }
    try {
      const res = await axios.post("http://localhost:5000/blog/blog-like", {
        blogId,
        userId
      })
      console.log(blogData + "blogdata");
      setBlogData(previous => previous.map(e => {
        if (e._id == blogId) {
          console.log(e, "finddddd");
          // let newlikedByList = [e.likedBy]
          return { ...e, likeCount: e.likeCount + 1, likedBy: currentUser?._id ? [...e.likedBy, currentUser._id] : e.likedBy }
        } else { return e }
      }));
      setIsLikeLoading(false);
      console.log(res + 'like');
    } catch (error) {
      setBlogData(previous => previous.map(e => {
        if (e._id == blogId) {
          console.log(e, "finddddd");
          return { ...e, likeCount: e.likeCount - 1, likedBy: currentUser?._id ? e.likedBy.filter(sId => (sId != currentUser._id)) : e.likedBy }
        } else { return e }
      }));
      setIsLikeLoading(false);
    }
  }

  const viewBlog = async (blogId, userId, Likes) => {
    console.log('view Blog');
    try {
      const res = await axios.post("http://localhost:5000/blog/blog-view", {
        blogId,
        userId,
        Likes,
      })
      setBlogData(previous => previous.map(e => {
        if (e._id == blogId) {
          console.log(e, "finddddd");
          return { ...e, viewCount: e.viewCount + 1 }
        } else { return e }
      }));
      console.log(res + 'view');
    } catch (error) {
      console.log(error);
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
              blogData.map((blog, index) => {
                return <div key={blog._id.toString()} className="container">
                  <Paper onClick={() => { viewBlog(blog?._id, currentUser?._id) }} elevation={16} style={{ backgroundColor: '#ffffff8b' }} className="p-10 mb-3">
                    <Link href={`/singleblog?blogid=${blog._id}`}>
                      <div className="grid grid-cols-2">
                        <div className="mr-9">
                          <img src={blog.blogFile} alt="" className="img-fluid" />
                        </div>
                        <div className="">
                          <h3 className="text-3xl font-extrabold mb-5"><font>{blog.title}</font></h3>
                          <p className="mb-2 text-lg"><Description fontSize="large" className="me-2" /><font className='text-lg'>{blog.description}</font></p>
                          <div className="grid grid-cols-4 mt-4">
                            <div className="inline-flex">
                              <img className="w-2/5 rounded-full img-fluid" src={blog.userData.myFile} />
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
                    <button style={{ color: (blog.likedBy.includes(currentUser?._id)) ? '#1A56DB' : "grey" }} disabled={isLikeLoading} onClick={() => { likeBlog(blog?._id, currentUser?._id) }} type="button" className="mt-4 text-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                      {
                        isLikeLoading ? (
                          <>
                            <CircularProgress size='1.5rem'/>
                          </>
                        ) :
                          <>
                            <font className='font-bold text-xl me-2'>{blog?.likeCount}</font>
                            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                              <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z" />
                            </svg>
                          </>
                      }
                    </button>
                    <Visibility fontSize="large" /><font className='mt-4 font-bold ms-2'>{blog?.viewCount} Views</font>
                    <div>
                    </div>
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