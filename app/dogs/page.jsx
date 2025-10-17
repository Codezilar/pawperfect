"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { FaRegHeart } from "react-icons/fa";
import { LuCalendar } from "react-icons/lu";
import { LuDot } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import Link from 'next/link';
import { LuDollarSign } from "react-icons/lu";
import { dogs } from '@/data';


const page = () => {
  const [selectedBreed, setSelectedBreed] = useState('All Breeds');
  
  // Get all unique breeds from the dogs data
  const allBreeds = ['All Breeds', ...new Set(dogs.map(dog => dog.breed))];
  
  // Filter dogs based on selected breed
  const filteredDogs = selectedBreed === 'All Breeds' 
    ? dogs 
    : dogs.filter(dog => dog.breed === selectedBreed);

  return (
      <div className="dogs">
        <div className="dogs-conatiner">
            <div className="companion">
                <h1>Find Your Perfect Companion</h1>
                <p>Browse our collection of healthy, happy puppies from certified breeders</p>
            </div>
            <div className="breed-nav">
                {allBreeds.map((breed, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedBreed(breed)}
                    className={selectedBreed === breed ? 'active' : ''}
                  >
                    {breed}
                  </button>
                ))}
            </div>
            <div className="dog-wrap">
                <div className="dog-wrap-container">
                    {filteredDogs.map((dog, key) =>(
                        <div className="dog-content" key={key}>
                            <Image className='dogImg' src={dog.img} alt='kjhd' width={10000} height={10000} />
                            <div className="dog-content-text">
                                <div className="dog-content-top">
                                    <span><FaRegHeart /></span>
                                    <p>Available</p>
                                </div>
                                <div className="dog-detail">
                                    <div className="dog-detail-top">
                                        <h1>{dog.name} </h1>
                                        <h2>{dog.gender}</h2>
                                    </div>
                                    <p className='sweet'>{dog.desc  }</p>
                                    <div className='gold'>
                                        <span><LuCalendar /> <p>{dog.breed}</p><LuDot /><p>{dog.age}</p></span>
                                        <span className='dolas'>
                                            <LuDollarSign /> 
                                            <h1>${dog.price}</h1>
                                        </span>
                                    </div>
                                    <Link href={`/profile/${dog.id}`} >
                                        <button className='cursor-pointer'>View Details</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
  )
}

export default page