"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from 'axios';
import Link from 'next/link';
function Rooms() {
    const router = useRouter();
    const {data,status}=useSession()
    const [dataH,setdataH]=useState([]);
    const [fil,setFil]=useState("");
    const star = <img src="star.png" alt="star.png" width={22} height={11}/>
    const bed = <img src="sleeping.png" alt="star.png" width={22} height={11}/>
    const wifi = <img src="wifi.png" alt="star.png" width={22} height={11}/>
    const bath = <img src="bathtub.png" alt="star.png" width={22} height={11}/>
    
  
    useEffect(() => {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
      if (!accessToken && status === "unauthenticated") {
        router.push("/Login");
      } else {
        router.push("/Rooms");
      }
    }, [router, status]);
  
    useEffect(() => {
      axios.get('https://ed-hotel-api.vercel.app/Rooms')
        .then((res) => setdataH(res.data))
    },[]);  
  

      return (
        <div className=" pb-10">
          <div className="w-full h-full mt-6 text-center pb-5">
            <h6 className="text-amber-400 mb-2 text-xl font-bold">__---- OUR ROOMS ----__</h6>
            <h1 className="text-4xl  text-black font-bold">Explore Our <span className="text-amber-400 ">ROOMS</span></h1>
          </div>
          <div className="text-center space-x-2 text-black mb-5">
            <button onClick={()=>{setFil("")}} className={`${fil === "" ? "bg-yellow-400" :""} p-3 rounded-md`}>ALL</button>
            <button onClick={()=>{setFil("Single")}}   className={`${fil === "Single" ? "bg-yellow-400" :""} p-3 rounded-md`}>SINGLE</button>
            <button onClick={()=>{setFil("Double")}}   className={`${fil === "Double" ? "bg-yellow-400" :""} p-3 rounded-md`}>DOUBLE</button>
            <button onClick={()=>{setFil("Extended")}} className={`${fil === "Extended" ? "bg-yellow-400" :""} p-3 rounded-md`}>EXTENDED</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mx-7 md:mx-16  ">
            {
              fil === "" ? 
                dataH && dataH.map((rm,i) => (
                  <div className="bg-white rounded-md shadow-md border pb-4" key={i} >
                    <nav className="relative">
                     {/* img */}
                    <img src={rm.imageUrl} alt={rm.name} className="w-full rounded-md " />
                    <span className="absolute -mt-4 ml-4 px-2 py-1  bg-amber-500 text-sm text-white rounded-md">{rm.prix}$/night</span>
                    </nav>
                    <div className="px-5">
                    <p className="pt-4 flex justify-between text-black text-xl font-bold mb-3">{rm.name} 
                    <span className="flex gap-1">{star}{star}{star}{star}{star}</span> 
                    </p>
                    
                    <div className="flex space-x-3 text-gray-800">
                     <span className="flex gap-1 items-center ">{bed} {rm.capacity} bed |</span>
                     <span className="flex gap-1 items-center ">{bath} {rm.capacity} Bath |</span>
                     <span className="flex gap-1 items-center ">{wifi} Wifi </span>
                    </div>
                    <div className="flex justify-between mt-5">
                     <Link href={`/Rooms/${rm._id}`}><button className="p-2 rounded-md hover:scale-105 duration-150 bg-yellow-500 text-white">VIEW DETAIL</button></Link>
                     <Link href={`/Rooms/${rm._id}`}><button className="p-2 rounded-md hover:scale-105 duration-150 bg-black text-white">BOOK NOW</button></Link>
                    </div>
                    </div>
                  </div>
                    ))
              :
              (
                dataH && dataH.filter((flt)=>( flt.type === fil)).map((rm,i) => (
                  <div className="bg-white rounded-md shadow-md border pb-4" key={i} >
                    <nav className="relative">
                     {/* img */}
                     <img src={rm.imageUrl} alt={rm.name} className="w-full rounded-md " />
                    <span className="absolute -mt-4 ml-4 px-2 py-1  bg-amber-500 text-sm text-white rounded-md">{rm.prix}$/night</span>
                    </nav>
                    <div className="px-5">
                    <p className="pt-4 flex justify-between text-black text-xl font-bold mb-3">{rm.name} <span className="flex gap-1">{star}{star}{star}{star}{star}</span> </p>
                    
                    <div className="flex space-x-3 text-gray-800">
                     <span className="flex gap-1 items-center ">{bed} {rm.capacity} bed |</span>
                     <span className="flex gap-1 items-center ">{bath} {rm.capacity} Bath |</span>
                     <span className="flex gap-1 items-center ">{wifi} Wifi </span>
                    </div>
                    <div className="flex justify-between mt-5">
                     <Link href={`/Rooms/${rm._id}`}><button className="p-2 rounded-md hover:scale-105 duration-150 bg-yellow-500 text-white">VIEW DETAIL</button></Link>
                     <Link href={`/Rooms/${rm._id}`}><button className="p-2 rounded-md hover:scale-105 duration-150 bg-black text-white">BOOK NOW</button></Link>
                    </div>
                    </div>
                  </div>
                    ))
              )
            }
          
          </div>
        </div>
      );
    }

export default Rooms