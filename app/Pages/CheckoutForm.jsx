import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import axios from 'axios';
import { differenceInDays, format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { fetchData } from 'next-auth/client/_utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CheckoutForm = ({amount}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading,setLoading]=useState(false);
    const [ErrorMessage,setErrorMessage]=useState();
    const [Booking,setBooking]=useState([]);
    const [Bookinge,setBookinge]=useState([]);
    const {data,status}=useSession()
    console.log(amount);
    console.log(Bookinge);
    
      const fetchData = async () => {
        try {
          const res = await axios.get('https://ed-hotel-api.vercel.app/Booking');
          setBooking(res.data);
          setBookinge((res.data).filter((bk) => bk.email === data?.user.email));
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      };

      fetchData(); //
      const DeleteAllBooking = () => {
        const userBookings = Booking.filter((bk) => bk.email === data?.user.email);
      
        axios.delete(`https://ed-hotel-api.vercel.app/BookingdAll`, {
          data: { bookings: userBookings }
        })
        .then(data => {
          console.log(data);
          window.location.reload();
        })
        .catch(err => console.log(err));
      }

    
    const sendpayment = ()=>{
    axios.post('https://ed-hotel-api.vercel.app/CheckoutDoc',Bookinge)
        .then(response => {
            console.log('Payment successfully:', response.data);
            toast('Payment successfully!', {
                type: 'success',
                position: 'top-center',
                autoClose: 1000,
            });
        })
        .catch(error => {
            console.error('Error adding Payment:', error);
            toast('Error adding Payment!', {
                type: 'error',
                position: 'top-center',
                autoClose: 5000,
            });
        });
    }

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
    sendpayment();
    DeleteAllBooking()
    
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
      <div>
      <div className='mx-10 md:mx-72 my-28'>
        <PaymentElement />
      <button className='w-full rounded-md py-3 bg-sky-600 text-white mt-3'>Submit</button>
        </div>
        {Bookinge.length > 0 ? 
          Bookinge.map((bk,i)=>{
          const checkInDate = new Date(bk.check_in);
          const checkOutDate = new Date(bk.check_out);
          const formattedCheckIn = format(checkInDate, "MMMM do, yyyy", { locale: enUS });
          const formattedCheckOut = format(checkOutDate, "MMMM do, yyyy", { locale: enUS }); 
          //
          const checkInDateObj = parseISO(bk.check_in);
          const checkOutDateObj = parseISO(bk.check_out);
          const daysDifference = differenceInDays(checkOutDateObj, checkInDateObj);  
          //
          const myDate = new Date(); 
          myDate.setHours(0, 0, 0, 0);
          // const checkInDt = new Date(bk.check_in); 
          const checkOutDt = new Date(bk.check_out); 
          if (checkOutDt < myDate) {
            Delete(bk._id)
          }
          else{
            return (
             <div key={i} className=" md:flex items-center justify-around text-black   bg-stone-200 mx-5 md:mx-32 my-5 rounded-md p-6">
               <p>{bk.nameR}</p>
               <p>
               <span className="text-amber-600">FROM: </span>{formattedCheckIn}&nbsp;&nbsp;
               <span className="text-amber-600">TO: </span>{formattedCheckOut}
               </p>
               <p>
                <span className="text-amber-600">Prix : </span> {`${bk.prix}`}$
               </p>
             </div>
           );
          }
           }) : 
           <div className="h-96 w-full text-center ">
            <p className="text-4xl text-black">You don't have any reservation</p><br />
            <Link className="p-4 rounded-md bg-amber-400 text-black "  href={"/Rooms"}>GO TO ROOMS PAGE</Link>
            </div>
            }
      </div>
      
        <ToastContainer />
    </form>
  );
};

export default CheckoutForm;