"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { differenceInDays, parseISO } from "date-fns";

function page({ params }) {
  const router = useRouter();
  const { data, status } = useSession();
  const [rm, setRm] = useState({});
  const [nameC, setNameC] = useState(data?.user.name || '');
  const [email, setEmail] = useState(data?.user.email || '');
  const [nameR, setNameR] = useState('');
  const [prix, setPrix] = useState(0);
  const [check_in, setCheckIn] = useState('');
  const [check_out, setCheckOut] = useState('');
  const [booking, setBooking] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken && status === "unauthenticated") {
      router.push("/Login");
    } else {
      fetchRoomDetails();
      fetchBookings();
    }
  }, [router, status]);

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`https://ed-hotel-api.vercel.app/Rooms/${params.RoomId}`);
      setRm(response.data);
      setNameR(response.data.name);
      setPrix(response.data.prix);
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`https://ed-hotel-api.vercel.app/Booking`);
      setBooking(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const PostBooking = async (e) => {
    e.preventDefault();

    if (!check_in || !check_out) {
      toast("Please select both check-in and check-out dates.", {
        type: "error",
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const checkInDateObj = parseISO(check_in);
    const checkOutDateObj = parseISO(check_out);
    const daysDifference = differenceInDays(checkOutDateObj, checkInDateObj);
    const prixTotal = isNaN(daysDifference) ? 0 : (rm.prix * daysDifference);

    if (checkOutDateObj < checkInDateObj) {
      toast("Your selected check-out date must be after the check-in date", {
        type: "error",
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (checkInDateObj < currentDate || checkOutDateObj < currentDate) {
      toast("Please select dates in the future", {
        type: "error",
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    for (const bkinout of booking) {
      const checkInDateB = parseISO(bkinout.check_in);
      const checkOutDateB = parseISO(bkinout.check_out);

      if (
        (checkInDateObj >= checkInDateB && checkInDateObj < checkOutDateB) ||
        (checkOutDateObj > checkInDateB && checkOutDateObj <= checkOutDateB) ||
        (checkInDateObj <= checkInDateB && checkOutDateObj >= checkOutDateB)
      ) {
        const errorMessage = `Room is already booked for the requested dates. It's booked from ${bkinout.check_in} to ${bkinout.check_out}.`;
        toast(errorMessage, {
          type: "error",
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
    }

    try {
      const response = await axios.post(
        `https://ed-hotel-api.vercel.app/Booking`,
        { nameC, email, nameR, prix: prixTotal, check_in, check_out },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      toast("Booking successful", {
        type: "success",
        position: "top-center",
        autoClose: 1000,
      });
      setTimeout(() => {
        router.push("/Booking");
      }, 500);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast("Invalid date", {
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

  return (
    <form method="post" className="pt-3 pb-36 bg-gray-100">
      {/* Room Details */}
      <div className='mx-5 md:mx-16 md:flex'>
        <div className="bg-white rounded-md shadow-md border pb-4">
          <nav className="relative">
            <img src={rm.imageUrl} alt={rm.name} className="w-full" />
            <span className="absolute -mt-4 ml-4 px-2 py-1 bg-amber-500 text-sm text-white rounded-md">{rm.prix}$/night</span>
          </nav>
          <div className="px-5">
            <p className="pt-4 flex justify-between text-black text-xl font-bold mb-3">{rm.name}</p>
            <div className="flex space-x-3 text-gray-800">
              <span className="flex items-center">{bed} {rm.capacity} bed |</span>
              <span className="flex items-center">{bath} {rm.capacity} Bath |</span>
              <span className="flex items-center">{wifi} Wifi</span>
            </div>
            <div className="text-gray-800 px-3">
              <span className="font-bold text-black">Description Room:</span> {rm.description}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className='text-xl mt-3 text-black w-full justify-between px-5'>
          <div className='md:-mt-2.5'>
            <p className='text-center py-3 bg-orange-300 rounded-t-md'>Book Your Room</p>
            <div className='bg-orange-100 px-10 py-4'>
              <span>Name <br /><input value={nameC} placeholder="Name" onChange={(e) => { setNameC(e.target.value) }} type="text" className='bg-gray-200 rounded-md p-2 border w-full' /></span><br />
              <span>Email <br /><input value={email} placeholder="example@gmail.com" onChange={(e) => { setEmail(e.target.value) }} type="text" className='bg-gray-200 rounded-md p-2 border w-full' /></span><br />
              <span>Check in <br /><input onChange={(e) => { setCheckIn(e.target.value) }} type="date" className='bg-gray-200 rounded-md p-2 border w-full' /></span><br />
              <span>Check out <br /><input onChange={(e) => { setCheckOut(e.target.value) }} type="date" className='bg-gray-200 rounded-md p-2 border w-full mb-1' /></span>
              <span>Prix/$ <br /><input value={prix} onChange={(e) => { setPrix(e.target.value) }} type="text" className='bg-gray-200 rounded-md p-2 border w-full' /></span><br />
              <button onClick={PostBooking} className='text-center mt-1 py-3 rounded-md bg-red-400 w-full'>BOOK NOW</button>
            </div>
   </div>
   </div>
   </div>
   <ToastContainer />
 </form>
)

}

export default page