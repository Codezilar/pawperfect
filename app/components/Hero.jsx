import React from 'react'

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-container">
            <h1>Find Your Perfect Dog Today</h1>
            <p>Discover your perfect companion from our collection of healthy, happy dogs from certified breeders. Safe delivery guaranteed.</p>
            <div className="hero-btns">
                <button className='browseBtn'>
                    Browse Our Dogs
                </button>
                <button className='specialBTN'>
                    Talk to a Specialist
                </button>
            </div>
            <div className="certified">
                <div className="certified-container">
                    <div className="certified-content">
                        <span>&</span>
                        <h1>Certified Breeders</h1>
                        <p>All our dogs come from verified, ethical breeders</p>
                    </div>
                    <div className="certified-content">
                        <span>&</span>
                        <h1>Certified Breeders</h1>
                        <p>Full vaccination records and health certificates</p>
                    </div>
                    <div className="certified-content">
                        <span>&</span>
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