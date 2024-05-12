"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {School,UsersRound,Users} from "lucide-react"
import Test from "../Pages/Test"
function page() {
  const router = useRouter();
  const {data,status}=useSession()


  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    {!accessToken && status==="unauthenticated" ? router.push("/Login"): router.push("/About")}
  }, [router]);
  return (
    <div className=" bg-gray-50">
        <Test name="ABOUT" />
        {/* ABOUT */}
        <About />
    </div>
  )
}

export default page

export  function About() {
  return (
    <div>
        {/* ABOUT */}
        <div className="flex flex-col-reverse md:flex md:flex-row-reverse mx-5 md:mx-32 py-16 justify-between items-center">
        <div className=" md:w-1/2   text-black">
          <p className="font-bold text-yellow-500 text-xl mb-4">__--- ABOUT US---__</p>
          <p className="text-4xl  mb-8 font-bold ">Welcome to <span className="text-yellow-500">EDHOTEL</span></p>
          <p className="mb-6 text-gray-600">
             In our application, we strive to provide a unique and distinctive
             experience to our valued guests. We pride ourselves on providing exceptional 
             service and excellent facilities to ensure your comfort and well-being during your stay with us.
          </p>
          <div className="flex w-full justify-between mb-6 gap-2">
            <p className="w-full h-36  border-2 rounded-md flex flex-col items-center justify-center space-y-2 ">
              <span className="text-yellow-600"><School />    </span>
              <span className="text-3xl "> 7861 </span><span>Rooms</span>
            </p>
            <p className="w-full h-36  border-2 rounded-md flex flex-col items-center justify-center space-y-2 ">
              <span className="text-yellow-600"><Users />     </span>
              <span className="text-3xl "> 1234 </span><span>Staffs</span>
            </p>
            <p className="w-full h-36  border-2 rounded-md flex flex-col items-center justify-center space-y-2 ">
              <span className="text-yellow-600"><UsersRound /></span>
              <span className="text-3xl "> 4657 </span><span>Clients</span>
            </p>
          </div>
          <button className="px-8 ml-7 py-4 rounded-md bg-yellow-500 text-white">EXPLORE MORE</button>
        </div>
        <div>
        <img src="about-1.jpg" alt="about-1.jpg"  className=" rounded-md md:mb-0 mb-8"/>
        </div>
        </div>

        
    </div>
  )
}

