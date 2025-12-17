import React, { useRef, useEffect, useState } from 'react';
import { Message } from '../types';
import { Send, Bot, User, Sparkles, Trash2, ChevronRight } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  onClear: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isTyping, onClear }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  // Get dynamic suggestions from the last model message, or fallback to defaults
  const lastModelMessage = [...messages].reverse().find(m => m.role === 'model');
  const activeSuggestions = lastModelMessage?.suggestedActions || [
    "Make it cheaper",
    "Add a dessert spot",
    "Swap the first stop",
    "Is the second place romantic?"
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex justify-between items-center">
        <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-kelp-magenta" /> Kelp Assistant
            </h3>
            <p className="text-xs text-slate-500">Refine your plan with Yelp AI</p>
        </div>
        <button 
            onClick={onClear}
            className="p-2 text-slate-600 hover:text-slate-400 hover:bg-slate-800 rounded-full transition-colors"
            title="Clear Chat"
        >
            <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-slate-700' : 'bg-gradient-to-br from-kelp-teal to-teal-600'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-slate-900" />}
            </div>
            
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-slate-800 text-white rounded-tr-none' 
                : 'bg-slate-800/60 border border-slate-700/50 text-slate-200 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 animate-pulse">
             <div className="w-8 h-8 rounded-full bg-kelp-teal flex items-center justify-center flex-shrink-0 opacity-50">
                <Bot className="w-5 h-5 text-slate-900" />
             </div>
             <div className="bg-slate-800 rounded-2xl p-3 rounded-tl-none flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        
        {/* Dynamic Suggestions - Always Visible & Horizontal Scroll */}
        {!isTyping && (
            <div className="mb-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Suggested Actions</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {activeSuggestions.map((s, idx) => (
                        <button 
                        key={idx} 
                        onClick={() => onSendMessage(s)}
                        className="flex-shrink-0 whitespace-nowrap px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:border-kelp-teal hover:bg-slate-800/80 hover:shadow-[0_0_10px_rgba(45,212,191,0.1)] transition-all flex items-center gap-1 group"
                        >
                        {s} <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-kelp-teal transition-colors" />
                        </button>
                    ))}
                </div>
            </div>
        )}

        <div className="relative flex items-end gap-2 bg-slate-800/50 border border-slate-700 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-kelp-teal/50 focus-within:border-transparent transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask to change stops, budget, etc..."
            className="w-full bg-transparent text-white text-sm px-2 py-2 max-h-32 min-h-[40px] resize-none outline-none placeholder:text-slate-500 scrollbar-hide"
          />
          <button 
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isTyping}
            className="p-2 bg-kelp-teal text-slate-900 rounded-xl hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-kelp-teal/20 mb-0.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-2 text-center">
            Yelp AI can make mistakes. Check details before booking.
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;