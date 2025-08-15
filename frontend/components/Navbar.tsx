'use client';

import Link from 'next/link';
import { AuthStatus } from './AuthStatus';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full h-16 bg-white/20 backdrop-blur-md border-b border-gray-200/50 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}    
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="mt-6 rounded-lg flex items-center justify-center text-white font-bold  text-sm">
             <Image width={100} height={100} src="/logo.png" alt="Logo" className=" " /> 
            </div>
             <div className="hidden sm:block">
              <h1 className="text-lg font-semibold leading-none text-gray-900">
                Suhani Travels
              </h1>
              <p className="text-xs text-gray-500">
                Your Journey, Our Priority
              </p>
            </div>
            {/* Mobile logo text */}
            <div className="sm:hidden">
              <h1 className="text-base mr-10 font-semibold text-gray-900">
                Suhani Travels
              </h1>
            </div>
          </Link> 

          {/* Auth Section */}
          <div className="flex justify-end items-center">
            <AuthStatus />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;