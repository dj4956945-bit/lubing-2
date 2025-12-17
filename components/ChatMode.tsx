import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ChatMode: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '同志您好！我是您的党史学习助手。无论是关于建党初期的艰辛，还是改革开放的辉煌，我都可以为您解答。请问您想了解哪段历史？'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Construct history for API
      const apiHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await getChatResponse(apiHistory, userMsg.text);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "抱歉，我暂时无法回答这个问题。"
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "网络连接似乎出了点问题，请稍后再试。"
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white shadow-2xl md:my-6 md:rounded-2xl border border-gray-100 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white shadow-md flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
            <i className="fa-solid fa-comments text-xl"></i>
        </div>
        <div>
            <h2 className="font-bold text-lg">党史智能问答</h2>
            <p className="text-xs text-red-100 opacity-90">基于 Gemini AI 2.5 驱动</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start max-w-[85%] md:max-w-[75%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-party-red text-party-yellow'
                }`}>
                    <i className={`fa-solid ${msg.role === 'user' ? 'fa-user' : 'fa-book-open'} text-sm`}></i>
                </div>

                {/* Bubble */}
                <div
                    className={`p-3 md:p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
                    msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                    }`}
                >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex items-start gap-2">
                <div className="w-10 h-10 rounded-full bg-party-red text-party-yellow flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-book-open text-sm"></i>
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-200">
                    <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您想了解的党史问题..."
            className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 max-h-32 shadow-inner"
            rows={1}
            style={{ minHeight: '50px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-party-red hover:bg-red-800 text-white rounded-xl px-6 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
          >
            <span>发送</span>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">AI 生成内容可能包含错误，请结合史实教材学习。</p>
      </div>
    </div>
  );
};