import { Button } from "flowbite-react";
import Link from "next/link"

const NotFound = async () => {
    return (
        <div className="">
            <Link href='/'><Button color='purple' className="ms-10 mb-20">Back to Home</Button></Link>
            {/* <div className="grid grid-cols-2">
                <div>
                    <Link href='/'><Button color='purple' className="ms-10">Back to Home</Button></Link>
                </div>
                <div>
                    <h1 className="text-4xl font-bold float-left">404 | Page Not Found</h1>
                </div>
            </div> */}
            <h1 className="text-center text-4xl font-bold">404 | Page Not Found</h1>
            <img className="mx-auto md:w-2/5 sm:max-w-full rounded-lg" src="https://cdn.svgator.com/images/2024/04/electrocuted-caveman-animation-404-error-page.gif" alt="" />
        </div>
    )
}

export default NotFound;