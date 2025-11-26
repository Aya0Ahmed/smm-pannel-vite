import React, { useState, useContext } from 'react';
import { Users, CreditCard, Activity, LucideDownload, MessageSquare, Search, Plus } from 'lucide-react';
import { UserContext, LanguageContext } from '../App';
import { SMMService, ServiceType, UserDatabaseProfile } from '../types';
import { db } from '../firebaseConfig';
import { collection, writeBatch, doc, setDoc } from 'firebase/firestore';
import { ServicesProvider } from '../context/ServicesProvider';


const AdminDashboard: React.FC = () => {
  const { state } = useContext(UserContext); // Note: We read services from Context, which is synced with DB
  const { t } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'services' | 'tickets'>('overview');

  // --- USER SEARCH STATE ---
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [foundUser, setFoundUser] = useState<UserDatabaseProfile | null>(null);

  // --- SERVICE STATE ---
  const [providerUrl, setProviderUrl] = useState('https://api.justanotherpanel.com/v2'); // Standard SMM URL
  const [apiKey, setApiKey] = useState('');
  const [profitMargin, setProfitMargin] = useState(20); 
  const [syncStatus, setSyncStatus] = useState('');
  
  // Manual Service Form
  const [showManualForm, setShowManualForm] = useState(false);
  const [newService, setNewService] = useState<Partial<SMMService>>({
      platform: ServiceType.INSTAGRAM,
      category: 'Followers',
      min: 100,
      max: 10000
  });

  // --- TICKET STATE ---
  const [adminReply, setAdminReply] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Stats Calculation
  const stats = [
    { label: 'Total Services', value: state.services.length.toString(), icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Total Users', value: '5', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' }, // Real count requires separate query
    { label: 'Total Revenue', value: `$0.00`, icon: CreditCard, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Open Tickets', value: '0', icon: MessageSquare, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ];

  // FETCH EXTERNAL API AND SAVE TO FIREBASE
  const handleSyncServices = async () => {
      if (!apiKey) {
          setSyncStatus("Error: API Key required");
          return;
      }
      setSyncStatus('Fetching from API...');
      
      try {
          // NOTE: Most SMM Panels block direct browser requests (CORS).
          // In production, this fetch should be done by a Cloud Function or Proxy.
          // For this demo, we assume the API allows CORS or you are using a proxy.
          
          const params = new URLSearchParams();
          params.append('key', apiKey);
          params.append('action', 'services');

          const response = await fetch(providerUrl, {
              method: 'POST',
              body: params
          });

          const data = await response.json();

          if (!Array.isArray(data)) {
              setSyncStatus('Error: Invalid response format from Provider');
              return;
          }

          setSyncStatus(`Found ${data.length} services. Saving to Database...`);

          // WRITE TO FIREBASE (Batching 500 at a time)
          const batch = writeBatch(db);
          
          data.forEach((item: any) => {
              const serviceRef = doc(db, "services", item.service.toString());
              
              // Map External API format to our Interface
              const newService: SMMService = {
                  id: Number(item.service),
                  name: item.name,
                  category: item.category,
                  rate: parseFloat((Number(item.rate) * (1 + profitMargin / 100)).toFixed(2)), // Apply Profit
                  min: Number(item.min),
                  max: Number(item.max),
                  platform: determinePlatform(item.category), // Helper function
                  source: `API: ${new URL(providerUrl).hostname}`
              };

              batch.set(serviceRef, newService);
          });

          await batch.commit();
          setSyncStatus('Success! Database updated.');

      } catch (error: any) {
          console.error(error);
          setSyncStatus(`Error: ${error.message}. (Check Console for CORS)`);
      }
  };

  const determinePlatform = (category: string): ServiceType => {
      const cat = category.toLowerCase();
      if (cat.includes('instagram')) return ServiceType.INSTAGRAM;
      if (cat.includes('tiktok')) return ServiceType.TIKTOK;
      if (cat.includes('youtube')) return ServiceType.YOUTUBE;
      if (cat.includes('twitter') || cat.includes('x ')) return ServiceType.TWITTER;
      if (cat.includes('facebook')) return ServiceType.FACEBOOK;
      return ServiceType.INSTAGRAM; // Default
  };

  const handleAddManualService = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newService.name || !newService.rate) return;

      const id = Math.floor(Math.random() * 100000);
      const service: SMMService = {
          id: id,
          platform: newService.platform as ServiceType,
          name: newService.name,
          rate: Number(newService.rate),
          min: Number(newService.min),
          max: Number(newService.max),
          category: newService.category || 'General',
          source: 'Manual'
      };

      // Save to Firebase
      await setDoc(doc(db, "services", id.toString()), service);
      
      setShowManualForm(false);
      setNewService({ platform: ServiceType.INSTAGRAM, category: 'Followers', min: 100, max: 10000 });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white">{t('adminPanel')}</h2>
        <p className="text-gray-400 mt-1">Overview of system performance and users.</p>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-800 mb-6 overflow-x-auto">
          {['overview', 'users', 'services', 'tickets'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 font-medium text-sm capitalize whitespace-nowrap ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                <div key={idx} className="bg-card border border-slate-800 p-6 rounded-xl flex items-center justify-between">
                    <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                    </div>
                </div>
                ))}
            </div>
          </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
          <div className="space-y-6">
              <div className="bg-card border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Search User</h3>
                  <p className="text-sm text-gray-500 mb-4">This feature requires Cloud Functions to search all Auth users securely.</p>
              </div>
          </div>
      )}

      {/* SERVICES TAB */}
      {activeTab === 'services' && (
          <div className="space-y-8">
              {/* API Import Section */}
              <div className="bg-card border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <LucideDownload className="text-primary" size={20} /> 
                      {t('importServices')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <input type="url" placeholder="Provider API URL (e.g. https://api.provider.com/v2)" className="bg-darker border border-slate-700 rounded-lg px-4 py-2 text-white" value={providerUrl} onChange={e => setProviderUrl(e.target.value)} />
                      <input type="password" placeholder="API Key" className="bg-darker border border-slate-700 rounded-lg px-4 py-2 text-white" value={apiKey} onChange={e => setApiKey(e.target.value)} />
                      <div className="flex gap-2">
                        <input type="number" placeholder="Margin %" className="bg-darker border border-slate-700 rounded-lg px-4 py-2 text-white w-24" value={profitMargin} onChange={e => setProfitMargin(Number(e.target.value))} />
                        <button onClick={handleSyncServices} className="flex-1 bg-primary hover:bg-secondary text-white rounded-lg font-medium">{t('syncServices')}</button>
                      </div>
                  </div>
                  {syncStatus && <p className={`text-sm ${syncStatus.includes('Success') ? 'text-green-400' : 'text-yellow-400'}`}>{syncStatus}</p>}
                  <p className="text-xs text-gray-500 mt-2 bg-slate-900/50 p-2 rounded border border-slate-800">
                      Note: Fetching services from a browser might fail due to CORS errors if the provider does not allow it. The correct way is to use a backend proxy or Firebase Cloud Function to fetch this data.
                  </p>
              </div>

              {/* Service Management List */}
              <div className="bg-card border border-slate-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Service Management</h3>
                      <button onClick={() => setShowManualForm(!showManualForm)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                          <Plus size={16} /> Add Service Manually
                      </button>
                  </div>

                  {/* Manual Add Form */}
                  {showManualForm && (
                      <div className="mb-6 p-4 bg-darker border border-slate-700 rounded-lg animate-in slide-in-from-top-2">
                          <h4 className="text-white font-semibold mb-3">New Service Details</h4>
                          <form onSubmit={handleAddManualService} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <input required type="text" placeholder="Service Name" className="bg-card border border-slate-600 rounded px-3 py-2 text-white" value={newService.name || ''} onChange={e => setNewService({...newService, name: e.target.value})} />
                              <select className="bg-card border border-slate-600 rounded px-3 py-2 text-white" value={newService.platform} onChange={e => setNewService({...newService, platform: e.target.value as ServiceType})}>
                                  {Object.values(ServiceType).map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                              <input required type="number" placeholder="Rate per 1000" step="0.01" className="bg-card border border-slate-600 rounded px-3 py-2 text-white" value={newService.rate || ''} onChange={e => setNewService({...newService, rate: Number(e.target.value)})} />
                              <input required type="number" placeholder="Min Quantity" className="bg-card border border-slate-600 rounded px-3 py-2 text-white" value={newService.min || ''} onChange={e => setNewService({...newService, min: Number(e.target.value)})} />
                              <input required type="number" placeholder="Max Quantity" className="bg-card border border-slate-600 rounded px-3 py-2 text-white" value={newService.max || ''} onChange={e => setNewService({...newService, max: Number(e.target.value)})} />
                              <input type="text" placeholder="Category" className="bg-card border border-slate-600 rounded px-3 py-2 text-white" value={newService.category || ''} onChange={e => setNewService({...newService, category: e.target.value})} />
                              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 md:col-span-3">Save Service</button>
                          </form>
                      </div>
                  )}

                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-400">
                          <thead className="bg-slate-800 text-gray-200 uppercase font-medium">
                              <tr>
                                  <th className="p-3">ID</th>
                                  <th className="p-3">Service Name</th>
                                  <th className="p-3">Source</th>
                                  <th className="p-3">Rate</th>
                                  <th className="p-3">Min/Max</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                              {state.services.length > 0 ? state.services.map(s => (
                                  <tr key={s.id} className="hover:bg-slate-800/30">
                                      <td className="p-3 font-mono text-xs">{s.id}</td>
                                      <td className="p-3 text-white">{s.name}</td>
                                      <td className="p-3">
                                          <span className={`px-2 py-1 rounded text-[10px] border ${
                                              s.source === 'Manual' 
                                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                                              : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                          }`}>
                                              {s.source || 'Unknown'}
                                          </span>
                                      </td>
                                      <td className="p-3">${s.rate.toFixed(2)}</td>
                                      <td className="p-3">{s.min} / {s.max}</td>
                                  </tr>
                              )) : (
                                  <tr><td colSpan={5} className="p-4 text-center">No services in database. Try importing them.</td></tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;