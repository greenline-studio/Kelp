import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { MapPin, Sparkles, DollarSign, Clock, Users, ArrowRight } from 'lucide-react';

interface ScenarioFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const ScenarioForm: React.FC<ScenarioFormProps> = ({ onSubmit, isLoading }) => {
  const [prefs, setPrefs] = useState<UserPreferences>({
    location: '',
    vibe: '',
    budget: '$$',
    time: 'evening',
    groupSize: 2
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prefs.location || !prefs.vibe) return;
    onSubmit(prefs);
  };

  const handleGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPrefs(prev => ({ ...prev, location: "Downtown" })); 
      });
    }
  };

  const budgetOptions = [
    { value: '$', label: 'Econ', range: '<$30' },
    { value: '$$', label: 'Standard', range: '$30-60' },
    { value: '$$$', label: 'Premium', range: '$60-100' },
    { value: '$$$$', label: 'Splurge', range: '$100+' },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-8 bg-slate-900/40 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-kelp-teal/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Location */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-kelp-teal" /> Where are we going?
        </label>
        <div className="flex gap-2 group focus-within:ring-2 focus-within:ring-kelp-teal/50 rounded-xl transition-all">
          <input
            type="text"
            placeholder="City, neighborhood, or zip"
            value={prefs.location}
            onChange={(e) => setPrefs({ ...prefs, location: e.target.value })}
            className="flex-1 bg-slate-950/60 border border-slate-700/50 rounded-xl px-5 py-4 text-white text-lg placeholder:text-slate-600 focus:outline-none focus:border-kelp-teal/50 transition-all"
            required
          />
          <button 
            type="button" 
            onClick={handleGeoLocation}
            className="p-4 bg-slate-800/50 text-slate-400 rounded-xl border border-slate-700/50 hover:text-kelp-teal hover:bg-slate-800 hover:border-kelp-teal/50 transition-all"
            title="Use current location"
          >
            <MapPin className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Vibe Scenario */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-kelp-magenta" /> What's the vibe?
        </label>
        <div className="relative">
            <textarea
            placeholder="E.g., A chill date night with cocktails and live jazz, preferably walking distance, no loud clubs."
            value={prefs.vibe}
            onChange={(e) => setPrefs({ ...prefs, vibe: e.target.value })}
            className="w-full h-32 bg-slate-950/60 border border-slate-700/50 rounded-xl px-5 py-4 text-white text-lg placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-kelp-magenta/50 focus:border-transparent resize-none transition-all"
            required
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-600 pointer-events-none">
                Be specific for better results
            </div>
        </div>
      </div>

      {/* Budget Row (Expanded) */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            Target Budget <span className="text-[10px] font-normal normal-case text-slate-600">(per person)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {budgetOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPrefs({ ...prefs, budget: opt.value as any })}
              className={`relative overflow-hidden flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-200 group ${
                prefs.budget === opt.value 
                  ? 'bg-kelp-teal/10 border-kelp-teal shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <span className={`text-sm font-bold mb-1 transition-colors ${prefs.budget === opt.value ? 'text-kelp-teal' : 'text-slate-200 group-hover:text-white'}`}>
                {opt.label}
              </span>
              <span className={`text-xs transition-colors ${prefs.budget === opt.value ? 'text-kelp-teal/80' : 'text-slate-500 group-hover:text-slate-400'}`}>
                {opt.range}
              </span>
              {prefs.budget === opt.value && (
                  <div className="absolute inset-0 border-2 border-kelp-teal rounded-xl pointer-events-none"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Time & Size Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Time */}
        <div className="space-y-3">
           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time</label>
           <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select 
                    value={prefs.time}
                    onChange={(e) => setPrefs({ ...prefs, time: e.target.value as any })}
                    className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-3.5 focus:ring-2 focus:ring-kelp-teal/50 outline-none appearance-none font-medium hover:border-slate-700 transition-colors"
                >
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="late_night">Late Night</option>
                </select>
           </div>
        </div>

         {/* Group Size */}
         <div className="space-y-3">
           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crew Size</label>
           <div className="flex items-center bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-kelp-teal/50 hover:border-slate-700 transition-all">
              <Users className="w-5 h-5 text-slate-500 mr-3" />
              <input 
                type="number" 
                min="1" 
                max="20"
                value={prefs.groupSize}
                onChange={(e) => setPrefs({...prefs, groupSize: parseInt(e.target.value)})}
                className="bg-transparent text-white w-full outline-none font-medium"
              />
           </div>
        </div>

      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(45,212,191,0.2)] flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] group ${
            isLoading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-kelp-teal to-teal-500 hover:to-teal-400 text-slate-950 hover:shadow-[0_0_40px_rgba(45,212,191,0.4)]'
            }`}
        >
            {isLoading ? (
            <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                Curating your night...
            </>
            ) : (
            <>Generate Flow <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
            )}
        </button>
      </div>

    </form>
  );
};

export default ScenarioForm;