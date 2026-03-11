import React, { useState } from 'react';
import { ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || !otp) return;
    
    setIsSubmitting(true);
    await login(phoneNumber, otp);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-3xl mx-auto shadow-xl shadow-primary/20 mb-6">
            S
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Sugar Admin</h1>
          <p className="text-slate-400 font-medium">Authorized personnel only</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl backdrop-blur-xl space-y-6">
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <ShieldAlert className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Admin Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter 10-digit number"
                className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3.5 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Security Code (OTP)</label>
              <input
                type="password"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter generated code"
                className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3.5 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600 font-mono tracking-widest text-lg"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !phoneNumber || !otp}
            className="w-full bg-primary hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>
                Authenticate <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-8 font-medium">
          Sugar & Gold Internal Systems &copy; 2026
        </p>
      </div>
    </div>
  );
}
