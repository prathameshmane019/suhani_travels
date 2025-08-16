import React from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotFoundPageProps {}

const NotFoundPage: React.FC<NotFoundPageProps> = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Simple 404 Typography */}
        <div className="mb-12">
          <div className="text-8xl md:text-9xl font-thin text-gray-200 leading-none tracking-wider mb-8">
            404
          </div>
        </div>

        {/* Professional Content */}
        <div className="mb-16 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
              Page Not Found
            </h1>
            <div className="w-16 h-px bg-gray-400 mx-auto"></div>
          </div>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-light">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-3 px-8 py-4 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <Button 
            onClick={() => window.location.href = '/'}
            className=" "
          >
            <Home className="w-5 h-5" />
            Go Home
          </Button>

          <Button 
            onClick={() => window.location.href = '/search'}
            className=" "
          >
            <Search className="w-5 h-5" />
            Search Site
          </Button>
        </div>

        {/* Footer Information */}
        <div className="border-t border-gray-200 pt-12">
          <div className="text-sm text-gray-500 space-y-3">
            <p>Error 404 - Page Not Found</p>
            <p>If you believe this is an error, please contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;