import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

function APaying() {
  const [Checkouts, setCheckouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("https://ed-hotel-api.vercel.app/Checkout");
        setCheckouts(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
    const intervalId = setInterval(fetchBookings, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const DeleteAll = async () => {
    const printContent = `
    <html>
      <head>
        <title>EdHotel Payment</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            color: #333;
            background-color: #f9f9f9;
          }
          .invoice-container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            background-color: #fff;
          }
          .invoice-header {
            text-align: center;
            margin-bottom: 20px;
          }
          .invoice-header img {
            max-width: 100px;
            margin-bottom: 20px;
          }
          .invoice-header h1 {
            font-size: 24px;
            color: #333;
            margin: 0;
          }
          .invoice-details p {
            font-size: 18px;
            text-align: center;
          }
          .invoice-footer {
            text-align: center;
            margin-top: 20px;
          }
          .invoice-footer p {
            margin: 0;
            font-size: 16px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <h1>EdHotel</h1>
            <img src="https://urlimage.vercel.app/Logo-my-hotel-app.png" alt="Hotel Logo"/>
          </div>
          <div class="invoice-details">
           <p>Your Payment has been cancelled.</p>
          </div>
          <div class="invoice-footer">
            <p>Thank you for choosing our hotel!</p>
          </div>
        </div>
      </body>
    </html>
  `;
    if (window.confirm("Are you sure you want to Cancel all Paying?")) {
      try {
        await axios.delete("https://ed-hotel-api.vercel.app/Checkoutd");
        const emailAddresses = Checkouts.map(booking => booking.email);
        await axios.post('https://ed-hotel-api.vercel.app/SendEmailAll', {
          to: emailAddresses,
          subject: 'Payment Cancellation',
          html: printContent
        });
        console.log('Emails sent successfully');
        setCheckouts([]);
      } catch (error) {
        console.error("Error deleting Paying:", error);
      }
    }
  };

  const filteredCheckouts = Checkouts.filter(
    booking =>
      booking.nameC.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-1">
      <div className="w-full h-full mt-6 text-center pb-5 flex justify-between items-center">
        <h1 className="text-4xl ml-16 text-black font-bold">
          Our <span className="text-amber-400">Paying</span>
        </h1>
        <input
          type="text"
          placeholder="Search by name or email"
          className="p-2 border border-gray-300  bg-white rounded-md w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {Checkouts.length > 0 && (
          <button
            onClick={DeleteAll}
            className="p-2 bg-red-400 text-white rounded-md mr-2 hover:bg-red-500"
          >
            Cancel All Paying
          </button>
        )}
      </div>
      {filteredCheckouts.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200 text-[13px] ">
          <thead className="bg-gray-50 text-black border">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 border">
                Name
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 border">
                Email
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 border">
                Room
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 border">
                Check-in
              </th>
              <th className="text-center py-3  font-medium text-gray-500 border">
                Check-out
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 border">
                Amount
              </th>
              <th className="px-6 py-3 text-center font-medium text-gray-500 border">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-x-2 divide-y-2 text-black border-b-2 divide-gray-200">
            {filteredCheckouts.map((booking, index) => (
              <tr key={index} className="border-b-2">
                <td className="px-6 py-4 whitespace-normal border">
                  {booking.nameC}
                </td>
                <td className="px-6 py-4 whitespace-normal border">
                  {booking.email}
                </td>
                <td className="px-6 py-4 whitespace-normal border">
                  {booking.nameR}
                </td>
                <td className="px-6 py-4 whitespace-normal border">
                  {`${new Date(booking.check_in).getFullYear()}/${new Date(
                    booking.check_in
                  ).getMonth() + 1}/${new Date(booking.check_in).getDate()}`}
                </td>
                <td className="px-6 py-4 whitespace-normal border">
                  {`${new Date(booking.check_out).getFullYear()}/${new Date(
                    booking.check_out
                  ).getMonth() + 1}/${new Date(booking.check_out).getDate()}`}
                </td>
                <td className="px-6 py-4 whitespace-normal border">{`${booking.prix}$`}</td>
                <td className="px-6 py-4 whitespace-normal border">
                  <Link href={`/Checkout/${booking._id}`} className="p-2 bg-amber-400 rounded-md hover:bg-amber-500 ">
                    Cancel 
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-black text-center text-4xl py-16 mt-10">
          No Paying available
        </p>
      )}
    </div>
  );
}

export default APaying;
