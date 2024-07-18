'use client'
import axios from "axios"
import { Button, Card, Textarea, TextInput } from "flowbite-react"
import { Suspense, useState } from "react"
import Login from "../login/page";
import { useFormik } from "formik";
import UseAppContext from "@/component/UseContext";
import { HowToReg } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';


function ChangePassword() {

    const[passData, setPassData] = useState();
    const router = useRouter();
    const { loggedIn, logout, currentUser, setCurrentUser } = UseAppContext();

    const passwordForm = useFormik({
        initialValues: {
            currentpassword: '',
            newpassword: '',
            cnfnewpassword: ''
        },
        onSubmit: async (values, { setSubmitting }) => {
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
                    userId : currentUser?._id
                })
                console.log(res.data.data);

                if (res.status == 200) {
                    toast.success("User Details Updated Successfully")
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
        <div className="bg-body pt-16 pb-80">
            <Card className="w-3/5 m-auto">
                <h1 className="text-center text-2xl font-bold">Change Your Password here</h1>
                <div>
                    <form onSubmit={passwordForm.handleSubmit}>
                        <label>Current Password</label>
                        <TextInput required type="password" name="currentpassword" className="margin-vt" placeholder="Your current passowrd" onChange={passwordForm?.handleChange} value={passwordForm?.values?.currentpassword}/>
                        <label>New Password</label>
                        <TextInput required type="password" name="newpassword" className="margin-vt" placeholder="Your new passowrd" onChange={passwordForm?.handleChange} value={passwordForm?.values?.newpassword}/>
                        <label>Confirm New Password</label>
                        <TextInput required type="password" name="cnfnewpassword" className="margin-vt" placeholder="Confirm your current passowrd" onChange={passwordForm?.handleChange} value={passwordForm?.values?.cnfnewpassword}/>
                        <Button disabled={passwordForm.isSubmitting} type="submit" className="my-3 w-full" color="purple" >
                            {
                                passwordForm.isSubmitting ? (
                                    <>
                                        Loading...
                                    </>
                                ) : <>
                                <HowToReg className="me-2"/> Save Changes
                                </>
                            }
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    )
}

export default function RenderedPage() {
    return <Suspense>
        <ChangePassword />
    </Suspense>
};