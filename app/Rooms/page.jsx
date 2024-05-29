"use client";
import React from "react";
import Test from "../Pages/Test"
import Rooms from "../Pages/Rooms";
export default function Page() {

    return (
      <div className="bg-gray-100 pb-10">
         <Test name="ROOMS" />
         {/* ROOMS */}
         <Rooms />
      </div>
    );
  }
 

