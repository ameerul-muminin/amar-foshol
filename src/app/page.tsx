"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Plant,
  CloudRain,
  ArrowRight,
  Globe,
  UserCircle,
  Medal,
  TrendDown,
  Database,
  CheckCircle,
  List,
  Camera,
  Leaf,
  Warning,
} from "@phosphor-icons/react";

// Translations
const translations = {
  en: {
    nav: {
      logo: "Amar Foshol",
      home: "Home",
      features: "Features",
      contact: "Contact",
      login: "Login",
    },
    hero: {
      badge: "HackFest 2025",
      title: "Transforming Agriculture Through Data & Sustainability",
      subtitle:
        "Helping Bangladeshi farmers reduce post-harvest food losses through smart weather alerts and actionable guidance.",
      cta: "Join Now",
      stat: "4.5M Tonnes Saved",
    },
    stats: {
      title: "The Crisis We Face",
      cards: [
        {
          title: "Food Loss",
          val: "4.5M",
          desc: "Metric tonnes of grain lost annually.",
        },
        {
          title: "Economic Impact",
          val: "$1.5B",
          desc: "USD lost from the economy every year.",
        },
        {
          title: "Wasted Supply",
          val: "32%",
          desc: "Of staple foods never reach the market.",
        },
      ],
    },
    features: {
      title: "Smart Farming Solutions",
      subtitle:
        "Our technology empowers farmers to make data-driven decisions.",
      items: [
        {
          title: "Crop Registration",
          desc: "Track harvested batches digitally.",
        },
        { title: "Hyper-local Weather", desc: "5-day forecasts in Bangla." },
        { title: "Risk Alerts", desc: "Real-time actionable advisories." },
        { title: "Gamification", desc: "Earn badges for good practices." },
      ],
      highlight1: "Early Warning System",
      highlight2: "Farm Analytics",
      highlight2Desc: "Data visualized for better yield.",
      viewAll: "View All Features",
    },
    workflow: {
      title: "How It Works",
      steps: [
        { title: "Data Collection", desc: "Input crop & location data." },
        { title: "Smart Analysis", desc: "System checks weather risks." },
        { title: "Actionable Alert", desc: "Receive timely warnings." },
        { title: "Saved Harvest", desc: "Prevent loss & increase profit." },
      ],
      ctaTitle: "Join Now",
      ctaSubtitle:
        "Join thousands of farmers protecting their livelihood today.",
      ctaButton: "Register Now",
    },
    scanner: {
      title: "AI Crop Health Scanner",
      subtitle: "Instantly check if your crop is fresh or rotten with a single photo",
      fresh: "Fresh",
      freshDesc: "Your crop looks healthy! Continue normal drying.",
      rotten: "Rotten",
      rottenDesc: "Spoilage detected! Separate immediately.",
      cta: "Try Scanner",
      badge: "AI Powered",
      tip: "Take a clear photo of your crop to get instant health analysis",
    },
    footer: {
      text: "Team SteveJobs. Built for EDU HackFest 2025.",
      copyright: "© 2025 Amar Foshol. All rights reserved.",
      hackfest: "Designed for EDU HackFest",
    },
  },
  bn: {
    nav: {
      logo: "আমার ফসল",
      home: "হোম",
      features: "বৈশিষ্ট্য",
      contact: "যোগাযোগ",
      login: "লগইন",
    },
    hero: {
      badge: "হ্যাকফেস্ট ২০২৫",
      title: "তথ্য ও প্রযুক্তির মাধ্যমে কৃষিতে নতুন দিগন্ত",
      subtitle:
        "স্মার্ট আবহাওয়া বার্তা এবং সঠিক নির্দেশনার মাধ্যমে কৃষকদের ফসল ও মুনাফা রক্ষা করি।",
      cta: "রেজিস্ট্রেশন করুন",
      stat: "৪.৫ মিলিয়ন টন রক্ষা",
    },
    stats: {
      title: "আমাদের চ্যালেঞ্জ",
      cards: [
        {
          title: "খাদ্য অপচয়",
          val: "৪.৫ মি.",
          desc: "মেট্রিক টন শস্য প্রতি বছর নষ্ট হয়।",
        },
        {
          title: "অর্থনৈতিক ক্ষতি",
          val: "$১.৫ বি.",
          desc: "প্রতি বছর অর্থনীতি থেকে হারিয়ে যাচ্ছে।",
        },
        {
          title: "সরবরাহ ঘাটতি",
          val: "৩২%",
          desc: "মৌলিক খাদ্য বাজারে পৌঁছায় না।",
        },
      ],
    },
    features: {
      title: "স্মার্ট কৃষি সমাধান",
      subtitle: "আমাদের প্রযুক্তি কৃষকদের সঠিক সিদ্ধান্ত নিতে সাহায্য করে।",
      items: [
        { title: "ফসল নিবন্ধন", desc: "ডিজিটালভাবে ফসলের হিসাব রাখুন।" },
        { title: "স্থানীয় আবহাওয়া", desc: "বাংলায় ৫ দিনের পূর্বাভাস।" },
        { title: "ঝুঁকি সতর্কতা", desc: "তাৎক্ষণিক প্রয়োজনীয় পরামর্শ।" },
        { title: "গেমফিকেশন", desc: "ভালো কাজের জন্য ব্যাজ জিতুন।" },
      ],
      highlight1: "আগাম সতর্কতা ব্যবস্থা",
      highlight2: "ফার্ম অ্যানালিটিক্স",
      highlight2Desc: "উন্নত ফলনের জন্য তথ্য বিশ্লেষণ।",
      viewAll: "সব বৈশিষ্ট্য দেখুন",
    },
    workflow: {
      title: "কিভাবে কাজ করে",
      steps: [
        { title: "তথ্য সংগ্রহ", desc: "ফসল ও অবস্থানের তথ্য দিন।" },
        { title: "স্মার্ট বিশ্লেষণ", desc: "আবহাওয়ার ঝুঁকি যাচাই।" },
        { title: "সতর্কবার্তা", desc: "সঠিক সময়ে সতর্কবার্তা পান।" },
        { title: "ফসল রক্ষা", desc: "ক্ষতি কমান ও লাভ বাড়ান।" },
      ],
      ctaTitle: "রেজিস্ট্রেশন করুন",
      ctaSubtitle: "হাজারো কৃষক আজই তাদের জীবিকা রক্ষা করছে।",
      ctaButton: "এখনই নিবন্ধন করুন",
    },
    scanner: {
      title: "AI ফসল স্বাস্থ্য স্ক্যানার",
      subtitle: "একটি ছবি দিয়ে তাৎক্ষণিক জানুন আপনার ফসল সতেজ না পচা",
      fresh: "সতেজ",
      freshDesc: "আপনার ফসল স্বাস্থ্যকর! স্বাভাবিকভাবে শুকাতে দিন।",
      rotten: "পচা",
      rottenDesc: "পচন ধরা পড়েছে! এখনই আলাদা করুন।",
      cta: "স্ক্যানার ব্যবহার করুন",
      badge: "AI চালিত",
      tip: "তাৎক্ষণিক স্বাস্থ্য বিশ্লেষণের জন্য আপনার ফসলের একটি স্পষ্ট ছবি তুলুন",
    },
    footer: {
      text: "টিম স্টিভজবস। EDU হ্যাকফেস্ট ২০২৫ এর জন্য তৈরি।",
      copyright: "© ২০২৫ আমার ফসল। সর্বস্বত্ব সংরক্ষিত।",
      hackfest: "EDU হ্যাকফেস্ট এর জন্য ডিজাইন করা",
    },
  },
};

// Feature icons mapping
const featureIcons = [Plant, CloudRain, ShieldCheck, Medal];

export default function LandingPage() {
  const [lang, setLang] = useState<"en" | "bn">("bn");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLang = () => setLang((prev) => (prev === "en" ? "bn" : "en"));

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 selection:bg-lime-300 selection:text-emerald-900">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-white/80 backdrop-blur-md"
        } border-b border-gray-100`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                <Plant size={20} weight="fill" />
              </div>
              <span className="font-bold text-xl text-emerald-900 tracking-tight">
                {t.nav.logo}
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-600 hover:text-emerald-500 transition-colors"
              >
                {t.nav.home}
              </a>
              <a
                href="#features"
                className="text-gray-600 hover:text-emerald-500 transition-colors"
              >
                {t.nav.features}
              </a>
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-emerald-500 transition-colors text-sm font-medium"
              >
                <Globe size={14} weight="bold" />
                {lang === "en" ? "বাংলা" : "ENG"}
              </button>
              <button
                onClick={() => (window.location.href = "/login")}
                className="bg-emerald-900 text-white px-5 py-2 rounded-full hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20"
              >
                {t.nav.login}
              </button>
            </div>

            {/* Mobile Nav */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={toggleLang}
                className="text-sm font-bold text-emerald-900"
              >
                {lang === "en" ? "BN" : "EN"}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <List size={24} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            <a href="#" className="block text-gray-600 hover:text-emerald-500">
              {t.nav.home}
            </a>
            <a
              href="#features"
              className="block text-gray-600 hover:text-emerald-500"
            >
              {t.nav.features}
            </a>
            <button 
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-emerald-900 text-white px-5 py-2 rounded-full hover:bg-emerald-500 transition-colors"
            >
              {t.nav.login}
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-emerald-900 text-white min-h-[500px] sm:min-h-[600px] flex items-end p-6 md:p-12 group">
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop"
            alt="Farmer in field"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-emerald-900/40 to-transparent"></div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-300/20 border border-lime-300/30 text-lime-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-lime-300 animate-pulse"></span>
              {t.hero.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t.hero.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => (window.location.href = "/register")}
                className="bg-white text-emerald-900 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold hover:bg-lime-300 transition-all transform hover:-translate-y-1 shadow-lg"
              >
                {t.hero.cta}
              </button>
              <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="font-medium text-sm sm:text-base">
                  {t.hero.stat}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.stats.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {t.stats.cards.map((card, idx) => {
            const icons = [TrendDown, Database, ShieldCheck];
            const Icon = icons[idx];
            return (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex justify-between items-start mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-lime-300 group-hover:text-emerald-900 transition-colors">
                    <Icon size={24} weight="duotone" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">
                    <CheckCircle size={12} weight="fill" />
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">
                  {card.title}
                </h3>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  {card.val}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dark Features Section */}
      <section
        id="features"
        className="py-16 sm:py-20 bg-black text-white my-12 rounded-[2rem] sm:rounded-[3rem] max-w-[98%] mx-auto relative overflow-hidden"
      >
        {/* Decorative gradient blob */}
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 px-4 sm:px-6 md:px-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6 sm:gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                {t.features.title}
              </h2>
              <p className="text-gray-400 text-base sm:text-lg">
                {t.features.subtitle}
              </p>
            </div>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-lime-300 text-emerald-900 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold hover:bg-white transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              {t.features.viewAll} <ArrowRight size={18} weight="bold" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {t.features.items.map((item, idx) => {
              const Icon = featureIcons[idx];
              return (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 sm:p-6 rounded-3xl hover:bg-white/10 transition-all group cursor-pointer"
                >
                  <div className="mb-16 sm:mb-32 relative">
                    <div className="absolute top-0 right-0 p-2 bg-emerald-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                      <ArrowRight
                        size={20}
                        className="text-black"
                        weight="bold"
                      />
                    </div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-900/50 rounded-2xl flex items-center justify-center text-lime-300">
                      <Icon size={28} weight="duotone" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Large Feature Highlight Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-lime-300 rounded-3xl p-6 sm:p-8 relative overflow-hidden h-64 sm:h-80 group">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white mb-4">
                  <ShieldCheck size={18} weight="fill" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-emerald-900 max-w-[200px]">
                  {t.features.highlight1}
                </h3>
              </div>
              <img
                src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2072&auto=format&fit=crop"
                alt="Rice"
                className="absolute bottom-0 right-0 w-2/3 sm:w-3/4 h-2/3 sm:h-3/4 object-cover rounded-tl-3xl shadow-2xl transition-transform group-hover:scale-105"
              />
            </div>

            <div className="bg-neutral-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden h-64 sm:h-80 group text-white">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white mb-4">
                  <Database size={18} weight="fill" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold max-w-[200px]">
                  {t.features.highlight2}
                </h3>
                <p className="text-gray-400 mt-2 text-sm max-w-[200px]">
                  {t.features.highlight2Desc}
                </p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?q=80&w=2070&auto=format&fit=crop"
                alt="Analytics"
                className="absolute top-1/2 right-0 w-1/2 h-full object-cover transform -translate-y-1/4 rounded-l-3xl opacity-60 group-hover:opacity-80 transition-opacity"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Workflow / How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.workflow.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left: Workflow Visualization */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="space-y-4 sm:space-y-6 relative z-10">
              {t.workflow.steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{step.title}</h4>
                    <p className="text-sm text-gray-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Decorative circle */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-lime-300/20 rounded-full blur-3xl"></div>
          </div>

          {/* Right: CTA Card */}
          <div className="bg-emerald-500 rounded-[2rem] p-6 sm:p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-center text-center items-center">
            <div className="relative z-10">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UserCircle size={32} weight="duotone" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                {t.workflow.ctaTitle}
              </h3>
              <p className="text-emerald-50 mb-8 max-w-sm mx-auto text-sm sm:text-base">
                {t.workflow.ctaSubtitle}
              </p>
              <button
                onClick={() => (window.location.href = "/register")}
                className="bg-white text-emerald-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-lime-300 hover:text-emerald-900 transition-all w-full max-w-xs shadow-lg"
              >
                {t.workflow.ctaButton}
              </button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=2070&auto=format&fit=crop"
              alt="Background pattern"
              className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
            />
          </div>
        </div>
      </section>

      {/* A5: AI Crop Health Scanner Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-amber-50 via-lime-50 to-emerald-50 rounded-[2.5rem] p-6 sm:p-10 md:p-16 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-300/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-300/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold mb-6">
                <Camera size={16} weight="bold" />
                {t.scanner.badge}
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {t.scanner.title}
              </h2>
              
              <p className="text-gray-600 text-lg mb-8 max-w-md">
                {t.scanner.subtitle}
              </p>
              
              {/* Fresh/Rotten indicators */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Leaf size={24} weight="duotone" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-800 text-lg">{t.scanner.fresh} 🌾</h4>
                    <p className="text-gray-600 text-sm">{t.scanner.freshDesc}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-red-100">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
                    <Warning size={24} weight="duotone" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 text-lg">{t.scanner.rotten} ⚠️</h4>
                    <p className="text-gray-600 text-sm">{t.scanner.rottenDesc}</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => (window.location.href = "/register")}
                className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-700 transition-all transform hover:-translate-y-1 shadow-lg shadow-emerald-500/30 flex items-center gap-2"
              >
                <Camera size={20} weight="bold" />
                {t.scanner.cta}
              </button>
            </div>
            
            {/* Right: 3D Wheat Animation */}
            <div className="relative flex justify-center items-center">
              {/* 3D Wheat Container */}
              <div className="relative w-64 h-80 sm:w-80 sm:h-96 perspective-1000">
                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-400/40 to-transparent rounded-full blur-2xl animate-pulse"></div>
                
                {/* 3D Rotating Wheat */}
                <div className="absolute inset-0 flex items-center justify-center animate-float">
                  {/* Main wheat emoji with 3D effect */}
                  <div className="relative transform-style-3d animate-rotate-y">
                    <span className="text-[120px] sm:text-[160px] select-none drop-shadow-2xl filter">
                      🌾
                    </span>
                    {/* Shadow underneath */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/20 rounded-full blur-md"></div>
                  </div>
                </div>
                
                {/* Floating status badges */}
                <div className="absolute top-4 right-0 sm:right-4 animate-bounce-slow">
                  <div className="bg-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                    <CheckCircle size={16} weight="fill" />
                    {t.scanner.fresh}
                  </div>
                </div>
                
                <div className="absolute bottom-8 left-0 sm:left-4 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                    <Warning size={16} weight="fill" />
                    {t.scanner.rotten}
                  </div>
                </div>
                
                {/* Decorative particles */}
                <div className="absolute top-1/4 left-8 w-3 h-3 bg-lime-400 rounded-full animate-ping"></div>
                <div className="absolute top-1/2 right-8 w-2 h-2 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute bottom-1/4 left-12 w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
              </div>
            </div>
          </div>
          
          {/* Tip at bottom */}
          <div className="relative z-10 mt-8 pt-6 border-t border-gray-200/50 text-center">
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
              <Camera size={16} />
              {t.scanner.tip}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white pt-16 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
            <div>
              <h2 className="text-[15vw] sm:text-[12vw] leading-none font-bold text-lime-300 opacity-20 select-none">
                আমার
              </h2>
              <h2 className="text-[15vw] sm:text-[12vw] leading-none font-bold text-white opacity-20 select-none -mt-2 sm:-mt-4 md:-mt-8">
                ফসল
              </h2>
            </div>
            <div className="flex flex-col justify-end">
              <div className="flex flex-wrap gap-4 sm:gap-8 text-base sm:text-lg font-medium text-gray-300">
                <a href="#" className="hover:text-lime-300 transition-colors">
                  Instagram
                </a>
                <a href="#" className="hover:text-lime-300 transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="hover:text-lime-300 transition-colors">
                  YouTube
                </a>
              </div>
              <p className="mt-6 sm:mt-8 text-gray-400 text-sm sm:text-base">
                {t.footer.text}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-2 text-xs sm:text-sm text-gray-400">
            <p>{t.footer.copyright}</p>
            <p>{t.footer.hackfest}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
