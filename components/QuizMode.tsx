import React, { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { QuizQuestion } from '../types';

export const QuizMode: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    setQuizFinished(false);
    setCurrentQuestionIdx(0);
    setScore(0);
    setQuestions([]);
    
    try {
      const qs = await generateQuizQuestions();
      setQuestions(qs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (questions.length === 0 && !loading && !quizFinished) {
      // Don't auto-start, let user choose to start
    }
  }, []);

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === questions[currentQuestionIdx].correctOptionIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-party-red">
        <i className="fa-solid fa-spinner fa-spin text-5xl mb-4"></i>
        <p className="text-xl font-medium">正在生成历史考题...</p>
      </div>
    );
  }

  if (questions.length === 0 && !quizFinished) {
      return (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full border-t-8 border-party-red">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-party-red">
                    <i className="fa-solid fa-clipboard-question text-4xl"></i>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">党史知识挑战</h2>
                  <p className="text-gray-600 mb-8">准备好测试您的党史知识储备了吗？AI 将为您生成5道随机题目。</p>
                  <button 
                    onClick={startQuiz}
                    className="w-full bg-party-red text-white py-4 rounded-xl font-bold text-lg hover:bg-red-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    开始答题
                  </button>
              </div>
          </div>
      )
  }

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    let comment = "继续努力！";
    if (percentage >= 80) comment = "太棒了！您是党史小专家！";
    else if (percentage >= 60) comment = "成绩不错，温故而知新。";

    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-yellow-400"></div>
          <i className="fa-solid fa-trophy text-6xl text-party-yellow mb-4 drop-shadow-sm"></i>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">挑战完成</h2>
          <p className="text-gray-500 mb-6">您的最终得分</p>
          
          <div className="text-6xl font-black text-party-red mb-4">{score} <span className="text-2xl text-gray-400 font-normal">/ {questions.length}</span></div>
          
          <p className="text-lg font-medium text-indigo-900 mb-8 bg-indigo-50 py-2 rounded-lg">{comment}</p>

          <button 
            onClick={startQuiz}
            className="bg-party-red text-white px-8 py-3 rounded-xl font-bold hover:bg-red-800 transition shadow-md"
          >
            再来一次
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIdx];

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col h-[600px] md:h-auto">
        {/* Progress Bar */}
        <div className="bg-gray-100 h-2 w-full">
            <div 
                className="bg-party-red h-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
            ></div>
        </div>

        {/* Question Header */}
        <div className="p-6 md:p-8 bg-red-50/50">
            <div className="flex justify-between items-center mb-4 text-sm font-bold text-red-800/60 uppercase tracking-widest">
                <span>题目 {currentQuestionIdx + 1} / {questions.length}</span>
                <span>得分: {score}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
                {currentQ.question}
            </h3>
        </div>

        {/* Options */}
        <div className="p-6 md:p-8 space-y-3 bg-white flex-1 overflow-y-auto">
          {currentQ.options.map((option, idx) => {
            let btnClass = "border-gray-200 hover:bg-gray-50 text-gray-700";
            if (isAnswered) {
              if (idx === currentQ.correctOptionIndex) {
                btnClass = "bg-green-100 border-green-500 text-green-800"; // Correct
              } else if (idx === selectedOption) {
                btnClass = "bg-red-100 border-red-500 text-red-800"; // Wrong selection
              } else {
                btnClass = "opacity-50 border-gray-100"; // Not selected
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-200 font-medium flex items-center justify-between group ${btnClass}`}
              >
                <span>{String.fromCharCode(65 + idx)}. {option}</span>
                {isAnswered && idx === currentQ.correctOptionIndex && (
                    <i className="fa-solid fa-check-circle text-green-600 text-xl"></i>
                )}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctOptionIndex && (
                    <i className="fa-solid fa-times-circle text-red-600 text-xl"></i>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 min-h-[100px] flex items-center justify-between">
            <div className="flex-1 mr-4">
                {isAnswered ? (
                    <div className="animate-fade-in">
                        <p className="font-bold text-sm text-gray-500 mb-1">历史解析:</p>
                        <p className="text-sm text-gray-800">{currentQ.explanation}</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic">请选择一个选项...</p>
                )}
            </div>
            
            <button
                onClick={nextQuestion}
                disabled={!isAnswered}
                className={`px-6 py-3 rounded-xl font-bold shadow-md transition-all whitespace-nowrap ${
                    isAnswered 
                    ? 'bg-party-dark text-white hover:bg-red-900' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                {currentQuestionIdx === questions.length - 1 ? '查看结果' : '下一题'}
                <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
        </div>
      </div>
    </div>
  );
};