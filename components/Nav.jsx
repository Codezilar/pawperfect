"use client"
import React, { useState } from 'react'
import Logo from './ui/Logo'
import Link from 'next/link'
import { FaBarsStaggered } from "react-icons/fa6";
import { SignedIn, SignedOut } from '@clerk/nextjs';

const Nav = () => {
    const [hamburga, setHamburga] = useState(false);
    
    const toggleHamburga = () => {
        setHamburga(!hamburga); // Toggle between true and false
    }

    return (
        <nav className='nav'>
            <div className="nav-container">
                <Logo />
                <ul className={`${hamburga === true ? "isActive" : ""}`}>
                    <Link href={'/'}>
                        <p onClick={toggleHamburga}>Home</p>
                    </Link>
                    <Link href={'/dogs'}>
                        <p onClick={toggleHamburga}>Browse Dogs</p>
                    </Link>
                    <Link href={'/support'}>
                        <p onClick={toggleHamburga}>Support</p>
                    </Link>
                    <Link href={'/about'}>
                        <p onClick={toggleHamburga}>About</p>
                    </Link>
                    <SignedOut>
                        <Link href={'/login'}>
                            <p onClick={toggleHamburga}>Login</p>
                        </Link>
                    </SignedOut>
                </ul>
                <Link href={'/dogs'}>
                    <button className='cursor-pointer'>
                        Find Your Dog
                    </button>
                </Link>
                <span className='cursor-pointer hamburger'>
                    <FaBarsStaggered className='text-4xl font-extrabold' onClick={toggleHamburga} />
                </span>
            </div>
        </nav>
    )
}

export default Nav