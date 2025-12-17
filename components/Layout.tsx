import React from 'react';
import { AppMode } from '../types';

interface LayoutProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentMode, setMode, children }) => {
  const navItems = [
    { mode: AppMode.HOME, icon: 'fa-home', label: '首页' },
    { mode: AppMode.TIMELINE, icon: 'fa-stream', label: '历史长河' },
    { mode: AppMode.CHAT, icon: 'fa-comments', label: '智能问答' },
    { mode: AppMode.QUIZ, icon: 'fa-graduation-cap', label: '知识挑战' },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-party-dark text-white shadow-xl z-20">
        <div className="p-6 border-b border-red-900/30 flex items-center gap-3">
          <div className="w-10 h-10 bg-party-yellow rounded-full flex items-center justify-center text-party-red font-bold text-xl shadow-md">
            <i className="fa-solid fa-star"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider">红色征途</h1>
            <p className="text-xs text-red-200">党史智学助手</p>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => setMode(item.mode)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentMode === item.mode
                  ? 'bg-party-red text-party-yellow shadow-lg font-bold'
                  : 'hover:bg-red-900/50 text-gray-200 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-6 text-center`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-red-900/30 text-center text-xs text-red-300">
          <p>© 2024 党史智学 App</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-party-dark text-white z-50 flex justify-between items-center px-4 py-3 shadow-md">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-party-yellow rounded-full flex items-center justify-center text-party-red">
               <i className="fa-solid fa-star text-sm"></i>
            </div>
            <span className="font-bold">红色征途</span>
         </div>
         <div className="flex gap-4">
             {navItems.map(item => (
                 <button 
                    key={item.mode} 
                    onClick={() => setMode(item.mode)}
                    className={`${currentMode === item.mode ? 'text-party-yellow' : 'text-white'}`}
                 >
                     <i className={`fa-solid ${item.icon}`}></i>
                 </button>
             ))}
         </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative pt-14 md:pt-0">
        <div className="h-full w-full overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            {children}
        </div>
      </main>
    </div>
  );
};