import React, { useContext } from 'react';
import { LanguageContext } from '../App';
import { 
  Instagram, 
  Youtube, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Globe, 
  Video, 
  Ghost, 
  Zap,
  ArrowRight
} from 'lucide-react';

const Services: React.FC = () => {
  const { t } = useContext(LanguageContext);

  const servicess = [
    { 
      id: t('tiktok'), 
      title: t('tiktokviews'), 
      icon: Video, 
      color: 'text-pink-500', 
      bg: 'bg-pink-500/10',
      price: '$1.99',
      gradient: 'group-hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.3)]'
    },
    { 
      id: t('instagram'), 
      title: t('instagramfollowers'), 
      icon: Instagram, 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10',
      price: '$4.99',
      gradient: 'group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]'
    },
    { 
      id: t('snapchat'), 
      title: t('snapchatads'), 
      icon: Ghost, 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-400/10',
      price: '$9.99',
      gradient: 'group-hover:shadow-[0_0_30px_-5px_rgba(250,204,21,0.3)]'
    },
    { 
      id: t('Youtube'), 
      title: t('youtubesubscribers'), 
      icon: Youtube, 
      color: 'text-red-500', 
      bg: 'bg-red-500/10',
      price: '$12.99',
      gradient: 'group-hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]'
    },
    { 
      id: t('facebook'), 
      title: t('facebooklikes'), 
      icon: Facebook, 
      color: 'text-blue-600', 
      bg: 'bg-blue-600/10',
      price: '$2.99',
      gradient: 'group-hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.3)]'
    },
    { 
      id: t('twitter'), 
      title: t('twitterfollowers'), 
      icon: Twitter, 
      color: 'text-sky-400', 
      bg: 'bg-sky-400/10',
      price: '$3.99',
      gradient: 'group-hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.3)]'
    },
    { 
      id: t('linkedin'), 
      title: t('linkedinconnections'), 
      icon: Linkedin, 
      color: 'text-blue-700', 
      bg: 'bg-blue-700/10',
      price: '$15.99',
      gradient: 'group-hover:shadow-[0_0_30px_-5px_rgba(29,78,216,0.3)]'
    },
    { 
      id: t('traffic'), 
      title: t('websitetraffic'), 
      icon: Globe, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10',
      price: '$0.99',
      gradient: 'group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-400">
               <Zap size={28} />
            </div>
            {t('mostWanted')}
          </h2>
          <p className="text-gray-400 mt-2 text-lg max-w-2xl leading-relaxed">
            {t('explorePopular')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {servicess.map((services) => (
          <div 
            key={services.id} 
            className={`group relative bg-card border border-slate-800 p-6 rounded-2xl hover:border-slate-600 hover:bg-slate-800/80 transition-all duration-300 cursor-pointer overflow-hidden ${services.gradient}`}
          >
            {/* Background Glow */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 ${services.bg.replace('/10', '')}`} />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-xl ${services.bg} ${services.color} group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/5`}>
                  <services.icon size={32} strokeWidth={1.5} />
                </div>
                <div className="bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-300 border border-slate-700/50 shadow-sm">
                  {t('popular')}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {services.title}
              </h3>
              
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-700/50">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">{t('startFrom')}</span>
                  <span className="font-bold text-white text-lg">{services.price}</span>
                </div>
                <button className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 group-hover:rotate-[-45deg] rtl:group-hover:rotate-45">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
