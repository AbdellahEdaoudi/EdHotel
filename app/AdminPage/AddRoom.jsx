"use client"
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function AddRoom({setAdmin}) {
  const formRef = useRef(null);
  const [ImageRoom, setImageRoom] = useState(null);
  const [loading,setLoading]=useState(false);

  const PostRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(formRef.current);
    try {
      const response = await axios.post('https://ed-hotel-api.vercel.app/Rooms', formData);
      console.log(response.data);
      toast("Room added successfully", {
        type: "success",
        position: "top-center",
        autoClose: 1000,
      });
      formRef.current.reset();
      setImageRoom(null);
    } catch (error) {
      console.error('There was an error uploading the room!', error);
      toast('There was an error uploading the room!', {
        type: "error",
        position: "top-center",
        autoClose: 5000,
      });
    setLoading(false);
    } finally{
    setLoading(false);
    }
  };

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

  return (
    <div className='flex'>
      <form ref={formRef} onSubmit={PostRoom} className="flex flex-col space-y-4 p-5">
        <input 
         onChange={Image}
          type="file" 
          name="image" 
          className="bg-white p-3 border border-black rounded-md w-96" 
        />
        <input 
          type="text" 
          name="name" 
          placeholder="Name Room" 
          className="bg-white p-3 border border-black rounded-md w-96" 
        />
        <input 
          type="text" 
          name="description" 
          placeholder="Description Room" 
          className="bg-white p-3 border border-black rounded-md w-96" 
        />
        <select 
          name="type" 
          className="bg-white p-3 border border-black rounded-md w-96"
        >
          <option value="">-------</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Extended">Extended</option>
        </select>
        <input 
          type="number" 
          name="capacity" 
          placeholder="Capacity" 
          className="bg-white p-3 border border-black rounded-md w-96" 
        />
        <input 
          type="number" 
          name="prix" 
          placeholder="Prix" 
          className="bg-white p-3 border border-black rounded-md w-96" 
        />
        <button 
          type="submit" 
          className="p-4 bg-yellow-500 text-black rounded-md" 
          disabled={loading}
        >
          {loading ? "Adding..." : "Submit"}
        </button>
      </form>
      <div className='md:block hidden p-6'>
      {ImageRoom && (
          <img src={ImageRoom} alt="ImageRoom" className='rounded-md w-full h-auto' />
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddRoom;
