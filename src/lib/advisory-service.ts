/**
 * Smart Advisory Service
 * Generates actionable Bangla advisories based on weather conditions
 */

export interface WeatherForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainProbability: number;
}

export interface Advisory {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  titleBn: string;
  messageBn: string;
  actionBn: string;
  riskLevel: 1 | 2 | 3 | 4 | 5; // 1 = low, 5 = critical
  affectedDays: number;
  condition: string;
  timestamp: Date;
  icon: 'alert' | 'warning' | 'info' | 'check' | 'thermometer' | 'droplets' | 'cloud-rain' | 'wind';
}

/**
 * Generate advisories based on 5-day weather forecast
 */
export function generateAdvisories(forecasts: WeatherForecast[]): Advisory[] {
  const advisories: Advisory[] = [];

  // Check for high rain probability (>70% for 3+ days)
  const highRainDays = forecasts.filter((f) => f.rainProbability > 70);
  if (highRainDays.length >= 3) {
    advisories.push({
      id: `rain-${Date.now()}`,
      type: 'critical',
      titleBn: 'বৃষ্টির সতর্কতা ⚠️',
      messageBn: `আগামী ৫ দিনে ${highRainDays.length} দিন ৭০% এর বেশি বৃষ্টির সম্ভাবনা রয়েছে।`,
      actionBn:
        'অবিলম্বে ধান কাটুন এবং সুরক্ষিত জায়গায় সংরক্ষণ করুন। পাটের বস্তা উঁচু এবং বাতাসপূর্ণ স্থানে রাখুন।',
      riskLevel: 5,
      affectedDays: highRainDays.length,
      condition: 'high_rain',
      timestamp: new Date(),
      icon: 'cloud-rain',
    });
  }

  // Check for moderate rain warning (50-70% for 2+ days)
  const moderateRainDays = forecasts.filter((f) => f.rainProbability >= 50 && f.rainProbability <= 70);
  if (moderateRainDays.length >= 2 && highRainDays.length < 3) {
    advisories.push({
      id: `moderate-rain-${Date.now()}`,
      type: 'warning',
      titleBn: 'মধ্যম বৃষ্টির সতর্কতা',
      messageBn: `${moderateRainDays.length} দিন ৫০-৭০% বৃষ্টির সম্ভাবনা রয়েছে।`,
      actionBn:
        'ফসল অর্ধেক শুকানো হলে সংরক্ষণ করুন। ভেন্টিলেশন সহ ঘরে রাখুন যাতে বাতাস চলাচল হয়।',
      riskLevel: 3,
      affectedDays: moderateRainDays.length,
      condition: 'moderate_rain',
      timestamp: new Date(),
      icon: 'warning',
    });
  }

  // Check for extreme temperature (>35°C)
  const hotDays = forecasts.filter((f) => f.tempMax > 35);
  if (hotDays.length > 0) {
    const maxTemp = Math.max(...hotDays.map((f) => f.tempMax));
    advisories.push({
      id: `hot-temp-${Date.now()}`,
      type: 'warning',
      titleBn: 'উচ্চ তাপমাত্রা সতর্কতা',
      messageBn: `তাপমাত্রা ${Math.round(maxTemp)}°সে পর্যন্ত উঠবে।`,
      actionBn:
        'দিনের বেলা (১০টা থেকে ৪টা) ছায়ায় বা ঘরে রাখুন। সকাল বা সন্ধ্যায় ছড়িয়ে দিন। পরিমাণ অনুযায়ী পানি ছিটিয়ে দিন।',
      riskLevel: 3,
      affectedDays: hotDays.length,
      condition: 'high_temp',
      timestamp: new Date(),
      icon: 'thermometer',
    });
  }

  // Check for high humidity (>80%)
  const humidDays = forecasts.filter((f) => f.humidity > 80);
  if (humidDays.length > 0) {
    const maxHumidity = Math.max(...humidDays.map((f) => f.humidity));
    advisories.push({
      id: `humidity-${Date.now()}`,
      type: 'warning',
      titleBn: 'উচ্চ আর্দ্রতা সতর্কতা',
      messageBn: `আর্দ্রতা ${Math.round(maxHumidity)}% এর উপরে থাকবে যা ফসল শুকানোর জন্য অনুপযুক্ত।`,
      actionBn:
        'বড় ছাদযুক্ত ঘরে সংরক্ষণ করুন যেখানে বাতাস চলাচল করতে পারে। প্রতিদিন তিনবার নেড়ে দিন।',
      riskLevel: 3,
      affectedDays: humidDays.length,
      condition: 'high_humidity',
      timestamp: new Date(),
      icon: 'droplets',
    });
  }

  // Check for combined risk (rain >50% AND humidity >75%)
  const combinedRiskDays = forecasts.filter(
    (f) => f.rainProbability > 50 && f.humidity > 75
  );
  if (combinedRiskDays.length > 0) {
    advisories.push({
      id: `combined-${Date.now()}`,
      type: 'critical',
      titleBn: 'সর্বোচ্চ ঝুঁকি ⚠️',
      messageBn: `${combinedRiskDays.length} দিন বৃষ্টি এবং আর্দ্রতা উভয়ই বেশি থাকবে।`,
      actionBn:
        'এই দিনগুলিতে বাইরে রাখবেন না। সিলিং ছাদযুক্ত গুদামে রাখুন। নিয়মিত আর্দ্রতা পরিমাপ করুন এবং বায়ু সঞ্চালন বাড়ান।',
      riskLevel: 5,
      affectedDays: combinedRiskDays.length,
      condition: 'combined_risk',
      timestamp: new Date(),
      icon: 'alert',
    });
  }

  // Check for cold temperature (<15°C)
  const coldDays = forecasts.filter((f) => f.tempMin < 15);
  if (coldDays.length > 0) {
    const minTemp = Math.min(...coldDays.map((f) => f.tempMin));
    advisories.push({
      id: `cold-temp-${Date.now()}`,
      type: 'info',
      titleBn: 'শীতল আবহাওয়া',
      messageBn: `তাপমাত্রা ${Math.round(minTemp)}°সে পর্যন্ত নেমে আসবে।`,
      actionBn:
        'শীতকালীন সংরক্ষণ ব্যবস্থা অবলম্বন করুন। ফসল সাধারণত ভালো থাকে কিন্তু ভালোভাবে ঢেকে রাখুন।',
      riskLevel: 1,
      affectedDays: coldDays.length,
      condition: 'cold_temp',
      timestamp: new Date(),
      icon: 'info',
    });
  }

  // Check for ideal conditions (low rain <30%, moderate temp 20-30°C, humidity 50-70%)
  const idealDays = forecasts.filter(
    (f) => f.rainProbability < 30 && f.tempMax >= 20 && f.tempMax <= 30 && f.humidity >= 50 && f.humidity <= 70
  );
  if (idealDays.length >= 2) {
    advisories.push({
      id: `ideal-${Date.now()}`,
      type: 'success',
      titleBn: 'উপযুক্ত সময় ✓',
      messageBn: `${idealDays.length} দিন ফসল শুকানোর জন্য আদর্শ আবহাওয়া থাকবে।`,
      actionBn:
        'এই দিনগুলিতে ফসল রোদে বা বাতাসে দ্রুত শুকান। সর্বোচ্চ সুবিধা নিন এবং ফসল সম্পূর্ণ শুকিয়ে সংরক্ষণ করুন।',
      riskLevel: 1,
      affectedDays: idealDays.length,
      condition: 'ideal',
      timestamp: new Date(),
      icon: 'check',
    });
  }

  // Check for clear weather opportunity (low rain <30% for 3+ days)
  const clearDays = forecasts.filter((f) => f.rainProbability < 30);
  if (clearDays.length >= 3 && !advisories.some((a) => a.condition === 'ideal')) {
    advisories.push({
      id: `clear-${Date.now()}`,
      type: 'info',
      titleBn: 'পরিষ্কার আবহাওয়া',
      messageBn: `আগামী ${clearDays.length} দিন বৃষ্টি হওয়ার সম্ভাবনা কম থাকবে।`,
      actionBn:
        'এই সময়ে ফসল শুকানোর জন্য সর্বোত্তম সময়। রোদে ছড়িয়ে দিন এবং নিয়মিত নেড়ে দিন।',
      riskLevel: 1,
      affectedDays: clearDays.length,
      condition: 'clear_weather',
      timestamp: new Date(),
      icon: 'check',
    });
  }

  // Sort advisories by risk level (highest first)
  return advisories.sort((a, b) => b.riskLevel - a.riskLevel);
}

/**
 * Get advisory color scheme based on type and risk level
 */
export function getAdvisoryColors(type: Advisory['type'], riskLevel: number) {
  const colors: Record<Advisory['type'], { bg: string; border: string; text: string; icon: string }> = {
    critical: {
      bg: 'from-red-50 to-orange-50',
      border: 'border-red-400',
      text: 'text-red-900',
      icon: 'text-red-600',
    },
    warning: {
      bg: 'from-yellow-50 to-orange-50',
      border: 'border-yellow-400',
      text: 'text-yellow-900',
      icon: 'text-yellow-600',
    },
    info: {
      bg: 'from-blue-50 to-cyan-50',
      border: 'border-blue-400',
      text: 'text-blue-900',
      icon: 'text-blue-600',
    },
    success: {
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-400',
      text: 'text-green-900',
      icon: 'text-green-600',
    },
  };

  return colors[type];
}

/**
 * Get icon component based on advisory icon type
 */
export function getAdvisoryIcon(iconType: Advisory['icon']) {
  const icons: Record<Advisory['icon'], string> = {
    alert: '⚠️',
    warning: '⚡',
    info: 'ℹ️',
    check: '✅',
    thermometer: '🌡️',
    droplets: '💧',
    'cloud-rain': '🌧️',
    wind: '💨',
  };

  return icons[iconType];
}

/**
 * Get risk level description in Bangla
 */
export function getRiskLevelBn(level: number): string {
  const levels: Record<number, string> = {
    1: 'কম ঝুঁকি',
    2: 'মধ্যম ঝুঁকি',
    3: 'উচ্চ ঝুঁকি',
    4: 'অত্যন্ত উচ্চ ঝুঁকি',
    5: 'গুরুতর ঝুঁকি',
  };

  return levels[level] || 'অজানা ঝুঁকি';
}

/**
 * Save advisory to local storage
 */
export function saveAdvisoryHistory(advisory: Advisory): void {
  try {
    const history = localStorage.getItem('advisory_history');
    const advisoryHistory: Advisory[] = history ? JSON.parse(history) : [];

    // Add new advisory at the beginning
    advisoryHistory.unshift(advisory);

    // Keep only last 100 advisories
    if (advisoryHistory.length > 100) {
      advisoryHistory.pop();
    }

    localStorage.setItem('advisory_history', JSON.stringify(advisoryHistory));
  } catch (error) {
    console.error('[Advisory] Error saving to history:', error);
  }
}

/**
 * Get advisory history from local storage
 */
export function getAdvisoryHistory(limit: number = 10): Advisory[] {
  try {
    const history = localStorage.getItem('advisory_history');
    if (!history) return [];

    const advisories: Advisory[] = JSON.parse(history);
    return advisories.slice(0, limit);
  } catch (error) {
    console.error('[Advisory] Error reading history:', error);
    return [];
  }
}

/**
 * Clear advisory history
 */
export function clearAdvisoryHistory(): void {
  try {
    localStorage.removeItem('advisory_history');
  } catch (error) {
    console.error('[Advisory] Error clearing history:', error);
  }
}
