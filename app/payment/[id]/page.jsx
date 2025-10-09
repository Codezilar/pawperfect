"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaUser, FaEnvelope, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';

// Import your dog data from the data folder
import { dogs } from '@/data/index'; // Adjust the path according to your project structure

const Page = () => {
  const params = useParams();
  const dogId = params?.id ? parseInt(params.id) : null;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [selectedDog, setSelectedDog] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    
    // Delivery Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postcode: '',
    
    // Payment Method (for future reference)
    paymentMethod: 'crypto',
    
    // Terms and conditions
    acceptTerms: false,
    acceptMarketing: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const walletAddress = 'bc1q4p3sgwq5052glcrjwu4rs48m0qtpfnkpzjezeh';

  // Fetch dog data based on ID from URL parameter
  useEffect(() => {
    if (dogId) {
      const dog = dogs.find(d => d.id === dogId);
      if (dog) {
        setSelectedDog(dog);
      }
      setLoading(false);
    }
  }, [dogId]);

  // Mock ticket data - now based on selected dog
  const ticket = selectedDog ? {
    price: parseFloat(selectedDog.price),
    numberOfDog: 1,
    application: 'PawPerfect',
    breed: selectedDog.breed,
    dogName: selectedDog.name,
    age: selectedDog.age,
    gender: selectedDog.gender,
    location: selectedDog.location,
    image: selectedDog.img,
    description: selectedDog.desc
  } : {
    price: 0,
    numberOfDog: 0,
    application: 'PawPerfect',
    breed: '',
    dogName: '',
    age: '',
    gender: '',
    location: '',
    image: '',
    description: ''
  };

  // Validation rules
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.confirmEmail.trim()) newErrors.confirmEmail = 'Please confirm your email';
      else if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = 'Emails do not match';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (step === 2) {
      if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State/Province is required';
      if (!formData.country.trim()) newErrors.country = 'Country is required';
      if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required';
    }

    if (step === 3) {
      if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      setIsSubmitting(true);
      // Here you would typically send the data to your backend
      const orderData = {
        ...formData,
        dog: selectedDog,
        totalAmount: ticket.price + 2.50,
        orderDate: new Date().toISOString()
      };
      
      console.log('Order submitted:', orderData);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentStep(4); // Move to payment step
        setTimeLeft(15 * 60); // Start timer
      }, 1000);
    }
  };

  // Timer useEffect
  useEffect(() => {
    if (timeLeft <= 0) {
      setPaymentStatus('expired');
      return;
    }

    if (currentStep === 4 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, currentStep]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Progress steps
  const steps = [
    { number: 1, title: 'Personal Info', icon: <FaUser /> },
    { number: 2, title: 'Delivery Address', icon: <FaMapMarkerAlt /> },
    { number: 3, title: 'Review & Confirm', icon: <FaEnvelope /> },
    { number: 4, title: 'Payment', icon: <FaCreditCard /> }
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dog information...</p>
        </div>
      </div>
    );
  }

  // Show error if dog not found
  if (!selectedDog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dog Not Found</h2>
          <p className="text-gray-600 mb-4">The dog you're looking for doesn't exist.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mt-[7rem] mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step.icon}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Email Address *
                      </label>
                      <input
                        type="email"
                        name="confirmEmail"
                        value={formData.confirmEmail}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.confirmEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.confirmEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmEmail}</p>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Delivery Address */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Address</h2>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.addressLine1 && (
                        <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.country ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.country && (
                          <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postcode *
                        </label>
                        <input
                          type="text"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.postcode ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.postcode && (
                          <p className="mt-1 text-sm text-red-600">{errors.postcode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Confirm */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Confirm</h2>
                    
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
                      <div className="space-y-2">
                        <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Phone:</strong> {formData.phone}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-lg mb-4">Delivery Address</h3>
                      <div className="space-y-2">
                        <p>{formData.addressLine1}</p>
                        {formData.addressLine2 && <p>{formData.addressLine2}</p>}
                        <p>{formData.city}, {formData.state}</p>
                        <p>{formData.country}, {formData.postcode}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-lg mb-4">Dog Details</h3>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 relative">
                          <Image
                            src={ticket.image}
                            alt={ticket.dogName}
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <p><strong>Name:</strong> {ticket.dogName}</p>
                          <p><strong>Breed:</strong> {ticket.breed}</p>
                          <p><strong>Age:</strong> {ticket.age}</p>
                          <p><strong>Gender:</strong> {ticket.gender}</p>
                          <p><strong>Location:</strong> {ticket.location}</p>
                          <p><strong>Price:</strong> £{ticket.price}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          className="mt-1 mr-3"
                        />
                        <label className="text-sm text-gray-700">
                          I agree to the Terms and Conditions and Privacy Policy *
                        </label>
                      </div>
                      {errors.acceptTerms && (
                        <p className="text-sm text-red-600">{errors.acceptTerms}</p>
                      )}

                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          name="acceptMarketing"
                          checked={formData.acceptMarketing}
                          onChange={handleInputChange}
                          className="mt-1 mr-3"
                        />
                        <label className="text-sm text-gray-700">
                          I would like to receive marketing communications and updates
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Payment Gateway */}
                {currentStep === 4 && (
                  <div>
                    <div className="text-center mb-8">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">Crypto Payment</h1>
                      <p className="text-gray-600">Send exactly £{ticket.price} of BTC to the address below</p>
                    </div>

                    {/* Countdown Timer */}
                    <div className="mb-6 text-center">
                      <div className="inline-flex items-center px-4 py-2 bg-red-50 rounded-full">
                        <span className="text-red-600 font-mono text-lg font-semibold">
                          ⏰ {formatTime(timeLeft)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Complete payment before timer expires
                      </p>
                    </div>

                    {/* QR Code */}
                    <div className="mb-6 text-center">
                      <div className="inline-block p-4 bg-white rounded-lg border border-gray-200">
                        <Image
                          src={'/btc.jpeg'}
                          alt="Bitcoin QR Code"
                          height={500}
                          width={500}
                          className='rounded-[30px]'
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Scan QR code with your wallet</p>
                    </div>

                    {/* Wallet Address */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wallet Address
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={walletAddress}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono bg-gray-50 text-gray-700 overflow-x-auto"
                        />
                        <button
                          onClick={copyToClipboard}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-mono">£{ticket.price} of BTC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dog:</span>
                          <span className="font-mono">{ticket.dogName} ({ticket.breed})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Network:</span>
                          <span>Bitcoin Mainnet</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-semibold ${
                            paymentStatus === 'pending' ? 'text-yellow-600' : 
                            paymentStatus === 'completed' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {paymentStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Important Instructions</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Send exactly £{ticket.price} of BTC</li>
                        <li>• Use Bitcoin Mainnet only</li>
                        <li>• Do not send from exchange wallets</li>
                        <li>• Transaction may take 2-3 minutes to confirm</li>
                      </ul>
                    </div>

                    {/* Status Indicator */}
                    {paymentStatus === 'expired' && (
                      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 font-semibold text-center">
                          Payment time expired. Please refresh to get a new address.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {currentStep > 1 && currentStep < 4 && (
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <FaChevronLeft className="inline mr-2" />
                      Back
                    </button>
                  )}
                  
                  {currentStep < 3 && (
                    <button
                      onClick={handleNextStep}
                      className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Continue
                    </button>
                  )}
                  
                  {currentStep === 3 && (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Processing...' : 'Complete Order'}
                    </button>
                  )}
                  
                  {currentStep === 1 && currentStep < 3 && (
                    <div className="ml-auto"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              {/* Dog Image and Info */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 relative">
                  <Image
                    src={ticket.image}
                    alt={ticket.dogName}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{ticket.dogName}</h4>
                  <p className="text-sm text-gray-600">{ticket.breed}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Dog Price:</span>
                  <span>£{ticket.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span>£2.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>£0.00</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>£{(ticket.price + 2.50).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">{ticket.application}</h4>
                <p className="text-sm text-gray-600 mb-1">{ticket.breed}</p>
                <p className="text-sm text-gray-600">{ticket.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support@pawperfect.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;