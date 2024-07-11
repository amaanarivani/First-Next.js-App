'use client'
import { Button, Card, Table, TextInput } from "flowbite-react";
import UseAppContext from "@/component/UseContext";
import { useEffect, useState } from "react";
import { Edit, PeopleAlt, Person } from "@mui/icons-material";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';
import { Formik } from "formik";

export default function Profile() {

    const { loggedIn, logout, currentUser, setCurrentUser } = UseAppContext();
    const [userData, setUserData] = useState();
    const [isUserEdit, setIsUserEdit] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/user/getbyid/${currentUser?._id}`);
            console.log(res.status);
            if (res.status === 200) {
                console.log(res.data + "userData");
                setUserData(res.data);
                setCurrentUser(res.data);
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
            Swal.fire({
                icon: 'error',
                title: 'oops!!',
                text: 'Password Not Matched'
            })
            return;
        }
        sessionStorage.removeItem('user');
        console.log(values);
        const res = await fetch(`http://localhost:5000/user/update/${currentUser?._id}`, {
            method: 'PUT',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(res.status);

        if (res.status === 200) {
            fetchUserData()
            Swal.fire({
                icon: 'success',
                title: 'User Details Updated Successfully',
            });
            const data = await res.json();
            console.log(data);
            sessionStorage.setItem('user', JSON.stringify(data));
            setCurrentUser(data);
            router.back()
        }
        setSubmitting(false);
    }
    // style={{ backgroundColor: '#e2e8f0', height: '100vh' }}
    return <div className="bg-body" >
        <div className="grid grid-cols-3">
            <div className="m-10 p-5">
                <Card>
                    <div>
                        {
                            currentUser?.myFile ? (
                                <>
                                    <img src={currentUser?.myFile} className="rounded-full" alt="" />
                                </>
                            ) : <>
                                <img src="https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png" className="rounded-full mb-7" alt="" />
                            </>
                        }

                    </div>
                    <div>
                        <h1 className="text-lg text-center mt-3 font-bold">{currentUser?.firstname + " " + currentUser?.lastname}</h1>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
                    </div>
                </Card>
            </div>
            <div className="col-span-2 m-10 p-5">
                <Card>
                    {
                        isUserEdit ? (
                            <>
                                <Formik initialValues={userData} onSubmit={submitForm}>
                                    {(userData) => (
                                        <form onSubmit={userData.handleSubmit}>
                                            <div className="grid grid-cols-2 gap-4 mt-3">
                                                <div>
                                                    <label className="text-lg">First Name</label>
                                                    <TextInput name="firstname" required className="w-75 margin-vt" id="outlined" label="Enter Name" variant="outlined" size="small" onChange={userData.handleChange} value={userData?.values?.firstname} />
                                                </div>
                                                <div>
                                                    <label className="text-lg">Last Name</label>
                                                    <TextInput name="lastname" className="margin-vt" fullWidth id="outlined" label="Enter Name" variant="outlined" size="small" onChange={userData.handleChange} value={userData?.values?.lastname} />
                                                </div>
                                            </div>
                                            <label className="text-lg">Email</label>
                                            <TextInput type="email" name="email" required className="margin-vt" fullWidth id="outlined" label="Enter Email" variant="outlined" size="small" onChange={userData.handleChange} value={userData?.values?.email} />
                                            <label className="text-lg">Password</label>
                                            <TextInput name="password" required fullWidth id="outlined-password-input" label="Enter Password" size="small" className="margin-vt" onChange={userData.handleChange} value={userData?.values?.password} />
                                            <label className="text-lg">Confirm Password</label>
                                            <TextInput name="confirmpassword" required fullWidth id="outlined-password-input" label="Re-Enter Password" size="small" className="margin-vt" onChange={userData.handleChange} value={userData?.values?.confirmpassword} />
                                            <Button fullWidth disabled={userData.isSubmitting} type='submit' color="purple" className="mt-3 w-full">
                                                {
                                                    userData.isSubmitting ? (
                                                        <>
                                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: '10px' }}></span>Loading...
                                                        </>
                                                    ) : 'Save Changes'
                                                }</Button>
                                        </form>
                                    )}

                                </Formik>
                            </>
                        ) : <>
                            <div>
                                <Table>
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
                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap text-lg text-gray-900 dark:text-white">
                                                {'Email'}
                                            </Table.Cell>
                                            <Table.Cell className="text-base">{userData?.email}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap text-lg text-gray-900 dark:text-white">
                                                {'Password'}
                                            </Table.Cell>
                                            <Table.Cell className="text-base">{userData?.password}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                    <Button color='purple' className="ms-3" onClick={() => { setIsUserEdit(true) }}><Edit className='me-3' />Edit</Button>
                                </Table>
                            </div>
                        </>
                    }
                </Card>
            </div>
        </div>
    </div>
}