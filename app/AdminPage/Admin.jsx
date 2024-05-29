"use client";
import { FolderDot } from "lucide-react";
import React, { useState, useEffect } from "react";
import ARooms from "./ARooms";
import ABooking from "./ABooking";
import APaying from "./APaying";
import AContact from "./AContact";
import AddRoom from "./AddRoom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Admin() {
  const AdminStg = typeof window !== 'undefined' ? localStorage.getItem("admin") : null;
  const [Admin, setAdmin] = useState(AdminStg || "ROOMS");
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.user?.email === "abdellahedaoudi80@gmail.com") {
      router.push("/Admin");
    } else {
      router.push("/HomePage");
    }
  }, [data, router]);

  useEffect(() => {
    localStorage.setItem("admin", Admin);
  }, [Admin]);

  const AdminPages = () => {
    switch (Admin) {
      case "ROOMS":
        return (
          <div>
            <ARooms Admin={Admin} setAdmin={setAdmin} />
          </div>
        );
      case "BOOKING":
        return (
          <div>
            <ABooking />
          </div>
        );
      case "PAYING":
        return (
          <div>
            <APaying />
          </div>
        );
      case "CONTACT":
        return (
          <div>
            <AContact />
          </div>
        );
      case "AddRoom":
        return (
          <div>
            <AddRoom Admin={Admin} setAdmin={setAdmin} />
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="flex h-full border-b-2">
      <div className="flex flex-col bg-gray-800 p-4 md:w-auto w-1/2">
        <button className=" md:w-60 p-2 rounded-md font-medium  text-black py-4 mb-16 bg-white flex gap-2 justify-center">
          <FolderDot /> ADMIN PAGE
        </button>
        <button
          onClick={() => setAdmin("ROOMS")}
          className={`${
            Admin === "ROOMS" ? "bg-white text-black" : ""
          } p-2 rounded-md font-medium w-full py-4 mb-7 `}
        >
          ROOMS
        </button>
        <button
          onClick={() => setAdmin("BOOKING")}
          className={`${
            Admin === "BOOKING" ? "bg-white text-black" : ""
          } p-2 rounded-md font-medium w-full py-4 mb-7`}
        >
          BOOKING
        </button>
        <button
          onClick={() => setAdmin("PAYING")}
          className={`${
            Admin === "PAYING" ? "bg-white text-black" : ""
          } p-2 rounded-md font-medium w-full py-4 mb-7`}
        >
          PAYING
        </button>
        <button
          onClick={() => setAdmin("CONTACT")}
          className={`${
            Admin === "CONTACT" ? "bg-white text-black" : ""
          } p-2 rounded-md font-medium w-full py-4 mb-7`}
        >
          CONTACT
        </button>
      </div>
      <div className="md:w-full  w-1/2">{AdminPages()}</div>
      <ToastContainer />
    </div>
  );
}

export default Admin;
