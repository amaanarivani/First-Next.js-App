'use client'
import UseAppContext from "@/component/UseContext";
import { AccountCircle, Event, Person } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useSearchParams } from "next/navigation"
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from "react";
import Swal from "sweetalert2";

function SingleBlog() {

    const { loggedIn, logout } = UseAppContext();

    const searchParams = useSearchParams()
    const blogid = searchParams.get('blogid');
    const router = useRouter();

    const [singleBlog, setSingleBlog] = useState();
    const fetchSingleBlogData = async () => {
        const res = await fetch(`http://localhost:5000/blog/getsingleblog/${blogid}`);
        if (res.status === 200) {
            const data = await res.json();
            console.log(data);
            setSingleBlog(data);
        }
    };

    useEffect(() => {
        fetchSingleBlogData();
    }, [blogid]);

    const deleteBlog = async () => {
        try {
            const res = await fetch (`http://localhost:5000/blog/delete/${blogid}`, {method: 'DELETE'});
            if (res.status === 200){
              Swal.fire({
                icon: 'success',
                title: 'Task deleted Successfully',
              });
              router.back();
              console.log('task deleted');
              fetchSingleBlogData();
            }
        } catch (error) {
            
        }
      }
      const deleteButton = () => {
        if(loggedIn){
            return (
                <>
                <Button onClick={() => { deleteBlog(singleBlog._id) }} variant='contained' color="error" style={{marginTop: '2rem'}}>Delete Blog</Button>
                </>
            )
        }
      }

    const displayData = () => {
        if (singleBlog) {
            return <div className="pt-10">
                <div className="ms-20">
                    <h1 className="mt-3 font-bold text-3xl"><font className='text-gray-700'>{singleBlog?.title}</font></h1>
                    <p className="text-xl mt-10"><font className='font-bold'>Description :</font> <font className='text-gray-900'>{singleBlog?.description}</font></p>
                    <p className="text-xl mt-10"><Event fontSize='large' className="me-3" /> <font className='text-gray-900'>{singleBlog?.createdAt}</font></p>
                    <p className="text-xl mt-10"><AccountCircle style={{ color: "#7c4dff" }} fontSize='large' className="me-4" /><font className='text-gray-900'>{singleBlog?.userData.name}</font></p>
                    <div>{deleteButton()}</div>
                </div>
            </div>
        } else {
            return <div>
                <img src="https://usagif.com/wp-content/uploads/loading-12.gif" alt="" className='w-1/5  block m-auto pt-20' />
            </div>
        }
    }


    return <div className="pt-20">
        <h1 className="text-center font-bold text-3xl mt-8">Blog Details</h1>
        <div>
        {displayData()}
        </div>
        
    </div>
}

export default function Page() {
    return <Suspense>
        <SingleBlog />
    </Suspense>
}