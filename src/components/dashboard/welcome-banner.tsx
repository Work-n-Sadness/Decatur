
"use client";

import Image from 'next/image';

export default function WelcomeBanner() {
  return (
    <div className="bg-[#a3e7f0] p-6 rounded-lg text-gray-800 dark:bg-teal-800 dark:text-gray-100 mb-6 shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-4 md:mb-0 md:mr-6">
          <h1 className="text-2xl font-bold mb-2">Welcome to Decatur West Personal Care Facility</h1>
          <p className="mb-4">Where care meets compassion. WeCare.</p>
          <div className="space-y-1 text-sm">
            <p><strong>Mission:</strong> To provide tender living care to your loved ones who are no longer able to live independently.</p>
            <p><strong>Vision:</strong> To offer round-the-clock care, support, and assistance in a safe, comfortable environment.</p>
          </div>
        </div>
        <div className="flex items-center shrink-0">
          <Image 
            src="https://placehold.co/150x60.png" 
            alt="Decatur West Logo" 
            width={150}
            height={60}
            className="h-16 w-auto" 
            data-ai-hint="facility logo"
          />
        </div>
      </div>
    </div>
  );
}
