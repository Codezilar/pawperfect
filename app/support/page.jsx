import React from 'react'
import { FaRegComment } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { FaRegEnvelope } from "react-icons/fa6";

const page = () => {
  return (
      <div className="dogs">
        <div className="dogs-conatiner">
            <div className="companion">
                <h1>Need Help?</h1>
                <p>Speak to our live specialists or chat with our AI assistant for instant support</p>
            </div>
            <div className="support">
                <div className="support-container">
                  <div className="support-content">
                    <div className="support-wrapp">
                      <div className="voice">
                        <FaRegComment className='chat_vn' />
                        <p>Voice Chat with AI Assistant</p>
                      </div>
                      <p className='speak-text'>Speak naturally with our AI agent about dogs, breeding, health guarantees, and delivery options.</p>
                      <div className="required">
                        <span><IoCallOutline /></span>
                        <button className='brown-btn'><FaRegComment /> <p>Start Voice Chat</p></button>
                        <p>Click to begin • Microphone access required</p>
                      </div>
                      <p className='tips'>💡 Tips: Ask about specific breeds, pricing, health certificates, or schedule a visit.</p>
                    </div>
                    <p className='avail'>Available 24/7 • Instant responses</p>
                  </div>
                  <div className="supp-con">
                    <div className="support-content">
                      <div className="support-wrapp">
                        <div className="voice">
                          <IoCallOutline className='chat_vn_blue' />
                          <p>Book a Live Call</p>
                        </div>
                        <p className='speak-text'>Schedule a video call with our dog specialists to discuss specific breeds, visit our facilities, or get personalized recommendations.</p>
                        <button className='blue-btn'>Schedule Call</button>
                      </div>
                    </div>
                    <div className="support-content">
                      <div className="support-wrapp">
                        <div className="voice">
                          <FaRegEnvelope className='chat_vn' />
                          <p>Email Support</p>
                        </div>
                        <p className='speak-text'>Send us detailed questions about health certificates, breeding history, or special requirements. We respond within 2-4 hours.</p>
                        <button className='gray-btn'>Send Email</button>
                      </div>
                    </div>
                    <div className="support-content">
                      <div className="support-wrapp emg-con">
                        <h2>Emergency Support</h2>
                        <p>For urgent matters regarding your reserved dog or delivery issues</p>
                        <button className='emg'>Call: (555) 123-PAWS</button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div className="faq">
              <div className="faq-head">
                <h1>Frequently Asked Questions</h1>
                <p>Quick answers to common questions about our dogs and services</p>
              </div>
              <div className="faq-container">
                <div className="faq-content">
                  <h2>Are your dogs from certified breeders?</h2>
                  <p>Yes, all our dogs come from licensed, ethical breeders who follow strict health and welfare standards.</p>
                </div>
                <div className="faq-content">
                  <h2>What health guarantees do you provide?</h2>
                  <p>Every puppy comes with full vaccination records, health certificates, and a 30-day health guarantee.</p>
                </div>
                <div className="faq-content">
                  <h2>How does delivery work?</h2>
                  <p>We use professional pet transport services with climate controlled vehicles and trained handlers.</p>
                </div>
                <div className="faq-content">
                  <h2>What payment options do you accept?</h2>
                  <p>We accept all major Bitcoin, PayPal, and offer financing options for qualified buyers.</p>
                </div>
                <div className="faq-content">
                  <h2>Is there a return policy?</h2>
                  <p>While we rarely have returns, we offer a 7-day return window if there are unexpected health issues.</p>
                </div>
              </div>
            </div>
        </div>
      </div>
  )
}

export default page