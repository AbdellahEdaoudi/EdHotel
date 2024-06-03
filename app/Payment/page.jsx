"use client";
import React from "react";;
import Test from "../Pages/Test"
import Payment from "../Pages/Payment";



export default function Page() {

    return (
      <div className=" pb-10">
         <Test name="PAYMENT" />
         {/* ROOMS */}
         <Payment />
      </div>
    );
  }

  

