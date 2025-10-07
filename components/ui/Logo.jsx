import Link from 'next/link'
import React from 'react'
import { FaRegHeart } from "react-icons/fa";

const Logo = () => {
  return (
    <Link href={'/'}>
        <div className='logo'>
            <div className="love">
                <FaRegHeart />
            </div>
            <p>PawPerfect</p>
        </div>
    </Link>
  )
}

export default Logo