"use client"
import React, { useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { dogs } from '@/data';
import { FaArrowLeft } from "react-icons/fa";

const page = () => {
  const params = useParams();
  const dogId = params.id;
  const [selectedImage, setSelectedImage] = useState(null);
  
  console.log('Dog ID:', dogId);
  const dog = dogs.find(dog => dog.id.toString() === dogId);

  // If dog not found, show a message
  if (!dog) {
    return (
      <div className="dogs">
        <div className="dogs-container">
          <div className="profile">
            <h1>Dog not found</h1>
            <p>Dog with ID {dogId} was not found.</p>
            <Link href="/dogs">
              <button>Back to Dogs</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Set initial selected image to the main dog image
  const mainImage = selectedImage || dog.img;

  return (
      <div className="dogs">
        <div className="dogs-conatiner">
          <div className="profile">
            <Link href={'/dogs'} className="profile-toper">
              <FaArrowLeft /> 
              <p>Back</p>
            </Link>
            <div className="profile-container">
              <div className="profile-left">
                <Image src={mainImage} className='pro_Img' alt="" height={700} width={700} />
                <div className="pro-images">
                  {dog.images.map((doggies, key) =>(
                    <Image 
                      src={doggies} 
                      key={key} 
                      className='sm_Img' 
                      alt="" 
                      height={150} 
                      width={150} 
                      onClick={() => setSelectedImage(doggies)}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </div>
              <div className="profile-right">
                <div className="profile-top">
                  <div className='flex justify-between items-center'>
                    <div>
                      <span className='nameDOg'>
                        <h1>{dog.breed} - {dog.name}</h1>
                        <p>Puppy for Sale</p>
                      </span>
                      <span className='flex items-center'>
                        <h2>${dog.price}</h2> 
                        <p>(Puppy price)</p>
                      </span>
                    </div>
                    <Image src={'/world.webp'} height={200} width={200} alt='j' />
                  </div>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, soluta? Sunt eaque, ratione corporis non obcaecati earum nostrum laudantium sequi quia cupiditate vero eveniet natus voluptatibus aspernatur odit tempora voluptatum?</p>
                  <div className="btns">
                    <Link href={'conatct'}>
                      <button className='buyDog'>Buy Now</button>
                    </Link>
                    <Link href={'conatct'}>
                      <button className='ask_btn'>Ask about puppy</button>
                    </Link>
                  </div>
                </div>
                <div className="lifetime">
                  <Image src={'/life.svg'} height={50} width={50} alt='life.svg' />
                  <p>Lifetime Health Guarantee</p>
                </div>
                <div className="guarantee">
                  <h1>✅ Our Guarantee</h1>
                  <div className="guarantee-container">
                    <p>We care deeply about the well-being of every dog we place. When you adopt or purchase a dog from us, you can rest assured knowing:</p>
                    <ul>
                      <li>
                        <h2>Health Guarantee:</h2>
                        <p>Every dog receives a full health check by a licensed veterinarian before going to their new home. Vaccinations and deworming are up to date.</p>
                      </li>
                      <li>
                        <h2>Temperament Assurance:</h2>
                        <p>Our dogs are assessed for temperament and socialization. We strive to match each dog to the right family based on personality and lifestyle.</p>
                      </li>
                      <li>
                        <h2>No Puppy Mills:</h2>
                        <p>We do not support or work with puppy mills. All our dogs come from ethical, responsible sources.</p>
                      </li>
                      <li>
                        <h2>Return Policy:</h2>
                        <p>If for any reason you're unable to keep your dog, we will always accept them back no questions asked.</p>
                      </li>
                       <li>
                        <h2>Ongoing Support:</h2>
                        <p>We're here for you even after adoption. Whether you need advice on care, training, or health, our team is happy to help.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default page