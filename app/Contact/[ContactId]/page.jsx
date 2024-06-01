"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FolderDot, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function Page({ params }) {
  const router = useRouter();
  const formRef = useRef(null);
  const { data } = useSession();
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Edhotel Contact");
  const [html, setHtml] = useState("");

  useEffect(() => {
    axios.get(`https://edhotel.vercel.app/Contact/${params.ContactId}`)
      .then((res) => {
        setEmail(res.data.email);
        setSubject(res.data.subject || "Edhotel Contact");
        setHtml(res.data.html);
      })
      .catch((error) => {
        console.error('Error fetching contact:', error);
      });
  }, [params.ContactId]);

  const sendEmail = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://edhotel.vercel.app/SendEmail", {
        to: email,
        subject,
        html,
      });
      toast("Email sent successfully", {
        type: "success",
        position: "top-center",
        autoClose: 1000,
      });
      setTimeout(()=>{router.push('/Admin')},2000)
    } catch (error) {
      console.error("Error sending email:", error);
      toast("Failed to send email", {
        type: "error",
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("accessTokenAdmin");
    router.push("/AdminLogin");
  };

  return (
    <div className="flex border-b-2">
      <div className="flex flex-col bg-gray-800 p-4 md:w-auto w-1/2">
        <button className="md:w-60 p-2 rounded-md font-medium text-black py-4 mb-16 bg-white flex gap-2 items-center justify-around" onClick={logout}>
          <span title="LogOut" className="bg-red-500 p-1 rounded-md text-white"><LogOut /></span>
          <span className="flex gap-2"><FolderDot /> ADMIN PAGE</span>
        </button>
        {["ROOMS", "BOOKING", "PAYING", "CONTACT"].map((item) => (
          <span
            key={item}
            onClick={() => {
              localStorage.setItem("admin", item);
              router.push("/Admin");
            }}
            className="p-2 rounded-md font-medium w-full py-4 mb-7 text-center cursor-pointer"
          >
            {item}
          </span>
        ))}
      </div>
      <div style={{
      backgroundImage: `url('/rooms/bg.jpg')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }} className="flex flex-col p-6 w-full justify-center items-center ">
        <form ref={formRef} onSubmit={sendEmail} className="flex flex-col space-y-4 p-12 text-black backdrop-blur-sm rounded-md">
          <input
            type="email"
            value={data?.user.email}
            onChange={(e) => setEmail(e.target.value)}
            name="to"
            placeholder=" Email to"
            required
            className="bg-white p-3 border border-black rounded-md w-[600px]"
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            name="subject"
            placeholder="Subject"
            required
            className="bg-white p-3 border border-black rounded-md"
          />
          <textarea
            name="html"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="Message"
            required
            className="bg-white p-3 border border-black rounded-md"
          />
          <button type="submit" className="p-4 bg-yellow-500 text-black rounded-md">
            Send Email
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Page;
