
"use client";

import Image from 'next/image';

export default function WelcomeBanner() {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg mb-6 shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-4 md:mb-0 md:mr-6">
          <h1 className="text-2xl font-bold mb-2 text-primary">Decatur West Personal Care Facility</h1>
          <p className="mb-4 text-lg">Where care meets compassion. <span className="font-semibold text-accent">WeCare.</span></p>
          <div className="space-y-1 text-sm">
            <p><strong>Mission:</strong> To provide tender living care to your loved ones who are no longer able to live independently.</p>
            <p><strong>Vision:</strong> To offer round-the-clock care, support, and assistance in a safe, comfortable environment.</p>
          </div>
        </div>
        <div className="flex items-center shrink-0">
          <Image 
            src="https://placehold.co/120x120.png?text=DW+Logo&font=roboto" 
            alt="Decatur West Logo" 
            width={120}
            height={120}
            className="rounded" 
            data-ai-hint="facility logo text"
          />
        </div>
      </div>
    </div>
  );
}
