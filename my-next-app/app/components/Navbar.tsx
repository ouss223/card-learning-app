import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
const Navbar = () => {
  return (
    <div className='px-10 py-10 bg-white shadow-md font-work-sans'>
        <nav className='flex justify-between items-center'>
            <Link href="/">
            <Image src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" alt="animal" width={100} height={100} unoptimized />
            
            </Link>
            </nav></div>
  )
}

export default Navbar