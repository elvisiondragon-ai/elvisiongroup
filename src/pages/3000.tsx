import React, { useState, useEffect, useRef } from 'react';
import { Star, CheckCircle, TrendingUp, Heart, Crown, DollarSign, Phone, ArrowRight, Sparkles, Shield, Check, Play, Pause } from 'lucide-react';

export default function ELVision3000() {
  // Facebook Pixel Code
  useEffect(() => {
    !(function (f: any, b: any, e: any, v: any, n: any, t: any, s: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );
    fbq('init', '3319324491540889');
    fbq('track', 'PageView');
  }, []);
  const testimonials = [
    {
      name: "Felicia Quincy",
      title: "Instagram: @itsfelicia.quincy",
      verified: true,
      image: "👩‍💼",
      rating: 5,
      text: "Following 6 weeks program make me from anxious and overthinking, first all my decision are foggy and so difficult to move forward, after the program i can see things clearer and also when my vibration is clear, my reality, connection and finance get better. It was amazing"
    },
    {
      name: "Agus Mulyadi, SH., MH.",
      title: "Head of Pangandaran Intelligence, Indonesia",
      verified: true,
      image: "👨‍💼",
      rating: 5,
      text: "As head of intelligence in Indonesia I have so many difficult tasks and impossible responsibilities to decide, with meditation 6 weeks I have super intuitive to get the best result of my works"
    },
    {
      name: "Dr. Gumilar",
      title: "Doctor & Hypnotherapist (20+ Years)",
      verified: true,
      image: "⚕️",
      rating: 5,
      text: "As doctor myself and hypnotherapist for more than 20 years I REALIZED my hypnotherapy is out of date, doing eL Vision method for 6 weeks completely change my perspective and see that this modern method was fast result"
    },
    {
      name: "Suryadi",
      title: "Foundation of Aisyah - Managing 100+ Orphanages",
      verified: true,
      image: "🌟",
      rating: 5,
      text: "We manage over hundreds of orphanage and give them scholarship to best college around the world. The hard part is to get donor that understand the value, with deep meditation with eL, it was amazing and make me easier to meet correct donors"
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
      image: "💎",
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
    }
  ];

  const weeklyProgram = [
    {
      week: "Week 0",
      title: "Before Program",
      description: "Problem, foggy mind, headache, fear, doubt",
      color: "from-red-900/30 to-gray-900",
      borderColor: "border-red-900/50"
    },
    {
      week: "Week 1",
      title: "Initial Shift",
      description: "Start feel easier to see day by day and joy",
      color: "from-orange-900/30 to-gray-900",
      borderColor: "border-orange-900/50"
    },
    {
      week: "Week 2",
      title: "Deeper Connection",
      description: "Deeper your sense of reality, from visual, listening even kinetic feel, you start connected with reality with joy",
      color: "from-yellow-900/30 to-gray-900",
      borderColor: "border-yellow-900/50"
    },
    {
      week: "Week 3",
      title: "Alignment & Flow",
      description: "Happiness start flow automatic in your presence, as now you Align with your goal, all the possible answer start reveal itself to you",
      color: "from-green-900/30 to-gray-900",
      borderColor: "border-green-900/50"
    },
    {
      week: "Week 4",
      title: "Results Begin",
      description: "Start to collection step by step result",
      color: "from-blue-900/30 to-gray-900",
      borderColor: "border-blue-900/50"
    },
    {
      week: "Week 5",
      title: "Deepening Results",
      description: "Result Closer as your frequency deeper align with your goal",
      color: "from-purple-900/30 to-gray-900",
      borderColor: "border-purple-900/50"
    },
    {
      week: "Week 6",
      title: "Achievement",
      description: "Result achieved",
      color: "from-yellow-500/30 to-amber-500/30",
      borderColor: "border-yellow-500/50"
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

  // New Audio Player Component
  const AudioPlayer = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayPause = () => {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
        // Track custom event for audio playback
        // @ts-ignore
        if (typeof fbq === 'function') {
          // @ts-ignore
          fbq('trackCustom', 'AudioPlayed', {
            audio_src: audioRef.current.src,
          });
        }
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    // Listen for when audio ends to reset button
    useEffect(() => {
      const audio = audioRef.current;
      if (audio) {
        const handleEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
      }
    }, []);

    return (
      <div className="flex items-center justify-center p-4">
        <button
          onClick={togglePlayPause}
          className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-yellow-500/50"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          {isPlaying ? 'Pause Audio' : 'Play Audio'}
        </button>
        <audio ref={audioRef} src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio/el3000.mp3" preload="auto" className="hidden" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Static Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/10 via-black to-black" />

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
          <div className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl px-8 py-4 mb-6 backdrop-blur-sm">
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

          <button 
            className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold text-xl px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl shadow-purple-500/50 flex items-center gap-4 mx-auto mb-16"
            onClick={() => window.open('https://instagram.com/elreyzandra', '_blank')}
          >
            <ArrowRight className="w-6 h-6" />
            FOLLOW OUR FOUNDER AT INSTAGRAM
          </button>
        
        {/* Audio Player */}
        <div className="py-10 bg-black">
          <div className="container mx-auto px-6">
            <AudioPlayer />
          </div>
        </div>

        {/* Reyzandra's Message */}
        <div className="py-10 bg-black">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-10 mb-8 text-gray-300 leading-relaxed text-lg">
              <p className="mb-4">My name is eL Reyzandra,</p>
              <p className="mb-4">Founder of eL Vision.</p>
              <p className="mb-4">By 2025, I have spent more than 15 years working in this field.</p>
              <p className="mb-4">My clients are primarily individuals with significant responsibility—heads of intelligence units, founders of social foundations, scholarship institutions, and leaders who operate under constant pressure.</p>
              <p className="mb-4">One category of client that has left a deep impression on me is those who come at the most critical moments of life.</p>
              <p className="mb-4">For example, Mr. Arif, who in May 2025 was medically diagnosed with stage-4 brain cancer and given an estimated three months. As of December 2025, he remains alive, conscious, and functioning.</p>
              <p className="mb-4">This experience reinforced a principle I have held for years:</p>
              <p className="mb-4">science can measure probabilities, but it does not own the authority over life.</p>
              <p className="mb-4">Life moves according to natural laws—and nature, when understood correctly, is far more compassionate than most people realize.</p>
              <p className="mb-4">Many ask why my clients tend to be high-profile individuals.</p>
              <p className="mb-4">The reason is simple:</p>
              <p className="mb-4">the more knowledge and experience a person accumulates, the sooner they realize that there is an invisible limiting factor—a factor that blocks progress regardless of intelligence, strategy, or effort.</p>
              <p className="mb-4">This is not a lack of skill.</p>
              <p className="mb-4">It is a misalignment with natural law.</p>
              <p className="mb-4">My journey began 15 years ago when I personally attempted to apply the Law of Attraction through popular teachings such as The Secret. I failed completely.</p>
              <p className="mb-4">That failure forced me to ask a deeper question:</p>
              <p className="mb-4">What is missing?</p>
              <p className="mb-4">Years of research, personal testing, and sacrifice eventually revealed the gap.</p>
              <p className="mb-4">That gap is what eL Vision now addresses—not as theory, but as a lived system that can be experienced directly.</p>
              <p className="mb-4">This is also why the first session is offered free.</p>
              <p className="mb-4">I do not sell motivation, belief, or advice.</p>
              <p className="mb-4">I offer a working method.</p>
              <p className="mb-4">One of my earliest international clients in Dubai came to me after losing his job. He joined a free session. Weeks later, he secured a better position as a manager at a premium gym.</p>
              <p className="mb-4">No promises were made. No persuasion was used.</p>
              <p className="mb-4">Am I extraordinary?</p>
              <p className="mb-4">No.</p>
              <p className="mb-4">What I have learned is this:</p>
              <p className="mb-4">every human being carries an inner strength already granted by nature.</p>
              <p className="mb-4">The difference lies only in knowing how to activate it.</p>
              <p className="mb-4">If you genuinely wish to experience this for yourself,</p>
              <p className="mb-4">start with the free session.</p>
              <p className="mb-4">Only then decide whether the six-week program is right for you.</p>
              <p className="mb-4">I have no interest in earning money by keeping people dependent or confused.</p>
              <p className="mb-4">This is designed to be one of the most efficient investments you will ever make—</p>
              <p className="mb-4">a small portion of your resources, in exchange for what matters most: clarity, alignment, and inner stability.</p>
              <p className="mb-4">I look forward to meeting you in the class.</p>
              <p className="mt-8 font-bold">— eL Reyzandra</p>
              <p className="font-bold">Founder, eL Vision</p>
            </div>
          </div>
        </div>

      {/* Story-Based Case Studies Section */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Real Stories, Real Transformation
              </span>
            </h2>
            <p className="text-xl text-gray-400 text-center mb-16">
              Case studies from high-performers who broke through internal ceilings
            </p>

            {/* John's Story */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-10 mb-8">
              <div className="inline-block bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1 mb-4">
                <span className="text-yellow-400 font-semibold text-sm">CASE STUDY: JOHN</span>
              </div>
              <h3 className="text-3xl font-bold text-yellow-400 mb-6">The Business Owner Who Had Everything Right</h3>
              
              <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
                <p>
                  John was already doing everything right. He had tested multiple ad strategies, hired strong teams, optimized funnels, and spent serious money on execution. Technically, nothing was wrong.
                </p>
                <p>
                  Yet his business kept stalling at the same ceiling. No matter how hard he pushed externally, the breakthrough wouldn't happen.
                </p>
                <p className="text-yellow-400 font-semibold">
                  When we worked together, it became clear: the obstacle was no longer outside the business. It was internal — subtle mental friction, decision fatigue, and unconscious resistance that even smart people overlook.
                </p>
                <p>
                  After entering a focused 6-week private process, the change wasn't dramatic on the surface. But clarity returned. Execution simplified. And the results he had been chasing finally began to move.
                </p>
              </div>
            </div>

            {/* Noah's Story */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-900/30 rounded-2xl p-10">
              <div className="inline-block bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1 mb-4">
                <span className="text-amber-400 font-semibold text-sm">CASE STUDY: NOAH</span>
              </div>
              <h3 className="text-3xl font-bold text-amber-400 mb-6">Wealth Without Peace</h3>
              
              <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
                <p>
                  Noah's story looked different. He had wealth, status, and freedom on paper. But his family wasn't happy. His body was breaking down.
                </p>
                <p>
                  Money, instead of being a tool, had become a source of pressure and recurring problems. The issue wasn't lack of success. It was internal misalignment.
                </p>
                <p className="text-amber-400 font-semibold">
                  During the same 6-week private work, we addressed the internal patterns that quietly distorted how money, relationships, and health showed up in his life.
                </p>
                <p>
                  Over time, money returned to its proper role — a tool for life, not a trigger for suffering.
                </p>
              </div>
            </div>

            {/* Pattern Recognition */}
            <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8">
              <h4 className="text-2xl font-bold text-purple-400 mb-4">The Common Pattern</h4>
              <div className="space-y-3 text-gray-300 leading-relaxed">
                <p>
                  Many people share a similar pattern. They try harder. They fix strategies. They optimize systems. But the solution is not there.
                </p>
                <p className="text-xl font-semibold text-white">
                  In fact, over 90% of our clients are top-tier performers. They already have technical mastery and external competence.
                </p>
                <p>
                  So why do they come to us? Because the smarter you become, the more you realize there is an X factor that techniques cannot fix. And that factor is internal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Program Breakdown */}
      <div className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              6-Week Transformation Journey
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            What happens week by week in your transformation
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            {weeklyProgram.map((week, idx) => (
              <div key={idx} className={`bg-gradient-to-r ${week.color} border ${week.borderColor} rounded-2xl p-8 transition-all hover:scale-105`}>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full ${week.week === "Week 6" ? "bg-yellow-500" : "bg-gray-800"} flex items-center justify-center border-2 ${week.week === "Week 6" ? "border-yellow-400" : "border-gray-700"}`}>
                      <span className={`font-bold ${week.week === "Week 6" ? "text-black" : "text-white"}`}>{idx}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-gray-400 uppercase">{week.week}</span>
                      {week.week === "Week 6" && <Check className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{week.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{week.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl px-8 py-6">
              <p className="text-xl text-gray-300">
                <strong className="text-yellow-400">This is not advice. This is not motivation.</strong><br />
                It is precision work on the system that drives everything else.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Not Advice Section */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
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
                <div className="absolute top-0 right-0 text-9xl opacity-10">✗</div>
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
<ul className="space-y-4 text-left">
<li className="flex items-start gap-3 text-gray-300">
<span className="text-2xl mt-1 flex-shrink-0">🏥</span>
<span><strong>Health transformations:</strong> We've helped clients defy terminal diagnoses. Mr. Arif was diagnosed with cancer and given 3 months to live in May 2025 - he's alive and thriving today. You can contact him directly to hear his story.</span>
</li>
<li className="flex items-start gap-3 text-gray-300">
<span className="text-2xl mt-1 flex-shrink-0">💰</span>
<span><strong>Financial breakthroughs:</strong> One foundation owner grew their scholarship donations from zero to $6M/year after working with us.</span>
</li>
<li className="flex items-start gap-3 text-gray-300">
<span className="text-2xl mt-1 flex-shrink-0">👨‍👩‍👧‍👦</span>
<span><strong>Family healing:</strong> Successful men often struggle with feeling respected at home. When ego clashes seem unsolvable, we create change within weeks - not years.</span>
</li>
<li className="flex items-start gap-3 text-gray-300">
<span className="text-2xl mt-1 flex-shrink-0">☮️</span>
<span><strong>True peace & happiness:</strong> Money and happiness are different. Money buys hospital visits and stress relief - not joy. Real happiness comes from attitude and giving. In your first session, you'll discover happiness through simple things: your breath, what you see, how you sense the world. Your finances become a bonus to happiness itself.</span>
</li>
<li className="flex items-start gap-3 text-gray-300">
<span className="text-2xl mt-1 flex-shrink-0">❤️</span>
<span><strong>Love & relationships:</strong> Our male clients who want to attract a specific woman have a 95% success rate within 6 weeks. For transparency: women seeking to attract a specific man have a 50% success rate in the same timeframe. However, women working to heal existing marriages also achieve 95% success - which is why we often recommend that path.</span>
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

          {/* Our Method Section */}
          <div className="mt-20 text-left">
            <h2 className="text-5xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Our Method
              </span>
            </h2>

            <div className="max-w-4xl mx-auto space-y-6 text-gray-300 leading-relaxed text-lg">
              <p>
                The eL Vision method is <strong className="text-yellow-400">not magic</strong>, not empty suggestion, and not mere <em>positive thinking</em>.
                It is a <strong className="text-yellow-400">calibration of the human internal system</strong>, working across three interconnected layers:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>physiological energy and nervous system regulation,</li>
                <li>subconscious patterning,</li>
                <li>and decision-making mechanisms that consistently shape daily reality.</li>
              </ul>
              <p>
                Modern neuroscience and psychology show that human behavior is <strong className="text-yellow-400">not primarily driven by conscious intention</strong>,
                but by <strong className="text-yellow-400">automatic subconscious processes</strong>.
              </p>
              <p>
                Research indicates that:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>approximately <strong className="text-yellow-400">90–95% of human decisions are non-conscious</strong>,</li>
                <li>while the conscious mind often functions only to
                  <strong className="text-yellow-400">justify decisions already made by the subconscious system</strong>.
                </li>
              </ul>
              <p className="italic text-gray-400">
                (Reference: Daniel Kahneman — <em>Thinking, Fast and Slow</em>)
              </p>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">Where 90% of People Get “Stuck”</h3>
              <p>
                Most people who feel stuck are <strong className="text-yellow-400">not lacking strategy, effort, or intelligence</strong>.
                The issue exists at a deeper level: <strong className="text-yellow-400">internal misalignment</strong>.
              </p>
              <p>
                The pattern is consistent:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>the nervous system remains in a state of <strong className="text-yellow-400">chronic tension</strong>
                  (persistent stress, hyper-vigilance, unprocessed pressure),
                </li>
                <li>bodily energy is <strong className="text-yellow-400">out of sync</strong> with personal goals,</li>
                <li>outdated subconscious beliefs remain active,
                  even when the person <em>logically knows</em> they should change.
                </li>
              </ul>
              <p>
                As a result:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>big visions feel heavy,</li>
                <li>execution becomes inconsistent,</li>
                <li>small decisions are delayed,</li>
                <li>outcomes plateau despite increased effort.</li>
              </ul>
              <p>
                This is <strong className="text-yellow-400">not laziness</strong>.
                It is <strong className="text-yellow-400">systemic internal incoherence</strong>.
              </p>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">What We Actually Do</h3>
              <p>
                In private eL Vision sessions, we <strong className="text-yellow-400">do not work at the level of motivation or advice</strong>.
                We work <strong className="text-yellow-400">directly with the subconscious system</strong>.
              </p>
              <p>
                Our approach is grounded in principles from:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong className="text-yellow-400">Neuroscience</strong> (particularly neuroplasticity),</li>
                <li><strong className="text-yellow-400">Somatic psychology</strong> (the body–emotion–mind connection),</li>
                <li><strong className="text-yellow-400">Subconscious patterning</strong> and emotional recalibration.</li>
              </ul>
              <p>
                The founder of eL Vision has <strong className="text-yellow-400">over 15 years of experience</strong> guiding individuals into specific internal states
                where <strong className="text-yellow-400">beliefs, self-identity, and emotional patterns can be gradually restructured</strong>.
              </p>
              <p>
                In psychological literature, this process is often described as:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><em>bypassing conscious resistance</em>, or</li>
                <li><em>direct subconscious access</em>.</li>
              </ul>
              <p>
                Nothing is forced.
                Nothing is fought.
                The system is <strong className="text-yellow-400">reorganized from within</strong>.
              </p>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">Why This Is Not Traditional Law of Attraction</h3>
              <p>
                The eL Vision technique is <strong className="text-yellow-400">not a motivational version of the Law of Attraction</strong>.
                It is a <strong className="text-yellow-400">system upgrade</strong> because it operates on <strong className="text-yellow-400">two simultaneous flows</strong>.
              </p>
              <h4 className="text-2xl font-bold text-amber-400 pt-4 mb-2">1. The Vision Flow <em>(Goals & Intentions)</em></h4>
              <p>
                Conscious goals, future images, and desired outcomes.
              </p>
              <h4 className="text-2xl font-bold text-amber-400 pt-4 mb-2">2. The Reality Flow <em>(Current Internal State)</em></h4>
              <p>
                This includes:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>dominant emotional patterns,</li>
                <li>nervous system tone,</li>
                <li>felt sense of safety and confidence,</li>
                <li>and embodied presence in daily life.</li>
              </ul>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">The Core Problem Most People Face</h3>
              <p>
                For most individuals:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong className="text-yellow-400">the vision flow is strong</strong>,</li>
                <li>but <strong className="text-yellow-400">the reality flow is misaligned with that vision</strong>.</li>
              </ul>
              <p>
                Vision is created by the conscious mind,
                while the reality flow is governed by the <strong className="text-yellow-400">subconscious</strong> —
                and the subconscious <strong className="text-yellow-400">always dominates</strong>.
              </p>
              <p>
                In systems physics and dynamic psychology, one principle applies:
              </p>
              <blockquote className="border-l-4 border-yellow-500 pl-4 italic text-gray-400">
                <p><strong className="text-yellow-400">The more stable and consistent system will always override the weaker one.</strong></p>
              </blockquote>
              <p>
                When the internal reality flow contradicts the vision,
                the result is friction, subtle self-sabotage, and delayed manifestation.
              </p>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">The Core Principle of eL Vision</h3>
              <p>
                In eL Vision:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>we <strong className="text-yellow-400">do not chase vision aggressively</strong>,</li>
                <li>we <strong className="text-yellow-400">first align and strengthen the reality flow</strong>.</li>
              </ul>
              <p>
                When:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>the body becomes calmer,</li>
                <li>emotions become coherent,</li>
                <li>and internal beliefs stabilize,</li>
              </ul>
              <p>
                the reality flow begins to <strong className="text-yellow-400">move in the same direction as the vision</strong>.
              </p>
              <p>
                Once this alignment occurs,
                vision no longer needs to be forced —
                it is <strong className="text-yellow-400">carried into reality naturally</strong>.
              </p>
              <p>
                This is what many people describe as <em>“manifestation.”</em>
              </p>
              <p>
                Not because of wishing.
                But because the <strong className="text-yellow-400">internal system is finally coherent</strong>.
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
              onClick={() => {
                // @ts-ignore
                if (typeof fbq === 'function') {
                  // @ts-ignore
                  fbq('track', 'AddToCart', {
                    content_name: 'EL Vision 3000 Coaching',
                  });
                }
                window.open('https://wa.me/62895325633487?text=Hi%20I%20would%20like%20to%20apply%20VIP%201%3A1%20%0AName:%20%0ASpecific%20Goal:%3A', '_blank');
              }}
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
    </div>
  );
}