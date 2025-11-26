import React, { useReducer, createContext, useState, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewOrder from './pages/NewOrder';
import Services from './pages/Services';
import AddFunds from './pages/AddFunds';
import Tickets from './pages/Tickets';
import SupportChat from './components/SupportChat';
import Landing from './pages/Landing';
import Login from './pages/Login';
import { ServicesProvider } from './context/ServicesProvider'; // ← هنا
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import { UserState, Language, UserProfile, Ticket, SMMService } from './types';
import { User, Bell, Menu, Globe } from 'lucide-react';
import { translations } from './translations';
import { MOCK_SERVICES } from './constants';
import MostOrdered from './pages/MostOrdered';

// --- CONTEXTS ---

// 1. User Data Context
const initialState: UserState = {
  balance: 5.00,
  spent: 125.50,
  name: 'John Doe',
  orders: [
    { id: 'ord-8821', serviceId: 101, serviceName: 'Instagram Followers', link: 'https://inst...', quantity: 1000, charge: 2.50, status: 'Completed', date: '10/24/2023' },
    { id: 'ord-8822', serviceId: 201, serviceName: 'TikTok Followers', link: 'https://tik...', quantity: 500, charge: 2.00, status: 'Processing', date: '10/25/2023' }
  ],
  tickets: [
      {
          id: 'tkt-001',
          subject: 'Order Stuck',
          status: 'Answered',
          lastUpdated: '10/26/2023',
          messages: [
              { sender: 'user', text: 'My order #8822 is still processing.', date: '10/26/2023, 10:00 AM' },
              { sender: 'admin', text: 'Hi, we are looking into it.', date: '10/26/2023, 10:15 AM' }
          ]
      }
  ],
  services: MOCK_SERVICES.map(s => ({...s, source: 'Manual'})),
  allUsers: [
      {
          id: 'usr-101',
          name: 'John Doe',
          email: 'user@example.com',
          role: 'user',
          balance: 5.00,
          spent: 125.50,
          orders: [
             { id: 'ord-8821', serviceId: 101, serviceName: 'Instagram Followers', link: '...', quantity: 1000, charge: 2.50, status: 'Completed', date: '10/24/2023' }
          ],
          tickets: []
      },
      {
          id: 'usr-102',
          name: 'Ahmed Ali',
          email: 'ahmed@example.com',
          role: 'user',
          balance: 50.00,
          spent: 2000.00,
          orders: [
             { id: 'ord-9901', serviceId: 301, serviceName: 'YouTube Subscribers', link: '...', quantity: 100, charge: 2.50, status: 'Pending', date: '10/28/2023' }
          ],
          tickets: []
      }
  ]
};

type Action = 
  | { type: 'ADD_ORDER', payload: any }
  | { type: 'DEDUCT_BALANCE', payload: number }
  | { type: 'ADD_FUNDS', payload: number }
  | { type: 'ADD_TICKET', payload: Ticket }
  | { type: 'REPLY_TICKET', payload: { ticketId: string, message: string, sender: 'user' | 'admin' } }
  | { type: 'SET_SERVICES', payload: SMMService[] }
  | { type: 'ADD_SERVICE', payload: SMMService }
  | { type: 'LOAD_STATE', payload: UserState };

const reducer = (state: UserState, action: Action): UserState => {
  let newState: UserState = state;
  switch (action.type) {
    case 'ADD_ORDER':
      newState = { ...state, orders: [action.payload, ...state.orders] };
      break;
    case 'DEDUCT_BALANCE':
      newState = { ...state, balance: state.balance - action.payload, spent: state.spent + action.payload };
      break;
    case 'ADD_FUNDS':
      newState = { ...state, balance: state.balance + action.payload };
      break;
    case 'ADD_TICKET':
      newState = { ...state, tickets: [action.payload, ...state.tickets] };
      break;
    case 'REPLY_TICKET':
      newState = {
          ...state,
          tickets: state.tickets.map(ticket => 
            ticket.id === action.payload.ticketId 
            ? { 
                ...ticket, 
                status: action.payload.sender === 'admin' ? 'Answered' : 'Open', 
                messages: [...ticket.messages, { sender: action.payload.sender, text: action.payload.message, date: new Date().toLocaleString() }]
              } 
            : ticket
          )
      };
      break;
    case 'SET_SERVICES':
      newState = { ...state, services: action.payload };
      break;
    case 'ADD_SERVICE':
      newState = { ...state, services: [...state.services, action.payload] };
      break;
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
  
  // Save to localStorage on every state change
  localStorage.setItem('nexus_app_state', JSON.stringify(newState));
  return newState;
};

export const UserContext = createContext<{state: UserState, dispatch: React.Dispatch<Action>}>({
  state: initialState,
  dispatch: () => null
});

// 2. Language Context
export const LanguageContext = createContext<{
    lang: Language;
    setLang: (l: Language) => void;
    t: (key: keyof typeof translations.en) => string;
    dir: 'ltr' | 'rtl';
}>({
    lang: 'en',
    setLang: () => {},
    t: (k) => k,
    dir: 'ltr'
});

// 3. Auth Context
export const AuthContext = createContext<{
    user: UserProfile | null;
    login: (u: UserProfile) => void;
    logout: () => void;
}>({
    user: null,
    login: () => {},
    logout: () => {}
});

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
    const { user } = useContext(AuthContext);
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (requireAdmin && user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
};

// --- LAYOUT COMPONENT ---
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state } = useContext(UserContext);
  const { lang, setLang, dir } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Hide Sidebar/Header on Landing/Login/Signup
  const isPublicPage = ['/', '/login', '/signup'].includes(location.pathname);

  if (isPublicPage) {
      return (
        <div className="min-h-screen bg-darker text-gray-100 font-sans" dir={dir}>
             {/* Floating Language Toggle for public pages */}
             <div className="fixed bottom-5 right-5 z-[60]">
                <button 
                    onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                    className="bg-card shadow-lg border border-slate-700 p-3 rounded-full text-gray-300 hover:bg-primary hover:text-white transition-colors"
                >
                    <Globe size={24} />
                </button>
             </div>
            {children}
        </div>
      )
  }

  return (
    <div className="flex min-h-screen bg-darker text-gray-100 font-sans" dir={dir}>
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            <div className={`relative z-50 w-64 h-full bg-card border-r border-slate-800 shadow-2xl animate-in ${dir === 'rtl' ? 'slide-in-from-right' : 'slide-in-from-left'}`}>
                <div className="h-full" onClick={() => setMobileMenuOpen(false)}>
                    <Sidebar />
                </div>
            </div>
        </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-30">
            <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-400 hover:text-white">
                <Menu size={24} />
            </button>
            <div className="md:hidden font-bold text-xl tracking-tight text-white">ATL3 TREND</div>
            </div>

            <div className="flex items-center gap-6">
                
                {/* Language Toggle */}
                <button 
                    onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                    className="text-gray-400 hover:text-white flex items-center gap-1 text-sm font-medium"
                >
                    <Globe size={18} />
                    <span>{lang === 'en' ? 'EN' : 'عربي'}</span>
                </button>

                {/* Balance Display */}
                <div className="hidden sm:flex items-center gap-2 bg-darker px-3 py-1.5 rounded-full border border-slate-700">
                    <span className="text-xs text-gray-400 uppercase font-semibold tracking-wide">{lang === 'en' ? 'Balance' : 'رصيد'}:</span>
                    <span className="text-primary font-bold font-mono">${state.balance.toFixed(2)}</span>
                </div>

                <button className="relative text-gray-400 hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-card"></span>
                </button>

                <div className={`flex items-center gap-3 ${dir === 'ltr' ? 'pl-6 border-l' : 'pr-6 border-r'} border-slate-800`}>
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-medium text-white">{user?.name}</div>
                        <div className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'Customer'}</div>
                    </div>
                    <div className="w-9 h-9 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <User size={18} />
                    </div>
                </div>
            </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden bg-darker">
            <div className="max-w-7xl mx-auto w-full">
               {children}
            </div>
        </main>
        </div>
        <SupportChat />
    </div>
  );
}

// 4. Main App
const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load data from local storage on startup
  useEffect(() => {
      const savedState = localStorage.getItem('nexus_app_state');
      if (savedState) {
          try {
              const parsed = JSON.parse(savedState);
              dispatch({ type: 'LOAD_STATE', payload: parsed });
          } catch (e) {
              console.error("Failed to load state", e);
          }
      }
  }, []);

  const t = (key: keyof typeof translations.en) => {
      // @ts-ignore
      return translations[lang][key] || key;
  }

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const login = (u: UserProfile) => setUser(u);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      <ServicesProvider>
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <AppLayout>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/new-order" element={<ProtectedRoute><NewOrder /></ProtectedRoute>} />
                <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
                <Route path="/most-ordered" element={<ProtectedRoute><MostOrdered /></ProtectedRoute>} />
                <Route path="/add-funds" element={<ProtectedRoute><AddFunds /></ProtectedRoute>} />
                <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AppLayout>
      </Router>
    </UserContext.Provider>
   </ServicesProvider>
    </LanguageContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
