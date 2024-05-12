"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Axios from "axios";
import { useRouter } from "next/navigation";

function page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("@hotel.app");
  const [pass, setPass] = useState("");
  const [ereur, setEreur] = useState("");
  const [goodCreat, setgoodCreat] = useState("");
  const router = useRouter();

  const CreateAcount = async (e) => {
    e.preventDefault();
    if (!name || !email || !pass) {
      setEreur("All fields are necessary.");
      return;
    }
    // Hash the password
    try {
      const response = await Axios.post(
        "http://127.0.0.1:4444/api/auth/register",
        { name, email, pass },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        // alert('User registered successfully.')
        console.log("User registered successfully:", data);
        setName("");
        setEmail("");
        setPass("");
        setgoodCreat("User registered successfully.");
        router.push("Login");
      } else {
        console.error(
          "Registration failed. Server returned:",
          response.status,
          response.statusText
        );
        setEreur("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setEreur("Email already exists. Please use a different email.");
    }
  };

  return (
    <div style={{backgroundImage: `url('image.jpg')`}}
    className="flex items-center  justify-center  bg-gray-50 text-black -mt-20">
      <section className=" flex items-center px-10 mt-[108px] mb-20 border-2 rounded-lg backdrop-blur-lg  justify-center   ">
        <div className="w-full py-10  ">
          <div className=" text-center">
            <Image
              src="/Logo-my-hotel-app.png"
              className="mx-auto"
              alt="LOGO"
              height={110}
              width={110}
            />
            <h1 className="text-2xl font-bold text-center mb-3">
              Create your account
            </h1>
            <h2 className="text-gray-500 text-center mb-4">
              {" "}
              Join us and start exploring!{" "}
            </h2>
          </div>
          <div className="mx-2">
            <form action="#" onSubmit={CreateAcount} className="space-y-4 ">
              <p>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  type="text"
                  className=" w-[320px] sm:w-[400px] md:w-[500px] rounded-lg bg-white text-black border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Full Name"
                />
              </p>
              <p>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  type="email"
                  className="w-[320px] sm:w-[400px] md:w-[500px] bg-white text-black  rounded-lg border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Email"
                />
              </p>
              <p>
                <input
                  value={pass}
                  onChange={(e) => {
                    setPass(e.target.value);
                  }}
                  type="password"
                  className="w-[320px] sm:w-[400px] md:w-[500px] bg-white text-black  rounded-lg border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Password"
                />
              </p>
              <div>
                <button className=" rounded-md  border w-[320px] sm:w-[400px] md:w-[500px] border-blue-600 bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                  Create an account
                </button>
                <h6
                  className={`bg-red-500 text-white p-1 w-45 rounded-md text-sm mt-3 ${
                    ereur ? "block" : "hidden"
                  }`}
                >
                  {ereur}
                </h6>
                <h6
                  className={`bg-green-500 text-white p-1 w-45 rounded-md text-sm mt-3 ${
                    goodCreat ? "block" : "hidden"
                  }`}
                >
                  {goodCreat}
                </h6>

                <div className=" text-sm mt-4 text-gray-500">
                  Already have an account?
                  <Link href="/Login" className="text-white underline">
                    {" "}
                    Log in
                  </Link>
                  .
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default page;
