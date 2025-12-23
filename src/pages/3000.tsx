import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, TrendingUp, Heart, Crown, DollarSign, Phone, ArrowRight, Sparkles, Shield } from 'lucide-react';

export default function ELVision3000() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Agus Mulyadi, SH., MH.",
      title: "Chief of Intelligence, Pangandaran",
      image: "👨‍💼",
      rating: 5,
      text: "The clarity I experienced was extraordinary. After 6 weeks, major decisions that used to confuse me now feel easy and clear. eL Vision opened a new dimension in my leadership."
    },
    {
      name: "Moses Maina",
      title: "Former Luxury Gym Manager, Dubai",
      image: "🏋️",
      rating: 5,
      text: "Losing my job was my lowest point. Just 1 session gave me incredible clarity. Within 2 weeks, I landed a new position 40% better salary. This wasn't luck."
    },
    {
      name: "David Sutanto",
      title: "CEO Tech Startup, $50M Valuation",
      image: "👔",
      rating: 5,
      text: "Money wasn't the problem anymore, but problems kept coming. After 1:1 with eL Vision, I understood: what was missing wasn't strategy, but energy calibration. Now business grows without drama."
    },
    {
      name: "Linda Permata",
      title: "Real Estate Investor & Entrepreneur",
      image: "👩‍💼",
      rating: 5,
      text: "I thought I was 'done' financially. Turns out there's a next level: manifestation without force. $3000 is the best investment compared to $50k seminars that are just theory."
    },
    {
      name: "Stephanie Chen",
      title: "Art Gallery Owner, Singapore",
      image: "🎨",
      rating: 5,
      text: "After the free first session, I immediately knew this was different. Not empty advice, but real results. 3 weeks later, my collection sold for 3x expected price. The energy shift is real."
    },
    {
      name: "Budi Hermawan",
      title: "Manufacturing Group Owner",
      image: "🎯",
      rating: 5,
      text: "6 weeks changed 15 years of mindset. Wealth was there, but peace wasn't. Now I understand: true prosperity starts with 1% of the right focus."
    },
    {
      name: "Dr. Siska Wijaya",
      title: "Medical Specialist & Holistic Practitioner",
      image: "⚕️",
      rating: 5,
      text: "As a doctor, I was skeptical. But this 1:1 system isn't just spiritual theory—it's the science of consciousness. My patients also feel the difference in my energy."
    },
    {
      name: "Rahman Putra",
      title: "Import-Export Company Director",
      image: "🌏",
      rating: 5,
      text: "Big deals started coming naturally. What changed wasn't my business strategy, but my internal calibration. eL Vision teaches manifestation from a level I'd never touched."
    },
    {
      name: "Patricia Wong",
      title: "Fashion Entrepreneur, Jakarta",
      image: "👗",
      rating: 5,
      text: "My brand was stuck at the same revenue for 2 years. After this program, breakthrough came: partnership with international retailers I never imagined. It's about energy alignment."
    }
  ];

  const goals = [
    {
      icon: <DollarSign className="w-12 h-12" />,
      title: "WEALTH",
      description: "Manifest wealth consciousness without anxiety. Money flows naturally."
    },
    {
      icon: <Crown className="w-12 h-12" />,
      title: "POWER",
      description: "Leadership grounded in clarity. Organic and sustainable influence."
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "LOVE",
      description: "Authentic and deep relationships. Natural magnetic presence."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 blur-3xl"
              style={{
                width: `${Math.random() * 400 + 200}px`,
                height: `${Math.random() * 400 + 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `translateY(${scrollY * 0.5}px)`,
                animation: `float ${Math.random() * 15 + 10}s infinite ease-in-out`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full px-6 py-3 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 font-semibold">EXCLUSIVELY FOR HIGH ACHIEVERS</span>
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              1:1 SYSTEM
            </span>
          </h1>
          
          <p className="text-3xl md:text-4xl text-gray-300 mb-4 font-light">
            eL Vision Premium Coaching
          </p>

          <div className="flex items-center justify-center gap-3 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-yellow-500 text-yellow-500" />
            ))}
          </div>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            For those who already have everything, but still searching for something deeper
          </p>

          {/* Free Trial Badge */}
          <div className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl px-8 py-4 mb-6 backdrop-blur-sm animate-pulse">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-green-400">FIRST SESSION FREE</div>
                <div className="text-sm text-gray-300">Experience The Value, Pay When You're Sure</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-8 max-w-2xl mx-auto backdrop-blur-sm mb-8">
            <div className="text-5xl font-bold text-yellow-400 mb-2">$3,000</div>
            <div className="text-xl text-gray-300 mb-1">6 Weeks • 6 Private Sessions (60 min/session)</div>
            <div className="text-sm text-gray-400">Pay After Session 1 • 1 Session per Week</div>
          </div>


        </div>
      </div>

      {/* Proof Not Advice Section */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl px-8 py-4 mb-8">
              <TrendingUp className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  We Don't Sell Advice
                </span>
              </h2>
              <p className="text-2xl text-gray-300">
                We Sell <span className="text-yellow-400 font-bold">PROVEN RESULTS</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-900/50 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl opacity-10">❌</div>
                <h3 className="text-2xl font-bold text-red-400 mb-4">Not This</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Theoretical advice that sounds good on paper</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Temporary motivation that fades tomorrow</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Abstract spiritual concepts</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Empty promises without real proof</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-black border-2 border-green-500/50 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl opacity-10">✓</div>
                <h3 className="text-2xl font-bold text-green-400 mb-4">What You Get</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span><strong>Measurable results</strong> in the first week</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span><strong>Energy transformation</strong> you can feel</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span><strong>Clarity</strong> for major decisions</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span><strong>Real manifestation</strong> like our clients</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-8">
              <p className="text-2xl text-gray-300 leading-relaxed">
                That's why <strong className="text-yellow-400">FIRST SESSION IS FREE</strong>.<br />
                You don't have to believe our words.<br />
                <span className="text-3xl font-bold text-yellow-400">Experience the proof yourself.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pain Point Section */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Is This You?
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-red-900/30 rounded-2xl p-8">
                <div className="text-red-400 text-6xl mb-4">💸</div>
                <h3 className="text-2xl font-bold mb-4 text-red-400">Money's There, But...</h3>
                <p className="text-gray-300 leading-relaxed">
                  Problems keep arriving. As if money becomes a magnet for drama, conflict, and anxiety. The more wealth you have, the more complex problems erode your peace.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-900/30 rounded-2xl p-8">
                <div className="text-orange-400 text-6xl mb-4">🎭</div>
                <h3 className="text-2xl font-bold mb-4 text-orange-400">Success Outside, Empty Inside</h3>
                <p className="text-gray-300 leading-relaxed">
                  Achievement after achievement reached. But there's a void that nothing can fill. You know there's more, but don't know how to access it.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-8">
                <div className="text-yellow-400 text-6xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">Energy Drained</h3>
                <p className="text-gray-300 leading-relaxed">
                  Every day feels like a battle. Big decisions drain your energy. You want natural flow, not constant exhausting struggle.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-900/30 rounded-2xl p-8">
                <div className="text-amber-400 text-6xl mb-4">🌪️</div>
                <h3 className="text-2xl font-bold mb-4 text-amber-400">Lost Clarity</h3>
                <p className="text-gray-300 leading-relaxed">
                  The vision that was once sharp is now blurred. Too many choices, too many voices. You need clarity to see the next step with certainty.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-2xl text-gray-300 italic">
                "Wrong calibration makes success feel like a burden."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Define Your Specific Goal
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Focus is key. Choose one area for deep transformation in 6 weeks
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {goals.map((goal, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-800 to-black border border-yellow-900/30 rounded-2xl p-8 hover:border-yellow-500/50 transition-all hover:scale-105 cursor-pointer">
                <div className="text-yellow-500 mb-6 flex justify-center">
                  {goal.icon}
                </div>
                <h3 className="text-3xl font-bold text-center mb-4 text-yellow-400">
                  {goal.title}
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  {goal.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-gray-400 mb-8">
              Or a combination of all three? We'll customize to your needs.
            </p>

          </div>
        </div>
      </div>

      {/* What You Get Section */}
      <div className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              What You Get
            </span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              "6 Private 1:1 Sessions (60 minutes per session) with exclusive eL Vision method",
              "Vipassana & Calibration specifically tailored to your goal",
              "Direct WhatsApp access for guidance between sessions",
              "Custom manifestation protocol based on your energy signature",
              "Weekly progress tracking to ensure measurable transformation",
              "Lifetime access to exclusive high-tier clients community"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-yellow-900/50 transition-all">
                <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <span className="text-lg text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              What Our High-Tier Clients Say
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Those who've already "succeeded" but seek the next level
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-8 hover:border-yellow-500/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-400">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl px-8 py-6">
              <p className="text-xl text-gray-300 mb-2">
                <strong className="text-purple-400">Results Aren't Coincidence.</strong>
              </p>
              <p className="text-lg text-gray-400">
                Every testimony is proof of precise energy calibration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-8" />
            
            <h2 className="text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Time To Recalibrate
              </span>
            </h2>

            <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
              Your money is enough. What you need is clarity, peace, and natural flow in manifesting your next desires.
            </p>

            <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-10 backdrop-blur-sm mb-12">
              <div className="inline-block bg-green-500/20 border border-green-500/50 rounded-full px-6 py-2 mb-4">
                <span className="text-green-400 font-bold text-lg">✓ FIRST SESSION FREE - Zero Risk</span>
              </div>
              <div className="text-5xl font-bold text-yellow-400 mb-3">$3,000</div>
              <div className="text-xl text-gray-300 mb-2">6 Weeks Transformation (60 min/session)</div>
              <div className="text-sm text-gray-400 mb-6">Pay After Session 1 • 1 Session per Week</div>
              
              <div className="inline-block bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-6 py-3">
                <p className="text-yellow-400 font-semibold">⚡ Limited: Only 3 Slots per Month</p>
              </div>
            </div>

            <button 
              className="group bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-2xl px-16 py-8 rounded-full transition-all transform hover:scale-105 shadow-2xl shadow-yellow-500/50 flex items-center gap-4 mx-auto mb-8"
              onClick={() => window.open('https://wa.me/62895325633487?text=Hi%20I%20would%20like%20to%20apply%20VIP%201%3A1%20%0AName:%20%0ASpecific%20Goal%3A', '_blank')}
            >
              <Phone className="w-8 h-8" />
              BOOK A CALL NOW
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>

            <p className="text-gray-500 text-sm">
              Limited slots. We only work with those serious about deep transformation.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}