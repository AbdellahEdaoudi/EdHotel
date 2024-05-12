"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { About } from "../About/page";
import { Rooms } from "../Rooms/page";
import { Servise } from "../Services/page";
import { Contact } from "../Contact/page";
import Link from "next/link";

function Page() {
  const router = useRouter();
  const {data,status}=useSession()


  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    {!accessToken && status==="unauthenticated" ? router.push("/Login"): router.push("/")}
  }, [router]);

    return (
      <>
    <div className="carousel w-full md:-mt-24 ">
      {/* img1 */}
  <div id="img1" className="carousel-item  relative w-full ">
    <img src="carousel-1.jpg" className="w-full brightness-50" />
    <div className=" absolute   text-center text-white w-full  h-full flex items-center justify-between px-20 text-2xl md:text-6xl font-bold">
    <a href="#img3" className="animate__animated animate__slideInLeft" >❮</a> 
    <p className="animate__animated animate__slideInDown">
    Unveiling the World's <br /> Finest Hotels <br />
    <p className="space-x-2 text-[13px] md:text-[20px] mt-7 flex justify-center">
      <Link href={"/Rooms"} className=" animate__animated animate__slideInLeft px-2 py-1 md:px-4 md:py-4 rounded-md bg-yellow-500">OUR ROOM</Link>
      <Link href={"/Rooms"} className=" animate__animated animate__slideInRight px-2 py-1 md:px-4 md:py-4 rounded-md bg-white text-black">BOOK ROOM</Link>
    </p>
    </p>
    <a href="#img2" className="animate__animated animate__slideInRight" >❯</a>
    </div>
  </div> 
      {/* img2 */}
  <div id="img2" className="carousel-item  relative w-full">
    <img src="image.jpg" className="w-full brightness-50" />
    <div className="absolute   text-center text-white w-full  h-full flex items-center justify-between px-20 text-2xl md:text-6xl font-bold">
    <a href="#img1" >❮</a> 
    <p>
    Unveiling the World's <br /> Finest Hotels <br />
    <p className="space-x-2 text-[13px] md:text-[20px] mt-7 flex justify-center">
      <Link href={"/Rooms"}  className="px-2 py-1 md:px-4 md:py-4 rounded-md bg-yellow-500 text-white">OUR ROOM</Link>
      <Link href={"/Rooms"}  className="px-2 py-1 md:px-4 md:py-4 rounded-md bg-white text-black">BOOK ROOM</Link>
    </p>
    </p>
    <a href="#img3" >❯</a>
    </div>
  </div> 
     {/* img3 */}
     <div id="img3" className="carousel-item  relative w-full">
    <img src="carousel-2.jpg" className="w-full brightness-50" />
    <div className="absolute   text-center text-white w-full  h-full flex items-center justify-between px-20 text-2xl md:text-6xl font-bold">
    <a href="#img2" >❮</a> 
    <p>
    Unveiling the World's <br /> Finest Hotels <br />
    <p className="space-x-2 text-[13px] md:text-[20px] mt-7 flex justify-center">
      <Link href={"/Rooms"} className=" px-2 py-1 md:px-4 md:py-4 rounded-md bg-yellow-500">OUR ROOM</Link>
      <Link href={"/Rooms"} className=" px-2 py-1 md:px-4 md:py-4 rounded-md bg-white text-black">BOOK ROOM</Link>
    </p>
    </p>
    <a href="#img1" >❯</a>
    </div>
  </div> 
    </div>
      <Rooms />
      <About />
      <Servise />
      <Contact />
      </>
    );
  }

export default Page;
