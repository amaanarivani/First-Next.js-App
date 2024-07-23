'use client'
import { AppBar, Box, IconButton, Toolbar, MenuIcon, Typography } from "@mui/material";
import { useState } from "react";
import UseAppContext from "./UseContext";
import Link from "next/link";
import { ChangeCircle, ExitToApp, HowToReg, LockOpen, PeopleAlt, Person } from "@mui/icons-material";
import Image from "next/image";
import { Button, Avatar, Dropdown, Navbar } from "flowbite-react";
import { usePathname } from "next/navigation";
export default function AppNavbar() {

  const { loggedIn, setLoggedIn, logout, currentUser } = UseAppContext();
  const pathname = usePathname();

  console.log(currentUser?.firstname, "vjgvhc");
  // console.log(currentUser?.myFile);

  const displayMyBlog = () => {
    console.log(loggedIn, " logged in ?");
    if (loggedIn) {
      return (
        <>
          <font className='text-lg'>My Blogs</font>
        </>
      )
    }
  }

  return <Navbar fluid rounded>
    <Link href='/'>
    <div className="inline-flex">
      <img src="./blog logo white.png" className="w-full h-14" alt="Blog App Logo" />
    </div>
    </Link>
    <div className="flex md:order-2">
      {
        loggedIn ? (
          <>
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="User settings" img={currentUser?.myFile} rounded className="me-3">
                  <div className="space-y-1 font-medium dark:text-white">
                    <div>{currentUser?.firstname}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{currentUser?.email?.substring(0, 10)}...</div>
                  </div>
                </Avatar>
              }
            >
              <Dropdown.Header className="p-4">
                <span className="block text-lg text-center">Hi, {currentUser?.firstname}</span>
                <span className="text-center block text-sm">{currentUser?.email}</span>
                {/* <span className="block truncate text-sm">{currentUser?.email}</span> */}
              </Dropdown.Header>
              <Dropdown.Item>
                <div className="">
                  <Link href='/profile'>
                    <Button className="" color="light" size='sm' style={{border: 'none'}}><PeopleAlt className='me-2' />Profile</Button>
                  </Link>
                </div>
              </Dropdown.Item>
              <Dropdown.Item>
                <div className="">
                  <Link href='/changepassword'>
                    <Button className="" color="light" size='sm' style={{border: 'none'}}><ChangeCircle className='me-2' />Change Password</Button>
                  </Link>
                </div>
              </Dropdown.Item>
              <Dropdown.Item>
                <div className=""><Button className="" color="light" size='sm' onClick={logout} style={{border: 'none'}}><ExitToApp className='me-2' />Logout</Button></div>
              </Dropdown.Item>
            </Dropdown>
          </>
        ) : <>
          <div>
            <Button color="purple" className="me-3 inline-flex">
              <Link className="" href="/login">
                <LockOpen className="me-2" />Login
              </Link>
            </Button>
            {/* <Button color="purple" >
              <Link className="" href="/signup">
                <HowToReg className="me-2" />Signup
              </Link>
            </Button> */}
          </div>
        </>
      }
      <Navbar.Toggle />
    </div>
    <Navbar.Collapse>
      <Link className={pathname=='/' ? 'active' : ""} href="/" >
        <font className='text-lg'>Home</font>
      </Link>
      <Link className={pathname=='/addblog' ? 'active' : ""} href="/addblog"><font className='text-lg'>Add Blog</font></Link>
      <Link className={pathname=='/myblogs' ? 'active' : ""} href="/myblogs"><font className=''>{displayMyBlog()}</font></Link>
    </Navbar.Collapse>
  </Navbar>

}