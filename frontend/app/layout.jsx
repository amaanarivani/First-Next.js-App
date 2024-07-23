'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import AppNavbar from "@/component/AppNavbar";
import { AppProvider } from "@/component/UseContext";
import Script from 'next/script'
import AppFooter from "@/component/AppFooter";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";



const inter = Inter({ subsets: ["latin"] });

const metadata = {
  title: "Blog App",

};


export default function RootLayout({ children }) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />

      </head>
      <body className={inter.className}>
        <Toaster
        // position="top-right"
        // reverseOrder={false}
        />
        <AppProvider>
          <AppNavbar />
          {children}
        </AppProvider>
        {(pathname == "/") ? <AppFooter /> : ""}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.4.1/flowbite.min.js" />
        <Script src="../path/to/flowbite/dist/flowbite.min.js" />  
      </body>
    </html>
  );
}