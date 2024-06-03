import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function page() {
	return (
		<div className='flex flex-col items-center justify-center px-5 my-32 '>
			<Image src='/verified.gif'
				alt='check'
				width={130}
				height={130}
			/>
			<h2 className='text-[24px] text-black'>Payment Successful !</h2>
			<h2 className='text-[17px]  text-center  mt-6 text-gray-500'>
			Your booking confirmation email has been sent,
			 and it includes all the details about your reservation.
			 Thank you for choosing our hotel app
			</h2>
			<Link
				href="/Payment"
				className='p-2 mt-6 text-white rounded-md bg-sky-500'>
				Go to Payment Page</Link>

		</div>
	)
}

export default page
