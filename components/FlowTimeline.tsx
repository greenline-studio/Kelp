import React from 'react';
import { Flow } from '../types';
import { Star, Clock, DollarSign, ExternalLink, Sparkles } from 'lucide-react';

interface FlowTimelineProps {
  flow: Flow;
}

const FlowTimeline: React.FC<FlowTimelineProps> = ({ flow }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header Stats */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-6 bg-gradient-to-r from-slate-800/80 to-slate-900/80 p-6 rounded-2xl border border-white/5 shadow-lg backdrop-blur-sm">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{flow.title}</h2>
          <div className="flex items-center gap-3 text-sm text-slate-400">
             <span className="bg-slate-700/50 px-2 py-0.5 rounded text-white">{flow.stops.length} stops</span>
             <span>•</span>
             <span>Budget: <span className="text-kelp-teal">{flow.totalBudgetEstimate}</span></span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-kelp-teal bg-kelp-teal/10 px-4 py-2 rounded-full border border-kelp-teal/20">
           <Clock className="w-4 h-4" />
           <span>~{(flow.totalDuration / 60).toFixed(1)} hours total</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-12 pl-6">
        {/* Continuous Vertical Line */}
        <div className="absolute left-[29px] top-6 bottom-12 w-0.5 bg-gradient-to-b from-kelp-teal via-slate-700 to-slate-800 -z-10 opacity-30"></div>

        {flow.stops.map((stop, index) => (
          <div key={stop.id} className="relative flex gap-8 group animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
            
            {/* Number Bubble */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-kelp-teal text-kelp-teal font-bold text-lg flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.25)] z-10 group-hover:scale-110 transition-transform duration-300">
                {stop.order}
              </div>
            </div>

            {/* Content Card */}
            <div className="flex-1 glass-panel rounded-2xl p-0 overflow-hidden glass-card-hover group-hover:border-kelp-teal/30">
              
              {/* Image Hero */}
              <div className="relative h-40 w-full overflow-hidden">
                <img src={stop.imageUrl} alt={stop.businessName} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                
                <div className="absolute top-4 right-4">
                     <div className="flex items-center bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-sm text-white font-bold border border-white/10 shadow-lg">
                        {stop.rating.toFixed(1)} <Star className="w-3.5 h-3.5 ml-1 fill-yellow-400 text-yellow-400" />
                     </div>
                </div>

                <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="text-2xl font-bold text-white leading-tight mb-1 drop-shadow-md">{stop.businessName}</h3>
                    <p className="text-slate-300 text-sm font-medium tracking-wide uppercase">{stop.category}</p>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-5 space-y-4">
                
                {/* AI Reason */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5 relative">
                    <div className="absolute -left-1 top-4 w-1 h-8 bg-kelp-magenta rounded-r"></div>
                    <p className="text-sm text-slate-300 italic pl-2 leading-relaxed">
                        <span className="text-kelp-magenta font-semibold not-italic mr-2">Why here:</span>
                        "{stop.reason}"
                    </p>
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                    <div className="flex gap-4 text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-slate-500" /> {stop.price}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-500" /> ~{stop.durationMinutes} min</span>
                    </div>
                    
                    <div className="flex gap-3">
                        <a 
                           href={stop.yelpUrl} 
                           target="_blank" 
                           rel="noreferrer"
                           className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-xs font-bold border border-slate-700 transition-colors flex items-center gap-2"
                        >
                            Yelp Review <ExternalLink className="w-3 h-3" />
                        </a>
                        {stop.category.toLowerCase().includes('restaurant') && (
                            <button className="px-4 py-2 bg-kelp-teal/10 hover:bg-kelp-teal/20 text-kelp-teal border border-kelp-teal/30 rounded-lg text-xs font-bold transition-colors">
                                Reserve Table
                            </button>
                        )}
                    </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center pb-8 opacity-50">
          <p className="text-xs text-slate-400">Powered by Yelp Fusion AI API • Prices and availability subject to change</p>
      </div>
    </div>
  );
};

export default FlowTimeline;
