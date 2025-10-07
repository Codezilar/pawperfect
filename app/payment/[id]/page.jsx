"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';

const Page = () => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [paymentStatus, setPaymentStatus] = useState('pending');

  const walletAddress = 'bc1q4p3sgwq5052glcrjwu4rs48m0qtpfnkpzjezeh'; 

  // Mock ticket data
  const ticket = {
    price: 25.00,
    numberOfTickets: 2,
  };

  // Timer useEffect
  useEffect(() => {
    if (timeLeft <= 0) {
      setPaymentStatus('expired');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Crypto Payment | Complete Your Transaction</title>
        <meta name="description" content="Complete your crypto payment securely" />
      </Head>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-[5rem]">
        <div className="p-8">
          {/* Header */}
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
                <span className="text-gray-600">No of Tickets:</span>
                <span className="font-mono">{ticket.numberOfTickets} {ticket.numberOfTickets === 1 ? "Ticket" : "Tickets"}</span>
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
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Need help? Contact support@fansale.com
        </p>
      </div>
    </div>
  );
};

export default Page;
