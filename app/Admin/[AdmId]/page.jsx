"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FolderDot, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Page({ params }) {
  const router = useRouter();
  const [ImageRoom, setImageRoom] = useState(null);
  const formRef = useRef(null);
  const [imageUrl, setimageUrl] = useState("");
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [type, settype] = useState("");
  const [capacity, setCapacity] = useState("");
  const [prix, setprix] = useState("");

  useEffect(() => {
    axios
      .get(`https://ed-hotel-api.vercel.app/Rooms/${params.AdmId}`)
      .then((res) => {
        setimageUrl(res.data.imageUrl);
        setname(res.data.name);
        setdescription(res.data.description);
        settype(res.data.type);
        setCapacity(res.data.capacity);
        setprix(res.data.prix);
      });
  }, [params.AdmId]);

  const Image = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageRoom(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const UpdateRoom = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    try {
      const response = await axios.put(`https://ed-hotel-api.vercel.app/Rooms/${params.AdmId}`, formData);
      console.log(response.data);
      toast("Room Update successfully", {
        type: "success",
        position: "top-center",
        autoClose: 1000,
      });
      router.push('/Admin');
      formRef.current.reset();
      setImageRoom(null); 
    } catch (error) {
      console.error('There was an error uploading the room!', error);
      toast('There was an error uploading the room!', {
        type: "error",
        position: "top-center",
        autoClose: 5000,
      });
    }
  };
  const Logout =  () => {
    localStorage.removeItem("accessTokenAdmin");
    router.push("/AdminLogin")
  };
  return (
    <div className="flex border-b-2">
      <div className="flex flex-col bg-gray-800 p-4 md:w-auto w-1/2">
      <button className=" md:w-60 p-2 rounded-md font-medium  text-black py-4 mb-16 bg-white flex gap-2 items-center justify-around">
        <span title="LogOut "
                  className="bg-red-500 p-1 rounded-md text-white"
                  onClick={Logout}
                >
                  <LogOut />
          </span>
          <span className="flex gap-2"><FolderDot /> ADMIN PAGE </span>
        </button>
        <span onClick={() => {
          localStorage.setItem("admin", "ROOMS");
          router.push('/Admin');
        }} className="p-2 rounded-md font-medium w-full text-gray-400 py-4 mb-7 text-center cursor-pointer">
          ROOMS
        </span>
        <span onClick={() => {
          localStorage.setItem("admin", "BOOKING");
          router.push('/Admin');
        }} className="p-2 rounded-md font-medium w-full text-gray-400 py-4 mb-7 text-center cursor-pointer">
          BOOKING
        </span>
        <span onClick={() => {
          localStorage.setItem("admin", "PAYING");
          router.push('/Admin');
        }} className="p-2 rounded-md font-medium w-full text-gray-400 py-4 mb-7 text-center cursor-pointer">
          PAYING
        </span>
        <span onClick={() => {
          localStorage.setItem("admin", "CONTACT");
          router.push('/Admin');
        }} className="p-2 rounded-md font-medium w-full text-gray-400 py-4 mb-7 text-center cursor-pointer">
          CONTACT
        </span>
      </div>
      <div className="flex p-6">
        <form ref={formRef} onSubmit={UpdateRoom} className="flex flex-col space-y-4 p-5">
          <input
            onChange={Image}
            type="file"
            name="image"
            className="bg-white p-3 border border-black rounded-md w-96"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
            name="name"
            placeholder="Name Room"
            className="bg-white p-3 border border-black rounded-md w-96"
          />
          <textarea
            type="text"
            name="description"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            placeholder="Description Room"
            className="bg-white p-3 border border-black rounded-md w-96"
          />
          <select
            name="type"
            value={type}
            onChange={(e) => settype(e.target.value)}
            className="bg-white p-3 border border-black rounded-md w-96"
          >
            <option value="">-------</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Extended">Extended</option>
          </select>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            name="capacity"
            placeholder="Capacity"
            className="bg-white p-3 border border-black rounded-md w-96"
          />
          <input
            type="number"
            value={prix}
            onChange={(e) => setprix(e.target.value)}
            name="prix"
            placeholder="Prix"
            className="bg-white p-3 border border-black rounded-md w-96"
          />
          <button type="submit" className="p-4 bg-yellow-500 text-black rounded-md">
            Update
          </button>
        </form>
        <div className="md:block hidden p-6">
          {ImageRoom ? (
            <img
              src={ImageRoom}
              alt="ImageRoom"
              className="rounded-md w-full h-auto"
            />
          ) : (
            <img
              src={imageUrl}
              alt="ImageRoom"
              className="rounded-md w-full h-auto"
            />
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Page;
