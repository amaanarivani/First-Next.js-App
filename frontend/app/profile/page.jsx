'use client'
import { Button, Card, Table, TextInput } from "flowbite-react";
import UseAppContext from "@/component/UseContext";
import { Suspense, useEffect, useState } from "react";
import { ArrowBack, Edit, PeopleAlt, Person } from "@mui/icons-material";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { Formik } from "formik";
import toast from "react-hot-toast";

function Profile() {

    // const { loggedIn, logout, currentUser, setCurrentUser } = UseAppContext();
    const [userData, setUserData] = useState();
    const [isUserEdit, setIsUserEdit] = useState(false);
    const [selFile, setSelFile] = useState("");
    const [validFile, setValidFile] = useState(false);
    const searchParams = useSearchParams();
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

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${process.env.backend}/user/getbyid/${currentUser?._id}`);
            console.log(res.status);
            if (res.status === 200) {
                console.log(res.data + "userData");
                setUserData(res.data);
                setCurrentUser(res.data);
                setSelFile(currentUser?.myFile);
                sessionStorage.setItem('user', JSON.stringify(res.data));

            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchUserData();
    }, []);

    const submitForm = async (values, { setSubmitting }) => {
        if (values.password != values.confirmpassword) {
            toast.error("Password Not Matched")
            return;
        }

        console.log(values);
        try {
            values.firstname = values.firstname.trim();
             values.lastname = values.lastname.trim();
             if(!values.firstname){
                return toast.error("User first name can't be empty")
             }
            if(!validFile){
                return toast.error("Invalid File")
             }
            const res = await axios.post(`${process.env.backend}/user/update`, {
                result: values,
                myFile: selFile,
                userId: currentUser?._id
            });

            console.log("response  =======" + res.data.data);

            if (res.status == 200) {
                sessionStorage.removeItem('user');
                fetchUserData()
                toast.success("User Details Updated Successfully")

                console.log(res.data.data);
                setCurrentUser(res.data.data);
                router.back()
            }
            setSubmitting(false);

        } catch (error) {
            if (error.response.data.message) {
                toast.error(error.response.data.message)
            }
        }
    }

    const validateImage = (filename) => {
        const allowedExt = ["png", "jpeg", "jpg", "gif"];
    
        // Get the extension of the uploaded file
        const ext = filename.split('.');
        const extension = ext[1];
    
        //Check if the uploaded file is allowed
        return allowedExt.includes(extension);
    };

    const uploadFile = async (e) => {
        if (!e.target.files)
        return;
    
        let file = e.target.files[0];
        console.log(file.name, " user file");
        const isFileValid = validateImage(file.name);
        console.log(isFileValid, "validation result");
        
        if (isFileValid) {
            let converted = await convertToBase64(file);
            console.log(converted);
            console.log(file, 'abc');
            setSelFile(converted);
        }
    
        setValidFile(isFileValid);
        console.log(isFileValid, "final validation result");
        console.log(validFile, "updated state value");
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };


    return <div className="bg-body pt-14 pb-36">
        <Card className="w-4/5 mx-auto p-4">
            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-8">
                <div className="w-4/5 me-auto">
                    <div className="">
                        {
                            currentUser?.myFile ? (
                                <>
                                    <img src={currentUser?.myFile} className="pt-6 rounded-full" alt="" />
                                </>
                            ) : <>
                                <img src="./User image.png" className="rounded-full pb-7" alt="" />
                            </>
                        }

                    </div>
                    <div>
                        <h1 className="text-lg text-center mt-3 font-bold">{currentUser?.firstname + " " + currentUser?.lastname}</h1>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
                    </div>
                </div>
                <div className="md:col-span-2">
                    {
                        isUserEdit ? (
                            <>
                                <div className="">
                                    <Formik initialValues={userData} onSubmit={submitForm}>
                                        {(userData) => (
                                            <form onSubmit={userData.handleSubmit}>
                                                {/* <div className="grid grid-cols-2 gap-4 mt-3">
                                                    <div> */}
                                                <label className="text-lg">First Name</label>
                                                <TextInput name="firstname" required className="w-4/5 margin-vt" id="outlined" label="Enter Name" variant="outlined" size="small" onChange={userData.handleChange} value={userData?.values?.firstname} />
                                                {/* </div>
                                                    <div> */}
                                                <label className="text-lg">Last Name</label>
                                                <TextInput name="lastname" className="w-4/5 margin-vt" size="small" onChange={userData.handleChange} value={userData?.values?.lastname} />
                                                {/* </div>
                                                </div> */}
                                                <label className="text-lg">Email</label>
                                                <TextInput disabled type="email" name="email" required className="margin-vt w-4/5" fullWidth id="outlined" label="Enter Email" variant="outlined" size="small" onChange={userData.handleChange} value={userData?.values?.email} />
                                                <label className="text-lg">Avatar</label><br />
                                                <input required type="file" onChange={uploadFile} className="mb-4" />

                                                <div className="">
                                                    <Button disabled={userData.isSubmitting} type='submit' color="purple" className="mt-3 w-1/5 inline-flex">
                                                        {
                                                            userData.isSubmitting ? (
                                                                <>
                                                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: '10px' }}></span>Loading...
                                                                </>
                                                            ) : 'Update'
                                                        }</Button>
                                                    <Button color='purple' className="inline-flex w-1/5 ms-3" onClick={() => { setIsUserEdit(false) }}>Discard</Button>
                                                </div>
                                            </form>
                                        )}

                                    </Formik>
                                </div>

                            </>
                        ) : <>
                            {/* <div className="w-4/5 py-6"> */}
                                <Table className="">
                                    <Table.Head className="">
                                        <Table.HeadCell className="text-2xl">
                                            <PeopleAlt className="me-3" fontSize="large" />Profile Details
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap text-lg text-gray-900 dark:text-white">
                                                {'First Name'}
                                            </Table.Cell>
                                            <Table.Cell className="text-base">{userData?.firstname}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap text-lg text-gray-900 dark:text-white">
                                                {'Last Name'}
                                            </Table.Cell>
                                            <Table.Cell>{
                                                currentUser?.lastname ? (
                                                    <>
                                                        {userData?.lastname}
                                                    </>
                                                ) : <>
                                                    Na
                                                </>
                                            }</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                    <Button color='purple' className="ms-3 mt-5" onClick={() => { setIsUserEdit(true) }}><Edit className='me-3' />Edit</Button>
                                </Table>
                            {/* </div> */}
                        </>
                    }
                </div>
            </div>
        </Card>
    </div >
}

export default function RenderedPage() {
    return <Suspense>
        <Profile />
    </Suspense>
};