import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Users, 
  Store, 
  MapPin, 
  MessageSquare, 
  Smartphone, 
  ChevronRight, 
  ChevronLeft,
  Menu,
  X,
  Plus,
  Zap,
  BookOpen
} from 'lucide-react';
import { STRATEGY_STEPS, MOCK_MERCHANTS, MOCK_TEAM } from './constants';
import { Step, Merchant, TeamMember, ProgressState, View } from './types';
import { getCoachResponse } from './geminiService';

// --- Helper Components ---

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-white rounded-full h-4 mb-4 border-2 border-black">
    <div 
      className="bg-bitcoin-orange h-full rounded-l-full border-r-2 border-black transition-all duration-300" 
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

interface StepCardProps {
  step: Step;
  completedCount: number;
  totalCount: number;
  onClick: () => void;
}

const StepCard: React.FC<StepCardProps> = ({ step, completedCount, totalCount, onClick }) => {
  const isComplete = completedCount === totalCount;
  return (
    <div 
      onClick={onClick}
      className={`p-5 mb-4 rounded-xl border-2 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
        isComplete ? 'bg-green-100 border-black' : 'bg-white border-black'
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className={`font-black text-xl ${isComplete ? 'text-black' : 'text-black'}`}>STEP {step.id}: {step.title}</h3>
          <p className="text-sm font-bold text-gray-600 mt-1">{step.description}</p>
        </div>
        <div className="flex items-center">
          <div className={`mr-3 text-lg font-black ${isComplete ? 'text-green-700' : 'text-bitcoin-orange'}`}>
            {completedCount}/{totalCount}
          </div>
          <ChevronRight className="text-black" size={24} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  // State
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [progress, setProgress] = useState<ProgressState>({});
  const [merchants, setMerchants] = useState<Merchant[]>(MOCK_MERCHANTS);
  const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // AI Coach State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', parts: { text: string }[] }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load progress from local storage
  useEffect(() => {
    const saved = localStorage.getItem('btc_street_progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  // Save progress
  const toggleProcedure = (stepId: number, procedureId: string) => {
    const newProgress = { ...progress };
    if (!newProgress[stepId]) newProgress[stepId] = {};
    newProgress[stepId][procedureId] = !newProgress[stepId][procedureId];
    
    setProgress(newProgress);
    localStorage.setItem('btc_street_progress', JSON.stringify(newProgress));
  };

  const getStepProgress = (step: Step) => {
    let completed = 0;
    let total = 0;
    step.phases.forEach(phase => {
      phase.procedures.forEach(proc => {
        total++;
        if (progress[step.id]?.[proc.id]) completed++;
      });
    });
    return { completed, total };
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: userMsg }] }]);
    setIsChatLoading(true);

    const contextStep = selectedStepId 
      ? STRATEGY_STEPS.find(s => s.id === selectedStepId)?.title 
      : "General Dashboard";
    
    const context = `User is currently viewing: ${contextStep}.`;

    const response = await getCoachResponse(userMsg, context, chatHistory);

    setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
    setIsChatLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleAddMerchant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMerchant: Merchant = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      notes: formData.get('notes') as string,
      status: 'New',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setMerchants([...merchants, newMerchant]);
    setCurrentView('merchant-list');
  };

  // --- Views ---

  const renderDashboard = () => {
    const totalSteps = STRATEGY_STEPS.length;
    let totalProcs = 0;
    let completedProcs = 0;

    STRATEGY_STEPS.forEach(step => {
      const { completed, total } = getStepProgress(step);
      totalProcs += total;
      completedProcs += completed;
    });

    const totalProgress = Math.round((completedProcs / totalProcs) * 100) || 0;

    return (
      <div className="p-4 max-w-3xl mx-auto">
        <header className="mb-6 flex justify-between items-center">
          <div>
             <h1 className="text-3xl font-black text-black tracking-tight">Mission Control</h1>
             <p className="text-black font-bold opacity-80">Strategy 1: Street Teams</p>
          </div>
          <div className="bg-black text-white px-4 py-2 rounded-lg border-2 border-white text-sm font-black transform rotate-2">
            BETA
          </div>
        </header>

        <div className="bg-white p-5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-black text-black text-lg">Campaign Progress</span>
            <span className="text-bitcoin-orange font-black text-xl">{totalProgress}%</span>
          </div>
          <ProgressBar progress={totalProgress} />
          <div className="grid grid-cols-2 gap-4 mt-4">
             <div className="bg-blue-50 p-3 rounded-lg border-2 border-black text-center">
                <span className="block text-3xl font-black text-black">{merchants.length}</span>
                <span className="text-xs text-black uppercase font-bold">Merchants</span>
             </div>
             <div className="bg-purple-50 p-3 rounded-lg border-2 border-black text-center">
                <span className="block text-3xl font-black text-black">{team.length}</span>
                <span className="text-xs text-black uppercase font-bold">Team</span>
             </div>
          </div>
        </div>

        <h2 className="text-xl font-black text-black mb-4 uppercase tracking-wider">Action Plan</h2>
        <div className="space-y-2 pb-24">
          {STRATEGY_STEPS.map(step => {
            const { completed, total } = getStepProgress(step);
            return (
              <StepCard 
                key={step.id} 
                step={step} 
                completedCount={completed} 
                totalCount={total}
                onClick={() => { setSelectedStepId(step.id); setCurrentView('step-detail'); }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderStepDetail = () => {
    const step = STRATEGY_STEPS.find(s => s.id === selectedStepId);
    if (!step) return null;

    const { completed, total } = getStepProgress(step);
    const percent = Math.round((completed / total) * 100);

    return (
      <div className="p-4 max-w-3xl mx-auto pb-32">
         <button onClick={() => setCurrentView('dashboard')} className="flex items-center text-black font-bold mb-6 hover:underline">
            <ChevronLeft size={24} strokeWidth={3} /> Back to Dashboard
         </button>

         <div className="mb-8 bg-white p-5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black text-black uppercase">Step {step.id}: {step.title}</h1>
            <p className="text-black font-bold mt-2">{step.description}</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-4 border-2 border-black">
                 <div className="bg-bitcoin-orange h-full rounded-l-full border-r-2 border-black" style={{width: `${percent}%`}}></div>
              </div>
              <span className="text-lg font-black text-black">{percent}%</span>
            </div>
         </div>

         <div className="space-y-6">
            {step.phases.map((phase, idx) => (
              <div key={idx} className="bg-white rounded-xl border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                <div className={`px-5 py-4 border-b-2 border-black flex items-center
                  ${phase.type === 'online' ? 'bg-blue-100' : 
                    phase.type === 'ground' ? 'bg-orange-100' : 
                    'bg-green-100'}`
                }>
                  {phase.type === 'online' && <Smartphone size={24} className="mr-3 text-black" strokeWidth={2.5} />}
                  {phase.type === 'ground' && <MapPin size={24} className="mr-3 text-black" strokeWidth={2.5} />}
                  {phase.type === 'followup' && <MessageSquare size={24} className="mr-3 text-black" strokeWidth={2.5} />}
                  <span className="font-black text-black uppercase text-lg tracking-wide">{phase.title}</span>
                </div>
                <div className="p-2">
                  {phase.procedures.map(proc => {
                    const isChecked = progress[step.id]?.[proc.id] || false;
                    return (
                      <div 
                        key={proc.id} 
                        onClick={() => toggleProcedure(step.id, proc.id)}
                        className={`flex items-start p-4 rounded-lg cursor-pointer transition-colors ${isChecked ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                      >
                        <div className={`mt-0.5 mr-4 flex-shrink-0 ${isChecked ? 'text-green-600' : 'text-gray-300'}`}>
                          {isChecked ? <CheckCircle size={28} fill="black" className="text-green-400" /> : <Circle size={28} strokeWidth={3} className="text-black" />}
                        </div>
                        <span className={`${isChecked ? 'text-gray-400 line-through' : 'text-black'} text-lg font-bold leading-relaxed`}>
                          {proc.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
         </div>
         
         {/* Contextual Actions based on Step */}
         {step.id === 6 && (
            <div className="fixed bottom-24 right-4 left-4 max-w-3xl mx-auto z-30">
               <button 
                onClick={() => window.open('https://phoenix.acinq.co/', '_blank')}
                className="w-full bg-black text-white py-4 rounded-xl border-2 border-white shadow-lg font-black text-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
               >
                 <Zap size={24} fill="orange" className="text-orange-500" /> Open Lightning Wallet
               </button>
            </div>
         )}
      </div>
    );
  };

  const renderMerchantList = () => (
    <div className="p-4 max-w-3xl mx-auto pb-32">
      <header className="mb-6 flex justify-between items-center">
         <h1 className="text-3xl font-black text-black tracking-tight">Merchants</h1>
         <button onClick={() => setCurrentView('merchant-list')} className="bg-black text-white p-3 rounded-full border-2 border-white shadow-lg">
            <Plus size={28} strokeWidth={3} />
         </button>
      </header>

      {/* Quick Add Form */}
      <div className="bg-white p-5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
        <h3 className="font-black text-lg text-black uppercase mb-4 flex items-center gap-2">
          <Plus size={20} /> Add New Merchant
        </h3>
        <form onSubmit={handleAddMerchant} className="space-y-4">
          <input 
            name="name" 
            placeholder="Shop Name" 
            required 
            className="w-full p-3 bg-white text-black font-bold border-2 border-black rounded-lg focus:ring-4 focus:ring-black/20 outline-none placeholder-gray-500" 
          />
          <input 
            name="address" 
            placeholder="Location/Street" 
            required 
            className="w-full p-3 bg-white text-black font-bold border-2 border-black rounded-lg focus:ring-4 focus:ring-black/20 outline-none placeholder-gray-500" 
          />
          <textarea 
            name="notes" 
            placeholder="Initial notes..." 
            className="w-full p-3 bg-white text-black font-bold border-2 border-black rounded-lg focus:ring-4 focus:ring-black/20 outline-none placeholder-gray-500" 
            rows={2}
          ></textarea>
          <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-black text-lg uppercase border-2 border-black hover:bg-gray-900 hover:shadow-lg transition-all">
            Record Merchant
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {merchants.map(m => (
          <div key={m.id} className="bg-white p-5 rounded-xl border-2 border-black flex justify-between items-start shadow-sm hover:shadow-md transition-shadow">
            <div>
              <h3 className="font-black text-xl text-black">{m.name}</h3>
              <div className="flex items-center text-gray-700 font-bold text-sm mt-1">
                <MapPin size={16} className="mr-1" strokeWidth={3} />
                {m.address}
              </div>
              <p className="text-sm text-black font-medium mt-3 bg-gray-100 p-2 rounded border border-gray-300">{m.notes}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-black border-2 border-black uppercase
              ${m.status === 'Onboarded' ? 'bg-green-300 text-black' : 'bg-yellow-300 text-black'}`}>
              {m.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAICoach = () => (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-bitcoin-orange">
       <div className="bg-white p-4 border-b-2 border-black flex justify-between items-center z-10">
          <h1 className="font-black text-xl flex items-center gap-2 text-black">
            <Users size={24} className="text-black" />
            Street Team Coach
          </h1>
          <button onClick={() => setCurrentView('dashboard')} className="text-black hover:bg-gray-100 rounded-full p-1">
            <X size={28} strokeWidth={3} />
          </button>
       </div>
       
       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-orange-50/50">
          {chatHistory.length === 0 && (
            <div className="text-center text-black mt-10 p-6 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="mb-4 font-black text-xl">👋 Hi! I'm your Strategy Coach.</p>
              <p className="text-base font-bold mb-6">I can help you roleplay the 2-minute script (Step 2) or handle merchant objections (Step 4).</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => setChatInput("Roleplay: You are a skeptical merchant.")} className="text-sm font-bold bg-white text-black border-2 border-black px-4 py-2 rounded-full hover:bg-gray-100">Merchant Roleplay</button>
                <button onClick={() => setChatInput("How do I explain Lightning Network simply?")} className="text-sm font-bold bg-white text-black border-2 border-black px-4 py-2 rounded-full hover:bg-gray-100">Explain Lightning</button>
              </div>
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-xl text-base font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${msg.role === 'user' ? 'bg-black text-white rounded-br-none' : 'bg-white text-black rounded-bl-none'}`}>
                {msg.parts[0].text}
              </div>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex justify-start">
               <div className="bg-white border-2 border-black p-4 rounded-xl rounded-bl-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                 <div className="flex gap-2">
                   <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                   <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                 </div>
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
       </div>

       <div className="p-4 bg-white border-t-2 border-black pb-8 lg:pb-4">
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask for advice..." 
              className="flex-1 bg-white text-black border-2 border-black rounded-full px-5 py-3 font-bold focus:ring-4 focus:ring-black/20 outline-none placeholder-gray-500"
            />
            <button type="submit" disabled={isChatLoading} className="bg-black text-white p-3 rounded-full border-2 border-black disabled:opacity-50 hover:bg-gray-800 transition-colors">
               <ChevronRight size={24} strokeWidth={3} />
            </button>
          </form>
       </div>
    </div>
  );

  // --- Layout Wrapper ---
  return (
    <div className="min-h-screen bg-bitcoin-orange font-bold text-black relative">
      
      {/* Dynamic Content View */}
      {currentView === 'ai-coach' ? renderAICoach() : (
        <>
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'step-detail' && renderStepDetail()}
          {currentView === 'merchant-list' && renderMerchantList()}
          {currentView === 'team-list' && <div className="p-10 text-center font-black text-2xl">Team Management (Placeholder)</div>}
        </>
      )}

      {/* Sidebar / Menu (Mobile Overlay) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="bg-white w-72 h-full relative z-10 shadow-xl border-r-4 border-black p-6 flex flex-col">
            <h2 className="text-3xl font-black mb-10 text-bitcoin-orange uppercase tracking-tighter">Street Team</h2>
            <nav className="space-y-6">
              <button onClick={() => { setCurrentView('dashboard'); setIsSidebarOpen(false); }} className="flex items-center gap-4 text-xl font-black text-black hover:text-bitcoin-orange">
                <BookOpen size={24} strokeWidth={3} /> Dashboard
              </button>
              <button onClick={() => { setCurrentView('merchant-list'); setIsSidebarOpen(false); }} className="flex items-center gap-4 text-xl font-black text-black hover:text-bitcoin-orange">
                <Store size={24} strokeWidth={3} /> Merchants
              </button>
              <button onClick={() => { setCurrentView('team-list'); setIsSidebarOpen(false); }} className="flex items-center gap-4 text-xl font-black text-black hover:text-bitcoin-orange">
                <Users size={24} strokeWidth={3} /> Team
              </button>
            </nav>
            <div className="mt-auto">
              <p className="text-xs font-bold text-gray-400">Version 1.0.0</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {currentView !== 'ai-coach' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black px-6 py-4 flex justify-between items-center z-40 lg:hidden shadow-[0px_-4px_10px_rgba(0,0,0,0.1)]">
          <button onClick={() => setIsSidebarOpen(true)} className="flex flex-col items-center text-gray-400 hover:text-black transition-colors">
             <Menu size={28} strokeWidth={2.5} />
             <span className="text-[10px] font-black uppercase mt-1">Menu</span>
          </button>
          
          <button onClick={() => setCurrentView('dashboard')} className={`flex flex-col items-center ${currentView === 'dashboard' ? 'text-bitcoin-orange' : 'text-gray-400 hover:text-black'}`}>
             <Zap size={28} strokeWidth={3} />
             <span className="text-[10px] font-black uppercase mt-1">Actions</span>
          </button>

          <button onClick={() => setCurrentView('merchant-list')} className={`flex flex-col items-center ${currentView === 'merchant-list' ? 'text-bitcoin-orange' : 'text-gray-400 hover:text-black'}`}>
             <Store size={28} strokeWidth={3} />
             <span className="text-[10px] font-black uppercase mt-1">Shops</span>
          </button>

          <button onClick={() => setCurrentView('ai-coach')} className="flex flex-col items-center text-gray-400 hover:text-black">
             <div className="bg-black text-white rounded-full p-2 mb-0.5 border-2 border-black hover:bg-white hover:text-black transition-colors">
                <MessageSquare size={20} strokeWidth={3} />
             </div>
             <span className="text-[10px] font-black uppercase text-black">Coach</span>
          </button>
        </div>
      )}
      
      {/* Desktop Navigation Helper (Hidden on mobile) */}
      <div className="hidden lg:flex fixed top-0 right-0 p-6 gap-4 z-50">
        <button onClick={() => setCurrentView('ai-coach')} className="bg-black text-white px-6 py-3 rounded-xl border-2 border-white flex items-center gap-2 hover:bg-gray-900 shadow-lg font-black uppercase tracking-wide">
          <MessageSquare size={20} /> Open Coach
        </button>
      </div>
    </div>
  );
}