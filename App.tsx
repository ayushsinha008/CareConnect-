
import React, { useState, useEffect } from 'react';
import { Page, User, UserRole, Appointment, HealthRecord } from './types';
import { store, AppNotification } from './services/stateStore';
import { 
  Home as HomeIcon, 
  Calendar, 
  Activity, 
  User as UserIcon, 
  Menu, 
  Bell, 
  Search, 
  MapPin, 
  ArrowLeft,
  Video,
  X,
  Stethoscope,
  Microscope,
  Package,
  Cpu,
  Heart,
  PlusCircle,
  ArrowRight,
  Check,
  Languages,
  LogOut,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Edit2,
  Camera,
  Mail,
  Wallet,
  Smartphone,
  Info,
  Moon,
  Sun,
  AlertCircle,
  Users,
  Brain,
  FileText,
  Star,
  ClipboardList,
  HeartPulse,
  Thermometer,
  Clock,
  Droplets,
  Briefcase,
  ThumbsUp,
  MoreVertical,
  MessageSquare,
  Send,
  Trash2,
  Gift,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { SPECIALITIES, MOCK_DOCTORS } from './constants';
import { getHealthAnalysis } from './geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { translations, Language } from './translations';

type Theme = 'light' | 'dark';

const MALE_AVATAR = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

// --- Shared Components ---

const Navbar = ({ lang, theme, title, showBack, onBack, onMenu, onOpenNotifications }: { 
  lang: Language, 
  theme: Theme,
  title: string, 
  showBack?: boolean, 
  onBack?: () => void, 
  onMenu?: () => void,
  onOpenNotifications: () => void
}) => {
  const unreadCount = store.getUnreadCount();
  const isPatient = store.getUser()?.role === 'PATIENT';
  const t = translations[lang];

  return (
    <div className="bg-white dark:bg-slate-900 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3 flex items-center justify-between sticky top-0 z-50 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border-b border-gray-50/50 dark:border-slate-800 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 transition-colors duration-300">
      <div className="flex items-center gap-2 w-full">
        {showBack ? (
          <button onClick={onBack} className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full transition-all active:scale-90 text-gray-800 dark:text-slate-100 shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={onMenu} className="p-1.5 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90 shrink-0">
            <Menu className="w-6 h-6 text-[#00bcd4]" />
          </button>
        )}
        <div className="flex-1 flex flex-col items-center overflow-hidden">
           <h1 className="text-sm font-black text-gray-800 dark:text-slate-100 tracking-tight truncate px-4">{title}</h1>
           {isPatient && !showBack && (
             <div className="flex items-center gap-1 text-[10px] font-bold text-[#00bcd4]">
               <MapPin className="w-2.5 h-2.5" />
               <span>{t.currentLocation}</span>
             </div>
           )}
        </div>
      </div>
      <div className="flex items-center gap-2 absolute right-4 bottom-3">
        <div className="flex items-center gap-1 bg-blue-50/80 dark:bg-blue-900/20 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm transition-transform active:scale-95">
          <Wallet className="w-3.5 h-3.5 text-[#00bcd4]" />
          <span className="text-xs font-black text-gray-800 dark:text-slate-100">₹0</span>
        </div>
        {isPatient && (
          <button onClick={onOpenNotifications} className="relative p-2 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm transition-transform active:scale-95">
            <Bell className="w-4 h-4 text-gray-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const Drawer = ({ isOpen, onClose, user, onNavigate, lang, onLogout, onToggleTheme, theme, onSetLanguage }: { 
  isOpen: boolean, 
  onClose: () => void, 
  user: User | null, 
  onNavigate: (p: Page) => void, 
  lang: Language,
  onLogout: () => void,
  onToggleTheme: () => void,
  theme: Theme,
  onSetLanguage: (l: Language) => void
}) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const t = translations[lang];

  if (!isOpen) return null;

  const toggleExpand = (key: string) => setExpanded(expanded === key ? null : key);
  const navTo = (page: Page) => { onNavigate(page); onClose(); };

  return (
    <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-[80%] bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="relative pt-[calc(env(safe-area-inset-top)+2rem)] pb-6 px-6 bg-[#00bcd4] overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full p-1 mb-3 shadow-lg overflow-hidden">
              <img src={MALE_AVATAR} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-tight truncate w-full text-center">{user?.name || 'ayush sinha'}</h2>
            <button onClick={() => navTo(Page.EDIT_PROFILE)} className="flex items-center gap-2 bg-[#00bcd4] border border-white/50 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-white/10 transition-colors">
              <PlusCircle className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pt-2 pb-10 hide-scrollbar">
          <nav className="px-1 space-y-0.5">
            <DrawerItem icon={<HomeIcon className="w-5 h-5" />} label="Home" onClick={() => navTo(user?.role === 'DOCTOR' ? Page.DOCTOR_HOME : Page.PATIENT_HOME)} />
            {user?.role === 'PATIENT' && (
              <>
                <div>
                  <button onClick={() => toggleExpand('plans')} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-4 text-gray-700 dark:text-slate-300 font-medium">
                      <Package className="w-5 h-5" />
                      <span className="text-[15px]">Plans</span>
                    </div>
                    {expanded === 'plans' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  {expanded === 'plans' && (
                    <div className="bg-gray-50/50 dark:bg-slate-800/30 border-y border-gray-100 dark:border-slate-800">
                      <DrawerSubItem label="Buy Plan" onClick={() => {}} />
                      <DrawerSubItem label="My Plan" onClick={() => {}} />
                    </div>
                  )}
                </div>
              </>
            )}
            {user?.role === 'DOCTOR' && (
              <DrawerItem icon={<Calendar className="w-5 h-5" />} label="Manage Availability" onClick={() => navTo(Page.MANAGE_AVAILABILITY)} />
            )}
            <DrawerItem icon={<Users className="w-5 h-5" />} label={t.referTitle} onClick={() => navTo(Page.REFER_AND_EARN)} />
            <DrawerItem icon={<Wallet className="w-5 h-5" />} label="Wallet" onClick={() => {}} />
            <div className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b border-gray-50 dark:border-slate-800/50">
              <div className="flex items-center gap-4 text-gray-700 dark:text-slate-300 font-medium">
                <Languages className="w-5 h-5 text-gray-500" />
                <span className="text-[15px]">Language</span>
              </div>
              <div className="flex bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg">
                <button onClick={() => onSetLanguage('en')} className={`px-2 py-1 rounded-md text-[9px] font-black tracking-widest transition-all ${lang === 'en' ? 'bg-[#00bcd4] text-white shadow-sm' : 'text-gray-400'}`}>EN</button>
                <button onClick={() => onSetLanguage('hi')} className={`px-2 py-1 rounded-md text-[9px] font-black tracking-widest transition-all ${lang === 'hi' ? 'bg-[#00bcd4] text-white shadow-sm' : 'text-gray-400'}`}>HI</button>
              </div>
            </div>
            <div className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b border-gray-50 dark:border-slate-800/50">
              <div className="flex items-center gap-4 text-gray-700 dark:text-slate-300 font-medium">
                {theme === 'light' ? <Moon className="w-5 h-5 text-gray-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                <span className="text-[15px]">Dark Mode</span>
              </div>
              <button onClick={onToggleTheme} className="relative w-12 h-6 flex items-center bg-gray-100 dark:bg-[#00bcd4] rounded-full p-1 transition-colors duration-300 shadow-inner">
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <DrawerItem icon={<Bell className="w-5 h-5" />} label="Notification" onClick={() => {}} />
          </nav>
        </div>
        <button onClick={onLogout} className="bg-[#00bcd4] text-white py-5 flex items-center justify-center gap-3 font-bold text-base hover:bg-[#00acc1] transition-colors shrink-0 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );
};

const DrawerItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button onClick={onClick} className="w-full flex items-center gap-4 px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b border-gray-50 dark:border-slate-800/50 last:border-0">
    <div className="text-gray-500">{icon}</div>
    <span className="font-medium text-[15px]">{label}</span>
  </button>
);

const DrawerSubItem = ({ label, onClick }: { label: string, onClick: () => void }) => (
  <button onClick={onClick} className="w-full text-left px-13 py-3 text-sm font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border-b border-gray-50 dark:border-slate-800/50 last:border-0">{label}</button>
);

const BottomNav = ({ activePage, onNavigate, lang }: { activePage: Page, onNavigate: (p: Page) => void, lang: Language }) => {
  const isDoctor = store.getUser()?.role === 'DOCTOR';
  const t = translations[lang];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 border-t border-gray-100 dark:border-slate-800 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] px-6 flex justify-around items-center z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] backdrop-blur-lg transition-colors duration-300">
      <button onClick={() => onNavigate(isDoctor ? Page.DOCTOR_HOME : Page.PATIENT_HOME)} className={`flex flex-col items-center gap-1 transition-all duration-300 group ${activePage === (isDoctor ? Page.DOCTOR_HOME : Page.PATIENT_HOME) ? 'text-[#00bcd4] scale-105' : 'text-gray-400 dark:text-slate-500'}`}>
        <div className={`p-1.5 rounded-xl transition-all ${activePage === (isDoctor ? Page.DOCTOR_HOME : Page.PATIENT_HOME) ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''}`}><HomeIcon className={`w-5 h-5 ${activePage === (isDoctor ? Page.DOCTOR_HOME : Page.PATIENT_HOME) ? 'fill-[#00bcd4]/20' : ''}`} /></div>
        <span className="text-[9px] font-black uppercase tracking-widest">{t.home}</span>
      </button>
      <button onClick={() => onNavigate(Page.APPOINTMENTS)} className={`flex flex-col items-center gap-1 transition-all duration-300 group ${activePage === Page.APPOINTMENTS ? 'text-[#00bcd4] scale-105' : 'text-gray-400 dark:text-slate-500'}`}>
        <div className={`p-1.5 rounded-xl transition-all ${activePage === Page.APPOINTMENTS ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''}`}><Calendar className={`w-5 h-5 ${activePage === Page.APPOINTMENTS ? 'fill-[#00bcd4]/20' : ''}`} /></div>
        <span className="text-[9px] font-black uppercase tracking-widest">{t.appointments}</span>
      </button>
      {!isDoctor && (
        <button onClick={() => onNavigate(Page.MY_HEALTH)} className={`flex flex-col items-center gap-1 transition-all duration-300 group ${activePage === Page.MY_HEALTH ? 'text-[#00bcd4] scale-105' : 'text-gray-400 dark:text-slate-500'}`}>
          <div className={`p-1.5 rounded-xl transition-all ${activePage === Page.MY_HEALTH ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''}`}><Heart className={`w-5 h-5 ${activePage === Page.MY_HEALTH ? 'fill-[#00bcd4]/20' : ''}`} /></div>
          <span className="text-[9px] font-black uppercase tracking-widest">{t.myHealth}</span>
        </button>
      )}
    </div>
  );
};

// --- Pages ---

const WelcomePage = ({ onNext, lang }: { onNext: () => void, lang: Language }) => {
  const t = translations[lang];
  return (
    <div className="h-full bg-white dark:bg-slate-900 flex flex-col items-center relative overflow-hidden animate-in fade-in duration-700 transition-colors duration-300 pt-[env(safe-area-inset-top)]">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60"></div>
      <div className="relative z-10 flex flex-col items-center px-6 pt-12 pb-10 w-full text-center h-full">
        <div className="mb-6 inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <Heart className="w-3 h-3 fill-current" /> CareConnect
        </div>
        <h1 className="text-2xl font-extrabold text-[#004a87] dark:text-slate-100 leading-tight mb-4 tracking-tight">{t.welcome}</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-8 max-w-[260px] leading-relaxed mx-auto">{t.healthcareAnytime}</p>
        <div className="flex-1 w-full flex items-center justify-center min-h-0 overflow-hidden mb-8">
          <img src="https://img.freepik.com/free-photo/smiling-doctor-with-thumbs-up_23-2148445100.jpg" alt="Healthcare Provider" className="h-full w-full object-contain dark:opacity-90 max-h-[40vh]" />
        </div>
        <button onClick={onNext} className="group relative w-full max-w-[240px] bg-[#004a87] text-white py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-900/20 active:scale-95 transition-all overflow-hidden mb-[calc(2rem+env(safe-area-inset-bottom))]">
          <span className="relative z-10 flex items-center justify-center gap-2">{t.getStarted} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
        </button>
      </div>
    </div>
  );
};

const LanguagePage = ({ onNext, currentLang, setLang }: { onNext: () => void, currentLang: Language, setLang: (l: Language) => void }) => {
  const t = translations[currentLang];
  return (
    <div className="h-full bg-[#dcecf9] dark:bg-slate-950 flex flex-col items-center px-6 pt-[calc(env(safe-area-inset-top)+3rem)]">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">{t.chooseLanguage}</h2>
      <p className="text-gray-700 dark:text-slate-400 font-medium text-base mb-10">अपनी भाषा चुनिए</p>
      <div className="w-full space-y-3 max-w-sm">
        <button onClick={() => setLang('en')} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all shadow-sm ${currentLang === 'en' ? 'bg-[#004a87] border-[#004a87] text-white' : 'bg-white dark:bg-slate-900 border-white dark:border-slate-800 text-[#004a87] dark:text-slate-100'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${currentLang === 'en' ? 'bg-white text-[#004a87]' : 'bg-[#004a87] text-white'}`}>A</div>
          <span className="text-lg font-bold">English</span>
        </button>
        <button onClick={() => setLang('hi')} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all shadow-sm ${currentLang === 'hi' ? 'bg-[#004a87] border-[#004a87] text-white' : 'bg-white dark:bg-slate-900 border-white dark:border-slate-800 text-[#004a87] dark:text-slate-100'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${currentLang === 'hi' ? 'bg-white text-[#004a87]' : 'bg-[#004a87] text-white'}`}>अ</div>
          <span className="text-lg font-bold">Hindi</span>
        </button>
      </div>
      <div className="flex-1"></div>
      <button onClick={onNext} className="w-full max-sm:max-w-xs bg-[#004a87] text-white py-4 rounded-2xl font-bold text-lg shadow-xl mb-[calc(2.5rem+env(safe-area-inset-bottom))]">{t.next}</button>
    </div>
  );
};

const LoginPage = ({ onLogin, lang }: { onLogin: (role: UserRole) => void, lang: Language }) => {
  const t = translations[lang];
  return (
    <div className="h-full bg-white dark:bg-slate-900 flex flex-col px-6 justify-center animate-in slide-in-from-right duration-500">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-600/20"><Heart className="w-8 h-8 text-white fill-current" /></div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight">{t.careConnect}</h1>
      </div>
      <div className="space-y-3 w-full max-w-sm mx-auto">
        <button onClick={() => onLogin('PATIENT')} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"><UserIcon className="w-5 h-5" />{t.iAmPatient}</button>
        <button onClick={() => onLogin('DOCTOR')} className="w-full bg-white dark:bg-slate-800 border-2 border-blue-600 text-blue-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all"><Stethoscope className="w-5 h-5" />{t.iAmDoctor}</button>
      </div>
    </div>
  );
};

const PatientHome = ({ onNavigate, lang }: { onNavigate: (p: Page) => void, lang: Language }) => {
  const t = translations[lang];
  return (
    <div className="bg-[#fafcfd] dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">
      <div className="px-5 py-4 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-600 w-4 h-4" />
          <input type="text" placeholder={t.searchPlaceholder} className="w-full bg-[#f8fafc] dark:bg-slate-800/50 border border-gray-100/50 dark:border-slate-800 py-3.5 pl-11 pr-4 rounded-xl shadow-inner focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#00bcd4]/30 transition-all text-sm font-medium dark:text-slate-100 placeholder:text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pt-2 pb-2">
        <div onClick={() => onNavigate(Page.DOCTOR_LIST)} className="bg-[#fff1e7] dark:bg-[#2c1d14] rounded-[2rem] p-5 flex flex-col justify-between relative overflow-hidden h-[200px] border border-[#f5e1d3]/50 dark:border-orange-900/30 active:scale-95 transition-all cursor-pointer">
          <div className="z-20 relative"><h3 className="text-xl font-black text-[#1a1a1a] dark:text-slate-100 leading-tight mb-2">Doctor<br/>Consult</h3><p className="text-[#003c71] dark:text-blue-400 font-black text-xl">24<span className="text-[#a62626] font-extrabold mx-1">X</span>7</p></div>
          <button className="bg-[#a62626] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide shadow-lg z-30 w-fit">Book Now</button>
          <img src="https://img.freepik.com/free-photo/handsome-indian-doctor-white-coat-standing-with-stethoscope-folded-arms_171337-5867.jpg" alt="Doctor" className="absolute -bottom-2 -right-8 w-32 object-contain mix-blend-multiply dark:mix-blend-normal opacity-90 z-10" />
        </div>

        <div onClick={() => onNavigate(Page.AI_CHECK)} className="bg-[#f0f9ff] dark:bg-[#142330] rounded-[2rem] p-5 flex flex-col justify-between relative overflow-hidden h-[200px] border border-blue-50 dark:border-blue-900/30 active:scale-95 transition-all cursor-pointer">
          <div className="z-20 relative"><h3 className="text-xl font-black text-[#1e40af] dark:text-blue-400 leading-tight mb-2">Psychologist</h3><div className="bg-[#a62626] text-white px-3 py-1 rounded-lg w-fit text-[9px] font-black tracking-widest shadow-lg">VAANI</div></div>
          <button className="bg-white dark:bg-slate-800 text-[#1a1a1a] dark:text-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg border border-white/50 z-30 w-fit">Click Here</button>
          <img src="https://img.freepik.com/free-photo/pretty-young-woman-pointing-with-index-finger-white-background_114579-66176.jpg" alt="Psychologist" className="absolute -bottom-2 -right-12 w-36 object-contain mix-blend-multiply dark:mix-blend-normal opacity-90 z-10" />
        </div>

        <div className="bg-[#f5faff] dark:bg-[#111c2e] rounded-[2rem] p-5 flex flex-col justify-between relative overflow-hidden h-[200px] border border-blue-50/50 dark:border-blue-900/30 active:scale-95 transition-all cursor-pointer">
          <div className="z-20 relative"><h3 className="text-2xl font-black text-[#003c71] dark:text-blue-200 mb-2 leading-none">Lab Test</h3><div className="flex items-center gap-2"><img src="https://cdn-icons-png.flaticon.com/128/2916/2916053.png" alt="Scooter" className="w-4 h-4 dark:invert" /><p className="text-[9px] font-black text-gray-700 dark:text-slate-300">Free Home Pickup</p></div></div>
          <button className="bg-[#a62626] text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg z-30 w-fit">Book Now</button>
          <img src="https://img.freepik.com/free-photo/professional-scientist-preparing-sample-microscope-lab_23-2148882791.jpg" alt="Lab Test" className="absolute -bottom-2 -right-10 w-36 object-contain mix-blend-multiply dark:mix-blend-normal opacity-40 z-10" />
        </div>

        <div className="bg-[#fff9f2] dark:bg-[#2e2318] rounded-[2rem] p-5 flex flex-col justify-between relative overflow-hidden h-[200px] border border-orange-50 dark:border-orange-900/30 active:scale-95 transition-all cursor-pointer">
          <div className="z-20 relative"><h3 className="text-xl font-black text-[#003c71] dark:text-orange-200 leading-tight mb-2">Health<br/><span className="text-[#a62626]">Packages</span></h3><div className="rounded-xl overflow-hidden mb-2 border-2 border-white dark:border-slate-700 shadow-lg h-16"><img src="https://img.freepik.com/free-photo/happy-family-sitting-grass-park_23-2148882800.jpg" alt="Health Packages" className="w-full h-full object-cover" /></div></div>
          <p className="text-[8px] font-black text-gray-500 uppercase tracking-tight">Code: <span className="text-[#a62626]">GENNIE</span></p>
        </div>
      </div>

      <div className="px-5 mt-6 mb-8">
        <div onClick={() => onNavigate(Page.AI_CHECK)} className="bg-[#ffe8ec] dark:bg-[#2e1a1e] rounded-[2rem] p-6 flex justify-between items-center shadow-lg relative overflow-hidden active:scale-[0.99] transition-all cursor-pointer border dark:border-red-900/30">
          <div className="z-20 relative max-w-[60%]"><h3 className="text-2xl font-black text-[#1a1a1a] dark:text-slate-100 leading-tight mb-1">Check Health<br/>in Seconds</h3><p className="text-gray-700 dark:text-slate-400 text-xs font-bold mb-4">Just Speak or Scan!</p><button className="bg-[#333333] dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-2 rounded-full text-[10px] font-black tracking-wider uppercase shadow-lg">Start Now</button></div>
          <div className="z-10 relative"><img src="https://img.freepik.com/free-photo/young-indian-woman-holding-phone-books_23-2148118612.jpg" alt="Care AI" className="w-32 h-32 object-contain scale-[1.5] translate-x-4 transition-transform duration-700" /></div>
          <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-[#ffd1d9]/30 dark:from-red-900/10 to-transparent z-0"></div>
        </div>
      </div>

      <div className="px-5 mt-4 pb-12">
        <h2 className="text-xl font-black text-[#1a1a1a] dark:text-slate-100 tracking-tight leading-none mb-6">{t.topSpecialities}</h2>
        <div className="space-y-4">
          {SPECIALITIES.map(spec => (
            <div key={spec.id} onClick={() => onNavigate(Page.DOCTOR_LIST)} className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100/50 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-all cursor-pointer">
              <div className={`${spec.color} w-14 h-14 rounded-2xl flex items-center justify-center shrink-0`}>{spec.icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-[#003c71] dark:text-blue-300 text-base truncate leading-tight group-hover:text-[#00bcd4] transition-colors">{(t.specs as any)[spec.key]}</h4>
                <p className="text-gray-400 dark:text-slate-500 text-xs leading-snug font-semibold line-clamp-1">{(t.specs as any)[`${spec.key}Desc`]}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-slate-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.WELCOME);
  const [user, setUser] = useState<User | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const storedUser = store.getUser();
    if (storedUser) {
      setUser(storedUser);
      setCurrentPage(storedUser.role === 'DOCTOR' ? Page.DOCTOR_HOME : Page.PATIENT_HOME);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogin = (role: UserRole) => {
    const newUser: User = {
      id: role === 'PATIENT' ? 'p1' : 'doc1',
      name: role === 'PATIENT' ? 'ayush sinha' : 'Dr. Sarah Wilson',
      email: role === 'PATIENT' ? 'patient@demo.com' : 'sarah@careconnect.com',
      role: role,
      avatar: MALE_AVATAR
    };
    store.setUser(newUser);
    setUser(newUser);
    setCurrentPage(role === 'PATIENT' ? Page.PATIENT_HOME : Page.DOCTOR_HOME);
  };

  const handleProfileUpdate = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    store.setUser(updatedUser);
    setUser(updatedUser);
    setCurrentPage(user.role === 'DOCTOR' ? Page.DOCTOR_HOME : Page.PATIENT_HOME);
  };

  const handleCompleteBooking = (date: string, time: string) => {
    if (!selectedDoctor || !user) return;
    const newAppointment: Appointment = {
      id: `app_${Date.now()}`,
      doctorId: selectedDoctor.id,
      patientId: user.id,
      doctorName: selectedDoctor.name,
      patientName: user.name,
      date: date,
      time: time,
      status: 'UPCOMING',
      type: 'TELECONSULTATION'
    };
    store.addAppointment(newAppointment);
    setCurrentPage(Page.APPOINTMENTS);
  };

  const logout = () => {
    store.setUser(null);
    setUser(null);
    setIsDrawerOpen(false);
    setCurrentPage(Page.WELCOME);
  };

  const getPageTitle = () => {
    const t = translations[language];
    switch(currentPage) {
      case Page.PATIENT_HOME: return t.careConnect;
      case Page.DOCTOR_HOME: return t.dashboard;
      case Page.DOCTOR_LIST: return t.selectDoctor;
      case Page.BOOKING: return t.confirmBooking;
      case Page.MY_HEALTH: return t.myHealth;
      case Page.APPOINTMENTS: return t.appointments;
      case Page.AI_CHECK: return t.aiHealthCheck;
      case Page.EDIT_PROFILE: return t.editProfile;
      case Page.MANAGE_AVAILABILITY: return t.manageAvailability;
      case Page.REFER_AND_EARN: return t.referTitle;
      default: return t.careConnect;
    }
  };

  const renderPage = () => {
    const t = translations[language];
    switch(currentPage) {
      case Page.WELCOME: return <WelcomePage onNext={() => setCurrentPage(Page.LANGUAGE)} lang={language} />;
      case Page.LANGUAGE: return <LanguagePage onNext={() => setCurrentPage(Page.LOGIN)} currentLang={language} setLang={setLanguage} />;
      case Page.LOGIN: return <LoginPage onLogin={handleLogin} lang={language} />;
      case Page.PATIENT_HOME: return <PatientHome onNavigate={setCurrentPage} lang={language} />;
      case Page.DOCTOR_HOME: return <DoctorDashboard onNavigate={setCurrentPage} lang={language} />;
      case Page.DOCTOR_LIST: return <DoctorListPage lang={language} onBook={(doc) => { setSelectedDoctor(doc); setCurrentPage(Page.BOOKING); }} />;
      case Page.BOOKING: return <BookingPage user={user} lang={language} doctor={selectedDoctor} onComplete={handleCompleteBooking} />;
      case Page.MY_HEALTH: return <HealthStatsPage lang={language} />;
      case Page.APPOINTMENTS: return <AppointmentsPage lang={language} onNavigate={setCurrentPage} />;
      case Page.AI_CHECK: return <AICheckPage lang={language} />;
      case Page.EDIT_PROFILE: return <EditProfilePage user={user!} lang={language} onSave={handleProfileUpdate} onCancel={() => setCurrentPage(user?.role === 'DOCTOR' ? Page.DOCTOR_HOME : Page.PATIENT_HOME)} />;
      case Page.MANAGE_AVAILABILITY: return <ManageAvailabilityPage lang={language} onBack={() => setCurrentPage(Page.DOCTOR_HOME)} />;
      case Page.REFER_AND_EARN: return <ReferAndEarnPage lang={language} onBack={() => setCurrentPage(Page.PATIENT_HOME)} />;
      default: return <div className="p-10 text-center dark:text-slate-400">Page Coming Soon</div>;
    }
  };

  const showNavbar = currentPage !== Page.LOGIN && currentPage !== Page.WELCOME && currentPage !== Page.LANGUAGE;
  const showBottomNav = showNavbar && currentPage !== Page.BOOKING && currentPage !== Page.EDIT_PROFILE && currentPage !== Page.MANAGE_AVAILABILITY && currentPage !== Page.REFER_AND_EARN;

  return (
    <div className={`w-full h-full max-w-md mx-auto relative overflow-hidden flex flex-col font-['Inter'] transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-950' : 'bg-white'}`}>
      {showNavbar && (
        <Navbar 
          lang={language} 
          theme={theme} 
          title={getPageTitle()} 
          showBack={currentPage !== Page.PATIENT_HOME && currentPage !== Page.DOCTOR_HOME} 
          onBack={() => { 
            if (currentPage === Page.BOOKING) setCurrentPage(Page.DOCTOR_LIST); 
            else if (currentPage === Page.EDIT_PROFILE) setCurrentPage(user?.role === 'DOCTOR' ? Page.DOCTOR_HOME : Page.PATIENT_HOME); 
            else if (currentPage === Page.MANAGE_AVAILABILITY) setCurrentPage(Page.DOCTOR_HOME); 
            else if (currentPage === Page.REFER_AND_EARN) setCurrentPage(user?.role === 'DOCTOR' ? Page.DOCTOR_HOME : Page.PATIENT_HOME);
            else if (user?.role === 'DOCTOR') setCurrentPage(Page.DOCTOR_HOME); 
            else setCurrentPage(Page.PATIENT_HOME); 
          }} 
          onMenu={() => setIsDrawerOpen(true)} 
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />
      )}
      {showNavbar && <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} user={user} onNavigate={setCurrentPage} lang={language} onLogout={logout} onToggleTheme={toggleTheme} onSetLanguage={setLanguage} theme={theme} />}
      
      {/* Notifications Modal */}
      <NotificationModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} lang={language} />

      <main className="flex-1 overflow-y-auto bg-[#fafcfd] dark:bg-slate-950 transition-colors duration-300 hide-scrollbar pb-safe">
        {renderPage()}
        {showBottomNav && <div className="h-24" />}
      </main>
      {showBottomNav && <BottomNav activePage={currentPage} onNavigate={setCurrentPage} lang={language} />}
    </div>
  );
}

// --- Helper Components ---

function ReferAndEarnPage({ lang, onBack }: { lang: Language, onBack: () => void }) {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);
  const referralCode = "CARE99X7";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mockReferrals = [
    { name: "Rahul Sharma", status: "Joined", amount: "₹0" },
    { name: "Sneha Kapur", status: "Consultation Done", amount: "₹100" },
    { name: "Amit Verma", status: "Joined", amount: "₹0" },
  ];

  return (
    <div className="px-5 pt-6 pb-20 animate-in slide-in-from-right duration-500">
      <div className="bg-[#00bcd4] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-900/20 rounded-full -ml-8 -mb-8 blur-xl"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-md flex items-center justify-center mb-6 border border-white/30 shadow-lg">
            <Gift className="w-10 h-10 text-white fill-current" />
          </div>
          <h2 className="text-2xl font-black mb-2 tracking-tight">{t.referTitle}</h2>
          <p className="text-cyan-50 font-medium text-sm leading-relaxed max-w-[240px]">
            {t.referBenefit}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-slate-800 mb-6">
        <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 text-center">{t.yourCode}</h4>
        
        <div className="relative mb-6 group">
          <div className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-[#00bcd4]/30 rounded-2xl p-5 flex items-center justify-center text-center group-hover:border-[#00bcd4] transition-all">
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-[0.2em]">{referralCode}</span>
          </div>
          <button 
            onClick={handleCopy}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#00bcd4] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 active:scale-95 transition-all"
          >
            {copied ? <><Check className="w-3 h-3" /> {t.codeCopied}</> : <><Copy className="w-3 h-3" /> {t.copyCode}</>}
          </button>
        </div>

        <div className="pt-4 flex gap-3">
          <button className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all">
            <Share2 className="w-5 h-5 text-gray-600 dark:text-slate-400" />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{t.shareCode}</span>
          </button>
          <button className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all">
            <ExternalLink className="w-5 h-5 text-gray-600 dark:text-slate-400" />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Rules</span>
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t.referralHistory}</h3>
          <span className="text-[10px] font-black text-[#00bcd4] uppercase tracking-widest">Total: ₹100</span>
        </div>
        
        <div className="space-y-3">
          {mockReferrals.map((ref, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-50 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center font-black text-[#00bcd4] text-xs">
                  {ref.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-slate-100">{ref.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{ref.status}</p>
                </div>
              </div>
              <span className={`text-sm font-black ${ref.amount !== '₹0' ? 'text-green-500' : 'text-gray-400'}`}>{ref.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationModal({ isOpen, onClose, lang }: { isOpen: boolean, onClose: () => void, lang: Language }) {
  const t = translations[lang];
  const notifications = store.getNotifications();
  
  useEffect(() => {
    if (isOpen) {
      store.markAllAsRead();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex flex-col bg-white dark:bg-slate-900 animate-in slide-in-from-right duration-300">
      <div className="px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-800">
        <button onClick={onClose} className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-800 dark:text-white" />
        </button>
        <h2 className="text-lg font-black tracking-tight dark:text-white">Notifications</h2>
        <button 
          onClick={() => store.clearNotifications()} 
          className="p-2 text-gray-400 hover:text-red-500"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <p className="font-bold text-sm text-gray-500">No new notifications</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 flex gap-4 animate-in slide-in-from-bottom duration-300">
              <div className="w-12 h-12 bg-[#00bcd4]/10 rounded-2xl flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-[#00bcd4]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-black text-gray-900 dark:text-white text-sm">{n.fromName}</h4>
                  <span className="text-[9px] font-bold text-gray-400">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-slate-400 text-xs leading-relaxed font-medium">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DoctorDashboard({ lang, onNavigate }: { lang: Language, onNavigate: (p: Page) => void }) {
  const t = translations[lang];
  const user = store.getUser();
  const appointments = store.getAppointments().filter(app => app.doctorId === user?.id);
  const [messagingTarget, setMessagingTarget] = useState<Appointment | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSendMessage = () => {
    if (!messageText.trim() || !user) return;
    
    // Logic: Send notification to patient from current doctor
    store.addNotification(user.name, messageText);
    
    setShowToast(true);
    setMessageText('');
    setMessagingTarget(null);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="px-5 pt-4 animate-in fade-in duration-300 bg-[#fafcfd] dark:bg-slate-950 transition-colors duration-300 min-h-full relative">
      <div className="bg-[#00bcd4] rounded-[2rem] p-6 text-white mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <p className="text-blue-100 font-bold mb-1 opacity-80 text-sm">{t.welcomeBack},</p>
        <h2 className="text-2xl font-black mb-6 truncate">{user?.name}</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 text-center">
            <p className="text-2xl font-black">{appointments.length}</p>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">{t.totalPatients}</p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 text-center">
            <p className="text-2xl font-black">{appointments.filter(a => a.status === 'UPCOMING').length}</p>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">{t.pending}</p>
          </div>
        </div>
      </div>

      <button onClick={() => onNavigate(Page.MANAGE_AVAILABILITY)} className="w-full bg-gray-900 dark:bg-slate-100 text-white dark:text-slate-900 py-4 rounded-xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all text-sm uppercase tracking-wider shadow-lg mb-8">
        <PlusCircle className="w-5 h-5" /> {t.manageAvailability}
      </button>

      <div className="mt-4 pb-10">
        <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">{t.todayAppointments}</h3>
        {appointments.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 text-center">
            <p className="text-gray-400 dark:text-slate-500 font-bold text-xs">No appointments scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((app) => (
              <div key={app.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-800 animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm bg-gray-50 shrink-0"><img src={MALE_AVATAR} alt={app.patientName} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-gray-900 dark:text-slate-100 text-sm truncate">{app.patientName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="bg-blue-50 dark:bg-blue-900/20 text-[#00bcd4] px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">{app.type}</span>
                      <span className="text-gray-400 dark:text-slate-600 text-[10px] font-bold">Today, {app.time}</span>
                    </div>
                  </div>
                  <button onClick={() => setMessagingTarget(app)} className="p-2.5 bg-cyan-50 dark:bg-cyan-900/20 text-[#00bcd4] rounded-xl active:scale-90 transition-all border border-cyan-100 dark:border-cyan-800/50">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
                <button className="w-full bg-[#00bcd4] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all">{t.startConsultation}</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {messagingTarget && (
        <div className="fixed inset-0 z-[60] flex items-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMessagingTarget(null)}></div>
          <div className="relative w-full bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-500 border-t border-gray-100 dark:border-slate-800 pb-[calc(2rem+env(safe-area-inset-bottom))]">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>
            <div className="flex items-center gap-4 mb-6">
              <img src={MALE_AVATAR} alt="Patient" className="w-12 h-12 rounded-xl" />
              <div><h4 className="font-black text-gray-900 dark:text-slate-100">{messagingTarget.patientName}</h4><p className="text-gray-400 text-xs font-bold">{t.messageCustomer}</p></div>
              <button onClick={() => setMessagingTarget(null)} className="ml-auto p-2 text-gray-400 hover:bg-gray-50 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder={t.typeMessage} className="w-full h-32 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-cyan-400 resize-none mb-6" />
            <button onClick={handleSendMessage} className="w-full bg-[#00bcd4] text-white py-4.5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"><Send className="w-5 h-5" /> {t.send}</button>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom duration-300 flex items-center gap-2 z-50">
          <Check className="w-5 h-5" /> <span className="font-bold text-sm">{t.messageSent}</span>
        </div>
      )}
    </div>
  );
}

function BookingPage({ user, lang, doctor, onComplete }: { user: User | null, lang: Language, doctor: any, onComplete: (date: string, time: string) => void }) {
  const t = translations[lang];
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  if (!doctor) return null;

  // Real availability from store
  const availableSlots = store.getDoctorAvailability(doctor.id);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dayName: d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      fullDate: d.toLocaleDateString(),
      month: d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { month: 'short' })
    };
  });

  const handleConfirm = () => { if (selectedTimeSlot) onComplete(dates[selectedDateIndex].fullDate, selectedTimeSlot); };

  return (
    <div className="px-5 pt-6 bg-[#fafcfd] dark:bg-slate-950 min-h-full flex flex-col animate-in slide-in-from-bottom duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-gray-50 dark:border-slate-800 mb-6 flex items-center gap-4">
        <img src={doctor.avatar} alt={doctor.name} className="w-14 h-14 rounded-xl object-cover shadow-sm dark:opacity-80" />
        <div><h3 className="text-base font-black text-gray-900 dark:text-slate-100">{doctor.name}</h3><p className="text-[#00bcd4] font-bold text-[10px] uppercase tracking-wider">{doctor.speciality}</p></div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-gray-50 dark:border-slate-800 mb-6">
         <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">Patient Details</h4>
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center"><UserIcon className="w-5 h-5 text-[#00bcd4]" /></div>
            <div><p className="text-sm font-black dark:text-white">{user?.name}</p><p className="text-[10px] text-gray-400 font-bold">{user?.email}</p></div>
         </div>
      </div>

      <div className="mb-6">
        <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">{t.selectDate}</h4>
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {dates.map((date, i) => (
            <button key={i} onClick={() => setSelectedDateIndex(i)} className={`flex flex-col items-center justify-center min-w-[65px] h-[85px] rounded-2xl transition-all border ${selectedDateIndex === i ? 'bg-[#00bcd4] border-[#00bcd4] text-white shadow-lg shadow-cyan-500/20' : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400'}`}>
              <span className={`text-[9px] font-black uppercase tracking-wider mb-1 ${selectedDateIndex === i ? 'text-white/80' : 'text-gray-400'}`}>{date.dayName}</span>
              <span className="text-xl font-black">{date.dayNumber}</span>
              <span className={`text-[8px] font-bold mt-1 ${selectedDateIndex === i ? 'text-white/60' : 'text-gray-300'}`}>{date.month}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">{t.selectTime}</h4>
        <div className="grid grid-cols-3 gap-2">
          {availableSlots.length > 0 ? (
            availableSlots.map((slot, i) => (
              <button key={i} onClick={() => setSelectedTimeSlot(slot)} className={`py-3 rounded-xl text-[11px] font-black border transition-all ${selectedTimeSlot === slot ? 'bg-[#00bcd4]/10 border-[#00bcd4] text-[#00bcd4]' : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400'}`}>{slot}</button>
            ))
          ) : (
             <div className="col-span-3 p-4 bg-gray-50 dark:bg-slate-800 text-center rounded-xl text-gray-400 text-[10px] font-bold">No slots available for this doctor.</div>
          )}
        </div>
      </div>
      
      <div className="flex-1"></div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-50 dark:border-slate-800 mb-6">
        <div className="flex justify-between items-center text-sm"><span className="text-gray-400 font-bold">{t.totalFees}</span><span className="text-xl font-black text-[#00bcd4]">₹{Math.round(doctor.fee * 1.18)}</span></div>
      </div>
      <button onClick={handleConfirm} disabled={!selectedTimeSlot} className="w-full bg-[#00bcd4] text-white py-4.5 rounded-2xl font-black text-base shadow-xl active:scale-95 transition-all mb-10 disabled:opacity-40">{t.confirmBooking}</button>
    </div>
  );
}

function DoctorListPage({ onBook, lang }: { onBook: (doc: any) => void, lang: Language }) {
  const t = translations[lang];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500';
      case 'BUSY': return 'bg-amber-500';
      case 'OFFLINE': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return t.statusAvailable;
      case 'BUSY': return t.statusBusy;
      case 'OFFLINE': return t.statusOffline;
      default: return t.statusOffline;
    }
  };

  return (
    <div className="px-5 pt-4 bg-[#fafcfd] dark:bg-slate-950 min-h-full pb-10">
      <div className="flex flex-col gap-4">
        {MOCK_DOCTORS.map(doc => (
          <div 
            key={doc.id} 
            className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 active:scale-[0.99] transition-all cursor-pointer group relative overflow-hidden"
            onClick={() => onBook(doc)}
          >
            {/* Top Section: Avatar & Essential Info */}
            <div className="flex gap-4 items-start relative z-10">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-800 ring-1 ring-cyan-50 dark:ring-cyan-900/20 group-hover:ring-[#00bcd4]/40 transition-all">
                  <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover dark:opacity-90" />
                </div>
                {/* Dynamic Status Indicator Dot on Avatar */}
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(doc.status)} border-4 border-white dark:border-slate-900 rounded-full shadow-sm`}></div>
              </div>
              
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-black text-gray-900 dark:text-slate-100 text-lg leading-tight truncate tracking-tight group-hover:text-[#00bcd4] transition-colors">{doc.name}</h3>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-xl border border-amber-100 dark:border-amber-800/30">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400">{doc.rating}</span>
                  </div>
                </div>
                
                {/* Speciality Tag & Status Label */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="inline-flex bg-cyan-50 dark:bg-cyan-900/20 px-2.5 py-1 rounded-lg border border-cyan-100 dark:border-cyan-800/30">
                    <p className="text-[#00bcd4] font-black text-[9px] uppercase tracking-widest truncate">
                      {(t.specs as any)[doc.id === 'doc1' ? 'gen' : doc.id === 'doc2' ? 'card' : 'psych'] || doc.speciality}
                    </p>
                  </div>
                  {/* Text Status Label */}
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(doc.status)} animate-pulse`}></div>
                    <span className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                      {getStatusLabel(doc.status)}
                    </span>
                  </div>
                </div>

                {/* Secondary Info Grid */}
                <div className="flex items-center gap-4 text-gray-400 dark:text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">{doc.experience} {t.exp}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">{t.currentLocation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Pricing & Action */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50 dark:border-slate-800 relative z-10">
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Consult Fee</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-gray-900 dark:text-slate-100 font-black text-2xl tracking-tighter">₹{doc.fee}</span>
                  <span className="text-[10px] text-gray-400 font-bold">/ session</span>
                </div>
              </div>
              <button 
                className={`bg-[#00bcd4] text-white px-7 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[#00bcd4]/20 hover:shadow-[#00bcd4]/30 active:scale-95 transition-all flex items-center gap-2 ${doc.status === 'OFFLINE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={doc.status === 'OFFLINE'}
              >
                {t.bookNow}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-50/20 dark:bg-cyan-900/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppointmentsPage({ lang, onNavigate }: { lang: Language, onNavigate: (p: Page) => void }) {
  const t = translations[lang];
  const appointments = store.getAppointments();
  if (appointments.length === 0) {
    return (
      <div className="px-6 pt-8 bg-[#fafcfd] dark:bg-slate-950 min-h-full">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm text-center border border-gray-100 dark:border-slate-800">
          <p className="text-gray-400 font-bold mb-6 text-sm">{t.noUpcoming}</p>
          <button onClick={() => onNavigate(Page.DOCTOR_LIST)} className="text-[#00bcd4] font-black text-xs bg-blue-50 px-6 py-3 rounded-xl uppercase tracking-wider">Book Now</button>
        </div>
      </div>
    );
  }
  return (
    <div className="px-5 pt-4 bg-[#fafcfd] dark:bg-slate-950 min-h-full space-y-4 pb-10">
      {appointments.map((app) => (
        <div key={app.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0"><Stethoscope className="w-6 h-6 text-[#00bcd4]" /></div>
            <div className="flex-1 min-w-0"><h3 className="font-black text-gray-900 dark:text-white text-sm">{app.doctorName}</h3><p className="text-[#00bcd4] font-black text-[10px] uppercase">{app.type}</p></div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-[#00bcd4]" /><span className="text-[11px] font-bold dark:text-white">{app.date}</span></div>
            <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-[#00bcd4]" /><span className="text-[11px] font-bold dark:text-white">{app.time}</span></div>
          </div>
          <button className="w-full bg-[#00bcd4] text-white py-2.5 rounded-xl text-[10px] font-black uppercase shadow-md shadow-[#00bcd4]/20 active:scale-95 transition-all">Start Consultation</button>
        </div>
      ))}
    </div>
  );
}

function HealthStatsPage({ lang }: { lang: Language }) {
  const healthCategories = [
    { title: 'Health History', icon: <ClipboardList className="w-8 h-8" />, gradient: 'bg-gradient-to-r from-[#f76b7e] to-[#f6916c]' },
    { title: 'Weight', icon: <Activity className="w-8 h-8" />, gradient: 'bg-gradient-to-r from-[#6582f3] to-[#36ecd7]' },
    { title: 'Diabetes', icon: <Droplets className="w-8 h-8" />, gradient: 'bg-gradient-to-r from-[#2d5cd5] to-[#1c3ca1]' },
    { title: 'Blood Pressure', icon: <HeartPulse className="w-8 h-8" />, gradient: 'bg-gradient-to-r from-[#48d28a] to-[#48e1c6]' },
    { title: 'Medicine', icon: <Clock className="w-8 h-8" />, gradient: 'bg-gradient-to-r from-[#f88f4c] to-[#fbc53b]' },
    { title: 'Temperature', icon: <Thermometer className="w-8 h-8" />, gradient: 'bg-gradient-to-r from-[#bd58ec] to-[#e271ee]' }
  ];
  return (
    <div className="px-5 pt-6 bg-white dark:bg-slate-950 min-h-full space-y-3 pb-10">
      {healthCategories.map((cat, i) => (
        <button key={i} className={`${cat.gradient} p-5 h-24 rounded-2xl shadow-lg flex items-center gap-4 w-full active:scale-[0.98] transition-all relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
          <div className="text-white z-10 drop-shadow-md shrink-0">{cat.icon}</div>
          <span className="text-lg font-bold text-white z-10 drop-shadow-sm tracking-tight">{cat.title}</span>
        </button>
      ))}
    </div>
  );
}

function AICheckPage({ lang }: { lang: Language }) {
  const t = translations[lang];
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const handleCheck = async () => { if (!symptoms.trim()) return; setLoading(true); const analysis = await getHealthAnalysis(symptoms); setResult(analysis); setLoading(false); };
  return (
    <div className="px-5 pt-6 bg-[#fafcfd] dark:bg-slate-950 min-h-full pb-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-gray-50 dark:border-slate-800 mb-6">
        <h3 className="text-xl font-black text-gray-900 dark:text-slate-100 mb-1">Care AI</h3>
        <p className="text-gray-500 text-xs mb-6">Describe your symptoms and our advanced AI will provide instant guidance.</p>
        <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g. I have a slight fever and headache..." className="w-full h-32 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-cyan-300 transition-all resize-none mb-4" />
        <button onClick={handleCheck} disabled={loading} className="w-full bg-gray-900 dark:bg-slate-100 text-white dark:text-slate-900 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">{loading ? 'Analyzing...' : 'Check Symptoms'}</button>
      </div>
      {result && (
        <div className="bg-cyan-50 dark:bg-cyan-900/10 rounded-3xl p-6 border border-cyan-100 animate-in slide-in-from-bottom duration-500 mb-10 transition-all">
          <h4 className="text-[#00bcd4] font-black uppercase tracking-widest text-[10px] mb-4">Analysis Result</h4>
          <div className="space-y-4">
            <div><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Possible Causes</p><div className="flex flex-wrap gap-1.5">{result.possibleCauses.map((c: any, i: number) => <span key={i} className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">{c}</span>)}</div></div>
            <div><p className="text-[9px] font-black text-gray-400 uppercase mb-1">Recommendation</p><p className="text-gray-800 dark:text-slate-200 font-bold text-sm leading-relaxed">{result.recommendation}</p></div>
            <div className="flex items-center justify-between pt-3 border-t border-cyan-200/50">
              <span className="text-[10px] font-black text-gray-500 uppercase">Urgency</span>
              <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${result.urgency === 'High' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>{result.urgency}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ManageAvailabilityPage({ lang, onBack }: { lang: Language, onBack: () => void }) {
  const t = translations[lang];
  const user = store.getUser();
  const currentSlots = user ? store.getDoctorAvailability(user.id) : [];
  
  const [selectedSlots, setSelectedSlots] = useState<string[]>(currentSlots);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const allSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];

  const toggleSlot = (slot: string) => {
    setSelectedSlots(prev => 
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = () => {
    if (!user) return;
    setIsSaving(true);
    // Persist to store
    store.updateDoctorAvailability(user.id, selectedSlots);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onBack();
      }, 1500);
    }, 800);
  };

  return (
    <div className="px-5 pt-6 bg-[#fafcfd] dark:bg-slate-950 min-h-full animate-in slide-in-from-right duration-500 pb-10">
      <div className="mb-8">
        <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">Working Days</h4>
        <div className="grid grid-cols-4 gap-2">
          {days.map(day => (
            <button key={day} className="py-3 rounded-xl text-[11px] font-black border bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400 opacity-60">
              {day}
            </button>
          ))}
        </div>
        <p className="text-[8px] text-gray-400 mt-2 ml-1 italic">* Multi-day selection coming soon. Defaulting to standard Mon-Fri.</p>
      </div>

      <div className="mb-10">
        <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">Choose Available Time Slots</h4>
        <div className="grid grid-cols-3 gap-2">
          {allSlots.map(slot => (
            <button 
              key={slot} 
              onClick={() => toggleSlot(slot)}
              className={`py-3 rounded-xl text-[10px] font-black border transition-all ${
                selectedSlots.includes(slot)
                ? 'bg-[#00bcd4] border-[#00bcd4] text-white shadow-lg shadow-cyan-500/20'
                : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={handleSave} 
        disabled={isSaving}
        className={`w-full bg-[#00bcd4] text-white py-4.5 rounded-2xl font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${isSaving ? 'opacity-70' : ''}`}
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Saving...
          </>
        ) : (
          'Save Availability'
        )}
      </button>

      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-8 py-4 rounded-[2rem] shadow-2xl animate-in zoom-in duration-300 flex flex-col items-center gap-3 z-[100] border-4 border-white">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8" />
          </div>
          <span className="font-black text-lg uppercase tracking-widest">Saved Successfully!</span>
        </div>
      )}
    </div>
  );
}

function EditProfilePage({ user, lang, onSave, onCancel }: { user: User, lang: Language, onSave: (u: Partial<User>) => void, onCancel: () => void }) {
  const t = translations[lang];
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  return (
    <div className="px-5 pt-6 bg-[#fafcfd] dark:bg-slate-950 min-h-full pb-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl mb-6 border border-gray-50 dark:border-slate-800">
        <div className="flex flex-col items-center mb-8"><div className="w-20 h-20 rounded-2xl bg-cyan-50 flex items-center justify-center mb-3"><img src={MALE_AVATAR} alt="Avatar" className="w-full h-full object-cover rounded-2xl" /></div></div>
        <div className="space-y-4">
          <div className="space-y-1.5"><label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 py-3.5 px-4 rounded-xl font-bold text-sm dark:text-white focus:border-[#00bcd4] outline-none transition-all" /></div>
          <div className="space-y-1.5"><label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 py-3.5 px-4 rounded-xl font-bold text-sm dark:text-white focus:border-[#00bcd4] outline-none transition-all" /></div>
        </div>
      </div>
      <div className="flex gap-3"><button onClick={onCancel} className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-500 py-4 rounded-xl font-black uppercase text-[10px]">Cancel</button><button onClick={() => onSave({ name, email })} className="flex-[2] bg-[#00bcd4] text-white py-4 rounded-xl font-black uppercase text-[10px] shadow-xl">Save Changes</button></div>
    </div>
  );
}
