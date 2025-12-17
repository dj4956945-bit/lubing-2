import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ChatMode } from './components/ChatMode';
import { QuizMode } from './components/QuizMode';
import { TimelineMode } from './components/TimelineMode';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);

  const renderContent = () => {
    switch (mode) {
      case AppMode.CHAT:
        return <ChatMode />;
      case AppMode.QUIZ:
        return <QuizMode />;
      case AppMode.TIMELINE:
        return <TimelineMode />;
      case AppMode.HOME:
      default:
        return <HomeView setMode={setMode} />;
    }
  };

  return (
    <Layout currentMode={mode} setMode={setMode}>
      {renderContent()}
    </Layout>
  );
};

const HomeView: React.FC<{ setMode: (mode: AppMode) => void }> = ({ setMode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
      <div className="max-w-3xl w-full bg-white/90 backdrop-blur-md p-10 md:p-16 rounded-3xl shadow-2xl border-t-8 border-party-dark">
        <div className="mb-8 relative inline-block">
           <div className="absolute inset-0 bg-party-yellow blur-xl opacity-30 rounded-full"></div>
           <i className="fa-solid fa-star text-7xl text-party-red relative z-10 animate-pulse"></i>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-party-dark mb-4 font-serif">
          红色征途
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-10 font-light">
          铭记光辉历史，传承红色基因
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => setMode(AppMode.TIMELINE)}
            className="group bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:border-red-200 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-party-red transition-colors">
              <i className="fa-solid fa-stream text-2xl text-party-red group-hover:text-white transition-colors"></i>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">历史长河</h3>
            <p className="text-sm text-gray-500">全景展示建党百年的重大历史事件与关键节点。</p>
          </button>

          <button 
             onClick={() => setMode(AppMode.CHAT)}
             className="group bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:border-red-200 transition-all duration-300"
          >
             <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-party-red transition-colors">
               <i className="fa-solid fa-comments text-2xl text-party-red group-hover:text-white transition-colors"></i>
             </div>
             <h3 className="font-bold text-lg text-gray-800 mb-2">智能问答</h3>
             <p className="text-sm text-gray-500">AI 历史专家随时为您解答关于党史的任何疑问。</p>
          </button>

          <button 
             onClick={() => setMode(AppMode.QUIZ)}
             className="group bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:border-red-200 transition-all duration-300"
          >
             <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-party-red transition-colors">
               <i className="fa-solid fa-graduation-cap text-2xl text-party-red group-hover:text-white transition-colors"></i>
             </div>
             <h3 className="font-bold text-lg text-gray-800 mb-2">知识挑战</h3>
             <p className="text-sm text-gray-500">趣味答题测试，巩固学习成果，挑战党史知识储备。</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;