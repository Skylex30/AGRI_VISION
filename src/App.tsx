import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ScanLine, 
  Sprout, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Globe,
  Bell,
  LogIn,
  CloudRain,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SalesDashboard } from './components/SalesDashboard';
import { Marketplace } from './components/Marketplace';
import { AIScanner } from './components/AIScanner';
import { WeatherForecast } from './components/WeatherForecast';
import { FarmerGroups } from './components/FarmerGroups';
import { cn } from './lib/utils';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from './firebase';
import { signInWithPopup, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type Tab = 'dashboard' | 'marketplace' | 'seed-scanner' | 'crop-scanner' | 'weather' | 'groups' | 'advisory';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [language, setLanguage] = useState('English');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync user to Firestore
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              role: 'farmer', // Default role
              createdAt: new Date().toISOString()
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}`);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => auth.signOut();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-[3rem] text-center max-w-md w-full shadow-2xl"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20">
            <Sprout size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tighter">AGRI_VISION</h1>
          <p className="text-white/40 mb-10">Empowering farmers with AI-driven insights and a direct marketplace.</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
          >
            <LogIn size={24} />
            <span>Sign in with Google</span>
          </button>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'seed-scanner', label: 'Seed Quality', icon: ScanLine },
    { id: 'crop-scanner', label: 'Crop Health', icon: Sprout },
    { id: 'weather', label: 'Weather', icon: CloudRain },
    { id: 'groups', label: 'Communities', icon: Users },
    { id: 'advisory', label: 'AI Advisory', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-black/40 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 z-50",
        isSidebarOpen ? "w-72" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sprout className="text-white" />
          </div>
          {isSidebarOpen && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-black tracking-tighter"
            >
              AGRI_VISION
            </motion.h1>
          )}
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
                activeTab === item.id 
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={24} className={cn(
                "shrink-0 transition-transform group-hover:scale-110",
                activeTab === item.id ? "text-white" : "text-white/40"
              )} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4 space-y-2">
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-white/40 hover:bg-white/5 hover:text-white transition-all">
            <Settings size={24} />
            {isSidebarOpen && <span className="font-medium">Settings</span>}
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500/60 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
          >
            <LogOut size={24} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        isSidebarOpen ? "pl-72" : "pl-20"
      )}>
        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 sticky top-0 bg-black/20 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-xl transition-all"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-lg font-bold text-white/80 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <Globe size={16} className="text-emerald-400" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Swahili">Swahili</option>
                <option value="French">French</option>
                <option value="Hausa">Hausa</option>
              </select>
            </div>
            <button className="relative p-2 hover:bg-white/5 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0a0a0a]" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
                <span className="text-xs font-bold">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && <SalesDashboard />}
              {activeTab === 'marketplace' && <Marketplace />}
              {activeTab === 'seed-scanner' && (
                <div className="max-w-2xl mx-auto">
                  <AIScanner type="seed" onResult={(res) => console.log(res)} />
                </div>
              )}
              {activeTab === 'crop-scanner' && (
                <div className="max-w-2xl mx-auto">
                  <AIScanner type="crop" onResult={(res) => console.log(res)} />
                </div>
              )}
              {activeTab === 'weather' && <WeatherForecast />}
              {activeTab === 'groups' && <FarmerGroups />}
              {activeTab === 'advisory' && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 text-center">
                  <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Globe size={48} className="text-emerald-400" />
                  </div>
                  <h2 className="text-4xl font-black mb-4">Localized AI Advisory</h2>
                  <p className="text-white/40 max-w-xl mx-auto text-lg leading-relaxed">
                    Get real-time insights based on your local soil data, weather patterns, and crop history. 
                    Available in multiple languages and works offline.
                  </p>
                  <button className="mt-10 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-10 py-5 rounded-3xl transition-all shadow-2xl shadow-emerald-500/40">
                    Start Consultation
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
