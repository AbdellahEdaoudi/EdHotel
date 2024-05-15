"use client";
import React, { Suspense } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../Pages/CheckoutForm";
import { useSearchParams } from "next/navigation";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHER_KEY);

function page() {
  const serchParams = useSearchParams();
  const options = {
    mode: "payment",
    currency: "usd",
    amount: Number(serchParams.get("amount")) * 100,
  };
  return (
    <>
      <nav>
        <Suspense fallback={<div>Wait</div>}>
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm amount={Number(serchParams.get("amount"))} />
          </Elements>
        </Suspense>
      </nav>
    </>
  );
}

export default page;
