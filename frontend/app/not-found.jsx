'use client'


import { Button } from "flowbite-react"
import Link from "next/link"

export default function NotFound() {
    return <div className="">
        <Link href='/'><Button className="ms-4" color='purple'>Back To Home</Button></Link>
        <h1 className="text-center text-4xl font-bold">404 | Page Not Found</h1>
        <img className="block m-auto h-auto max-w-full rounded-lg" src="https://cdn.svgator.com/images/2024/04/electrocuted-caveman-animation-404-error-page.gif" alt="" />
    </div>
}