"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { differenceInDays, parseISO } from "date-fns";

function page({params}) {
    const router = useRouter();
    const {data,status}=useSession()
    const nameuser = typeof window !== 'undefined' ? localStorage.getItem("nameuser") : null;
    const star = <img src="/star.png" alt="star.png" width={22} height={11}/>
    const bed = <img src="/sleeping.png" alt="star.png" width={22} height={11}/>
    const wifi = <img src="/wifi.png" alt="star.png" width={22} height={11}/>
    const bath = <img src="/bathtub.png" alt="star.png" width={22} height={11}/>
    const [rm,setrm]=useState([]);
    const [nameC, setNameC] = useState(data?.user.name);
    const [email, setEmail] = useState(data?.user.email);
    const [nameR, setNameR] = useState('');
    const [prix, setPrix] = useState(0);
    const [check_in, setCheckIn] = useState('');
    const [check_out, setCheckOut] = useState('');
    const [Booking,setBooking]=useState([]);

    useEffect(() => {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
      if (!accessToken && status === "unauthenticated") {
        router.push("/Login");
      } else {
        router.push(`/Rooms/${params.RoomId}`);
      }
    }, [router, status]);

    useEffect(() => {
      axios.get(`${process.env.NEXTAUTH_URL}/api/Booking`)
        .then((res) => setBooking(res.data))
    },[]);

    const PostBoking = async (e) => {
      const checkInDateObj = parseISO(check_in);
     const checkOutDateObj = parseISO(check_out);
     const daysDifference = differenceInDays(checkOutDateObj, checkInDateObj);
     const prixTotal = isNaN(daysDifference) ? 0 : (rm.prix * daysDifference === 0 ? rm.prix : (rm.prix * 2) * daysDifference);
     e.preventDefault();
      if (!check_in || !check_out) {
        toast("Please select both check-in and check-out dates.", {
          type: "error", // Can be 'success', 'error', 'info', etc.
          position: "top-center", // Adjust position as needed
          autoClose: 3000, // Milliseconds before auto-dismissal
        });
        return;
      }
      const myDate = new Date(); 
      myDate.setHours(0, 0, 0, 0);
      const checkInDate = new Date(check_in); 
      const checkOutDate = new Date(check_out); 
      
      // Compare check_in and check_out dates with current date
      if (checkInDate < myDate || checkOutDate < myDate) {
        toast("Please select dates in the future", {
          type: "error",
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
      
      for (const bkinout of Booking) {
        if (bkinout.nameR !== nameR) {
          continue; 
        }
        const checkInDateB = new Date(bkinout.check_in);
        const checkOutDateB = new Date(bkinout.check_out);
    
        if (
          (checkInDate >= checkInDateB && checkInDate < checkOutDateB) || 
          (checkOutDate > checkInDateB && checkOutDate <= checkOutDateB) ||  
          (checkInDate <= checkInDateB && checkOutDate >= checkOutDateB)  
        ) {
          const DateInInBooking = `${checkInDateB.getFullYear()}-${checkInDateB.getMonth() + 1}-${checkInDateB.getDate()}`;
          const DateOutInBooking = `${checkOutDateB.getFullYear()}-${checkOutDateB.getMonth() + 1}-${checkOutDateB.getDate()}`;
          const errorMessage = `Room is already booked for the requested dates. It's booked from ${DateInInBooking} to ${DateOutInBooking}.`;
          toast(errorMessage, {
            type: "error",
            position: "top-center",
            autoClose: 3000,
          });
          return;
        }
        
      }
      
      if (checkOutDate < checkInDate) {
        toast("Your selected check-out date must be after the check-in date", {
          type: "error",
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.NEXTAUTH_URL}/api/Booking`,
          {nameC,email,nameR,prix:prixTotal,check_in,check_out},
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log(response.data);
        toast("Booking succesfully", {
          type: "success", // Can be 'success', 'error', 'info', etc.
          position: "top-center", // Adjust position as needed
          autoClose: 1000, // Milliseconds before auto-dismissal
        });
        setTimeout(() => {
          router.push("/Booking")
          },500);
        // router.push("/Booking")
      } catch (error) {
  if (error.response && error.response.status === 400) {
    toast("date is invalid", {
      type: "error",
      position: "top-center",
      autoClose: 3000,
    });
  } else {
    console.error(error);
    toast("An error occurred. Please try again.", {
      type: "error",
      position: "top-center",
      autoClose: 3000,
    });
  }
}
    };
    useEffect(() => {
      const accessToken = localStorage.getItem("accessToken");
      {!accessToken && status==="unauthenticated" ? router.push("/Login"): router.push(`/Rooms/${params.RoomId}`)}
    }, [router]);
  

  useEffect(() => {
    axios.get(`${process.env.NEXTAUTH_URL}/api/Rooms/${params.RoomId}`)
      .then((res)=>{setrm(res.data);
        setNameR(res.data.name);
        setPrix(res.data.prix);
      })
  },[]);
     const checkInDateObj = parseISO(check_in);
     const checkOutDateObj = parseISO(check_out);
     const daysDifference = differenceInDays(checkOutDateObj, checkInDateObj);
     const prixTotal=  (rm.prix*2) * daysDifference

  return (
    <form method="post" className=" pt-3 pb-36 bg-gray-100">
    {/* ROOMS BY ID */}
   <div className=' mx-5 md:mx-16   md:flex '>

   <div className="bg-white rounded-md shadow-md border pb-4"  >
                    <nav className="relative">
                     {/* img */}
                    <img src={rm.imageUrl} alt={rm.name} className="w-full " />
                    <span className="absolute -mt-4 ml-4 px-2 py-1  bg-amber-500 text-sm text-white rounded-md">{rm.prix}$/night</span>
                    </nav>
                    <div className="px-5">
                    <p className="pt-4 flex justify-between text-black text-xl font-bold mb-3">{rm.name} <span className="flex gap-1">{star}{star}{star}{star}{star}</span> </p>
                    
                    <div className="flex space-x-3 text-gray-800">
                     <span className="flex gap-1 items-center ">{bed} {rm.capacity} bed |</span>
                     <span className="flex gap-1 items-center ">{bath} {rm.capacity} Bath |</span>
                     <span className="flex gap-1 items-center ">{wifi} Wifi </span>
                    </div>
                    <div className="text-gray-800 px-3">
                      <span className="font-bold text-black">Description Room : </span>{rm.description}
                    </div>
                    </div>
                  </div>
   
   <div className=' text-xl mt-3 text-black w-full   justify-between px-5'>
    {/* Boking */}
    <div className='md:-mt-2.5 '>
    <p className='text-center py-3 bg-orange-300 rounded-t-md '>Book Your Room</p>
    <div className='bg-orange-100 px-10 py-4'>
      <span>Name <br /> <input value={data?.user.name} placeholder="Name" onChange={(e)=>{setNameC(e.target.value)}} type="text" name="" id="" className='bg-gray-200 rounded-md p-2 border  w-full ' /></span><br />
      <span>Email <br /><input value={data?.user.email} placeholder="exemple@gmail.com" onChange={(e)=>{setEmail(e.target.value)}} type="text" name="" id="" className='bg-gray-200 rounded-md p-2 border  w-full ' /></span><br />
      <span>Check in <br /><input onChange={(e)=>{setCheckIn(e.target.value)}} type="date" name="" id="" className='bg-gray-200 rounded-md p-2 border  w-full ' /></span><br />
      <span>Check out <br /><input onChange={(e)=>{setCheckOut(e.target.value)}} type="date" name="" id="" className='bg-gray-200 rounded-md p-2 border w-full mb-1' /></span>
      <span>Prix/$ <br /><input value={Number(`${isNaN(daysDifference) ? 0 : (rm.prix * daysDifference === 0 ? rm.prix : (rm.prix * 2) * daysDifference)}`)} onChange={(e)=>{setPrix(e.target.value)}} type="text" name="" id="" className='bg-gray-200 rounded-md p-2 border  w-full ' /></span><br />
      <button onClick={PostBoking} className='text-center mt-1 py-3 rounded-md bg-red-400 w-full '>BOOK NOW</button>
    </div>
   </div>
   </div>
   </div>
   <ToastContainer />
 </form>
)

}

export default page