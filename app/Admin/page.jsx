"use client";
import React, { useEffect } from "react";
import Admin from "../AdminPage/Admin";
import { useRouter } from "next/navigation";

function page() {
  const accessTokenAdmin = typeof window !== 'undefined' ? localStorage.getItem("accessTokenAdmin") : null;
  const router = useRouter()
  useEffect(() => {
    if (accessTokenAdmin) {
      router.push("/Admin");
    } else {
      router.push("/AdminLogin");
    }
  }, [router]);
  return (
    <div>
      <Admin />
    </div>
  );
}

export default page;
