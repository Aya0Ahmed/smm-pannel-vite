import React, { useContext } from 'react';
import { UserContext, LanguageContext } from '../App';
import { TrendingUp, ShoppingBag, DollarSign, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard: React.FC = () => {
  const { state } = useContext(UserContext);
  const { t, dir } = useContext(LanguageContext);

  // Mock data for the chart
  const data = [
    { name: 'TikTok', orders: 10 },
    { name: 'Instagram', orders: 7 },
    { name: 'Snapchat', orders: 5 },
    { name: 'Youtube', orders: 1 },
  ];

  const stats = [
    { label: t('totalSpent'), value: `$${state.spent.toFixed(2)}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: t('activeOrders'), value: state.orders.filter(o => o.status !== 'Completed').length.toString(), icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: t('totalOrders'), value: state.orders.length.toString(), icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: t('pending'), value: state.orders.filter(o => o.status === 'Pending').length.toString(), icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white">{t('dashboard')}</h2>
        <p className="text-gray-400 mt-1">{t('welcomeBack')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-card border border-slate-800 p-6 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-card border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">{t('Mostorderedservices')}</h3>
          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{fill: '#334155', opacity: 0.4}}
                />
                <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">{t('recentOrders')}</h3>
          <div className="space-y-4">
            {state.orders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">{t('noOrders')}</p>
            ) : (
              state.orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-darker rounded-lg border border-slate-800">
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{order.serviceName}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'Processing' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;