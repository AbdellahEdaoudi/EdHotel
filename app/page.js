"use client"
import { useRouter } from "next/navigation";
import HomePage from "./HomePage/page";
import { useSession } from "next-auth/react";

export default  function Home() {
  const router = useRouter();
  const {data,status}=useSession()
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  if (!accessToken && status === "unauthenticated") {
    router.push("/Login");
  }  return (
    <div >
      <HomePage/>
    </div>
  );
}
