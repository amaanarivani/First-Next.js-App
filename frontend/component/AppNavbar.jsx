'use client'
import { AppBar, Box, IconButton, Toolbar, MenuIcon, Typography } from "@mui/material";
import { useState } from "react";
import UseAppContext from "./UseContext";
import Link from "next/link";
import { Person } from "@mui/icons-material";
import Image from "next/image";
import { Button, Avatar, Dropdown, Navbar } from "flowbite-react";
export default function AppNavbar() {

  const { loggedIn, setLoggedIn, logout, currentUser } = UseAppContext();

  console.log(currentUser?.name);
  // console.log(currentUser?.myFile);

  const displayMyBlog = () => {
    if (loggedIn) {
      return (
        <>
          <Link
            href="/myblogs"
            className="text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          >
            <font className='text-lg'>My Blogs</font>
          </Link>
        </>
      )
    }
  }

  return <Navbar fluid rounded>
  <Navbar.Brand href="https://flowbite-react.com">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nextjs-logo.svg/2560px-Nextjs-logo.svg.png" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
  </Navbar.Brand>
  <div className="flex md:order-2">
    {
      loggedIn ? (
        <>
        <Dropdown
      arrowIcon={false}
      inline
      label={
        <Avatar alt="User settings" img={currentUser?.myFile} rounded className="me-3" />
      }
    >
      <Dropdown.Header>
        <span className="block text-sm text-center">{currentUser?.firstname + currentUser?.lastname}</span>
        {/* <span className="block truncate text-sm">{currentUser?.email}</span> */}
      </Dropdown.Header>
      <Dropdown.Item>
      <div className="block m-auto"><Button className="float-center" color="blue" size='sm' onClick={logout}>Logout</Button></div>
      </Dropdown.Item>
    </Dropdown>
        </>
      ) : <>
      <button type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-3">
            <Link className="" href="/login">
              Login
            </Link>
          </button>

          <button type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ms-3">
            <Link className="" href="/signup">
              Signup
            </Link>
          </button>
      </>
    }
    <Navbar.Toggle />
  </div>
  <Navbar.Collapse>
    <Navbar.Link href="/">
      <font className='text-lg'>Home</font>
    </Navbar.Link>
    <Navbar.Link href="/addblog"><font className='text-lg'>Add Blog</font></Navbar.Link>
    <Navbar.Link href="">{displayMyBlog()}</Navbar.Link>
  </Navbar.Collapse>
</Navbar>

}