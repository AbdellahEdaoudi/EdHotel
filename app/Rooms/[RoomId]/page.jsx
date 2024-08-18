"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
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
    const [Paying,setPaying]=useState([]);
    const [isBooking, setIsBooking] = useState(false); // New state


    useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google", { redirect: true, callbackUrl: `/Rooms/${params.RoomId}` });
    } else {
      axios.get(`${process.env.NEXT_PUBLIC_SERVER_URl}/Rooms/${params.RoomId}`)
        .then(res => {
          setrm(res.data);
          setNameR(res.data.name);
          setPrix(res.data.prix);
        });
    }
  }, [router, status]);


    useEffect(() => {
      axios.get(`${process.env.NEXT_PUBLIC_SERVER_URl}/Booking`)
        .then(res => setBooking(res.data));
      axios.get(`${process.env.NEXT_PUBLIC_SERVER_URl}/Checkout`)
        .then(res => setPaying(res.data));
    }, []);

    const PostBoking = async (e) => {
      e.preventDefault();
      setIsBooking(true);
      const checkInDateObj = parseISO(check_in);
     const checkOutDateObj = parseISO(check_out);
     const daysDifference = differenceInDays(checkOutDateObj, checkInDateObj);
     const prixTotal = isNaN(daysDifference) ? 0 : (rm.prix * daysDifference === 0 ? rm.prix : (rm.prix * 2) * daysDifference);
     if (!check_in || !check_out) {
      toast.error("Please select both check-in and check-out dates.", { type: "error", position: "top-center", autoClose: 3000 });
      setIsBooking(false); // Re-enable the button
      return;
    }
      const myDate = new Date(); 
      myDate.setHours(0, 0, 0, 0);
      const checkInDate = new Date(check_in); 
      const checkOutDate = new Date(check_out); 
      
      // Compare check_in and check_out dates with current date
      if (checkInDate < myDate || checkOutDate < myDate) {
        toast.error("Please select dates in the future", { type: "error", position: "top-center", autoClose: 3000 });
        setIsBooking(false); // Re-enable the button
        return;
      }
      
      for (const bkinout of Booking) {
        if (bkinout.nameR === nameR) {
          const checkInDateB = new Date(bkinout.check_in);
          const checkOutDateB = new Date(bkinout.check_out);
          if (
            (checkInDate >= checkInDateB && checkInDate < checkOutDateB) || 
            (checkOutDate > checkInDateB && checkOutDate <= checkOutDateB) ||  
            (checkInDate <= checkInDateB && checkOutDate >= checkOutDateB)
          ) {
            toast.error(`Room is already booked from ${checkInDateB.toDateString()} to ${checkOutDateB.toDateString()}.`, { type: "error", position: "top-center", autoClose: 3000 });
            setIsBooking(false); // Re-enable the button
            return;
          }
        }
      }
      for (const bkinout of Paying) {
        if (bkinout.nameR === nameR) {
          const checkInDateB = new Date(bkinout.check_in);
          const checkOutDateB = new Date(bkinout.check_out);
          if (
            (checkInDate >= checkInDateB && checkInDate < checkOutDateB) || 
            (checkOutDate > checkInDateB && checkOutDate <= checkOutDateB) ||  
            (checkInDate <= checkInDateB && checkOutDate >= checkOutDateB)
          ) {
            toast.error(`Room is already booked from ${checkInDateB.toDateString()} to ${checkOutDateB.toDateString()}.`, { type: "error", position: "top-center", autoClose: 3000 });
            setIsBooking(false); // Re-enable the button
            return;
          }
        }
      }
      if (checkOutDate < checkInDate) {
        toast.error("Your selected check-out date must be after the check-in date", { type: "error", position: "top-center", autoClose: 3000 });
        setIsBooking(false); // Re-enable the button
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URl}/Booking`,
          { nameC, email, nameR, prix: prixTotal, check_in, check_out },
          { headers: { "Content-Type": "application/json" } }
        );
        toast.success("Booking successful", { type: "success", position: "top-center", autoClose: 1000 });
        setTimeout(() => {
          router.push("/Booking");
        }, 1000);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Date is invalid", { type: "error", position: "top-center", autoClose: 3000 });
        } else {
          console.error(error);
          toast.error("An error occurred. Please try again.", { type: "error", position: "top-center", autoClose: 3000 });
        }
      } finally {
        setIsBooking(true); 
      }
    };
    useEffect(() => {
      {status==="unauthenticated" ? signIn("google", {redirect:true, callbackUrl:`/Rooms/${params.RoomId}`}): router.push(`/Rooms/${params.RoomId}`)}
    }, [router]);
  

  
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
      <button 
        onClick={PostBoking} 
        className='text-center mt-1 py-3 rounded-md bg-red-400 w-full' 
        disabled={isBooking} 
      >
        {isBooking ? "Booking..." : "BOOK NOW"}  
      </button> 
         
      </div>
   </div>
   </div>
   </div>
   <ToastContainer />
 </form>
)

}

export default page