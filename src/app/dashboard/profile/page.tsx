'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  User,
  Envelope,
  Phone,
  Globe,
  Calendar,
  Medal,
  Package,
  CheckCircle,
  XCircle,
  TrendUp,
  Trophy,
  Star,
  Shield
} from '@phosphor-icons/react';

export default function ProfilePage() {
  const router = useRouter();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [farmer, setFarmer] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const t = {
    bn: {
      title: 'প্রোফাইল',
      back: 'ফিরে যান',
      personalInfo: 'ব্যক্তিগত তথ্য',
      statistics: 'পরিসংখ্যান',
      achievements: 'অর্জন',
      name: 'নাম',
      email: 'ইমেইল',
      phone: 'ফোন নম্বর',
      language: 'ভাষা',
      memberSince: 'সদস্য হয়েছেন',
      lastLogin: 'শেষ লগইন',
      stats: {
        activeBatches: 'সক্রিয় ব্যাচ',
        completedBatches: 'সম্পন্ন ব্যাচ',
        lostBatches: 'হারানো ব্যাচ',
        interventions: 'হস্তক্ষেপ',
        successRate: 'সফলতার হার',
        totalWeight: 'মোট ওজন',
        kg: 'কেজি'
      },
      badges: {
        earned: 'অর্জিত ব্যাজ',
        locked: 'লক করা',
        earnedOn: 'অর্জিত',
        milestone: 'মাইলস্টোন',
        achievement: 'অর্জন',
        streak: 'ধারাবাহিকতা'
      },
      nobadges: 'এখনও কোনো ব্যাজ অর্জন করেননি',
      noBadgesDesc: 'আরও ফসল নিবন্ধন করুন এবং ব্যাজ অর্জন করুন!'
    },
    en: {
      title: 'Profile',
      back: 'Back',
      personalInfo: 'Personal Information',
      statistics: 'Statistics',
      achievements: 'Achievements',
      name: 'Name',
      email: 'Email',
      phone: 'Phone Number',
      language: 'Language',
      memberSince: 'Member Since',
      lastLogin: 'Last Login',
      stats: {
        activeBatches: 'Active Batches',
        completedBatches: 'Completed Batches',
        lostBatches: 'Lost Batches',
        interventions: 'Interventions',
        successRate: 'Success Rate',
        totalWeight: 'Total Weight',
        kg: 'kg'
      },
      badges: {
        earned: 'Earned Badges',
        locked: 'Locked',
        earnedOn: 'Earned on',
        milestone: 'Milestone',
        achievement: 'Achievement',
        streak: 'Streak'
      },
      nobadges: 'No badges earned yet',
      noBadgesDesc: 'Register more crops and earn badges!'
    }
  };

  const text = t[lang];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { getCurrentFarmer, checkAndAwardBadges } = await import('@/lib/auth');
      const { getFarmerStats } = await import('@/lib/cropBatch');

      const currentFarmer = await getCurrentFarmer();
      if (!currentFarmer) {
        router.push('/login');
        return;
      }

      // Check and award any pending badges
      await checkAndAwardBadges(currentFarmer.id);

      // Reload farmer to get updated badges
            const updatedFarmer = await getCurrentFarmer();
            const farmerStats = await getFarmerStats(currentFarmer.id);
      
            if (updatedFarmer) {
              setFarmer(updatedFarmer);
              setLang(updatedFarmer.language === 'bn' || updatedFarmer.language === 'en' ? updatedFarmer.language : 'bn');
            } else {
              setFarmer(null);
            }
            setStats(farmerStats);
    } catch (error) {
      console.error('Error loading data:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateSuccessRate = () => {
    if (!stats) return 0;
    const total = stats.totalBatches;
    if (total === 0) return 0;
    const successful = stats.completedBatches;
    return Math.round((successful / total) * 100);
  };

  const getBadgeCategoryIcon = (category: string) => {
    switch (category) {
      case 'milestone':
        return <Trophy size={16} weight="fill" className="text-amber-500" />;
      case 'achievement':
        return <Star size={16} weight="fill" className="text-blue-500" />;
      case 'streak':
        return <Shield size={16} weight="fill" className="text-purple-500" />;
      default:
        return <Medal size={16} weight="fill" className="text-gray-500" />;
    }
  };

  const getBadgeCategoryLabel = (category: string) => {
    return text.badges[category as keyof typeof text.badges] || category;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  if (!farmer) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft size={24} weight="bold" />
              </button>
              <div>
                <h1 className="font-bold text-lg text-gray-900">{text.title}</h1>
              </div>
            </div>

            <button
              onClick={() => setLang(prev => prev === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-emerald-500 transition-colors text-sm font-medium"
            >
              <Globe size={14} weight="bold" />
              {lang === 'bn' ? 'EN' : 'BN'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
                  {farmer.badges.length > 0 ? farmer.badges[0].icon : '👤'}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">{farmer.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    {farmer.badges.slice(0, 3).map((badge: any, idx: number) => (
                      <div key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm flex items-center gap-1.5">
                        <span>{badge.icon}</span>
                        <span>{lang === 'bn' ? badge.nameBn : badge.name}</span>
                      </div>
                    ))}
                    {farmer.badges.length > 3 && (
                      <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                        +{farmer.badges.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User size={24} weight="duotone" className="text-emerald-600" />
                {text.personalInfo}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-500">{text.name}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{farmer.name}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Envelope size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-500">{text.email}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{farmer.email}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-500">{text.phone}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{farmer.phone}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-500">{text.language}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {farmer.language === 'bn' ? 'বাংলা' : 'English'}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-500">{text.memberSince}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatDate(farmer.createdAt)}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-500">{text.lastLogin}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatDate(farmer.lastLogin)}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            {stats && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendUp size={24} weight="duotone" className="text-emerald-600" />
                  {text.statistics}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl text-center">
                    <Package size={32} className="text-blue-600 mx-auto mb-2" weight="duotone" />
                    <p className="text-2xl font-bold text-blue-900">{stats.activeBatches}</p>
                    <p className="text-sm text-blue-600">{text.stats.activeBatches}</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl text-center">
                    <CheckCircle size={32} className="text-green-600 mx-auto mb-2" weight="duotone" />
                    <p className="text-2xl font-bold text-green-900">{stats.completedBatches}</p>
                    <p className="text-sm text-green-600">{text.stats.completedBatches}</p>
                  </div>

                  <div className="p-4 bg-red-50 rounded-xl text-center">
                    <XCircle size={32} className="text-red-600 mx-auto mb-2" weight="duotone" />
                    <p className="text-2xl font-bold text-red-900">{stats.lostBatches}</p>
                    <p className="text-sm text-red-600">{text.stats.lostBatches}</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl text-center">
                    <Shield size={32} className="text-purple-600 mx-auto mb-2" weight="duotone" />
                    <p className="text-2xl font-bold text-purple-900">{stats.interventionCount}</p>
                    <p className="text-sm text-purple-600">{text.stats.interventions}</p>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl text-center">
                    <TrendUp size={32} className="text-amber-600 mx-auto mb-2" weight="duotone" />
                    <p className="text-2xl font-bold text-amber-900">{calculateSuccessRate()}%</p>
                    <p className="text-sm text-amber-600">{text.stats.successRate}</p>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl text-center">
                    <Package size={32} className="text-emerald-600 mx-auto mb-2" weight="duotone" />
                    <p className="text-2xl font-bold text-emerald-900">{stats.totalWeight}</p>
                    <p className="text-sm text-emerald-600">{text.stats.totalWeight} ({text.stats.kg})</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Badges */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Medal size={24} weight="duotone" className="text-amber-500" />
                {text.achievements}
              </h3>

              {farmer.badges.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                    🏆
                  </div>
                  <p className="text-gray-600 font-medium mb-2">{text.nobadges}</p>
                  <p className="text-sm text-gray-500">{text.noBadgesDesc}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {farmer.badges.map((badge: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{badge.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900">
                              {lang === 'bn' ? badge.nameBn : badge.name}
                            </h4>
                            {getBadgeCategoryIcon(badge.category)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {lang === 'bn' ? badge.descriptionBn : badge.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {text.badges.earnedOn} {formatDate(badge.earnedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Badge Progress Hint */}
              {stats && stats.totalBatches < 5 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💡</div>
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        {lang === 'bn' ? 'পরবর্তী ব্যাজ' : 'Next Badge'}
                      </p>
                      <p className="text-xs text-blue-600">
                        {lang === 'bn' 
                          ? `আরও ${5 - stats.totalBatches}টি ব্যাচ নিবন্ধন করুন "ব্যাচ মাস্টার" ব্যাজ পেতে!`
                          : `Register ${5 - stats.totalBatches} more batches to earn "Batch Master" badge!`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}