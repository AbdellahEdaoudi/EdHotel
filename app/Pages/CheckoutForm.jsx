import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CheckoutForm = ({amount}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading,setLoading]=useState(false);
    const [ErrorMessage,setErrorMessage]=useState();
    console.log(amount);

  const handleSubmit = async (event) => {
    
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    const handleError = (error) => {
        setLoading(false)
        setErrorMessage(error.message)
      }
     // Trigger form validation and wallet collection
     const {error: submitError} = await elements.submit();
     if (submitError) {
       handleError(submitError);
       return;
     }
    
    const res = await fetch("/CheckApi/create-intent",{
        method: "POST",
        body : JSON.stringify({
            amount : amount
        })
    })
    const clientSecret = await res.json()
    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      clientSecret,
      elements,
      confirmParams: {
        return_url: "https://edhotel.vercel.app/payment-confirm",
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className='mx-10 md:mx-72 my-28'>
        <PaymentElement />
      <button className='w-full rounded-md py-3 bg-sky-600 text-white mt-2'>Submit</button>
        </div>
        <ToastContainer />
    </form>
  );
};

export default CheckoutForm;