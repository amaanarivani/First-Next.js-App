'use client'
import { AccountCircle, Event, Person } from "@mui/icons-material";
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react";

function SingleBlog() {

    const searchParams = useSearchParams()
    const blogid = searchParams.get('blogid');

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

return <div className="p-20">

    <div className="">
        <h1 className="mt-3 font-bold text-3xl text-center"><font> Title : </font><font className='text-gray-700'>{singleBlog?.title}</font></h1>
        <p className="text-xl mt-10"><font className='font-bold'>Description :</font> <font className='text-gray-900'>{singleBlog?.description}</font></p>
        <p className="text-xl mt-10"><Event fontSize='large' className="me-3"/> <font className='text-gray-900'>{singleBlog?.createdAt}</font></p>
        <p className="text-xl mt-10"><AccountCircle style={{color: "#7c4dff"}} fontSize='large' className="me-4"/><font className='text-gray-900'>{singleBlog?.userData.name}</font></p>
    </div>
</div>
}

export default function Page() {
    return <Suspense>
        <SingleBlog />
    </Suspense>
}