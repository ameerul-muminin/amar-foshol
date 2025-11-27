'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plant, Eye, EyeSlash, Globe } from '@phosphor-icons/react';

export default function RegisterPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    language: 'bn' as 'bn' | 'en'
  });

  // Error state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  // Translations
  const t = {
    bn: {
      title: 'নিবন্ধন করুন',
      subtitle: 'আমার ফসল পরিবারে যোগ দিন',
      name: 'নাম',
      namePlaceholder: 'আপনার পুরো নাম লিখুন',
      email: 'ইমেইল',
      emailPlaceholder: 'আপনার ইমেইল ঠিকানা',
      password: 'পাসওয়ার্ড',
      passwordPlaceholder: 'কমপক্ষে ৬টি অক্ষর',
      phone: 'ফোন নম্বর',
      phonePlaceholder: '০১XXXXXXXXX',
      language: 'ভাষা পছন্দ',
      languageBn: 'বাংলা',
      languageEn: 'English',
      submit: 'নিবন্ধন সম্পন্ন করুন',
      haveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
      login: 'লগইন করুন',
      errors: {
        nameRequired: 'নাম অবশ্যই প্রয়োজন',
        nameMin: 'নাম কমপক্ষে ২টি অক্ষর হতে হবে',
        emailRequired: 'ইমেইল অবশ্যই প্রয়োজন',
        emailInvalid: 'সঠিক ইমেইল ঠিকানা লিখুন',
        passwordRequired: 'পাসওয়ার্ড অবশ্যই প্রয়োজন',
        passwordMin: 'পাসওয়ার্ড কমপক্ষে ৬টি অক্ষর হতে হবে',
        phoneRequired: 'ফোন নম্বর অবশ্যই প্রয়োজন',
        phoneInvalid: 'সঠিক ফোন নম্বর লিখুন (১১ ডিজিট, ০১ দিয়ে শুরু)'
      }
    },
    en: {
      title: 'Register',
      subtitle: 'Join the Amar Foshol family',
      name: 'Name',
      namePlaceholder: 'Enter your full name',
      email: 'Email',
      emailPlaceholder: 'Your email address',
      password: 'Password',
      passwordPlaceholder: 'At least 6 characters',
      phone: 'Phone Number',
      phonePlaceholder: '01XXXXXXXXX',
      language: 'Language Preference',
      languageBn: 'বাংলা',
      languageEn: 'English',
      submit: 'Complete Registration',
      haveAccount: 'Already have an account?',
      login: 'Login',
      errors: {
        nameRequired: 'Name is required',
        nameMin: 'Name must be at least 2 characters',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email',
        passwordRequired: 'Password is required',
        passwordMin: 'Password must be at least 6 characters',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Please enter a valid phone number (11 digits, starts with 01)'
      }
    }
  };

  const text = t[lang];

  // Validation functions
  const validateName = (name: string): string => {
    if (!name.trim()) return text.errors.nameRequired;
    if (name.trim().length < 2) return text.errors.nameMin;
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return text.errors.emailRequired;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return text.errors.emailInvalid;
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return text.errors.passwordRequired;
    if (password.length < 6) return text.errors.passwordMin;
    return '';
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return text.errors.phoneRequired;
    const phoneRegex = /^01\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) return text.errors.phoneInvalid;
    return '';
  };

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      phone: validatePhone(formData.phone)
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setIsLoading(true);

    try {
      // Import auth utilities dynamically
      const { registerFarmer } = await import('@/lib/auth');
      
      // Register farmer (password will be hashed automatically)
      const farmer = await registerFarmer(formData);

      console.log('✅ Registration successful!', {
        id: farmer.id,
        name: farmer.name,
        email: farmer.email,
        badges: farmer.badges.length
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Show error to user
      if (error.message === 'Email already registered') {
        setErrors(prev => ({
          ...prev,
          email: lang === 'bn' ? 'এই ইমেইল ইতিমধ্যে নিবন্ধিত' : 'Email already registered'
        }));
      } else {
        alert(lang === 'bn' ? 'নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Registration failed. Please try again.');
      }
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                {text.name} *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder={text.namePlaceholder}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors`}
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

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
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                {text.password} *
              </label>
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

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                {text.phone} *
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder={text.phonePlaceholder}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.phone ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors`}
              />
              {errors.phone && (
                <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Language Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {text.language} *
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, language: 'bn' }))}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    formData.language === 'bn'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {text.languageBn}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, language: 'en' }))}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    formData.language === 'en'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {text.languageEn}
                </button>
              </div>
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

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600">
            {text.haveAccount}{' '}
            <a href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
              {text.login}
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}