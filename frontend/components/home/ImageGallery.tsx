import React from 'react';
import {   CheckCircle } from 'lucide-react';
import Image from 'next/image';
const BusShowcase: React.FC = () => {
  // Replace these URLs with your actual bus images
 

  const features = [
    "Premium comfortable seating",
    "Air conditioning & climate control", 
  ];

  return (
    <div className="w-full bg-gray-50 py-8 md:py-16 lg:py-20 px-4 relative overflow-hidden">
      {/* Simple decorative elements - hidden on mobile */}
      <div className="hidden lg:block absolute top-20 right-20 w-4 h-4 bg-purple-400 rounded-full opacity-60"></div>
      <div className="hidden lg:block absolute bottom-40 left-16 w-6 h-6 bg-indigo-400 rounded-full opacity-50"></div>

   <div className="absolute top-20 right-20 w-4 h-4 bg-purple-400 rounded-full opacity-60"></div>
      <div className="absolute top-32 right-32 w-4 h-4 bg-purple-400 rounded-full opacity-40"></div>
      <div className="absolute bottom-40 left-16 w-6 h-6 bg-indigo-400 rounded-full opacity-50"></div>
      
      {/* Dotted pattern */}
      <div className="absolute top-40 right-1/6 opacity-30">
        <div className="grid grid-cols-8 gap-4">
          {[...Array(64)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-purple-400 rounded-full"></div>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">


   {/* Decorative elements */}
   

          {/* Left Content */}
          <div className="order-2 lg:order-1 space-y-6 lg:space-y-8">
            <div className="space-y-3 lg:space-y-4">
              <p className="text-purple-600 text-base lg:text-lg font-medium">
                You travel. We deliver comfort.
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Premium Bus Service
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                Experience luxury and comfort on every journey with our modern fleet
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 lg:space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-base lg:text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Section */}
          <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm lg:max-w-none">

              {/* Main exterior bus image */}
              <div className="w-full lg:w-80 xl:w-96 h-48 md:h-56 lg:h-64 bg-white rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden relative">
                <Image
                  src={'/images/interior.jpg'}
                  alt="Premium bus exterior"
                  width={400}
                  height={300}
                />
              </div>
              <div className="absolute -bottom-6 lg:-bottom-8 -left-4 lg:-left-12 w-32 md:w-40 lg:w-48 h-24 md:h-28 lg:h-36 bg-white rounded-xl lg:rounded-2xl shadow-xl overflow-hidden">
                <div className=' bg-linear-gradient-to-br from-purple-900 to-indigo-500'>
                  <Image
                    src={'/images/front.jpg'}
                    alt="Comfortable bus interior"
                    width={400}
                    
                    height={300}
                />
                </div>
              </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default BusShowcase;