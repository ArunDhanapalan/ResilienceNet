import React from 'react';
import { Card, CardContent } from './ui/card.jsx';
import { MapPin, Loader2 } from 'lucide-react';

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-600 to-purple-300">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <MapPin className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">ResilienceNet</h1>
          </div>
          
          {/* Loading Animation */}
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <p className="text-gray-600 text-center">
              Loading your dashboard...
            </p>
          </div>
          
          {/* Loading Dots */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingPage;
