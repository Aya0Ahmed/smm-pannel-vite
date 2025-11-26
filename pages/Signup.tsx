import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Loader2, AlertCircle } from 'lucide-react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
        // 1. Create User in Authentication
        const authInstance = getAuth();
        const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
        const user = userCredential.user;

        // 2. Create User Profile in Database
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: name,
            email: email,
            role: 'user', // Default role
            balance: 0.00,
            spent: 0.00,
            orders: [],
            tickets: [],
            createdAt: new Date().toISOString()
        });

        navigate('/dashboard');
    } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to sign up");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-darker px-4">
        <div className="mb-8 flex items-center gap-2 animate-in slide-in-from-top-5">
             <Zap className="text-primary" size={40} fill="currentColor" />
             <h1 className="text-4xl font-bold text-white">ATL3 TREND</h1>
        </div>
        
        <div className="w-full max-w-md bg-card border border-slate-800 p-8 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Create an account</h2>
            
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Full Name</label>
                    <input 
                        type="text" 
                        required
                        className="w-full bg-darker border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
                    <input 
                        type="email" 
                        required
                        className="w-full bg-darker border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="name@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
                    <input 
                        type="password" 
                        required
                        className="w-full bg-darker border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                    {loading && <Loader2 className="animate-spin" size={20}/>}
                    Sign Up
                </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-400">
                Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
            </div>
        </div>
    </div>
  );
};

export default Signup;