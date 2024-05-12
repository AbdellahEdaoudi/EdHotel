"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Test from "../Pages/Test"
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Page() {
    return (
      <div>
        <Test name="CONTACT" />
        {/* CONTACT */}
        <Contact />
      </div>
    );
  }
export default Page;

export function Contact() {
  const router = useRouter();
  const {data,status}=useSession()
  const nameuser = typeof window !== 'undefined' ? localStorage.getItem("nameuser") : null;
  const emaill = <img src="email.png" alt="star.png" width={22} height={11}/>
  const [name, setName] = useState(`${data?.user?.name} ${nameuser}`);
  const [email, setEmail] = useState(data?.user?.email);
  const [subject, setsubject] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const PostContact = async (e) => {
    e.preventDefault();
    if (!name || !emaill || !subject || !msg) {
      toast("Please fill in all fields and provide a valid email.", {
        type: "error", // Can be 'success', 'error', 'info', etc.
        position: "top-center", // Adjust position as needed
        autoClose: 3000, // Milliseconds before auto-dismissal
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:4444/Contact",
        { name, email,subject, msg },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      toast("sent succesfully", {
        type: "success", // Can be 'success', 'error', 'info', etc.
        position: "top-center", // Adjust position as needed
        autoClose: 3000, // Milliseconds before auto-dismissal
      });
      // router.push("/")
      setName("");
      setEmail("");
      setsubject("")
      setMsg("");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("");
      toast("An error occurred. Please try again.", {
        type: "error", // Can be 'success', 'error', 'info', etc.
        position: "top-center", // Adjust position as needed
        autoClose: 3000, // Milliseconds before auto-dismissal
      });
    }finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
    if (!accessToken && status === "unauthenticated") {
      router.push("/Login");
    } else {
      router.push("/Contact");
    }
  }, [router, status]);

    return (
      <div>
        {/* CONTACT */}
        <div className="w-full h-full mt-7 text-center">
          <h6 className="text-amber-400 mb-2 text-xl font-bold">__---- CONTACT US ----__</h6>
          <h1 className="text-4xl mb-10 text-black font-bold">Contact <span className="text-amber-400 ">FOR ANY QUERY</span></h1>
        </div>
        <div className="text-amber-500 md:space-y-0  space-y-7 md:flex md:justify-between mx-5 md:mx-16  mb-5 ">
          <span className="font-bold">BOKING   ----- <span className="flex gap-2 text-gray-500 font-normal">{emaill} book@Hotel.app</span></span>
          <span className="font-bold">TECHNICAL----- <span className="flex gap-2 text-gray-500 font-normal">{emaill} tech@Hotel.app</span></span>
          <span className="font-bold">GENERAL  ----- <span className="flex gap-2 text-gray-500 font-normal">{emaill} info@Hotel.app</span></span>
        </div>
        <form  method="post" className="mx-5 md:mx-16 md:flex  gap-4 py-10">
        <div className="md:w-1/2 md:mb-0 mb-5 " data-wow-delay="0.1s">
              <iframe
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13413.497715884776!2d-13.19815!3d27.154256!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc37731e21ffd02f%3A0xb5d8ba3b30a4a46b!2sH%C3%B4tel%20Al%20Massira!5e0!3m2!1sen!2sbd!4v1643685191346!5m2!1sen!2sbd
                "
                frameborder="0"
                style={{ minHeight: "350px", border: "0" }}
                allowfullscreen=""
                aria-hidden="false"
                tabindex="0"
              ></iframe>
       </div>
          <div className="md:w-1/2 w-full ">
            <nav className=" md:flex">
              <input value={`${data?.user?.name ? `${data?.user?.name}` : `${nameuser}` }`} onChange={(e)=>{setName(e.target.value)}} type="text" placeholder="Your Name"  className=" mr-3 p-4 mb-5 bg-white text-black rounded-md border  w-full" />
              <input value={data?.user?.email} onChange={(e)=>{setEmail(e.target.value)}} type="text" placeholder="Your Email" className="p-4 mb-5 bg-white text-black rounded-md border w-full" />
            </nav>
            <input onChange={(e)=>{setsubject(e.target.value)}} placeholder="Subject" type="text" className="p-4 mb-5 bg-white text-black rounded-md border w-full" />
            <textarea onChange={(e)=>{setMsg(e.target.value)}} placeholder="Message"  className="p-4 bg-white h-36 text-black rounded-md border w-full " />
            <button onClick={PostContact}  className="w-full p-4 bg-amber-500  text-white rounded-md">SEND MESSAGE</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    );
  }
