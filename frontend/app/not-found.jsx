import Link from "next/link"

const NotFound = async() => {
    return (
    <div className="">
        <Link href='/'>Back to Home</Link>
        <h1 className="text-center text-4xl font-bold">404 | Page Not Found</h1>
        <img className="block m-auto h-auto max-w-full rounded-lg" src="https://cdn.svgator.com/images/2024/04/electrocuted-caveman-animation-404-error-page.gif" alt="" />
    </div>
    )
}

export default NotFound;