'use client'
import { AccountCircle, Description, Email, Event, GitHub, Instagram, LinkedIn, Person, Telegram, ThumbUp, ThumbUpAlt, ThumbUpOffAlt, Title, Visibility, X } from "@mui/icons-material";
import { Box, Button, CircularProgress, Paper, TextField } from "@mui/material";
import axios from "axios";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { Pagination, TextInput } from "flowbite-react";
import toast from "react-hot-toast";



export default function Home() {

  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem('user'))
  );

  const [blogData, setBlogData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [blogList, setBlogList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); 

  const onPageChange = async (page) => {
    setIsLoading(true);
    const res = await axios.get("http://localhost:5000/blog/getall/" + page)
    setBlogData(res.data.data);
    console.log("totapages " + res.data.totalpages);
    setTotalPages(res.data.totalpages);
    console.log(page);
    setCurrentPage(page);
    setIsLoading(false);
  }


  const fetchBlogData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/blog/getall/1');
      console.log(res);

      if (res.status === 200) {
        setIsLoading(false);
        console.log("blog data - " + res.data.data);
        setTotalPages(res.data.totalpages);
        setBlogData(res.data.data);
        // setBlogList(res.data.data);
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

  const searchBlog = async(searchText) => {
    try {
      const res = await axios.post("http://localhost:5000/blog/blog-search", {
        text: searchText
      })
      console.log(res.data.finalResult);
      if(searchText){
        setBlogData(res.data.finalResult);
      }else{
        fetchBlogData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const likeBlog = async (blogId, userId) => {
    console.log(blogId, 'blog liked');
    setIsLikeLoading(true);
    if (currentUser == null) {
      toast.error("Please Login to continue")
      router.push("/login")
      return;
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
      return <main className="flex min-h-screen flex-col items-center justify-between pt-10">
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
        <div className="w-11/12">
          <TextInput onChange={(e) => { searchBlog(e.target.value) }} placeholder='Search Blogs' sizing="lg" className="float-right rounded-none border-none" style={{ backgroundColor: 'white' }} />
          <h1 className="text-3xl font-extrabold text-center mb-10">Welcome! You can Browse all the Blogs here</h1>

          <Box className='grid grid-cols-1 gap-y-10'>

            {
              blogData.map((blog, index) => {
                return <div key={blog._id.toString()} className="container">
                  <Paper onClick={() => { viewBlog(blog?._id, currentUser?._id) }} elevation={16} style={{ backgroundColor: '#ffffff8b' }} className="p-10 mb-3">
                    <Link href={`/singleblog?blogid=${blog?._id}`}>
                      <div className="grid grid-cols-2">
                        <div className="mr-9">
                          <img src={blog?.blogFile} alt="" className="img-fluid" />
                        </div>
                        <div className="">
                          <h3 className="inline-flex text-3xl font-extrabold mb-5">{blog?.title}</h3>
                          <div className="float-right">
                            {/* DateTime.fromISO('2014-08-06T13:07:04.054').toFormat('yyyy LLL dd'); */}
                            <Event fontSize='large' className="me-3" /><font className='text-gray-900'>{DateTime.fromISO(blog?.createdAt).toFormat('LLL dd, yyyy, HH:mm')}</font>
                          </div>

                          <p className="mb-2 text-lg"><Description fontSize="large" className="me-2" /><font className='text-lg'>{blog?.description}</font></p>
                        </div>
                      </div>
                    </Link>
                    <div className="">
                      {
                        blog?.userData?.myFile ? (
                          <img className="mt-2 inline-flex w-14 h-14 rounded-full" src={blog?.userData?.myFile} />
                        ) : <Person fontSize="large" className="inline-flex rounded-full" />
                      }
                      <font className="text-xl font-bold mt-3 ms-2">{blog?.userData?.firstname}</font>
                      <button style={{ color: (blog.likedBy.includes(currentUser?._id)) ? '#1A56DB' : "grey" }} disabled={isLikeLoading} onClick={() => { likeBlog(blog?._id, currentUser?._id) }} type="button" className=" ms-4 text-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                        {
                          isLikeLoading ? (
                            <>
                              <CircularProgress size='1.5rem' />
                            </>
                          ) :
                            <>
                              <font className='font-bold text-xl me-2'>{blog?.likeCount}</font>
                              <ThumbUpAlt fontSize="large" />
                            </>
                        }
                      </button>
                      <font className='font-bold text-xl me-1'>{blog?.commentCount} </font>
                      <Telegram className="mb-1" fontSize="large" />
                      <font className='font-bold text-xl mx-2'>{blog?.viewCount} </font>
                      <Visibility fontSize="large" />
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
    <div>{dsiplayData()}
      <div className="flex overflow-x-auto sm:justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>

  );
}