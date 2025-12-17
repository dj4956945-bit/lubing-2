import React, { useState, useEffect } from 'react';
import { generateTimelineEvents } from '../services/geminiService';
import { TimelineEvent } from '../types';

export const TimelineMode: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
        try {
            const data = await generateTimelineEvents();
            setEvents(data);
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-party-red">
          <i className="fa-solid fa-spinner fa-spin text-5xl mb-4"></i>
          <p className="text-xl font-medium">正在回溯历史长河...</p>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12">
        <header className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-party-dark mb-4 drop-shadow-sm font-serif">光辉历程</h2>
            <div className="h-1 w-24 bg-party-red mx-auto"></div>
            <p className="mt-4 text-gray-600">中国共产党关键历史节点概览</p>
        </header>

        <div className="relative">
             {/* Center Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-red-200 md:-ml-0.5"></div>

            <div className="space-y-12">
                {events.map((evt, idx) => {
                    const isLeft = idx % 2 === 0;
                    return (
                        <div key={idx} className={`relative flex items-center md:justify-between ${isLeft ? 'flex-row-reverse' : ''}`}>
                            
                            {/* Spacer for alignment on desktop */}
                            <div className="hidden md:block w-5/12"></div>

                            {/* Dot on Line */}
                            <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-party-red border-4 border-white rounded-full shadow-md z-10 md:-translate-x-1/2 flex items-center justify-center">
                                <div className="w-2 h-2 bg-party-yellow rounded-full"></div>
                            </div>

                            {/* Content Card */}
                            <div className="ml-12 md:ml-0 w-full md:w-5/12">
                                <div className={`bg-white p-6 rounded-2xl shadow-lg border-t-4 border-party-red hover:shadow-xl transition-shadow relative ${isLeft ? 'md:mr-8' : 'md:ml-8'}`}>
                                    {/* Arrow for Desktop */}
                                    <div className={`hidden md:block absolute top-1/2 -mt-2 w-4 h-4 bg-white transform rotate-45 border-l border-b border-gray-100 ${isLeft ? '-right-2 border-r-0 border-t-0 shadow-sm' : '-left-2 border-l-0 border-b-0 shadow-sm'}`}></div>
                                    
                                    <span className="inline-block px-3 py-1 bg-red-50 text-party-red font-bold rounded-full text-sm mb-3 shadow-sm">
                                        {evt.year}
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{evt.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{evt.description}</p>
                                    <div className="text-xs text-red-800 bg-red-50 p-2 rounded border border-red-100">
                                        <strong>意义:</strong> {evt.significance}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
             {/* End Node */}
             <div className="relative flex justify-center mt-12">
                 <div className="bg-party-yellow text-party-red px-6 py-2 rounded-full font-bold shadow-lg z-10 border-2 border-white">
                    走向未来
                 </div>
             </div>
        </div>
    </div>
  );
};