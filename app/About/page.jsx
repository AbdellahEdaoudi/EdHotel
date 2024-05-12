"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Test from "../Pages/Test"
import About from "../Pages/About";
function page() {
  const router = useRouter();
  const {data,status}=useSession()


  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
    if (!accessToken && status === "unauthenticated") {
      router.push("/Login");
    } else {
      router.push("/About");
    }
  }, [router, status]);

  return (
    <div className=" bg-gray-50">
        <Test name="ABOUT" />
        {/* ABOUT */}
        <About />
    </div>
  )
}

export default page



