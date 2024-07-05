'use client'

import { Button } from "@mui/material"
import Link from "next/link"

export default function NotFound() {
    return <div className="pt-20">
        <Link href='/'><Button style={{marginInlineStart: '2rem'}} className="" variant="contained">Back to Home</Button></Link>
        <h1 className="text-center text-4xl font-bold">404 | Page Not Found</h1>
        <img className="block m-auto h-auto max-w-full rounded-lg" src="https://cdn.svgator.com/images/2024/04/electrocuted-caveman-animation-404-error-page.gif" alt="" />
    </div>
}