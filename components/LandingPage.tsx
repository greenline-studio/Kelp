import React, { useEffect, useState } from 'react';
import { ArrowRight, MapPin, Sparkles, Star, Zap, Search, Calendar, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  // --- Hero Animation State ---
  const [cards, setCards] = useState([
    { id: 1, title: "Rooftop Drinks", place: "Skyline Lounge", rating: 4.8, tag: "Views" },
    { id: 2, title: "Jazz Dinner", place: "Blue Note", rating: 4.6, tag: "Live Music" },
    { id: 3, title: "Speakeasy", place: "The Vault", rating: 4.9, tag: "Cozy" },
  ]);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapMessage, setSwapMessage] = useState("");

  useEffect(() => {
    // Loop for the "Edit" animation simulation
    const interval = setInterval(() => {
      setIsSwapping(true);
      setSwapMessage("User: 'Make it cheaper'...");
      
      setTimeout(() => {
        setSwapMessage("AI: Swapping for happy hour...");
        
        setTimeout(() => {
            setCards(prev => {
                const newCards = [...prev];
                // Replace middle card
                newCards[1] = { 
                    id: Date.now(), 
                    title: "Tacos & Margaritas", 
                    place: "Velvet Taco", 
                    rating: 4.7, 
                    tag: "Budget Friendly" 
                };
                return newCards;
            });
            setIsSwapping(false);
            setSwapMessage("");
        }, 1500);

      }, 1500);

    }, 8000); // Run every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-kelp-bg text-slate-50 overflow-x-hidden font-sans">
      
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-kelp-teal/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-kelp-magenta/10 rounded-full blur-[120px]" />
      </div>

      {/* --- Navbar --- */}
      <nav className="relative z-50 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-kelp-teal to-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Kelp</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#how-it-works" className="hover:text-kelp-teal transition-colors">How it works</a>
          <a href="#features" className="hover:text-kelp-teal transition-colors">Why Kelp?</a>
        </div>

        <button 
          onClick={onStart}
          className="bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all backdrop-blur-md hover:border-kelp-teal/50 hover:shadow-[0_0_15px_rgba(45,212,191,0.1)]"
        >
          Plan my flow
        </button>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 md:py-24 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Copy */}
        <div className="space-y-8 animate-fade-in-up">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kelp-teal/10 border border-kelp-teal/20 text-kelp-teal text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(45,212,191,0.15)]">
            <Sparkles className="w-3 h-3" /> Powered by Yelp AI
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Turn a <span className="text-transparent bg-clip-text bg-gradient-to-r from-kelp-teal via-blue-400 to-kelp-magenta animate-pulse-slow">vibe</span> into a bookable night out.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
            Describe your mood, budget, and crew. Kelp designs a smart micro-itinerary with Yelp's trusted local data in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={onStart}
              className="group bg-kelp-teal text-kelp-bg px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:bg-teal-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(45,212,191,0.5)]"
            >
              Start Planning <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-xl font-bold text-lg text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all">
              See How It Works
            </button>
          </div>
        </div>

        {/* Right: Animated Preview */}
        <div className="relative h-[500px] w-full flex items-center justify-center perspective-[1000px] hidden lg:flex">
             {/* Chat Bubble Simulation */}
             <div className={`absolute top-0 right-10 z-30 transition-all duration-500 transform ${isSwapping ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                <div className="bg-slate-800 p-4 rounded-2xl rounded-tr-none border border-slate-600 shadow-xl max-w-xs">
                    <p className="text-sm text-kelp-teal font-medium">{swapMessage}</p>
                </div>
            </div>

            <div className="relative w-80 perspective-1000">
                {cards.map((card, idx) => (
                    <div
                        key={card.id}
                        className="absolute w-full bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                        style={{
                            top: `${idx * 110}px`,
                            left: `${idx * 20}px`,
                            zIndex: 10 - idx,
                            transform: isSwapping && idx === 1 
                                ? 'translateX(-120%) rotate(-10deg) opacity-50' // Slide out state
                                : 'translateX(0) rotate(0deg) opacity-100', // Normal state
                            borderColor: idx === 1 && !isSwapping ? 'rgba(45,212,191,0.4)' : '' // Highlight middle card when settled
                        }}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.tag}</span>
                            <div className="flex items-center gap-1 bg-slate-800 px-1.5 py-0.5 rounded text-xs text-yellow-400">
                                <Star className="w-3 h-3 fill-yellow-400" /> {card.rating}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{card.place}</h3>
                        <p className="text-sm text-slate-400">{card.title}</p>
                        
                        {/* Fake loading bars for visuals */}
                        <div className="mt-4 space-y-2">
                            <div className="h-1.5 bg-slate-800 rounded-full w-full overflow-hidden">
                                <div className="h-full bg-slate-600 rounded-full w-3/4"></div>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full w-2/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </header>

      {/* --- How It Works Section --- */}
      <section id="how-it-works" className="relative z-10 py-24 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">From Vibe to Venue</h2>
                <p className="text-slate-400 text-lg">Planning a night out shouldn't feel like a research project.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: <Sparkles className="w-6 h-6 text-kelp-magenta" />, title: "1. Describe the Plan", desc: "Tell Kelp your mood. 'Chill date night', 'Rowdy birthday', or 'Quiet coffee'." },
                    { icon: <Zap className="w-6 h-6 text-yellow-400" />, title: "2. Kelp Chats with Yelp", desc: "Our AI agents scan thousands of real-time Yelp listings, reviews, and amenities." },
                    { icon: <Calendar className="w-6 h-6 text-kelp-teal" />, title: "3. Get a Bookable Flow", desc: "Receive a 3-stop itinerary. Don't like a spot? Just ask to swap it." }
                ].map((step, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl relative group hover:border-kelp-teal/30 transition-colors">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- Comparison Section --- */}
      <section id="features" className="relative z-10 py-24">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Stop scrolling listicles. <br />Start flowing.</h2>
                <p className="text-lg text-slate-400">Generic search results give you 20 options and zero context. Kelp gives you a plan.</p>
                
                <ul className="space-y-4 pt-4">
                    {[
                        "Curated sequence (Drinks → Dinner → Fun)",
                        "Real-time availability logic",
                        "Conversational edits ('Too expensive', 'Make it closer')",
                        "Deep Yelp data integration"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-300">
                            <div className="w-5 h-5 rounded-full bg-kelp-teal/20 flex items-center justify-center">
                                <ChevronRight className="w-3 h-3 text-kelp-teal" />
                            </div>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="relative">
                {/* Generic Card */}
                <div className="absolute top-0 right-10 w-64 bg-slate-800 p-6 rounded-xl border border-slate-700 opacity-50 scale-95 blur-[1px]">
                    <div className="h-4 w-1/2 bg-slate-600 rounded mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-3 w-full bg-slate-700 rounded"></div>
                        <div className="h-3 w-full bg-slate-700 rounded"></div>
                        <div className="h-3 w-3/4 bg-slate-700 rounded"></div>
                    </div>
                </div>

                {/* Kelp Card */}
                <div className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-kelp-teal/50 shadow-[0_0_50px_rgba(45,212,191,0.15)] mt-12 md:mt-0 md:-ml-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-kelp-magenta animate-pulse"></span>
                            <span className="font-bold tracking-wide text-sm uppercase">Kelp Itinerary</span>
                        </div>
                        <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">3 Stops</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="w-8 h-8 rounded-full bg-kelp-teal/20 text-kelp-teal flex items-center justify-center font-bold text-xs">1</div>
                            <div className="text-sm font-medium">Cocktails @ The Roof</div>
                        </div>
                         <div className="flex justify-center h-4 border-l border-dashed border-slate-600 ml-7"></div>
                         <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="w-8 h-8 rounded-full bg-kelp-teal/20 text-kelp-teal flex items-center justify-center font-bold text-xs">2</div>
                            <div className="text-sm font-medium">Sushi @ Omakase</div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* --- Powered By Yelp --- */}
      <section className="py-16 bg-white text-slate-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_design_web/2d217a15a200/assets/img/brand_guidelines/yelp_burst.png')] opacity-5 bg-cover bg-center"></div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
             <h2 className="text-3xl font-bold mb-6">Built on the Yelp Fusion AI API</h2>
             <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                 Kelp leverages Yelp's massive database of 60M+ reviews and businesses to ensure your night out isn't just hallucinated—it's real, rated, and open for business.
             </p>
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-700">
                Data Source: <span className="text-[#ff1a1a]">Yelp Places & Reviews</span>
             </div>
          </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 bg-slate-950 border-t border-slate-900 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold">Kelp</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500 text-sm">AI Nightlife Planner</span>
        </div>
        <p className="text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} Kelp. Hackathon Submission.
        </p>
        <div className="flex justify-center gap-6 mt-6 text-sm text-slate-500">
            <a href="#" className="hover:text-kelp-teal">Privacy Policy</a>
            <a href="#" className="hover:text-kelp-teal">Terms of Service</a>
            <a href="#" className="hover:text-kelp-teal">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
