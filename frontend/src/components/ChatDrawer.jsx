import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Navigation } from 'lucide-react';
import axios from 'axios';

const ChatDrawer = ({ onNavigateToPlace }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'ሰላም! እኔ የደብረ ብርሃን ከተማ ረዳት ነኝ። የት መሄድ ይፈልጋሉ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const extractJsonFromMarkdown = (text) => {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse extracted JSON", e);
      }
    }
    return null;
  };

  const cleanResponseText = (text) => {
    return text.replace(/```json\n([\s\S]*?)\n```/, '').trim();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message: userMessage });
      const fullText = res.data.reply;
      
      const extractedData = extractJsonFromMarkdown(fullText);
      const cleanText = cleanResponseText(fullText);

      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: cleanText,
        locationData: extractedData 
      }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: 'ይቅርታ፣ የኔትወርክ ችግር አጋጥሟል። እባክዎ እንደገና ይሞክሩ።' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-emerald-600 rounded-full shadow-xl flex items-center justify-center text-white hover:bg-emerald-700 transition-transform hover:scale-105 z-50"
      >
        <Bot className="h-7 w-7" />
      </button>

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-emerald-700 text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-emerald-200" />
            <h2 className="font-bold text-lg">Debre Berhan AI Guide</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-emerald-200 hover:text-white p-2">
            ✕
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
              }`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-600 uppercase">AI Assistant</span>
                  </div>
                )}
                
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                {msg.locationData?.location_found && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <button 
                      onClick={() => onNavigateToPlace(msg.locationData.coordinates)}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-semibold border border-emerald-200"
                    >
                      <Navigation className="h-4 w-4" />
                      Show on Map
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                <Loader2 className="h-5 w-5 text-emerald-600 animate-spin" />
                <span className="text-sm text-slate-500">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask in Amharic (e.g. ሆስፒታሉ የት ነው?)..."
              className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-full px-4 py-3 text-sm transition-all outline-none"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-emerald-600 text-white p-3 rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center h-11 w-11"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 sm:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ChatDrawer;
