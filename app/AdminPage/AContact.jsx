import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

function AContact() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URl}/Contact`);
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
    const intervalId = setInterval(fetchContacts, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const DeleteAllContacts = async () => {
    if (window.confirm("Are you sure you want to delete all contacts?")) {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URl}/Contact`);
        console.log(response.data.message);
        setContacts([]);
      } catch (error) {
        console.error('Error deleting contacts:', error);
      }
    }
  };

  const DeleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URl}/Contact/${id}`);
        console.log(response.data.message);
        setContacts(contacts.filter(contact => contact._id !== id));
      } catch (error) {
        console.error(`Error deleting contact with ID ${id}:`, error);
      }
    }
  };

  const filteredContacts = contacts.filter(
    contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-1">
      <div className="w-full h-full mt-6 text-center pb-5 flex justify-between items-center">
        <h1 className="text-4xl ml-16 text-black font-bold">
          Our <span className="text-amber-400">Contact</span>
        </h1>
        <input
          type="search"
          placeholder="Search by name or email"
          className="p-2 border border-gray-300 bg-white rounded-md w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {contacts.length > 0 && (
          <button onClick={DeleteAllContacts} className="p-2 bg-red-400 text-white rounded-md mr-2 hover:bg-red-500">
            Delete All Contacts
          </button>
        )}
      </div>
      {filteredContacts.length > 0 ? (
        <div>
          <table className="min-w-full divide-y divide-gray-200 text-[12px]">
            <thead className="bg-gray-50 text-black border">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 border">Name</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 border">Email</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 border">Subject</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 border">Message</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 border">Date/Time</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 border">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-x-2 divide-y-2 text-black border-b-2 divide-gray-200">
              {filteredContacts.map((contact, index) => (
                <tr key={index} className="border-b-2">
                  <td className="px-6 py-4 border">{contact.name}</td>
                  <td className="px-6 py-4 border">{contact.email}</td>
                  <td className="px-6 py-4 border break-all">{contact.subject}</td>
                  <td className="px-6 py-4 border break-all">{contact.msg}</td>
                  <td className="px-6 py-4 border">
                    {`
                    ${new Date(contact.created_at).getFullYear()}/${new Date(contact.created_at).getMonth()+1}/${new Date(contact.created_at).getDate()} 
                    ${new Date(contact.created_at).getHours()}:${new Date(contact.created_at).getMinutes()}:${new Date(contact.created_at).getMilliseconds()}
                    `}
                  </td>
                  <td className="px-6 py-4 border-r-2 flex gap-2">
                    <button onClick={() => DeleteContact(contact._id)} className="bg-red-500 text-white p-2 rounded-md hover:text-red-900">
                      Delete
                    </button>
                    <Link href={`Contact/${contact._id}`} className="bg-green-400 text-white p-2 rounded-md hover:text-green-900 w-28 text-center">
                      Send Email
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-black text-center text-4xl py-16 mt-10">No contacts available</p>
      )}
    </div>
  );
}

export default AContact;
