"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Home from "../Pages/Home";
import Rooms from "../Pages/Rooms";
import About from "../Pages/About";
import Servise from "../Pages/Servise";
import Contact from "../Pages/Contact";

function Page() {
  const router = useRouter();
  const {data,status}=useSession()


  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
    if (!accessToken && status === "unauthenticated") {
      router.push("/Login");
    } else {
      router.push("/");
    }
  }, [router, status]);
  
    return (
      <div>
      <Home />
      <Rooms />
      <About />
      <Servise />
      <Contact />
      </div>
    );
  }

export default Page;
