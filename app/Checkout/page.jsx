import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../Pages/CheckoutForm';
import { useSearchParams } from 'next/navigation';
import { SuspenseBoundary } from 'react ';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHER_KEY);

function page() {
    const SearchParams = useSearchParams();
    const options = {
        mode: "payment",
        currency: "usd",
        amount: Number(SearchParams.get('amount')) * 100
    };

    return (
        <SuspenseBoundary fallback={<div>Loading...</div>}>
            <Elements stripe={stripePromise} options={options}>
                <CheckoutForm amount={Number(SearchParams.get('amount'))} />
            </Elements>
        </SuspenseBoundary>
    );
}

export default page;
