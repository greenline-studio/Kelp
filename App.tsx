import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ScenarioForm from './components/ScenarioForm';
import FlowTimeline from './components/FlowTimeline';
import ChatPanel from './components/ChatPanel';
import { Flow, Message, UserPreferences, ViewState } from './types';
import { generateFlow, chatWithFlow } from './services/geminiService';
import { Menu, Map, UserCircle } from 'lucide-react';
import { MOCK_USER_ID } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [flow, setFlow] = useState<Flow | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [userId, setUserId] = useState<string>("");

  // --- Auth & Init ---
  useEffect(() => {
    // Simulate simple guest auth
    let storedId = localStorage.getItem('kelp_user_id');
    if (!storedId) {
      storedId = `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem('kelp_user_id', storedId);
    }
    setUserId(storedId);
  }, []);

  const handleStart = () => {
    // Simple transition delay for effect could go here
    setView(ViewState.APP);
  };

  const handleCreateFlow = async (prefs: UserPreferences) => {
    setIsAiLoading(true);
    try {
      const generatedFlow = await generateFlow(prefs);
      setFlow(generatedFlow);
      
      const initialMsg: Message = {
        id: 'init-1',
        role: 'model',
        content: `I've put together a ${generatedFlow.stops.length}-stop plan for your "${prefs.vibe}" night in ${prefs.location || "town"}. It starts at ${generatedFlow.stops[0].businessName}. How does this look?`,
        timestamp: Date.now(),
        suggestedActions: [
            "Swap the first stop",
            "Make it cheaper",
            "Add a dessert spot",
            "Is it walkable?"
        ]
      };
      setMessages([initialMsg]);

    } catch (error) {
      alert("Failed to generate flow. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!flow) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await chatWithFlow(flow, history, text);

      const aiMsg: Message = {
        id: `m-${Date.now()}`,
        role: 'model',
        content: response.text || "I've updated the plan based on your request.",
        timestamp: Date.now(),
        suggestedActions: response.suggestedActions || [
             "Any other options?",
             "Change the time",
             "Looks good!"
        ]
      };
      setMessages(prev => [...prev, aiMsg]);

      if (response.updatedFlow) {
        setFlow(response.updatedFlow);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleClearChat = () => {
      if (flow) {
          setMessages([{
            id: 'init-reset',
            role: 'model',
            content: `Chat cleared. We're still looking at your plan for ${flow.title}. What would you like to tweak?`,
            timestamp: Date.now(),
            suggestedActions: ["Change the budget", "Swap a stop", "Start over"]
          }]);
      }
  };

  // --- Render ---

  if (view === ViewState.LANDING) {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <div className="flex flex-col h-screen bg-kelp-bg text-slate-50 overflow-hidden font-sans">
      
      {/* App Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-kelp-bg/80 backdrop-blur-md z-20 animate-fade-in">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView(ViewState.LANDING)}>
            <div className="w-8 h-8 bg-gradient-to-tr from-kelp-teal to-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.2)] group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Kelp</span>
        </div>
        
        <div className="flex items-center gap-4">
            {/* Mock Auth Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-400">
                <UserCircle className="w-4 h-4" />
                <span>{userId}</span>
            </div>

            {/* Mobile Chat Toggle */}
            {flow && (
                <button 
                    className="md:hidden p-2 text-slate-400 hover:text-white"
                    onClick={() => setShowChatMobile(!showChatMobile)}
                >
                    {showChatMobile ? <Map className="w-5 h-5"/> : <span className="text-xs font-bold bg-kelp-teal text-kelp-bg px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.4)]">Chat</span>}
                </button>
            )}
        </div>
      </header>

      <main className="flex-1 flex relative overflow-hidden">
        
        {/* Left / Main Panel (Flow & Form) */}
        <div className={`flex-1 overflow-y-auto relative transition-all duration-300 ${showChatMobile ? '-translate-x-full opacity-0 absolute' : 'translate-x-0 opacity-100'} md:translate-x-0 md:opacity-100 md:static`}>
          <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-full">
            
            {!flow ? (
              <div className="mt-10 animate-fade-in-up flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-center mb-10 space-y-3">
                     <h2 className="text-4xl font-extrabold text-white">Plan your night</h2>
                     <p className="text-slate-400 text-lg">Tell Kelp the vibe. We handle the stops.</p>
                </div>
                <ScenarioForm onSubmit={handleCreateFlow} isLoading={isAiLoading} />
              </div>
            ) : (
              <div className="animate-fade-in-up pb-20">
                 <div className="flex items-center justify-between mb-6">
                    <button 
                    onClick={() => setFlow(null)} 
                    className="text-sm text-slate-400 hover:text-kelp-teal flex items-center gap-1 transition-colors group"
                    >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Start Over
                    </button>
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Generated Flow</span>
                 </div>
                 <FlowTimeline flow={flow} />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel (Chat) */}
        {flow && (
          <aside className={`absolute inset-0 md:static md:w-[420px] bg-kelp-surface/50 border-l border-white/5 backdrop-blur-xl transition-transform duration-300 z-10 ${showChatMobile ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 flex flex-col shadow-2xl`}>
             <ChatPanel 
               messages={messages} 
               onSendMessage={handleSendMessage} 
               isTyping={isAiLoading}
               onClear={handleClearChat}
             />
          </aside>
        )}
      </main>
    </div>
  );
};

export default App;