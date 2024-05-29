import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ABooking() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('https://ed-hotel-api.vercel.app/Booking');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
    const intervalId = setInterval(fetchBookings, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const DeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all bookings?')) {
      try {
        const response = await axios.delete('https://ed-hotel-api.vercel.app/Bookingd');
        console.log(response.data.message);
        setBookings([]);
      } catch (error) {
        console.error('Error deleting bookings:', error);
      }
    }
  };

  const Delete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await axios.delete(`https://ed-hotel-api.vercel.app/Booking/${id}`);
        console.log(response.data.message);
        setBookings(bookings.filter(booking => booking._id !== id));
      } catch (error) {
        console.error(`Error deleting booking with ID ${id}:`, error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="w-full h-full mt-6 text-center pb-5 flex justify-between">
        <h1 className="text-4xl ml-16 text-black font-bold">
          Our <span className="text-amber-400">BOOKINGS</span>
        </h1>
        {bookings.length > 0 && (
          <button onClick={DeleteAll} className="p-2 bg-red-400 text-white rounded-md mr-2 hover:bg-red-500">
            Cancel All Bookings
          </button>
        )}
      </div>
      {bookings.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-black border">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 border">Name</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 border">Email</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 border">Room</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 border">Check-in</th>
              <th className="text-center py-3  font-medium text-gray-500 border">Check-out</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 border">Price</th>
              <th className="px-6 py-3 text-center font-medium text-gray-500 border">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-x-2 divide-y-2 text-black border-b-2 divide-gray-200">
            {bookings.map((booking, index) => (
              <tr key={index} className="border-b-2">
                <td className="px-6 py-4 whitespace-normal border">{booking.nameC}</td>
                <td className="px-6 py-4 whitespace-normal border">{booking.email}</td>
                <td className="px-6 py-4 whitespace-normal border">{booking.nameR}</td>
                <td className="px-6 py-4 whitespace-normal border">
                  {`${new Date(booking.check_in).getFullYear()}/${new Date(booking.check_in).getMonth()}/${new Date(booking.check_in).getDay()}`}
                </td>
                <td className="px-6 py-4 whitespace-normal border">
                {`${new Date(booking.check_out).getFullYear()}/${new Date(booking.check_out).getMonth()}/${new Date(booking.check_out).getDay()}`}
                </td>
                <td className="px-6 py-4 whitespace-normal border">{`${booking.prix}$`}</td>
                <td className="px-6 py-4 whitespace-normal border">
                  <button
                    onClick={() => Delete(booking._id)}
                    className="p-2 bg-amber-400 rounded-md hover:bg-amber-500 "
                  >
                    Cancel Reservation
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-black text-center text-4xl py-16 mt-10">No bookings available</p>
      )}
    </div>
  );
}

export default ABooking;
