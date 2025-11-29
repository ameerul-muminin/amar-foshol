'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plant, 
  SignOut, 
  User, 
  CloudRain, 
  Package,
  Medal,
  Globe,
  Microphone,
  MapPin
} from '@phosphor-icons/react';
import Header from '@/components/Header';

interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  language: 'bn' | 'en';
  badges: any[];
  createdAt: Date;
}

export default function DashboardPage() {
  const router = useRouter();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [isLoading, setIsLoading] = useState(true);

  // Translations
  const t = {
    bn: {
      welcome: 'স্বাগতম',
      dashboard: 'ড্যাশবোর্ড',
      profile: 'প্রোফাইল',
      weather: 'আবহাওয়া',
      batches: 'ফসল ব্যাচ',
      badges: 'ব্যাজ',
      logout: 'লগ আউট',
      comingSoon: 'শীঘ্রই আসছে',
      registered: 'নিবন্ধিত',
      email: 'ইমেইল',
      phone: 'ফোন',
      language: 'ভাষা',
      quickActions: 'দ্রুত কাজ',
      map: 'মানচিত্র',
      voiceAssistant: 'ভয়েস সহকারী'
    },
    en: {
      welcome: 'Welcome',
      dashboard: 'Dashboard',
      profile: 'Profile',
      weather: 'Weather',
      batches: 'Crop Batches',
      badges: 'Badges',
      logout: 'Logout',
      comingSoon: 'Coming Soon',
      registered: 'Registered',
      email: 'Email',
      phone: 'Phone',
      language: 'Language',
      quickActions: 'Quick Actions',
      map: 'Map',
      voiceAssistant: 'Voice Assistant'
    }
  };

  const text = t[lang];

  useEffect(() => {
    loadFarmer();
  }, []);

  const loadFarmer = async () => {
    try {
      const { getCurrentFarmer } = await import('@/lib/auth');
      const currentFarmer = await getCurrentFarmer();

      if (!currentFarmer) {
        router.push('/login');
        return;
      }

      setFarmer(currentFarmer);
      setLang(currentFarmer.language);
    } catch (error) {
      console.error('Error loading farmer:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { logout } = await import('@/lib/auth');
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header subtitle={text.dashboard} lang={lang} setLang={setLang} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div 
          onClick={() => router.push('/dashboard/profile')}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white mb-8 cursor-pointer hover:shadow-xl transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-100 text-sm mb-2">{text.welcome}</p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">{farmer.name}</h2>
              <div className="flex flex-wrap gap-2">
                {farmer.badges.map((badge, idx) => (
                  <div key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm flex items-center gap-1.5">
                    <span>{badge.icon}</span>
                    <span>{lang === 'bn' ? badge.nameBn : badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <User size={32} weight="duotone" />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{text.profile}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">{text.email}</p>
              <p className="font-medium text-gray-900">{farmer.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">{text.phone}</p>
              <p className="font-medium text-gray-900">{farmer.phone}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">{text.language}</p>
              <p className="font-medium text-gray-900">
                {farmer.language === 'bn' ? 'বাংলা' : 'English'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">{text.registered}</p>
              <p className="font-medium text-gray-900">
                {new Date(farmer.createdAt).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{text.quickActions}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/weather')}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-500 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <CloudRain size={24} weight="duotone" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{text.weather}</h4>
              <p className="text-sm text-gray-500">{lang === 'bn' ? 'আবহাওয়া দেখুন' : 'View weather'}</p>
            </button>

            <button 
              onClick={() => router.push('/dashboard/map')}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-500 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 mb-4 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <MapPin size={24} weight="duotone" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{text.map}</h4>
              <p className="text-sm text-gray-500">{lang === 'bn' ? 'লোকাল মানচিত্র দেখুন' : 'View local map'}</p>
            </button>

            <button 
              onClick={() => router.push('/voice')}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-500 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <Microphone size={24} weight="duotone" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{text.voiceAssistant}</h4>
              <p className="text-sm text-gray-500">{lang === 'bn' ? 'ভয়েস কমাণ্ড চালু করুন' : 'Open voice assistant'}</p>
            </button>

            <button 
              onClick={() => router.push('/dashboard/batches')}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-500 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Package size={24} weight="duotone" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{text.batches}</h4>
              <p className="text-sm text-gray-500">{lang === 'bn' ? 'ফসল ব্যাচ দেখুন' : 'View crop batches'}</p>
            </button>

            <button className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-500 transition-all text-left group">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Medal size={24} weight="duotone" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{text.badges}</h4>
              <p className="text-sm text-gray-500">{farmer.badges.length} {lang === 'bn' ? 'অর্জিত' : 'earned'}</p>
            </button>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
            <Medal size={32} weight="fill" />
          </div>
          <h3 className="text-xl font-bold text-emerald-900 mb-2">
            {lang === 'bn' ? '🎉 সফলভাবে নিবন্ধিত!' : '🎉 Successfully Registered!'}
          </h3>
          <p className="text-emerald-700">
            {lang === 'bn' 
              ? 'আপনার প্রথম ব্যাজ "প্রথম ফসল" 🌾 অর্জিত হয়েছে!' 
              : 'You earned your first badge "First Harvest" 🌾!'}
          </p>
        </div>
      </main>
    </div>
  );
}