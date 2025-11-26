import React, { useContext, useState } from 'react';
import { UserContext, LanguageContext } from '../App';
import { PAYMENT_METHODS } from '../constants';
import { CreditCard, Bitcoin, Wallet, CheckCircle, Loader2, Smartphone } from 'lucide-react';

const AddFunds: React.FC = () => {
  const { dispatch } = useContext(UserContext);
  const { t } = useContext(LanguageContext);
  const [amount, setAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>(PAYMENT_METHODS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = () => {
    if (!amount || Number(amount) <= 0) return;
    
    setIsProcessing(true);
    setSuccess(false);

    // Simulate API Call
    setTimeout(() => {
        dispatch({ type: 'ADD_FUNDS', payload: Number(amount) });
        setIsProcessing(false);
        setSuccess(true);
        setAmount('');
        setTimeout(() => setSuccess(false), 3000);
    }, 2000);
  };

  const getIcon = (iconName: string) => {
    switch(iconName) {
        case 'Bitcoin': return <Bitcoin className="text-orange-500" />;
        case 'Wallet': return <Wallet className="text-blue-500" />;
        case 'Smartphone': return <Smartphone className="text-red-500" />;
        default: return <CreditCard className="text-primary" />;
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white">{t('addFunds')}</h2>
        <p className="text-gray-400 mt-1">{t('depositFunds')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment Methods Column */}
        <div className="md:col-span-1 space-y-3">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">{t('selectMethod')}</p>
            {PAYMENT_METHODS.map(method => (
                <button
                    key={method.id}
                    onClick={() => {
                        setSelectedMethod(method.id);
                        setSuccess(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        selectedMethod === method.id 
                        ? 'bg-primary/10 border-primary text-white' 
                        : 'bg-card border-slate-800 text-gray-400 hover:bg-slate-800'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {getIcon(method.icon)}
                        <span className="font-medium text-left">{method.name}</span>
                    </div>
                </button>
            ))}
        </div>

        {/* Payment Details Column */}
        <div className="md:col-span-2">
            <div className="bg-card border border-slate-800 rounded-xl p-6 md:p-8">
                <h3 className="text-xl font-semibold text-white mb-6">{t('depositAmount')}</h3>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</label>
                    <div className="relative">
                        <span className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
                        <input 
                            type="number" 
                            className="w-full bg-darker border border-slate-700 text-white rounded-lg pl-8 rtl:pr-8 rtl:pl-4 pr-4 py-4 text-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="10"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{t('minDeposit')}</p>
                </div>

                {selectedMethod === 'crypto' && (
                    <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-sm text-gray-300">
                        <p className="font-semibold text-white mb-1">Important:</p>
                        In a real Website, a QR code and wallet address would appear here.
                    </div>
                )}

                {selectedMethod === 'egypt_wallet' && (
                    <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-sm text-gray-300">
                         <p className="font-semibold text-white mb-1">Instructions:</p>
                         1. Send amount to <b>01064833131</b> (Any Wallet).<br/>
                         2. Send The ScreenShot of The Transaction to <b>01064833131</b>.<br/>
                         3. Wait for confirmation.<br/>
                         4. Funds will be added to your account.
                    </div>
                )}

                {success ? (
                    <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-4 rounded-lg flex items-center justify-center gap-2">
                        <CheckCircle size={24} />
                        <span className="font-bold">{t('fundsAdded')}</span>
                    </div>
                ) : (
                    <button 
                        onClick={handlePayment}
                        disabled={isProcessing || !amount}
                        className="w-full bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        {isProcessing && <Loader2 className="animate-spin" />}
                        {isProcessing ? t('processing') : t('payNow')}
                    </button>
                )}

                <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                   <span className="h-3 w-3 bg-green-500 rounded-full"></span> 
                   256-bit SSL Encrypted Payment
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AddFunds;