import { Inter } from "next/font/google";
import "./globals.css";
import AppNavbar from "@/component/AppNavbar";
import { AppProvider } from "@/component/UseContext";
import Script from 'next/script'


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fist Next App",
  description: "Generated by create next app",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
      
      </head>
      <body className={inter.className}>
        <AppProvider>
        <AppNavbar/>
        {children}
        </AppProvider>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.4.1/flowbite.min.js"/>
      </body> 
    </html>
  );
}