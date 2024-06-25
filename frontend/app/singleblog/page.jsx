'use client'
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

    <p>{singleBlog?.title}</p>
</div>
}

export default function Page() {
    return <Suspense>
        <SingleBlog />
    </Suspense>
}