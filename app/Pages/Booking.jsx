"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { differenceInDays, format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Link from "next/link";
export  function Booking() {
    const router = useRouter();
    const {data,status}=useSession()
    const [Booking,setBooking]=useState([]);

    const DeleteAll = () => {
      const userBookings = Booking.filter((bk) => bk.email === data?.user.email);
    
      axios.delete(`https://ed-hotel-api.vercel.app/BookingdAll`, {
        data: { bookings: userBookings }
      })
      .then(data => {
        console.log(data);
        window.location.reload();
      })
      .catch(err => console.log(err));
    }
    

    const Delete = (id) => {
      axios.delete(`https://ed-hotel-api.vercel.app/Booking/${id}`)
          .then(data => {
              console.log(data);
              window.location.reload();
          })
          .catch(err => console.log(err));
      }
    
    useEffect(() => {
    const intervalId = setInterval(() => {
      axios.get('https://ed-hotel-api.vercel.app/Booking')
        .then(res => setBooking(res.data))
        .catch(error => console.error('Error fetching bookings:', error));
    }, 1);

    return () => clearInterval(intervalId);
  }, []);

    useEffect(() => {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
      {!accessToken && status==="unauthenticated" ? router.push("/Login"): router.push("/Booking")}
    }, [router]);
      console.log('====================================');
      console.log(data?.user.email);
      console.log('====================================');

  const getTotal = () => {
    let Total = 0;
    Booking.filter((bk) => bk.email === data?.user.email).reduce((tt, total) => {
      Total += total.prix; 
    }, 0);
    return Total;
  };
  
  
      return (
        <div className="pb-16 mt-5">
          <div className={`float-end mx-5 md:mx-32 ${Booking.filter((bk) => bk.email === data?.user.email).length === 0 ? "hidden" : ""}`}>
          <button onClick={DeleteAll} 
          className={`p-2 bg-amber-400 rounded-md mr-2 text-black   
          `}>
           CANCEL ALL  RESERVATION
          </button>
            <button onClick={()=> router.push(`/Checkout?amount=${getTotal()}`)} className="p-2 bg-sky-500 rounded-md text-black  ">PAYING</button>
          </div> <br /><br />
          {Booking.filter((bk) => bk.email === data?.user.email).length > 0 ? 
          Booking.filter((bk) => bk.email === data?.user.email).map((bk,i)=>{
          const checkInDate = new Date(bk.check_in);
          const checkOutDate = new Date(bk.check_out);
          const formattedCheckIn = format(checkInDate, "MMMM do, yyyy", { locale: enUS });
          const formattedCheckOut = format(checkOutDate, "MMMM do, yyyy", { locale: enUS }); 
          //
          const checkInDateObj = parseISO(bk.check_in);
          const checkOutDateObj = parseISO(bk.check_out);
          const daysDifference = differenceInDays(checkOutDateObj, checkInDateObj);  
          //
          const myDate = new Date(); 
          myDate.setHours(0, 0, 0, 0);
          // const checkInDt = new Date(bk.check_in); 
          const checkOutDt = new Date(bk.check_out); 
          if (checkOutDt < myDate) {
            Delete(bk._id)
          }
          else{
            return (
             <div key={i} className=" md:flex items-center justify-around text-black   bg-stone-200 mx-5 md:mx-32 my-5 rounded-md p-6">
               <p>{bk.nameR}</p>
               <p>
               <span className="text-amber-600">FROM: </span>{formattedCheckIn}&nbsp;&nbsp;
               <span className="text-amber-600">TO: </span>{formattedCheckOut}
               </p>
               <p>
                <span className="text-amber-600">Prix : </span> {`${bk.prix}`}$
               </p>
               <button onClick={()=>{Delete(bk._id);}} className="p-2 bg-amber-400 rounded-md ">CANCEL RESERVATION</button>
             </div>
           );
          }
           }) : 
           <div className="h-96 w-full text-center ">
            <p className="text-4xl text-black">You don't have any reservation</p><br />
            <Link className="p-4 rounded-md bg-amber-400 text-black "  href={"/Rooms"}>GO TO ROOMS PAGE</Link>
            </div>}
        </div>
      );
    }

export default Booking