import React, { useState, useContext, useMemo, useEffect } from 'react';
import { LanguageContext, UserContext } from '../App';
import { PlatformOption, CategoryOption, ServiceOption } from '../types';
import { Video, Instagram, Youtube, Ghost, Facebook, Send, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';

const NewOrder: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const { dispatch } = useContext(UserContext);

  // --- HARDCODED DATA STRUCTURE (User can edit this part) ---
  // Structure: Platforms -> Categories -> Services
  const platformsData: PlatformOption[] = [
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Video,
      categories: [
        {
          id: 'tt_views',
          name: 'Views',
          services: [
            { 
              id: '101', 
              name: 'TikTok Video Views [Refill Enabled + LifeTime] - $1', 
              rate: 1.00, 
              min: 40, 
              max: 1000000, 
              description: `Always Can be Refilled 
              Instant start time 
               Refill Enables 
               Best for viral boosting 
                Cancel anytime.` 
            },
            { 
              id: '102', 
              name: 'TikTok Video Views [Refill Enabled + very fast ] - $0.50', 
              rate: 0.50, 
              min: 100, 
              max: 1000000, 
              description: `
              Cancel Enabled
               Non Drop 
              instant start.` 
            },
            { 
              id: '103', 
              name: 'TikTok Video Views [No Refill + Cancel Enabled] - $0.8', 
              rate: 0.8, 
              min: 40, 
              max: 1000000, 
              description: ` 
⚠Note:
📌 Check the link format carefully before placing the order.
🔓 Kindly make sure your account is public, Not private.
📌 When the service is busy, the starting speed of the operation changes.
📌 Do not place a second order on the same link before your order is completed in the system.`
            },
            { 
              id: '104', 
              name: 'TikTok Live Stream Views [15 min] - $1', 
              rate: 1, 
              min: 50, 
              max: 100000, 
              description: ` 
⚠Note:
Check the link format carefully before placing the order.
Kindly make sure your account is public, Not private.
Support at the Live stream for 15 minutes.
Average Time to start: 0-22 minutes.
              `
            },
              { 
              id: '105', 
              name: 'TikTok Live Stream Views [30 min] - $1.2', 
              rate: 1.2, 
              min: 50, 
              max: 100000, 
              description: ` 
⚠Note:
Check the link format carefully before placing the order.
Kindly make sure your account is public, Not private.
Support at the Live stream for 30 minutes.
Average Time to start: 0-30 minutes.
              `
            },
              { 
              id: '106', 
              name: 'TikTok Live Stream Views [60 min] - $2.1', 
              rate: 2.1, 
              min: 50, 
              max: 100000, 
              description: ` 
⚠Note:
Check the link format carefully before placing the order.
Kindly make sure your account is public, Not private.
Support at the Live stream for 60 minutes.
Average Time to start: 0-50 minutes.
              `
            },
            { 
              id: '107', 
              name: 'TikTok Live Stream Views [100% Arab + 15 min] - $4', 
              rate: 4, 
              min: 100, 
              max: 50000, 
              description: ` 
⚠Note:
Please send screenshot if you claim order was not delivered.
Check the link format carefully before placing the order.
Kindly make sure your account is public, Not private.
Support at the Live stream for 15 minutes.
Average Time to start: 0-22 minutes.
No Refill
Super Fast Delivery
              `
            },         
          ]
        },
        {
          id: 'tt_likes',
          name: 'Likes',
          services: [
            { 
              id: '108', 
              name: 'TikTok Likes [Fast + Non-Drop] - $1', 
              rate: 1, 
              min: 10, 
              max: 500000, 
              description: `
              Real And Bot Likes.
              Instant Start.
              High Retention.
              Cancel Anytime.
              No Refill.` 
            },
              { 
              id: '109', 
              name: 'TikTok Likes [Real + ReFill] - $1.30', 
              rate: 1.30, 
              min: 10, 
              max: 500000, 
              description: `
              Real Likes (From all the world).
              Instant Start.
              High Retention.
              Cancel Anytime.
              one month Refill.
              EveryDay Checking for drop.
              Average Time Delivery: 0-200 minutes.` 
            },
              { 
              id: '110', 
              name: 'TikTok Power Likes [All Real] - $2.30', 
              rate: 2.30, 
              min: 5, 
              max: 500000, 
              description: `
              Real Likes (From all the world) .
              Instant Start.
              High Retention.
              Cancel Anytime.
              one month Refill.
              EveryDay Checking for drop.
              Average Time Delivery: 0-300 minutes.` 
            },
              { 
              id: '111', 
              name: 'TikTok Power Likes [Arab Accounts] - $1.30', 
              rate: 1.30, 
              min: 10, 
              max: 300000, 
              description: `
              Real Likes (From Arab countries).
              Instant Start.
              High Retention.
              Cancel Anytime.
              one month Refill.
              EveryDay Checking for drop.
              Average Time Delivery: 0-40 minutes.` 
            },
          ]
        },
        {
          id: 'tt_followers',
          name: 'Followers',
          services: [
            { 
              id: '112', 
              name: 'TikTok Real Followers [No Refill] - $4.5', 
              rate: 4.5, 
              min: 100, 
              max: 100000, 
              description: `
              Very Low Drop.
              Real Followers.
              Instant Start.
              No Refill.
              ` 
            },
              { 
              id: '113', 
              name: 'TikTok Followers [Bot and Real Followers ] - $2.5', 
              rate: 2.5, 
              min: 50, 
              max: 100000, 
              description: `
              Very Low Drop.
              Instant Start.
              15days refill.
              EveryDay Checking for drop.
              Average Strat time : 0-15 min.
              ` 
            },
             { 
              id: '114', 
              name: 'TikTok Real Followers [Saudi Arabia Followers ] - $8.5', 
              rate: 8.5, 
              min: 10, 
              max: 100000, 
              description: `
              Very Low Drop.
              Real Saudi Followers.
              High Quality.
              Instant Start.
              No Refill.
              Average Strat time : 0-40 min.
              ` 
            },
              { 
              id: '115', 
              name: 'TikTok Real Followers [Refilled ] - $2', 
              rate: 2, 
              min: 50, 
              max: 100000, 
              description: `
                 Real & Bot Followers.
                 Low Low Drop.
                 Speed: 10K/Day.
                 Refill button: Active.
                 EveryDay Checking for drop.
                 365 Day Refill.` 
            },
          ]
        },
        {
          id: 'tt_saves',
          name: 'Saves',
          services: [
            { 
              id: '116', 
              name: 'TikTok Saves [No Refill] - $0.5', 
              rate: 0.5, 
              min: 10, 
              max: 100000, 
              description: `⌛Start: 0-30Min.
⚡Speed: 10K/Day.
♻️Refill: No Refill.` 
            }
          ]
        },
        {
          id: 'tt_shares',
          name: 'Shares',
          services: [
            { 
              id: '117', 
              name: 'TikTok Shares [Super Fast+ no refill] - $1', 
              rate: 1, 
              min: 10, 
              max: 100000, 
              description: `⌛Start: 0-30Min.
⚡Speed: 10K/Day.
♻️Refill: No Refill.`
            },
              { 
              id: '118', 
              name: 'TikTok Shares [Refill] - $1.5', 
              rate: 1.5, 
              min: 10, 
              max: 100000, 
              description: `⌛Start: 0-30Min.
                          EveryDay Checking for drop.
                          ♻️Refill: one Year.
⚡Speed: 10K/Day.`
            },
          ]
        },
      ]
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      categories: [
        {
          id: 'ig_followers',
          name: 'Followers',
          services: [
             { 
              id: '201', 
              name: 'Instagram Followers [Mixed] - $3.50', 
              rate: 3.50, 
              min: 50, 
              max: 100000, 
              description: 'Mixed global profiles. Start 0-1 hr.' 
            },
             { 
              id: '202', 
              name: 'Instagram Followers [Premium] - $8.00', 
              rate: 8.00, 
              min: 50, 
              max: 50000, 
              description: 'Premium profiles with photos and bio. Stable.' 
            }
          ]
        },
        {
          id: 'ig_likes',
          name: 'Likes',
          services: [
             { 
              id: '203', 
              name: 'Instagram Likes [Real] - $0.80', 
              rate: 0.80, 
              min: 50, 
              max: 50000, 
              description: 'Real likes. Instant start.' 
            }
          ]
        }
      ]
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      categories: [
        {
          id: 'yt_subs',
          name: 'Subscribers',
          services: [
            { 
              id: '301', 
              name: 'YouTube Subscribers [Non-Drop] - $12.00', 
              rate: 12.00, 
              min: 50, 
              max: 5000, 
              description: 'Life time guarantee. Slow speed.' 
            }
          ]
        },
        {
          id: 'yt_views',
          name: 'Views',
          services: [
            { 
              id: '302', 
              name: 'YouTube Views [HR] - $2.50', 
              rate: 2.50, 
              min: 500, 
              max: 1000000, 
              description: 'High Retention views. Good for watch time.' 
            }
          ]
        }
      ]
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      icon: Ghost,
      categories: [
          {
            id: 'sn_views',
            name: 'Story Views',
            services: [
                 { id: '401', name: 'Snapchat Story Views - $1.50', rate: 1.50, min: 1000, max: 1000000, description: 'Public stories only.' }
            ]
          }
      ]
    }
  ];

  // State
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [success, setSuccess] = useState(false);

  // Helpers to get objects based on ID
  const selectedPlatform = useMemo(() => 
    platformsData.find(p => p.id === selectedPlatformId), 
  [selectedPlatformId]);

  const selectedCategory = useMemo(() => 
    selectedPlatform?.categories.find(c => c.id === selectedCategoryId), 
  [selectedPlatform, selectedCategoryId]);

  const selectedService = useMemo(() => 
    selectedCategory?.services.find(s => s.id === selectedServiceId), 
  [selectedCategory, selectedServiceId]);

  // Reset logic
  useEffect(() => {
    // When platform changes, reset category and service
    setSelectedCategoryId('');
    setSelectedServiceId('');
  }, [selectedPlatformId]);

  useEffect(() => {
    // When category changes, reset service
    setSelectedServiceId('');
  }, [selectedCategoryId]);

  // Calculations
  const charge = useMemo(() => {
    if (!quantity || !selectedService) return 0;
    return (Number(quantity) * selectedService.rate) / 1000;
  }, [quantity, selectedService]);

  const handleSubmit = () => {
    if (!link || !quantity || !selectedService) return;
    if (Number(quantity) < selectedService.min || Number(quantity) > selectedService.max) return;

    setSuccess(true);
    
    // In a real app, you would dispatch an API call here
    setTimeout(() => {
        setSuccess(false);
        setLink('');
        setQuantity('');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Page Title */}
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold text-white mb-2">{t('placeNewOrder')}</h2>
        <p className="text-slate-400">{t('checkPricing')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: The Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
            
            {/* 1. Platform Select */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-medium text-slate-300">{t('selectPlatform')}</label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  value={selectedPlatformId}
                  onChange={(e) => setSelectedPlatformId(e.target.value)}
                >
                  <option value="">-- Select Platform --</option>
                  {platformsData.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
              </div>
            </div>

            {/* 2. Category Select */}
            <div className={`space-y-2 mb-6 transition-all duration-300 ${!selectedPlatformId ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <label className="block text-sm font-medium text-slate-300">{t('selectCategory')}</label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  <option value="">-- Select Category --</option>
                  {selectedPlatform?.categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
              </div>
            </div>

            {/* 3. Service Select */}
            <div className={`space-y-2 mb-6 transition-all duration-300 ${!selectedCategoryId ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <label className="block text-sm font-medium text-slate-300">{t('selectService')}</label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                >
                  <option value="">-- Select Service --</option>
                  {selectedCategory?.services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Link Input */}
            <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-slate-300">{t('link')}</label>
                <input 
                  type="text" 
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
            </div>

            {/* Quantity Input */}
            <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-slate-300">{t('quantity')}</label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
                {selectedService && quantity !== '' && (Number(quantity) < selectedService.min || Number(quantity) > selectedService.max) && (
                   <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle size={12} />
                      Must be between {selectedService.min} and {selectedService.max}
                   </p>
                )}
            </div>

            {/* Charge Display */}
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center mb-6">
                <span className="text-slate-400 font-medium">{t('charge')}</span>
                <span className="text-2xl font-bold text-indigo-400">${charge.toFixed(2)}</span>
            </div>

            {/* Submit Button */}
            <button 
                onClick={handleSubmit}
                disabled={!selectedService || !link || !quantity || Number(quantity) < (selectedService?.min || 0) || Number(quantity) > (selectedService?.max || 0)}
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-lg shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {success ? <CheckCircle2 size={24} /> : null}
                {success ? t('orderSuccess') : t('submitOrder')}
            </button>
          </div>
        </div>

        {/* Right Column: Information & Description */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Service Info Boxes (Min/Max) */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-card border border-slate-800 p-4 rounded-xl text-center">
                 <p className="text-slate-400 text-xs uppercase font-bold mb-1">{t('minAmount')}</p>
                 <p className="text-xl font-bold text-white">{selectedService ? selectedService.min.toLocaleString() : '-'}</p>
             </div>
             <div className="bg-card border border-slate-800 p-4 rounded-xl text-center">
                 <p className="text-slate-400 text-xs uppercase font-bold mb-1">{t('maxAmount')}</p>
                 <p className="text-xl font-bold text-white">{selectedService ? selectedService.max.toLocaleString() : '-'}</p>
             </div>
          </div>

          {/* Description Box */}
          <div className="bg-card border border-slate-800 rounded-xl p-6 h-fit">
             <div className="flex items-center gap-2 mb-4 text-indigo-400">
                <AlertCircle size={20} />
                <h3 className="font-bold text-white">{t('description')}</h3>
             </div>
             <div className="bg-slate-900/50 rounded-lg p-4 text-sm text-slate-300 leading-relaxed border border-slate-800/50 min-h-[150px]">
               {selectedService ? selectedService.description : t('selectToView')}
             </div>
             
             {/* Dynamic Warning/Tip based on service */}
             <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500">
                    Make sure your account is public before placing the order. Private accounts cannot receive followers or likes.
                </p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewOrder;