// Crop Risk Management System with Geocoding Support
// Integrated from b2.js for weather-based risk assessment with dynamic location support

export interface WeatherData {
  rain: boolean;
  humidity: number;
  temp: number;
  rainAmount: number;
}

export interface RiskAssessment {
  level: 'Low' | 'Medium' | 'Critical';
  type: string | null;
}

export interface Alert {
  cropType: string;
  location: string;
  riskLevel: string;
  riskType: string | null;
  message: string;
  messageBn: string;
  weather: WeatherData;
  timestamp: Date;
}

// Geocoding: Convert location name to lat/long using Nominatim (OpenStreetMap)
async function getCoordinates(location: string): Promise<{ latitude: number; longitude: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AmarFoshol/1.0' // Good practice for Nominatim usage policy
      }
    });
    if (!response.ok) {
      throw new Error('Geocoding response was not ok');
    }
    const data = await response.json();
    
    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    } else {
      console.error('No coordinates found for location:', location);
      return null;
    }
  } catch (error) {
    console.error('Geocoding API error:', error);
    return null;
  }
}

// Fetch weather data from Open-Meteo API using dynamic geocoding
export async function fetchWeather(location: string): Promise<WeatherData | null> {
  const coords = await getCoordinates(location);
  
  if (!coords) {
    console.error('Failed to get coordinates for location:', location);
    return null;
  }
  
  const { latitude, longitude } = coords;
  
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,precipitation_sum,relative_humidity_2m_mean&timezone=auto`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Tomorrow's forecast (index 1; index 0 is today)
    const tomorrowTemp = data.daily.temperature_2m_max[1];
    const tomorrowPrecip = data.daily.precipitation_sum[1]; // in mm
    const tomorrowHumidity = data.daily.relative_humidity_2m_mean[1];
    
    return {
      rain: tomorrowPrecip > 0,
      humidity: tomorrowHumidity,
      temp: tomorrowTemp,
      rainAmount: tomorrowPrecip
    };
  } catch (error) {
    console.error('Open-Meteo API error:', error);
    return null;
  }
}

// Calculate risk level and type based on crop and weather
export function calculateRisk(cropType: string, weather: WeatherData | null): RiskAssessment {
  if (!weather) return { level: 'Low', type: null };
  
  let level: 'Low' | 'Medium' | 'Critical' = 'Low';
  let type: string | null = null;
  
  const highTempThreshold = 30;
  const lowTempThreshold = 15;
  const highHumidityThreshold = 70;
  const lowHumidityThreshold = 40;
  const heavyRainThreshold = 20;
  
  // General weather checks
  if (weather.temp > highTempThreshold && !weather.rain) {
    level = 'Critical';
    type = 'heat_stress';
  } else if (weather.temp < lowTempThreshold) {
    level = 'Critical';
    type = 'cold_stress';
  } else if (weather.humidity > highHumidityThreshold && weather.rain) {
    level = 'Critical';
    type = 'high_humidity';
  } else if (!weather.rain && weather.humidity < lowHumidityThreshold && weather.temp > highTempThreshold - 5) {
    level = 'Critical';
    type = 'drought';
  } else if (weather.rain && weather.rainAmount > heavyRainThreshold) {
    level = 'Critical';
    type = 'flood';
  } else if (weather.humidity > highHumidityThreshold) {
    level = 'Medium';
    type = 'high_humidity';
  }
  
  // Crop-specific adjustments
  if (cropType === 'potato') {
    if (type === 'high_humidity') level = 'Critical';
    if (type === 'drought' && weather.temp < 20) level = 'Medium';
  } else if (cropType === 'rice') {
    if (type === 'flood') level = 'Medium';
    if (type === 'drought') level = 'Critical';
    if (type === 'heat_stress') level = 'Critical';
  } else if (cropType === 'wheat') {
    if (type === 'drought' || type === 'heat_stress') level = 'Critical';
  } else if (cropType === 'maize') {
    if (type === 'drought') level = 'Medium';
    if (type === 'high_humidity') level = 'Critical';
  } else if (cropType === 'jute') {
    if (type === 'flood') level = 'Low';
    if (type === 'drought') level = 'Critical';
    if (type === 'high_humidity') level = 'Critical';
  } else if (cropType === 'tomato') {
    if (type === 'heat_stress' || type === 'drought' || type === 'high_humidity' || type === 'flood') level = 'Critical';
  } else if (cropType === 'brinjal') {
    if (type === 'drought') level = 'Critical';
    if (type === 'high_humidity') level = 'Critical';
    if (type === 'cold_stress') level = 'Critical';
  } else if (cropType === 'mustard') {
    if (type === 'drought' || type === 'heat_stress') level = 'Critical';
    if (type === 'cold_stress') level = 'Medium';
  } else if (cropType === 'lentil') {
    if (type === 'drought' || type === 'heat_stress') level = 'Critical';
    if (type === 'flood') level = 'Critical';
  } else if (cropType === 'mango') {
    if (type === 'drought' || type === 'heat_stress' || type === 'flood') level = 'Critical';
    if (type === 'high_humidity') level = 'Critical';
  } else if (cropType === 'banana') {
    if (type === 'drought' || type === 'flood' || type === 'cold_stress') level = 'Critical';
  } else if (cropType === 'sugarcane') {
    if (type === 'drought') level = 'Critical';
    if (type === 'flood') level = 'Critical';
  } else if (cropType === 'onion') {
    if (type === 'cold_stress' || type === 'high_humidity' || type === 'drought') level = 'Critical';
  }
  
  return { level, type };
}

// Bengali translations for risk types
const riskTranslations: Record<string, string> = {
  drought: 'খরা',
  flood: 'বন্যা',
  heat_stress: 'তাপীয় চাপ',
  cold_stress: 'শীতল চাপ',
  high_humidity: 'উচ্চ আর্দ্রতা',
  waterlogging: 'জলাবদ্ধতা',
  pest_infestation: 'কীটপতঙ্গ আক্রমণ'
};

// Bengali crop names
const cropNamesBn: Record<string, string> = {
  potato: 'আলু',
  rice: 'ধান',
  wheat: 'গম',
  maize: 'ভুট্টা',
  jute: 'পাট',
  tomato: 'টমেটো',
  brinjal: 'বেগুন',
  mustard: 'সরিষা',
  lentil: 'মসুর',
  mango: 'আম',
  banana: 'কলা',
  sugarcane: 'আখ',
  onion: 'পেঁয়াজ'
};

// Generate actionable alerts in Bangla
export function generateAlert(cropType: string, weather: WeatherData, risk: RiskAssessment, location: string): Alert | null {
  if (risk.level !== 'Critical') return null;
  
  let alertMessage = '';
  let alertMessageBn = '';
  const riskBn = riskTranslations[risk.type || ''] || 'ঝুঁকি';
  const cropBn = cropNamesBn[cropType] || cropType;
  
  // Default message
  alertMessageBn = `ঝুঁকি: ${riskBn}। আপনার ${cropBn} ফসলের জন্য ${riskBn} ঝুঁকি। উপযুক্ত ব্যবস্থা নিন।`;
  alertMessage = `Risk: ${risk.type}. Your ${cropType} crop faces a ${risk.type} risk. Take appropriate measures.`;
  
  // Crop-specific messages
  if (cropType === 'potato') {
    if (risk.type === 'high_humidity') {
      alertMessageBn = `ঝুঁকি: ${riskBn} (ছত্রাকজনিত রোগের সম্ভাবনা)। আগামীকাল বৃষ্টি হবে এবং আর্দ্রতা বেশি। এখনই ফ্যান চালু করুন এবং ছত্রাকনাশক ব্যবহার করুন।`;
      alertMessage = `Risk: ${riskBn}. Rain and high humidity expected. Turn on ventilation and apply fungicide.`;
    } else if (risk.type === 'drought') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। আপনার ${cropBn} ক্ষেতে পানির অভাব। এখনই সেচ দিন এবং মাটি আর্দ্র রাখুন।`;
      alertMessage = 'Risk: Drought. Your potato field lacks water. Irrigate immediately and keep soil moist.';
    } else if (risk.type === 'cold_stress') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। নিম্ন তাপমাত্রা ${cropBn} কে ক্ষতি করবে। আচ্ছাদন প্রদান করুন।`;
      alertMessage = 'Risk: Cold stress. Low temperature will damage potatoes. Provide covering.';
    }
  } else if (cropType === 'rice') {
    if (risk.type === 'drought') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। আপনার ${cropBn} ক্ষেতে খরা। এখনই সেচ ব্যবস্থা চালু করুন এবং খরা-সহনশীল জাত ব্যবহার করুন।`;
      alertMessage = 'Risk: Drought. Your rice field needs water. Start irrigation immediately and use drought-tolerant varieties.';
    } else if (risk.type === 'flood') {
      alertMessageBn = `ঝুঁকি: ${riskBn} (জলাবদ্ধতা)। আগামীকাল ভারী বৃষ্টি হতে পারে। নিকাশ ব্যবস্থা চেক করুন এবং উঁচু জমিতে সরান।`;
      alertMessage = 'Risk: Flood. Heavy rain expected. Check drainage and move to higher ground if possible.';
    } else if (risk.type === 'heat_stress') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। উচ্চ তাপমাত্রা ${cropBn} ফলন কমাবে। সেচ বাড়ান এবং ছায়া প্রদান করুন।`;
      alertMessage = 'Risk: Heat stress. High temperature will reduce rice yield. Increase irrigation.';
    }
  } else if (cropType === 'tomato') {
    if (risk.type === 'heat_stress') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। উচ্চ তাপমাত্রা ${cropBn} ফল গঠনে সমস্যা সৃষ্টি করবে। ছায়া নেট ব্যবহার করুন এবং সেচ বাড়ান।`;
      alertMessage = 'Risk: Heat stress. High temperature affects fruit development. Use shade nets and increase irrigation.';
    } else if (risk.type === 'drought') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। পানির অভাব। নিয়মিত সেচ দিন।`;
      alertMessage = 'Risk: Drought. Water shortage detected. Irrigate regularly.';
    } else if (risk.type === 'high_humidity') {
      alertMessageBn = `ঝুঁকি: ${riskBn} (রোগের ঝুঁকি)। ছত্রাকনাশক স্প্রে করুন।`;
      alertMessage = 'Risk: High humidity with disease risk. Apply fungicide spray.';
    } else if (risk.type === 'flood') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। জলাবদ্ধতা এড়াতে নিকাশ নিশ্চিত করুন।`;
      alertMessage = 'Risk: Flood. Ensure proper drainage to avoid waterlogging.';
    }
  } else if (cropType === 'wheat') {
    if (risk.type === 'heat_stress') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। উচ্চ তাপমাত্রা আপনার ${cropBn} ফসলকে ক্ষতি করবে। ছায়া প্রদান করুন এবং সেচ বাড়ান।`;
      alertMessage = 'Risk: Heat stress. High temperature will damage wheat. Provide shade and increase irrigation.';
    } else if (risk.type === 'drought') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। পানির অভাব। এখনই সেচ দিন।`;
      alertMessage = 'Risk: Drought. Water shortage. Irrigate immediately.';
    }
  } else if (cropType === 'mango') {
    if (risk.type === 'drought') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। পানির অভাব ফল গঠনে সমস্যা। সেচ দিন।`;
      alertMessage = 'Risk: Drought. Water shortage affects fruit development. Irrigate.';
    } else if (risk.type === 'heat_stress') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। উচ্চ তাপমাত্রা ফল পোড়াবে। ছায়া নেট ব্যবহার করুন।`;
      alertMessage = 'Risk: Heat stress. High temperature causes fruit burn. Use shade nets.';
    } else if (risk.type === 'high_humidity') {
      alertMessageBn = `ঝুঁকি: ${riskBn} (রোগ)। ছত্রাকনাশক স্প্রে করুন।`;
      alertMessage = 'Risk: High humidity with disease. Apply fungicide.';
    }
  } else if (cropType === 'brinjal') {
    if (risk.type === 'drought') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। পানির অভাব ${cropBn} কে ক্ষতি করবে। সেচ দিন।`;
      alertMessage = 'Risk: Drought. Water shortage will damage brinjal. Irrigate.';
    } else if (risk.type === 'high_humidity') {
      alertMessageBn = `ঝুঁকি: ${riskBn} (কীটপতঙ্গ)। কীটনাশক ব্যবহার করুন।`;
      alertMessage = 'Risk: High humidity with pest risk. Apply insecticide.';
    } else if (risk.type === 'cold_stress') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। নিম্ন তাপমাত্রা। আচ্ছাদন প্রদান করুন।`;
      alertMessage = 'Risk: Cold stress. Low temperature detected. Provide covering.';
    }
  } else if (cropType === 'mustard') {
    if (risk.type === 'drought') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। পানির অভাব। সেচ ব্যবস্থা চালু করুন।`;
      alertMessage = 'Risk: Drought. Water shortage. Start irrigation.';
    } else if (risk.type === 'heat_stress') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। উচ্চ তাপমাত্রা ফুল ফোটাতে সমস্যা। সেচ বাড়ান।`;
      alertMessage = 'Risk: Heat stress. High temperature affects flowering. Increase irrigation.';
    } else if (risk.type === 'cold_stress') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। শীতল তাপমাত্রা। পর্যবেক্ষণ করুন।`;
      alertMessage = 'Risk: Cold stress. Monitor low temperature.';
    }
  } else if (cropType === 'lentil') {
    if (risk.type === 'drought') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। পানির অভাব। সেচ দিন।`;
      alertMessage = 'Risk: Drought. Water shortage. Irrigate.';
    } else if (risk.type === 'heat_stress') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। উচ্চ তাপমাত্রা ফলন কমাবে। ছায়া প্রদান করুন।`;
      alertMessage = 'Risk: Heat stress. High temperature reduces yield. Provide shade.';
    } else if (risk.type === 'flood') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। জলাবদ্ধতা এড়ান।`;
      alertMessage = 'Risk: Flood. Avoid waterlogging.';
    }
  } else if (cropType === 'banana') {
    if (risk.type === 'drought') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। পানির অভাব। নিয়মিত সেচ দিন।`;
      alertMessage = 'Risk: Drought. Water shortage. Irrigate regularly.';
    } else if (risk.type === 'flood') {
      alertMessageBn = `ঝুঁকি: ${riskBn} (জলাবদ্ধতা)। নিকাশ ব্যবস্থা চেক করুন।`;
      alertMessage = 'Risk: Flood. Waterlogging risk. Check drainage system.';
    } else if (risk.type === 'cold_stress') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। নিম্ন তাপমাত্রা। আচ্ছাদন করুন।`;
      alertMessage = 'Risk: Cold stress. Low temperature. Provide covering.';
    }
  } else if (cropType === 'sugarcane') {
    if (risk.type === 'drought') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। পানির অভাব ফলন কমাবে। সেচ বাড়ান।`;
      alertMessage = 'Risk: Drought. Water shortage reduces yield. Increase irrigation.';
    } else if (risk.type === 'flood') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। ভারী বৃষ্টি লোডিং ঘটাবে। নিকাশ নিশ্চিত করুন।`;
      alertMessage = 'Risk: Flood. Heavy rain causes lodging. Ensure drainage.';
    }
  } else if (cropType === 'onion') {
    if (risk.type === 'cold_stress') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। নিম্ন তাপমাত্রা। আচ্ছাদন প্রদান করুন।`;
      alertMessage = 'Risk: Cold stress. Low temperature. Provide covering.';
    } else if (risk.type === 'high_humidity') {
      alertMessageBn = `ঝুঁকি: ${riskBn} (পচন)। আর্দ্রতা কমানোর চেষ্টা করুন এবং ছত্রাকনাশক ব্যবহার করুন।`;
      alertMessage = 'Risk: High humidity with rot risk. Reduce humidity and apply fungicide.';
    } else if (risk.type === 'drought') {
      alertMessageBn = `ঝুঁকি: ${riskBn}। পানির অভাব। সেচ দিন।`;
      alertMessage = 'Risk: Drought. Water shortage. Irrigate.';
    }
  }
  
  return {
    cropType,
    location,
    riskLevel: risk.level,
    riskType: risk.type,
    message: alertMessage,
    messageBn: alertMessageBn,
    weather,
    timestamp: new Date()
  };
}

// Main function to check for alerts
export async function checkForAlerts(userCropType: string, location: string): Promise<Alert | null> {
  const weather = await fetchWeather(location);
  if (!weather) return null;
  
  const risk = calculateRisk(userCropType, weather);
  const alert = generateAlert(userCropType, weather, risk, location);
  return alert;
}
