'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plant, Eye, EyeSlash, Globe, ArrowRight } from '@phosphor-icons/react';

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Error state
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  // Translations
  const t = {
    bn: {
      title: 'স্বাগতম',
      subtitle: 'আপনার অ্যাকাউন্টে লগইন করুন',
      email: 'ইমেইল',
      emailPlaceholder: 'আপনার ইমেইল ঠিকানা',
      password: 'পাসওয়ার্ড',
      passwordPlaceholder: 'আপনার পাসওয়ার্ড',
      forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
      submit: 'লগইন করুন',
      noAccount: 'নতুন ব্যবহারকারী?',
      register: 'নিবন্ধন করুন',
      orContinue: 'অথবা',
      demoAccount: 'ডেমো অ্যাকাউন্ট ব্যবহার করুন',
      errors: {
        emailRequired: 'ইমেইল অবশ্যই প্রয়োজন',
        emailInvalid: 'সঠিক ইমেইল ঠিকানা লিখুন',
        passwordRequired: 'পাসওয়ার্ড অবশ্যই প্রয়োজন',
        invalidCredentials: 'ভুল ইমেইল বা পাসওয়ার্ড'
      }
    },
    en: {
      title: 'Welcome Back',
      subtitle: 'Login to your account',
      email: 'Email',
      emailPlaceholder: 'Your email address',
      password: 'Password',
      passwordPlaceholder: 'Your password',
      forgotPassword: 'Forgot password?',
      submit: 'Login',
      noAccount: 'New user?',
      register: 'Register',
      orContinue: 'Or',
      demoAccount: 'Use demo account',
      errors: {
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email',
        passwordRequired: 'Password is required',
        invalidCredentials: 'Invalid email or password'
      }
    }
  };

  const text = t[lang];

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email.trim()) return text.errors.emailRequired;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return text.errors.emailInvalid;
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return text.errors.passwordRequired;
    return '';
  };

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '', general: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      general: ''
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setIsLoading(true);

    try {
      // Import auth utilities dynamically
      const { loginFarmer } = await import('@/lib/auth');
      
      // Login farmer
      const farmer = await loginFarmer(formData.email, formData.password);

      console.log('✅ Login successful!', {
        id: farmer.id,
        name: farmer.name,
        email: farmer.email,
        lastLogin: farmer.lastLogin
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Show error to user
      setErrors(prev => ({
        ...prev,
        general: text.errors.invalidCredentials
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Demo account login
  const handleDemoLogin = async () => {
    setFormData({
      email: 'demo@amarfoshol.com',
      password: 'demo123'
    });

    // Check if demo account exists, if not create it
    setIsLoading(true);
    try {
      const { loginFarmer, registerFarmer, getAllFarmers } = await import('@/lib/auth');
      
      const farmers = await getAllFarmers();
      const demoExists = farmers.some(f => f.email === 'demo@amarfoshol.com');

      if (!demoExists) {
        // Create demo account
        await registerFarmer({
          name: 'ডেমো ব্যবহারকারী',
          email: 'demo@amarfoshol.com',
          password: 'demo123',
          phone: '01700000000',
          language: 'bn'
        });
      }

      // Login with demo account
      await loginFarmer('demo@amarfoshol.com', 'demo123');
      router.push('/dashboard');
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <Plant size={20} weight="fill" />
            </div>
            <span className="font-bold text-xl text-emerald-900">আমার ফসল</span>
          </div>
          <button
            onClick={() => setLang(prev => prev === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-emerald-500 transition-colors text-sm font-medium"
          >
            <Globe size={14} weight="bold" />
            {lang === 'bn' ? 'EN' : 'BN'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="max-w-md mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {text.title}
            </h1>
            <p className="text-gray-600">{text.subtitle}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-5">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600 text-center font-medium">
                  {errors.general}
                </p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                {text.email} *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder={text.emailPlaceholder}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors`}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  {text.password} *
                </label>
                <button
                  type="button"
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {text.forgotPassword}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder={text.passwordPlaceholder}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20 mt-6"
            >
              {isLoading ? 'প্রক্রিয়াধীন...' : text.submit}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500 font-medium">
                {text.orContinue}
              </span>
            </div>
          </div>

          {/* Demo Account Button */}
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 hover:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>{text.demoAccount}</span>
            <ArrowRight size={18} weight="bold" />
          </button>

          {/* Register Link */}
          <p className="text-center mt-6 text-gray-600">
            {text.noAccount}{' '}
            <a href="/register" className="text-emerald-600 font-semibold hover:text-emerald-700">
              {text.register}
            </a>
          </p>

          {/* Back to Home */}
          <div className="text-center mt-4">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← {lang === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
            </a>
          </div>
        </div>
      </main>

      {/* Background decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-emerald-50 to-transparent pointer-events-none -z-10"></div>
    </div>
  );
}