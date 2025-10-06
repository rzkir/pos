'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowContent(true);
    }, 100);

    const timer2 = setTimeout(() => {
      setIsLoading(false);
      router.push('/signin');
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [router]);

  const particleConfigs = [
    { left: '10%', top: '20%', delay: '0s', duration: '3s' },
    { left: '20%', top: '80%', delay: '0.5s', duration: '4s' },
    { left: '30%', top: '40%', delay: '1s', duration: '3.5s' },
    { left: '40%', top: '10%', delay: '1.5s', duration: '4.5s' },
    { left: '50%', top: '70%', delay: '2s', duration: '3s' },
    { left: '60%', top: '30%', delay: '2.5s', duration: '4s' },
    { left: '70%', top: '90%', delay: '0.2s', duration: '3.8s' },
    { left: '80%', top: '50%', delay: '0.8s', duration: '4.2s' },
    { left: '90%', top: '15%', delay: '1.3s', duration: '3.3s' },
    { left: '15%', top: '60%', delay: '1.8s', duration: '4.7s' },
    { left: '25%', top: '85%', delay: '0.3s', duration: '3.6s' },
    { left: '35%', top: '25%', delay: '0.9s', duration: '4.1s' },
    { left: '45%', top: '75%', delay: '1.4s', duration: '3.9s' },
    { left: '55%', top: '35%', delay: '1.9s', duration: '4.3s' },
    { left: '65%', top: '95%', delay: '0.4s', duration: '3.4s' },
    { left: '75%', top: '45%', delay: '1.1s', duration: '4.6s' },
    { left: '85%', top: '5%', delay: '1.6s', duration: '3.7s' },
    { left: '95%', top: '65%', delay: '2.1s', duration: '4.4s' },
    { left: '5%', top: '55%', delay: '0.6s', duration: '3.2s' },
    { left: '18%', top: '12%', delay: '1.2s', duration: '4.8s' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main content container */}
        <div className={`relative z-10 text-center transition-all duration-1000 ease-out ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* App Name */}
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-fade-in-up">
            School App
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up animation-delay-300">
            Platform Pendidikan Modern & Terdepan
          </p>

          {/* Loading animation */}
          <div className="flex justify-center items-center space-x-2 mb-8">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce animation-delay-200"></div>
          </div>

          {/* Progress bar */}
          <div className="w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-3000 ease-out animate-progress"></div>
          </div>

          {/* Loading text */}
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            Memuat aplikasi...
          </p>
        </div>

        {/* Floating particles with deterministic positions */}
        <div className="absolute inset-0 pointer-events-none">
          {particleConfigs.map((config, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 dark:bg-blue-300/20 rounded-full animate-float"
              style={{
                left: config.left,
                top: config.top,
                animationDelay: config.delay,
                animationDuration: config.duration
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}