import React from 'react'
import Link from 'next/link';
import { LuDollarSign } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { FaRegEnvelope } from "react-icons/fa6";

const page = () => {
  return (
      <div className="dogs">
        <div className="dogs-conatiner">
            <div className="companion">
                <h1>About Us</h1>
                <div className='about_us'>
                    <p>Welcome to PawPerfect your one-stop destination for everything pets! At PawPerfect, we believe that pets aren't just animals they're family. Whether you're looking for a playful puppy, a cuddly kitten, a cheerful bird, or even a charming turtle, we’re here to help you find your perfect companion.</p>
                    <p>We proudly offer a wide variety of domestic pets, including:</p>
                    <ul>
                        <li>Dogs & Puppies</li>
                        <li>Cats & Kittens</li>
                        <li>Birds of all kinds</li>
                        <li>Small animals like hamsters, rabbits, and guinea pigs</li>
                        <li>Reptiles and turtles</li>
                        <p>Aquarium fish & aquatic pets</p>
                    </ul>
                    <p>No matter what you're looking for, PawPerfect is committed to helping you bring home a healthy, happy new friend.</p>
                    <h2>Our Mission</h2>
                    <p>At PawPerfect, our mission is to connect loving homes with happy, healthy pets, while promoting responsible ownership and lifelong care. We’re passionate about animals, and it shows in everything we do – from how we care for our pets, to the advice and support we offer our customers.</p>
                    <h2>Why Choose PawPerfect?</h2>
                    <ul>
                        <p>✔ Ethically Sourced Pets, We work only with trusted breeders and licensed suppliers who share our values for animal care and welfare.</p>
                        <p>✔ Health & Happiness First, All pets receive proper veterinary care, nutrition, and socialization before they’re ready for adoption.</p>
                        <p>✔ Expert Support, Our friendly team offers expert advice on pet care, feeding, housing, and training – even after you take your pet home.</p>
                        <p>✔ Everything You Need, We also stock a wide range of food, toys, accessories, cages, tanks, grooming supplies, and more.</p>
                    </ul>
                    <h2>More Than a Pet Store</h2>
                    <p>PawPerfect is more than just a pet shop we're a community of pet lovers. We understand the joy and responsibility that comes with owning a pet, and we’re here to support you through every step of your journey.</p>
                    <p>Whether you're buying your first pet or adding a new friend to your family, we make the experience easy, enjoyable, and worry-free.</p>
                    <h2>Visit Us Today</h2>
                    <p>At PawPerfect, we’re proud to help families bring home the perfect pet and we’d be honored to help you too. Come visit us and experience the warmth, care, and commitment that make us different.</p>
                    <p>Because at PawPerfect, every pet is perfect and every story begins with love.</p>
                </div>
            </div>
        </div>
      </div>
  )
}

export default page