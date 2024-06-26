'use client'
import UseAppContext from "@/component/UseContext";
import { AccountCircle, Event, Person } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation"
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from "react";
import Swal from "sweetalert2";

function SingleBlog() {

    const { loggedIn, logout } = UseAppContext();

    const [currentUser, setCurrentUser] = useState(
        JSON.parse(sessionStorage.getItem('user'))
    );
    console.log(currentUser);

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
      console.log(loggedIn);
      const deleteButton = () => {
        if(currentUser._id == singleBlog.userId){
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
                <h1 className="text-center font-bold text-3xl">Blog Details</h1>
                    <h1 className="mt-3 font-bold text-3xl"><font className='text-gray-700'>{singleBlog?.title}</font></h1>
                    <p className="text-xl mt-10"><font className='font-bold'>Description :</font> <font className='text-gray-900'>{singleBlog?.description}</font></p>
                    <p className="text-xl mt-10"><Event fontSize='large' className="me-3" /> <font className='text-gray-900'>{singleBlog?.createdAt}</font></p>
                    <p className="text-xl mt-10"><AccountCircle style={{ color: "#7c4dff" }} fontSize='large' className="me-4" /><font className='text-gray-900'>{singleBlog?.userData.name}</font></p>
                    <div>{deleteButton()}</div>
                </div>
            </div>
        } else {
            return <div>
               <h1 className="pt-20 text-center font-bold text-3xl">Loading <CircularProgress size='1.5rem' color='success' /></h1>
               <img src="https://i.pinimg.com/originals/78/5b/ff/785bffb987465e9348c1d6d48a6e4b31.gif  " alt="" className='w-1/3 block m-auto pt-20'/>
            </div>
        }
    }


    return <div className="pt-20">
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