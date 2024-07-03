'use client'
import { AppBar, Box, IconButton, Toolbar, MenuIcon, Typography, Button } from "@mui/material";
import { useState } from "react";
import UseAppContext from "./UseContext";
import Link from "next/link";
import { Person } from "@mui/icons-material";
import Image from "next/image";
export default function AppNavbar() {

  const { loggedIn, setLoggedIn, logout, currentUser } = UseAppContext();

  console.log(currentUser?.name);
  // console.log(currentUser?.myFile);

  const displayMyBlog = () => {
    if (loggedIn) {
      return (
        <>
          <a
            href="/myblogs"
            className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          >
            My Blogs
          </a>
        </>
      )
    }
  }

  const displayUserOption = () => {
    if (loggedIn) {
      return (
        <>
          <div className="grid grid-cols-2">
            <div className="inline-flex">
              <img src={currentUser?.myFile} alt="" className="rounded-full w-8 h-8 float-right" />
              <p className= 'ms-2 mt-1'>{currentUser?.firstname}</p> 
            </div>
            <div className="">
              <button type="button" className="ms-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={logout}>Logout</button>
            </div>
          </div>
        </>
      )
    }
    else {
      return (
        <>
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
      )
    }
  }

  return <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a
        className="flex items-center space-x-3 rtl:space-x-reverse"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nextjs-logo.svg/2560px-Nextjs-logo.svg.png"
          className="h-8"
          alt="Next.js Logo"
        />

      </a>
      <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <div className="">
          {displayUserOption()}
        </div>
        <button
          data-collapse-toggle="navbar-sticky"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-sticky"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>
      <div
        className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        id="navbar-sticky"
      >
        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <a
              href="/"
              className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
              aria-current="page"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/addblog"
              className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              Add Blog
            </a>
          </li>
          <li>
            {displayMyBlog()}
          </li>
        </ul>
        {/* <ul>
          {displayUserOption()}
        </ul> */}
      </div>
    </div>
  </nav>

}