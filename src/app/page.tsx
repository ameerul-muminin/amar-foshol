'use client';

import { useState, useEffect } from 'react';
import { 
  Grains, 
  Warning, 
  ShieldCheck, 
  Plant,
  Sun,
  CloudRain,
  Thermometer,
  ArrowRight,
  Globe,
  UserPlus,
  ChartLineUp,
  Medal
} from '@phosphor-icons/react';

// Translations
const translations = {
  en: {
    nav: {
      home: 'Home',
      features: 'Features',
      register: 'Register'
    },
    hero: {
      badge: '🚨 4.5 Million Tonnes Lost Every Year',
      title: 'Protect Your Harvest',
      titleHighlight: 'Save Your Future',
      subtitle: 'Bangladesh loses $1.5 billion worth of crops annually. আমার ফসল helps farmers prevent food loss with smart weather alerts and storage guidance.',
      cta: 'Start Protecting Your Crops',
      secondaryCta: 'Learn More'
    },
    problem: {
      title: 'The Crisis We Face',
      stat1: '4.5M',
      stat1Label: 'Tonnes of grain lost yearly',
      stat2: '$1.5B',
      stat2Label: 'Economic loss annually',
      stat3: '32%',
      stat3Label: 'Of staple foods wasted',
      description: 'Poor storage, unpredictable weather, and lack of timely information cause devastating losses for Bangladeshi farmers.'
    },
    workflow: {
      title: 'How আমার ফসল Saves Your Crops',
      step1: 'Register Crop',
      step1Desc: 'Log your harvest details',
      step2: 'Get Alerts',
      step2Desc: 'Weather & risk warnings',
      step3: 'Take Action',
      step3Desc: 'Follow simple guidance',
      step4: 'Save Food',
      step4Desc: 'Reduce losses, earn more'
    },
    features: {
      title: 'Everything You Need',
      feature1: 'Weather Forecasts',
      feature1Desc: '5-day local weather in Bangla',
      feature2: 'Crop Tracking',
      feature2Desc: 'Manage all your harvests',
      feature3: 'Smart Alerts',
      feature3Desc: 'Timely risk warnings',
      feature4: 'Earn Badges',
      feature4Desc: 'Rewards for good practices'
    },
    cta: {
      title: 'Ready to Protect Your Harvest?',
      subtitle: 'Join thousands of farmers saving their crops',
      button: 'Register Now - Free'
    },
    footer: {
      tagline: 'Reducing food loss, one harvest at a time.',
      hackfest: 'Built for EDU HackFest 2025'
    }
  },
  bn: {
    nav: {
      home: 'হোম',
      features: 'সুবিধা',
      register: 'নিবন্ধন'
    },
    hero: {
      badge: '🚨 প্রতি বছর ৪৫ লক্ষ টন খাদ্য নষ্ট',
      title: 'আপনার ফসল রক্ষা করুন',
      titleHighlight: 'ভবিষ্যৎ বাঁচান',
      subtitle: 'বাংলাদেশে প্রতি বছর ১.৫ বিলিয়ন ডলারের ফসল নষ্ট হয়। আমার ফসল কৃষকদের আবহাওয়া সতর্কতা ও সংরক্ষণ পরামর্শ দিয়ে সাহায্য করে।',
      cta: 'ফসল সুরক্ষা শুরু করুন',
      secondaryCta: 'আরও জানুন'
    },
    problem: {
      title: 'আমাদের সমস্যা',
      stat1: '৪৫ লক্ষ',
      stat1Label: 'টন শস্য নষ্ট প্রতি বছর',
      stat2: '১.৫ বিলিয়ন',
      stat2Label: 'ডলার ক্ষতি বছরে',
      stat3: '৩২%',
      stat3Label: 'খাদ্য অপচয় হয়',
      description: 'দুর্বল সংরক্ষণ, অনিশ্চিত আবহাওয়া এবং সময়মতো তথ্যের অভাবে বাংলাদেশের কৃষকরা বিশাল ক্ষতির সম্মুখীন হন।'
    },
    workflow: {
      title: 'আমার ফসল কীভাবে কাজ করে',
      step1: 'ফসল নিবন্ধন',
      step1Desc: 'ফসলের তথ্য দিন',
      step2: 'সতর্কতা পান',
      step2Desc: 'আবহাওয়া ও ঝুঁকি সতর্কতা',
      step3: 'পদক্ষেপ নিন',
      step3Desc: 'সহজ নির্দেশনা অনুসরণ করুন',
      step4: 'ফসল বাঁচান',
      step4Desc: 'ক্ষতি কমান, বেশি আয় করুন'
    },
    features: {
      title: 'আপনার জন্য সব সুবিধা',
      feature1: 'আবহাওয়ার পূর্বাভাস',
      feature1Desc: '৫ দিনের স্থানীয় আবহাওয়া বাংলায়',
      feature2: 'ফসল ট্র্যাকিং',
      feature2Desc: 'সব ফসল পরিচালনা করুন',
      feature3: 'স্মার্ট সতর্কতা',
      feature3Desc: 'সময়মতো ঝুঁকি সতর্কতা',
      feature4: 'ব্যাজ অর্জন',
      feature4Desc: 'ভালো অভ্যাসের পুরস্কার'
    },
    cta: {
      title: 'ফসল রক্ষা করতে প্রস্তুত?',
      subtitle: 'হাজারো কৃষকের সাথে যোগ দিন',
      button: 'বিনামূল্যে নিবন্ধন করুন'
    },
    footer: {
      tagline: 'প্রতিটি ফসল রক্ষায় আমরা পাশে।',
      hackfest: 'EDU HackFest 2025 এর জন্য তৈরি'
    }
  }
};

export default function LandingPage() {
  const [lang, setLang] = useState<'en' | 'bn'>('bn');
  const [isLoaded, setIsLoaded] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white overflow-x-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Grain Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${15 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          >
            <Grains size={32 + i * 8} className="text-amber-400" />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 blur-lg opacity-50 animate-pulse" />
                <Plant size={32} weight="duotone" className="relative text-amber-400 sm:w-10 sm:h-10" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-300 to-emerald-300 bg-clip-text text-transparent">
                আমার ফসল
              </span>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Globe size={18} className="sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium">{lang === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 sm:pt-0">
        <div className="max-w-5xl mx-auto text-center">
          {/* Alert Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 mb-6 sm:mb-8 transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-red-500"></span>
            </span>
            <span className="text-sm sm:text-base font-medium">{t.hero.badge}</span>
          </div>

          {/* Main Heading */}
          <h1 className={`text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-4 sm:mb-6 transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <span className="block text-white">{t.hero.title}</span>
            <span className="block bg-gradient-to-r from-amber-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              {t.hero.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-lg sm:text-xl md:text-2xl text-emerald-100/80 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4 transition-all duration-700 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <button className="group w-full sm:w-auto px-6 py-4 sm:px-8 sm:py-5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-lg sm:text-xl rounded-2xl shadow-lg shadow-amber-500/30 hover:shadow-amber-400/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
              {t.hero.cta}
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-6 py-4 sm:px-8 sm:py-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 font-semibold text-lg sm:text-xl rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95">
              {t.hero.secondaryCta}
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* Problem Statistics Section */}
      <section className="relative py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-6">
            {t.problem.title}
          </h2>
          <p className="text-base sm:text-lg text-emerald-100/70 text-center max-w-2xl mx-auto mb-12 sm:mb-16 px-4">
            {t.problem.description}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { value: t.problem.stat1, label: t.problem.stat1Label, color: 'from-red-500 to-orange-500' },
              { value: t.problem.stat2, label: t.problem.stat2Label, color: 'from-amber-500 to-yellow-500' },
              { value: t.problem.stat3, label: t.problem.stat3Label, color: 'from-orange-500 to-red-500' },
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
                <div className={`text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-base sm:text-lg text-emerald-100/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section - Data → Warning → Action → Saved Food */}
      <section className="relative py-16 sm:py-24 px-4 bg-gradient-to-b from-transparent via-emerald-900/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16">
            {t.workflow.title}
          </h2>

          {/* Workflow Steps */}
          <div className="relative">
            {/* Connection Line - Hidden on mobile, visible on larger screens */}
            <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500 -translate-y-1/2 opacity-30" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { icon: Grains, title: t.workflow.step1, desc: t.workflow.step1Desc, color: 'emerald', delay: '0ms' },
                { icon: Warning, title: t.workflow.step2, desc: t.workflow.step2Desc, color: 'amber', delay: '100ms' },
                { icon: ShieldCheck, title: t.workflow.step3, desc: t.workflow.step3Desc, color: 'blue', delay: '200ms' },
                { icon: Plant, title: t.workflow.step4, desc: t.workflow.step4Desc, color: 'green', delay: '300ms' },
              ].map((step, i) => (
                <div
                  key={i}
                  className="group relative"
                  style={{ animationDelay: step.delay }}
                >
                  {/* Arrow between steps - Mobile */}
                  {i < 3 && (
                    <div className="sm:hidden flex justify-center my-2">
                      <ArrowRight size={24} className="text-emerald-400/50 rotate-90" />
                    </div>
                  )}
                  
                  <div className="relative p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    {/* Step Number */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-emerald-950 font-bold text-sm sm:text-base shadow-lg">
                      {i + 1}
                    </div>

                    {/* Icon */}
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-${step.color}-400/20 to-${step.color}-600/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500`}>
                      <step.icon size={32} weight="duotone" className={`text-${step.color}-400 sm:w-9 sm:h-9`} />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-sm sm:text-base text-emerald-100/60">{step.desc}</p>
                  </div>

                  {/* Arrow between steps - Desktop */}
                  {i < 3 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                      <ArrowRight size={24} className="text-amber-400 animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16">
            {t.features.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {[
              { icon: CloudRain, title: t.features.feature1, desc: t.features.feature1Desc, gradient: 'from-blue-500 to-cyan-500' },
              { icon: ChartLineUp, title: t.features.feature2, desc: t.features.feature2Desc, gradient: 'from-emerald-500 to-teal-500' },
              { icon: Thermometer, title: t.features.feature3, desc: t.features.feature3Desc, gradient: 'from-orange-500 to-red-500' },
              { icon: Medal, title: t.features.feature4, desc: t.features.feature4Desc, gradient: 'from-amber-500 to-yellow-500' },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`} />
                
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                    <feature.icon size={28} weight="duotone" className="text-white sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-emerald-100/60">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 sm:p-12 md:p-16 rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-br from-amber-500/20 to-emerald-500/20 backdrop-blur-sm border border-white/10 text-center overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                {t.cta.title}
              </h2>
              <p className="text-lg sm:text-xl text-emerald-100/70 mb-8 sm:mb-10">
                {t.cta.subtitle}
              </p>
              <button className="group w-full sm:w-auto px-8 py-5 sm:px-12 sm:py-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-lg sm:text-xl rounded-2xl shadow-lg shadow-amber-500/30 hover:shadow-amber-400/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 mx-auto">
                <UserPlus size={28} className="sm:w-8 sm:h-8" />
                {t.cta.button}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 sm:py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plant size={28} weight="duotone" className="text-amber-400 sm:w-8 sm:h-8" />
            <span className="text-xl sm:text-2xl font-bold">আমার ফসল</span>
          </div>
          <p className="text-sm sm:text-base text-emerald-100/60 mb-2">{t.footer.tagline}</p>
          <p className="text-xs sm:text-sm text-emerald-100/40">{t.footer.hackfest}</p>
          <p className="text-xs sm:text-sm text-emerald-100/40 mt-2">Team SteveJobs - Alif, Yasin, Joydeep</p>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Noto Sans Bengali', system-ui, sans-serif;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.2;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes scroll {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(4px);
            opacity: 0.5;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}