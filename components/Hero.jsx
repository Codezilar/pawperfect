import Link from 'next/link';
import React from 'react'
import { FaRegHeart } from "react-icons/fa";
import { FiShield } from "react-icons/fi";
import { HiOutlineTruck } from "react-icons/hi";

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-container">
            <span className='find'>
                <h1>Find Your Perfect</h1>
                <h1 className='text-gray-300'>Dog Today</h1>
            </span>
            
            <p className='discover'>Discover your perfect companion from our collection of healthy, happy dogs from certified breeders. Safe delivery guaranteed.</p>
            <div className="hero-btns">
                <Link href={'/dogs'}>
                    <button className='browseBtn'>
                        Browse Our Dogs
                    </button>
                </Link>
                <Link href={'/support'}>
                    <button className='specialBTN'>
                        Talk to a Specialist
                    </button>
                </Link>
            </div>
            <div className="certified">
                <div className="certified-container">
                    <div className="certified-content">
                        <span><FaRegHeart /></span>
                        <h1>Certified Breeders</h1>
                        <p>All our dogs come from verified, ethical breeders</p>
                    </div>
                    <div className="certified-content">
                        <span><FiShield /></span>
                        <h1>Certified Breeders</h1>
                        <p>Full vaccination records and health certificates</p>
                    </div>
                    <div className="certified-content">
                        <span><HiOutlineTruck /></span>
                        <h1>Safe Delivery</h1>
                        <p>Professional pet transport to your door</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero