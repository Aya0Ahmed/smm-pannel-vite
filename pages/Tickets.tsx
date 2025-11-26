import React, { useContext, useState } from 'react';
import { UserContext, LanguageContext } from '../App';
import { MessageSquare, Plus, Send, User, Shield } from 'lucide-react';
import { Ticket } from '../types';

const Tickets: React.FC = () => {
  const { state, dispatch } = useContext(UserContext);
  const { t } = useContext(LanguageContext);
  
  const [view, setView] = useState<'list' | 'new' | 'detail'>('list');
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  // New Ticket Form State
  const [subject, setSubject] = useState('');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  
  // Reply State
  const [reply, setReply] = useState('');

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    const newTicket: Ticket = {
        id: Math.random().toString(36).substr(2, 9),
        subject,
        orderId,
        status: 'Open',
        lastUpdated: new Date().toLocaleString(),
        messages: [
            { sender: 'user', text: message, date: new Date().toLocaleString() }
        ]
    };

    dispatch({ type: 'ADD_TICKET', payload: newTicket });
    setView('list');
    setSubject('');
    setOrderId('');
    setMessage('');
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply || !activeTicket) return;

    dispatch({ 
        type: 'REPLY_TICKET', 
        payload: { ticketId: activeTicket.id, message: reply, sender: 'user' } 
    });
    
    // Update local active ticket view immediately
    const updatedTicket = {
        ...activeTicket,
        messages: [...activeTicket.messages, { sender: 'user', text: reply, date: new Date().toLocaleString() } as any]
    };
    setActiveTicket(updatedTicket);
    setReply('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold text-white">{t('supportTickets')}</h2>
            <p className="text-gray-400 mt-1">Track your requests and issues.</p>
        </div>
        {view === 'list' && (
            <button 
                onClick={() => setView('new')}
                className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
                <Plus size={20} /> {t('openNewTicket')}
            </button>
        )}
        {view !== 'list' && (
            <button 
                onClick={() => setView('list')}
                className="text-gray-400 hover:text-white"
            >
                &larr; Back to List
            </button>
        )}
      </div>

      {/* Ticket List View */}
      {view === 'list' && (
        <div className="bg-card border border-slate-800 rounded-xl overflow-hidden">
             {state.tickets.length === 0 ? (
                 <div className="p-12 text-center text-gray-500">
                     <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                     <p>{t('noTickets')}</p>
                 </div>
             ) : (
                 <div className="divide-y divide-slate-800">
                     {state.tickets.map(ticket => (
                         <div 
                            key={ticket.id} 
                            onClick={() => { setActiveTicket(ticket); setView('detail'); }}
                            className="p-4 hover:bg-slate-800/50 cursor-pointer transition-colors flex items-center justify-between"
                         >
                             <div>
                                 <h3 className="font-semibold text-white">{ticket.subject}</h3>
                                 <p className="text-xs text-gray-500 mt-1">ID: {ticket.id} • {t('lastUpdated')}: {ticket.lastUpdated}</p>
                             </div>
                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                 ticket.status === 'Open' ? 'bg-green-500/10 text-green-400' : 
                                 ticket.status === 'Answered' ? 'bg-yellow-500/10 text-yellow-400' : 
                                 'bg-gray-500/10 text-gray-400'
                             }`}>
                                 {ticket.status}
                             </span>
                         </div>
                     ))}
                 </div>
             )}
        </div>
      )}

      {/* New Ticket View */}
      {view === 'new' && (
        <div className="bg-card border border-slate-800 rounded-xl p-6 max-w-2xl">
            <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('subject')}</label>
                    <div className="relative">
                         <select 
                            className="w-full bg-darker border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-primary appearance-none"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                         >
                            <option value="" disabled>Select a subject...</option>
                            <option value="Order Issue">Order Issue (Refill/Cancel)</option>
                            <option value="Payment">Payment / Funds</option>
                            <option value="Service Question">Service Question</option>
                            <option value="Other">Other</option>
                         </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('orderIdOptional')}</label>
                    <input 
                        type="text"
                        className="w-full bg-darker border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-primary"
                        placeholder="e.g. 8821"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('message')}</label>
                    <textarea 
                        className="w-full bg-darker border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-primary h-32 resize-none"
                        placeholder="Describe your issue..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>
                <button 
                    type="submit"
                    className="bg-primary hover:bg-secondary text-white font-bold py-3 px-6 rounded-lg transition-colors w-full md:w-auto"
                >
                    {t('submitTicket')}
                </button>
            </form>
        </div>
      )}

      {/* Detail View (Chat) */}
      {view === 'detail' && activeTicket && (
        <div className="flex flex-col h-[600px] bg-card border border-slate-800 rounded-xl overflow-hidden">
             {/* Header */}
             <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                 <h3 className="font-bold text-white text-lg">{activeTicket.subject}</h3>
                 <p className="text-xs text-gray-400">Order ID: {activeTicket.orderId || 'N/A'}</p>
             </div>

             {/* Messages */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {activeTicket.messages.map((msg, idx) => (
                     <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[80%] flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-primary' : 'bg-red-500'}`}>
                                 {msg.sender === 'user' ? <User size={16} /> : <Shield size={16} />}
                             </div>
                             <div className={`p-3 rounded-xl text-sm ${
                                 msg.sender === 'user' 
                                 ? 'bg-primary/20 text-white border border-primary/50 rounded-tr-none' 
                                 : 'bg-slate-800 text-gray-200 border border-slate-700 rounded-tl-none'
                             }`}>
                                 <p>{msg.text}</p>
                                 <p className="text-[10px] opacity-50 mt-1 text-right">{msg.date}</p>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>

             {/* Input */}
             <form onSubmit={handleReply} className="p-4 bg-slate-900/50 border-t border-slate-800 flex gap-2">
                 <input 
                    type="text"
                    className="flex-1 bg-darker border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
                    placeholder={t('typeMessage')}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                 />
                 <button 
                    type="submit"
                    disabled={!reply}
                    className="bg-primary hover:bg-secondary disabled:opacity-50 text-white p-3 rounded-lg transition-colors"
                 >
                     <Send size={20} />
                 </button>
             </form>
        </div>
      )}
    </div>
  );
};

export default Tickets;