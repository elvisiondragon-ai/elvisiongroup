"use client";

import React from 'react';

const Pricing: React.FC = () => {
  const handlePayment = (plan: string) => {
    let message = `Hello, I'm interested in the ${plan} plan. Please provide payment details for Bitcoin or Paypal.`;
    const whatsappUrl = `https://wa.me/62895325633487?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  };

  return (
    <div className="bg-background text-foreground font-exo p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">1-on-1 VIP Session Pricing</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Pricing Card 1 */}
          <div className="bg-card p-6 rounded-lg border border-border flex flex-col">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">1 Session</h2>
            <p className="text-4xl font-bold text-primary mb-4">$100 <span className="text-lg font-normal text-muted-foreground">USD</span></p>
            <p className="text-muted-foreground mb-6">A single, focused 1-on-1 session.</p>
            <button
              onClick={() => handlePayment('1 Session')}
              className="w-full mt-auto bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary-glow transition-all duration-300 glow-primary"
            >
              Payment Via Bitcoin or Paypal
            </button>
          </div>

          {/* Pricing Card 2 */}
          <div className="bg-card p-6 rounded-lg border-2 border-primary flex flex-col">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">1 Month</h2>
            <p className="text-4xl font-bold text-primary mb-4">$800 <span className="text-lg font-normal text-muted-foreground">USD</span></p>
            <p className="text-muted-foreground mb-6">8 sessions, designed for consistent progress.</p>
            <button
              onClick={() => handlePayment('1 Month (8 Sessions)')}
              className="w-full mt-auto bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary-glow transition-all duration-300 glow-primary"
            >
              Payment Via Bitcoin or Paypal
            </button>
          </div>

          {/* Pricing Card 3 */}
          <div className="bg-card p-6 rounded-lg border border-border flex flex-col">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">1 Year</h2>
            <p className="text-4xl font-bold text-primary mb-4">$8000 <span className="text-lg font-normal text-muted-foreground">USD</span></p>
            <p className="text-muted-foreground mb-6">Long-term mentorship for profound transformation.</p>
            <button
              onClick={() => handlePayment('1 Year')}
              className="w-full mt-auto bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary-glow transition-all duration-300 glow-primary"
            >
              Payment Via Bitcoin or Paypal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
