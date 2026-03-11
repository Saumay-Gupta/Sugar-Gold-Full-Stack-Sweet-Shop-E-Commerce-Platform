import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader } from 'lucide-react';
import useStore from '../store/useStore';
import axios from 'axios';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, setUser } = useStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    // Mock sending OTP
    setStep(2);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        phoneNumber,
        otp
      });
      setUser(res.data.user);
      closeAuthModal();
      // Reset state for next open
      setStep(1);
      setPhoneNumber('');
      setOtp('');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-xl w-full max-w-md relative border border-primary/20"
        >
          <button 
            onClick={closeAuthModal} 
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {step === 1 ? 'Log in with your phone number' : `Enter the OTP sent to ${phoneNumber}`}
            </p>
            {error && <p className="text-red-500 text-sm mt-3 animate-pulse">{error}</p>}
          </div>

          {step === 1 ? (
            <form onSubmit={handlePhoneSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="flex">
                  <span className="bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 rounded-l-lg flex items-center text-slate-500 font-medium">
                    +91
                  </span>
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter 10-digit number"
                    className="flex-1 w-full bg-transparent border border-slate-300 dark:border-slate-700 px-4 py-3 rounded-r-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    autoFocus
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">One Time Password</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP (1234)"
                  className="w-full bg-transparent border border-slate-300 dark:border-slate-700 px-4 py-3 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-center tracking-[0.5em] text-xl"
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
              </button>
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-slate-500 hover:text-primary mt-4 text-center"
              >
                Change Phone Number
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-xs text-slate-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            <div className="mt-2 text-primary font-bold">Try mock OTP: 1234</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
