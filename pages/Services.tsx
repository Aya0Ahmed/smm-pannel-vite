import React, { useState, useContext, useMemo } from 'react';
import { LanguageContext } from '../App';
import { Search, Video, Instagram, Youtube, Ghost, Facebook, Send } from 'lucide-react';
import { Service, PlatformCategory, ServiceItem } from '../types';

interface ServicesProps {
  onServiceClick: (service: Service) => void;
}

const Services: React.FC<ServicesProps> = ({ onServiceClick }) => {
  const { t } = useContext(LanguageContext);
  const [searchTerm, setSearchTerm] = useState('');

  // Define hardcoded data structure for services
  const platforms: PlatformCategory[] = [
    {
      id: 'tiktok',
      name: 'tiktok', // Key for translation
      icon: Video,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
      services: [
        { id: 'tt1', nameKey: 'tt_views', rate: 0.50, min: 50, max:  2147483647, type: 'Views' },
        { id: 'tt2', nameKey: 'tt_likes', rate: 2.30, min: 100, max: 50000, type: 'Likes' },
        { id: 'tt3', nameKey: 'tt_followers', rate: 5.99, min: 100, max: 20000, type: 'Followers' },
        { id: 'tt4', nameKey: 'tt_saves', rate: 1.20, min: 100, max: 100000, type: 'Saves' },
        { id: 'tt5', nameKey: 'tt_shares', rate: 1.50, min: 100, max: 100000, type: 'Shares' },

      ]
    },
    {
      id: 'instagram',
      name: 'instagram',
      icon: Instagram,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      services: [
        { id: 'ig1', nameKey: 'ig_followers', rate: 3.50, min: 50, max: 100000, type: 'Followers' },
        { id: 'ig2', nameKey: 'ig_likes', rate: 0.80, min: 50, max: 50000, type: 'Likes' },
        { id: 'ig3', nameKey: 'ig_views', rate: 0.40, min: 500, max: 10000000, type: 'Views' },
        { id: 'ig4', nameKey: 'ig_comments', rate: 15.00, min: 10, max: 1000, type: 'Comments' },
        { id: 'ig5', nameKey: 'ig_shares', rate: 15.00, min: 10, max: 1000, type: 'Shares' },

      ]
    },
    {
      id: 'youtube',
      name: 'youtube',
      icon: Youtube,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      services: [
        { id: 'yt1', nameKey: 'yt_subs', rate: 12.00, min: 50, max: 5000, type: 'Subscribers' },
        { id: 'yt2', nameKey: 'yt_views', rate: 2.50, min: 500, max: 1000000, type: 'Views' },
        { id: 'yt3', nameKey: 'yt_watchtime', rate: 35.00, min: 100, max: 4000, type: 'Watch Time' },
      ]
    },
    {
      id: 'snapchat',
      name: 'snapchat',
      icon: Ghost,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      services: [
        { id: 'sn1', nameKey: 'snap_views', rate: 1.50, min: 1000, max: 1000000, type: 'Views' },
        { id: 'sn2', nameKey: 'snap_score', rate: 5.00, min: 1000, max: 50000, type: 'Score' },
      ]
    },
    {
      id: 'facebook',
      name: 'facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bg: 'bg-blue-600/10',
      services: [
        { id: 'fb1', nameKey: 'fb_followers', rate: 4.50, min: 100, max: 100000, type: 'Followers' },
        { id: 'fb2', nameKey: 'fb_likes', rate: 3.00, min: 100, max: 50000, type: 'Likes' },
      ]
    },
    {
      id: 'telegram',
      name: 'telegram',
      icon: Send,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10',
      services: [
        { id: 'tg1', nameKey: 'tg_members', rate: 2.00, min: 100, max: 200000, type: 'Members' },
        { id: 'tg2', nameKey: 'tg_views', rate: 0.20, min: 500, max: 1000000, type: 'Views' },
      ]
    }
  ];

  // Helper to handle row click
  const handleRowClick = (platform: PlatformCategory, item: ServiceItem) => {
    // Construct the Service object required by the parent
    const serviceObj: Service = {
      id: item.id,
      title: t(item.nameKey),
      icon: platform.icon,
      color: platform.color,
      bg: platform.bg,
      price: `$${item.rate.toFixed(2)}`,
      gradient: ''
    };
    onServiceClick(serviceObj);
  };

  // Filter logic
  const filteredPlatforms = useMemo(() => {
    if (!searchTerm) return platforms;

    const term = searchTerm.toLowerCase();

    return platforms.map(platform => {
      // Check if platform name matches
      const platformNameMatch = t(platform.name).toLowerCase().includes(term);

      // Filter services
      const matchingServices = platform.services.filter(service => {
        const serviceName = t(service.nameKey).toLowerCase();
        const type = service.type.toLowerCase();
        return serviceName.includes(term) || type.includes(term);
      });

      // If platform matches, return all services. If not, return only matching services.
      if (platformNameMatch) return platform;
      
      return {
        ...platform,
        services: matchingServices
      };
    }).filter(p => p.services.length > 0); // Remove platforms with no matching services
  }, [searchTerm, t]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h2 className="text-3xl font-bold text-white">{t('services')}</h2>
            <p className="text-gray-400 mt-1">{t('checkPricing')}</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                className="pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-3 bg-card border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* Tables Loop */}
      {filteredPlatforms.length > 0 ? (
        filteredPlatforms.map((platform) => (
          <div key={platform.id} className="space-y-4">
            
            {/* Category Header */}
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${platform.bg} ${platform.color} ring-1 ring-white/5`}>
                <platform.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-200">
                {t(platform.name)}
              </h3>
            </div>

            {/* Table Card */}
            <div className="bg-card border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20">
              <div className="overflow-x-auto">
                  <table className="w-full text-left rtl:text-right border-collapse">
                      <thead>
                          <tr className="bg-slate-900/50 border-b border-slate-700/50 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                              <th className="p-4 w-16 text-center">{t('id')}</th>
                              <th className="p-4">{t('service')}</th>
                              <th className="p-4 w-32">{t('rate')}</th>
                              <th className="p-4 w-40">{t('minmax')}</th>
                              <th className="p-4 w-32">{t('category')}</th>
                          </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-slate-800/50">
                          {platform.services.map((service, index) => (
                              <tr 
                                key={service.id} 
                                onClick={() => handleRowClick(platform, service)}
                                className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                              >
                                  <td className="p-4 text-center">
                                    <span className="font-mono text-gray-500 text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                      {service.id}
                                    </span>
                                  </td>
                                  <td className="p-4 font-medium text-slate-200 group-hover:text-indigo-400 transition-colors">
                                    {t(service.nameKey)}
                                  </td>
                                  <td className="p-4">
                                    <span className="font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs">
                                      ${service.rate.toFixed(2)}
                                    </span>
                                  </td>
                                  <td className="p-4 text-gray-400 text-xs font-mono">
                                    {service.min.toLocaleString()} / {service.max.toLocaleString()}
                                  </td>
                                  <td className="p-4">
                                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${platform.bg} ${platform.color} border-white/5`}>
                                          {service.type}
                                      </span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-card border border-slate-800 rounded-xl border-dashed">
          <Search size={48} className="mb-4 opacity-20" />
          <p className="text-lg">{t('noServicesFound')} "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default Services;