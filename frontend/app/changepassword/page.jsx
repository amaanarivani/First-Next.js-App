'use client'
import axios from "axios"
import { Button, Card, TextInput } from "flowbite-react"
import { Suspense, useEffect, useState } from "react"
import Login from "../login/page";
import { useFormik } from "formik";
import UseAppContext from "@/component/UseContext";
import { HowToReg } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { Box } from "@mui/material";


function ChangePassword() {

    const [passData, setPassData] = useState();
    const router = useRouter();
    const { loggedIn, logout, currentUser, setCurrentUser, loadingData } = UseAppContext();
    console.log(currentUser);

    console.log(currentUser, " current user");
    useEffect(() => {
        console.log(currentUser, " current user data ");
        if (!currentUser && !loadingData) {
            toast.error("Please Login to continue")
            router.push("/login")
        }
    }, [loadingData, currentUser]);

    const passwordForm = useFormik({
        initialValues: {
            currentpassword: '',
            newpassword: '',
            cnfnewpassword: ''
        },
        onSubmit: async (values, { setSubmitting }) => {
            values.currentpassword = values.currentpassword.trim();
            values.newpassword = values.newpassword.trim();
            values.cnfnewpassword = values.cnfnewpassword.trim();
            if (!values.newpassword || !values.cnfnewpassword) {
                return toast.error("new password or confirm new password is empty")
            }
            setSubmitting(true);
            setTimeout(() => {
                console.log(values);
                setSubmitting(false);
            }, 3000);
            if (values.newpassword != values.cnfnewpassword) {
                toast.error("Password Not Matched");
                return;
            }
            try {
                const res = await axios.post(`${process.env.backend}/user/update-password`, {
                    currentPassword: values?.currentpassword,
                    newPassword: values?.newpassword,
                    userId: currentUser?._id
                })
                console.log(res.data.data);

                if (res.status == 200) {
                    toast.success("Password Changed Successfully")
                    console.log(res.data.data);
                    router.back()
                }
                setSubmitting(false);

            } catch (error) {
                if (error.response.data.message) {
                    toast.error(error.response.data.message)
                }
            }
        }
    })

    return (
        <div className="bg-body pt-10 pb-96">
            <Box className='m-auto md:w-1/2 sm:4/5 p-5'>
                <Card className="">
                    <h1 className="text-center text-2xl font-bold">Change Your Password here</h1>
                    <div className="px-5">
                        <form onSubmit={passwordForm.handleSubmit}>
                            <label>Current Password</label>
                            <TextInput required type="password" name="currentpassword" className="margin-vt" placeholder="Your current passowrd" onChange={passwordForm?.handleChange} value={passwordForm?.values?.currentpassword} />
                            <label>New Password</label>
                            <TextInput required type="password" name="newpassword" className="margin-vt" placeholder="Your new passowrd" onChange={passwordForm?.handleChange} value={passwordForm?.values?.newpassword} />
                            <label>Confirm New Password</label>
                            <TextInput required type="password" name="cnfnewpassword" className="margin-vt" placeholder="Confirm your new passowrd" onChange={passwordForm?.handleChange} value={passwordForm?.values?.cnfnewpassword} />
                            <Button disabled={passwordForm.isSubmitting} type="submit" className="my-5 w-full" color="purple" >
                                {
                                    passwordForm.isSubmitting ? (
                                        <>
                                            Loading...
                                        </>
                                    ) : <>
                                        <HowToReg className="me-2" /> Save Changes
                                    </>
                                }
                            </Button>
                        </form>
                    </div>
                </Card>
            </Box>
        </div>
    )
}

export default function RenderedPage() {
    return <Suspense>
        <ChangePassword />
    </Suspense>
};