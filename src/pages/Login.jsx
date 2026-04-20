import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register, verifyEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (needsVerification) {
        console.log('CALLING VERIFICATION API', { email, verificationCode });
        // Handle verification
        const res = await verifyEmail(email, verificationCode);
        setSuccess(res.message);
        setNeedsVerification(false);
        setIsLogin(true);
        setPassword('');
        setVerificationCode('');
      } else if (isLogin) {
        await login(email, password);
        navigate('/');
      } else {
        const res = await register(name, email, password);
        if (res.requiresVerification) {
          setNeedsVerification(true);
          setSuccess(res.message);
        } else {
          setSuccess(res.message || 'Account created! Please login.');
          setIsLogin(true);
          setPassword('');
        }
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);
      setError(err.response?.data?.message || 'Authentication failed.');
      if (err.response?.data?.requiresVerification) {
        setNeedsVerification(true);
        setSuccess('Please verify your email first.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-[5%] relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-orange-600/15 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[150px]"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#111] p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative z-10"
      >
        <div className="mb-10">
          <h2 className="text-4xl font-black mb-2 italic tracking-tight">
            {needsVerification ? 'VERIFY EMAIL' : isLogin ? 'WELCOME BACK' : 'JOIN THE FEAST'}
          </h2>
          <p className="text-gray-500 uppercase tracking-widest text-sm">
            {needsVerification ? 'Enter the code sent to your email' : isLogin ? 'Enter your credentials' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Verification Code field */}
          {needsVerification ? (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">
                Verification Code
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-center text-2xl font-mono focus:border-orange-500 outline-none transition-all tracking-[1em]"
                  placeholder="------"
                  maxLength={6}
                  required
                />
              </div>
            </motion.div>
          ) : (
            <>
              {/* Name field (register only) */}
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 focus:border-orange-500 outline-none transition-all"
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              {/* Email field */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 focus:border-orange-500 outline-none transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 focus:border-orange-500 outline-none transition-all"
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Error message */}
          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-red-500 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20"
            >
              {error}
            </motion.p>
          )}

          {/* Success message */}
          {success && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-green-500 text-sm bg-green-500/10 p-3 rounded-xl border border-green-500/20"
            >
              {success}
            </motion.p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition-all shadow-[0_10px_30px_rgba(249,115,22,0.3)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </span>
            ) : (
              needsVerification ? 'VERIFY' : isLogin ? 'LOGIN' : 'CREATE ACCOUNT'
            )}
          </button>
        </form>

        {!needsVerification && (
          <p className="text-center mt-8 text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
              className="text-orange-500 font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
