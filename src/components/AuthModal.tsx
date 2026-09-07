import React, { useState } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { useAuth } from '../context/AuthContext';
import {
  X, Lock, Mail, Phone, User, Shield, AlertCircle, CheckCircle,
  Eye, EyeOff, MessageSquare, Send, Smartphone, Sparkles, RefreshCw, KeyRound
} from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshLocations';

export const AuthModal: React.FC = () => {
  const { isBn } = useTranslation();
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    loginWithOtp,
    sendOtp,
    register
  } = useAuth();

  // Login Mode Tab: 'otp' | 'password'
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');

  // OTP Login States
  const [otpPhone, setOtpPhone] = useState('01813817167');
  const [otpChannel, setOtpChannel] = useState<'sms' | 'whatsapp'>('whatsapp');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [receivedOtp, setReceivedOtp] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Password Login States
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration States
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Noakhali');
  const [upazila, setUpazila] = useState('Companiganj');
  const [bloodGroup, setBloodGroup] = useState('O+');

  // Common States
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!showAuthModal) return null;

  const currentDistrictInfo = Object.values(BANGLADESH_DISTRICTS).find(
    (d) => d.name.toLowerCase() === district.toLowerCase()
  );

  // Start Countdown Timer
  const startCountdown = () => {
    setOtpCountdown(60);
    const interval = setInterval(() => {
      setOtpCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await sendOtp(otpPhone, otpChannel);
      setOtpSent(true);
      if (res.otp) {
        setReceivedOtp(res.otp);
      }
      setSuccessMsg(res.message || (isBn ? 'ওটিপি কোড সফলভাবে প্রেরণ করা হয়েছে' : 'OTP sent successfully'));
      startCountdown();
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP & Login
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithOtp(otpPhone, otpCode);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  // Handle Password-based Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ usernameOrEmail, password });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle User Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        fullName,
        phone: regPhone,
        email,
        password,
        district,
        upazila,
        bloodGroup
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSuccess(true);
  };

  // Quick Account Selectors
  const fillQuickOtpNumber = (phoneNum: string, channel: 'sms' | 'whatsapp' = 'whatsapp') => {
    setOtpPhone(phoneNum);
    setOtpChannel(channel);
    setOtpSent(false);
    setOtpCode('');
    setReceivedOtp(null);
    setError('');
  };

  const fillQuickCredentials = (userType: 'admin' | 'org' | 'user') => {
    if (userType === 'admin') {
      setUsernameOrEmail('01813817167');
      setPassword('M817167m@');
    } else if (userType === 'org') {
      setUsernameOrEmail('org_ananda');
      setPassword('User@123456');
    } else {
      setUsernameOrEmail('karim_khan');
      setPassword('User@123456');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-black shadow-lg shadow-emerald-900/30 text-white text-lg">
              A
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight flex items-center gap-1.5">
                <span>{isBn ? 'এসকাডো সমাজকল্যাণ পোর্টাল' : 'ASCADO Platform'}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {authModalMode === 'register' ? (isBn ? 'নিবন্ধন' : 'Register') : (isBn ? 'নিরাপদ লগইন' : 'Secure Login')}
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                {authModalMode === 'register'
                  ? (isBn ? 'নতুন সদস্য বা সংগঠনের অ্যাকাউন্ট তৈরি করুন' : 'Create a new citizen or organization account')
                  : (isBn ? 'মোবাইল ওটিপি বা পাসওয়ার্ড দিয়ে প্রবেশ করুন' : 'Sign in using Mobile OTP or Password')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowAuthModal(false);
              setError('');
              setSuccessMsg('');
            }}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-3 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Main Mode View */}
        {authModalMode === 'login' && (
          <div className="p-5 sm:p-6 space-y-4">
            {/* Method Tabs: Mobile OTP (Recommended) vs Password */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200 gap-1">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('otp');
                  setError('');
                  setSuccessMsg('');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition ${
                  loginMethod === 'otp'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? 'মোবাইল ওটিপি (SMS/WhatsApp)' : 'Mobile OTP Login'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('password');
                  setError('');
                  setSuccessMsg('');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition ${
                  loginMethod === 'password'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>{isBn ? 'পাসওয়ার্ড দিয়ে লগইন' : 'Password Login'}</span>
              </button>
            </div>

            {/* TAB 1: MOBILE OTP LOGIN */}
            {loginMethod === 'otp' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Quick Fill Super Admin Phone Badge */}
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      {isBn ? 'সুপার এডমিন দ্রুত লগইন:' : 'Super Admin Quick Login:'}
                    </span>
                    <span className="text-[10px] bg-emerald-200/70 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                      {isBn ? 'পাসওয়ার্ড লাগবে না' : 'No Password Needed'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => fillQuickOtpNumber('01813817167', 'whatsapp')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-sm"
                    >
                      <span>👑</span>
                      <span>01813817167 ({isBn ? 'সুপার এডমিন' : 'Super Admin'})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillQuickOtpNumber('01812000002', 'sms')}
                      className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-medium transition"
                    >
                      01812000002 ({isBn ? 'শাখা' : 'Branch'})
                    </button>
                  </div>
                </div>

                {!otpSent ? (
                  /* STEP 1: Enter Mobile Number & Select Channel */
                  <form onSubmit={handleSendOtp} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isBn ? 'মোবাইল নম্বর' : 'Mobile Number'}
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          required
                          value={otpPhone}
                          onChange={(e) => setOtpPhone(e.target.value)}
                          placeholder="018XXXXXXXX"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900 bg-white"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {isBn
                          ? 'সুপার এডমিন বা ব্যবহারকারীর ১১ ডিজিটের মোবাইল নম্বর লিখুন।'
                          : 'Enter your 11-digit registered mobile number.'}
                      </p>
                    </div>

                    {/* Delivery Channel Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isBn ? 'ওটিপি কোড পাঠানোর মাধ্যম' : 'OTP Channel'}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setOtpChannel('whatsapp')}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                            otpChannel === 'whatsapp'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          <span>WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOtpChannel('sms')}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                            otpChannel === 'sms'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                          <span>SMS</span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !otpPhone}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow-md transition disabled:opacity-50 text-xs flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span>{isBn ? 'কোড পাঠানো হচ্ছে...' : 'Sending OTP Code...'}</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>
                            {isBn
                              ? `${otpChannel === 'whatsapp' ? 'হোয়াটসঅ্যাপে' : 'এসএমএস-এ'} ওটিপি কোড পাঠান`
                              : `Send OTP via ${otpChannel.toUpperCase()}`}
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* STEP 2: Verify OTP */
                  <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                    {/* Simulated Instant Code Card */}
                    <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2 border border-slate-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{otpPhone}</span>
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded text-[10px] uppercase">
                          {otpChannel}
                        </span>
                      </div>

                      {receivedOtp && (
                        <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-slate-400">
                              {isBn ? 'প্রেরিত ওটিপি কোড:' : 'Generated OTP Code:'}
                            </div>
                            <div className="text-lg font-mono font-black text-emerald-400 tracking-widest">
                              {receivedOtp}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setOtpCode(receivedOtp)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-md transition shadow"
                          >
                            {isBn ? 'অটো-কোড পেস্ট করুন' : 'Auto Fill'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isBn ? '৬ সংখ্যার ওটিপি কোড লিখুন' : 'Enter 6-digit OTP Code'}
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="••••••"
                        autoFocus
                        className="w-full text-center tracking-[0.4em] text-lg font-mono font-bold py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpCode.length < 4}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow transition disabled:opacity-50 text-xs flex items-center justify-center gap-1.5"
                    >
                      {loading ? (
                        <span>{isBn ? 'যাচাই হচ্ছে...' : 'Verifying...'}</span>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>{isBn ? 'ওটিপি যাচাই করে প্রবেশ করুন' : 'Verify OTP & Sign In'}</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpCode('');
                        }}
                        className="text-slate-500 hover:text-slate-800 underline"
                      >
                        {isBn ? 'নম্বর পরিবর্তন করুন' : 'Change Number'}
                      </button>

                      {otpCountdown > 0 ? (
                        <span className="text-slate-400">
                          {isBn ? `পুনরায় কোড (${otpCountdown}s)` : `Resend in ${otpCountdown}s`}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendOtp()}
                          className="text-emerald-600 hover:underline font-bold"
                        >
                          {isBn ? 'পুনরায় ওটিপি পাঠান' : 'Resend OTP'}
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: USERNAME / PASSWORD LOGIN */}
            {loginMethod === 'password' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 animate-in fade-in duration-200">
                {/* Quick Fill Credentials Pills */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-600 mb-1.5">
                    {isBn ? 'দ্রুত টেস্ট ক্রেডেনশিয়াল:' : 'Quick Test Credentials:'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => fillQuickCredentials('admin')}
                      className="px-2 py-1 bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 rounded-md text-[11px] font-medium transition"
                    >
                      👑 Super Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => fillQuickCredentials('org')}
                      className="px-2 py-1 bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 rounded-md text-[11px] font-medium transition"
                    >
                      🏢 Org Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => fillQuickCredentials('user')}
                      className="px-2 py-1 bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 rounded-md text-[11px] font-medium transition"
                    >
                      👤 General User
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'ইউজারনেম / ইমেইল / মোবাইল' : 'Username / Email / Mobile'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      placeholder={isBn ? '01813817167 / ascahdoadmin' : '01813817167 / ascahdoadmin'}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      {isBn ? 'পাসওয়ার্ড' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('forgot')}
                      className="text-[11px] text-emerald-600 hover:underline"
                    >
                      {isBn ? 'ভুলে গেছেন?' : 'Forgot?'}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition p-0.5 rounded"
                      title={showPassword ? (isBn ? 'পাসওয়ার্ড লুকান' : 'Hide Password') : (isBn ? 'পাসওয়ার্ড দেখুন' : 'Show Password')}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow transition disabled:opacity-50 text-xs"
                >
                  {loading ? (isBn ? 'যাচাই হচ্ছে...' : 'Authenticating...') : (isBn ? 'লগইন করুন' : 'Sign In')}
                </button>
              </form>
            )}

            {/* Bottom Register Switcher */}
            <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
              {isBn ? 'নতুন নাগরিক বা সদস্য?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('register');
                  setError('');
                  setSuccessMsg('');
                }}
                className="font-bold text-emerald-600 hover:underline"
              >
                {isBn ? 'রেজিস্ট্রেশন করুন' : 'Create Account'}
              </button>
            </div>
          </div>
        )}

        {/* REGISTRATION VIEW */}
        {authModalMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-5 sm:p-6 space-y-3 max-h-[75vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isBn ? 'পূর্ণ নাম' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isBn ? 'যেমন: তানভির মাহমুদ' : 'e.g. Tanvir Mahmud'}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'মোবাইল নম্বর' : 'Phone'}
                </label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isBn ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isBn ? 'জেলা' : 'District'}
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    const found = Object.values(BANGLADESH_DISTRICTS).find(d => d.name === e.target.value);
                    if (found && found.upazilas.length > 0) setUpazila(found.upazilas[0]);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                >
                  {Object.values(BANGLADESH_DISTRICTS).map((d) => (
                    <option key={d.name} value={d.name}>
                      {isBn ? d.nameBn : d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isBn ? 'উপজেলা' : 'Upazila'}
                </label>
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                >
                  {(currentDistrictInfo?.upazilas || []).map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isBn ? 'পাসওয়ার্ড নির্ধারণ করুন' : 'Set Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition p-0.5 rounded"
                  title={showRegisterPassword ? (isBn ? 'পাসওয়ার্ড লুকান' : 'Hide Password') : (isBn ? 'পাসওয়ার্ড দেখুন' : 'Show Password')}
                  aria-label="Toggle password visibility"
                >
                  {showRegisterPassword ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow transition disabled:opacity-50 text-xs mt-2"
            >
              {loading ? (isBn ? 'নিবন্ধন হচ্ছে...' : 'Registering...') : (isBn ? 'অ্যাকাউন্ট তৈরি সম্পন্ন করুন' : 'Complete Registration')}
            </button>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              {isBn ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setError('');
                  setSuccessMsg('');
                }}
                className="font-bold text-emerald-600 hover:underline"
              >
                {isBn ? 'লগইন করুন' : 'Sign In'}
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {authModalMode === 'forgot' && (
          <div className="p-6 space-y-4">
            {resetSuccess ? (
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {isBn ? 'ওটিপি (OTP) কোড পাঠানো হয়েছে' : 'OTP Verification Sent'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isBn
                    ? 'আপনার মোবাইল নম্বরে ৬ ডিজিটের ভেরিফিকেশন কোড প্রেরণ করা হয়েছে।'
                    : 'A 6-digit password reset code has been dispatched to your mobile.'}
                </p>
                <button
                  onClick={() => {
                    setResetSuccess(false);
                    setAuthModalMode('login');
                  }}
                  className="w-full bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl"
                >
                  {isBn ? 'লগইনে ফিরে যান' : 'Back to Login'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-slate-600">
                  {isBn
                    ? 'আপনার নিবন্ধিত মোবাইল নম্বর বা ইমেইল লিখুন, আমরা পাসওয়ার্ড রিসেটের কোড পাঠাবো।'
                    : 'Enter your registered mobile or email to receive password reset OTP.'}
                </p>
                <input
                  type="text"
                  required
                  placeholder="01813817167 / email"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  {isBn ? 'ওটিপি কোড পাঠান' : 'Send Verification OTP'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="text-xs text-slate-500 hover:underline"
                  >
                    {isBn ? 'লগইনে ফিরে যান' : 'Back to Login'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
