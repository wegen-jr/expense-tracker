import React from 'react'
import Logo from "../assets/logo.png";
export default function Navbar() {
  return (
    <div>
      <div className='bg-green-500 flex gap-2 py-2 px-5 '>
            <div className='flex items-center justify-start'>
                <img src={Logo} alt="logio " className='w-10 h-10 rounded-full' />
            </div>
            <div className='capitalize font-serif font-bold text-white flex items-center justify-end '>
                <p>Expense Tracker</p>
            </div>
      </div>
    </div>
  )
}
