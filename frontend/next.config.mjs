/** @type {import('next').NextConfig} */
const nextConfig = {
    env : {
    // backend: "https://blog-app-backend-ud98.onrender.com",
    backend : "http://localhost:5000",
},
    reactStrictMode: false,
    eslint:{ignoreDuringBuilds:true,},
};

export default nextConfig;

//https://blog-app-backend-ud98.onrender.com
