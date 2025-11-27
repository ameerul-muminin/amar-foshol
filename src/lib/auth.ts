import localforage from 'localforage';

// Configure localforage
const farmerStore = localforage.createInstance({
  name: 'amar-foshol',
  storeName: 'farmers'
});

// Farmer interface (from PRD)
export interface Farmer {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  language: 'bn' | 'en';
  createdAt: Date;
  lastLogin: Date;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  icon: string;
  earnedAt: Date;
  category: 'milestone' | 'achievement' | 'streak';
}

// Available badges
export const availableBadges = {
  first_harvest: {
    id: 'badge_first_harvest',
    name: 'First Harvest',
    nameBn: 'প্রথম ফসল',
    description: 'Registered your first account',
    descriptionBn: 'প্রথম অ্যাকাউন্ট তৈরি করেছেন',
    icon: '🌾',
    category: 'milestone' as const
  },
  first_batch: {
    id: 'badge_first_batch',
    name: 'First Batch',
    nameBn: 'প্রথম ব্যাচ',
    description: 'Registered your first crop batch',
    descriptionBn: 'প্রথম ফসল ব্যাচ নিবন্ধন করেছেন',
    icon: '📦',
    category: 'milestone' as const
  },
  alert_farmer: {
    id: 'badge_alert_farmer',
    name: 'Alert Farmer',
    nameBn: 'সতর্ক কৃষক',
    description: 'Viewed 5 weather forecasts',
    descriptionBn: '৫টি আবহাওয়া পূর্বাভাস দেখেছেন',
    icon: '🌤️',
    category: 'achievement' as const
  },
  risk_mitigator: {
    id: 'badge_risk_mitigator',
    name: 'Risk Mitigator',
    nameBn: 'ঝুঁকি প্রতিরোধী',
    description: 'Completed 3 interventions',
    descriptionBn: '৩টি হস্তক্ষেপ সম্পন্ন করেছেন',
    icon: '🛡️',
    category: 'achievement' as const
  },
  expert: {
    id: 'badge_expert',
    name: 'Expert',
    nameBn: 'বিশেষজ্ঞ',
    description: 'Saved 100kg from loss',
    descriptionBn: '১০০ কেজি ক্ষতি থেকে রক্ষা করেছেন',
    icon: '🏆',
    category: 'achievement' as const
  },
  regular: {
    id: 'badge_regular',
    name: 'Regular',
    nameBn: 'নিয়মিত',
    description: 'Logged in 7 consecutive days',
    descriptionBn: '৭ দিন একটানা লগইন করেছেন',
    icon: '⭐',
    category: 'streak' as const
  },
  batch_master: {
    id: 'badge_batch_master',
    name: 'Batch Master',
    nameBn: 'ব্যাচ মাস্টার',
    description: 'Registered 5 crop batches',
    descriptionBn: '৫টি ফসল ব্যাচ নিবন্ধন করেছেন',
    icon: '📊',
    category: 'milestone' as const
  },
  weather_watcher: {
    id: 'badge_weather_watcher',
    name: 'Weather Watcher',
    nameBn: 'আবহাওয়া পর্যবেক্ষক',
    description: 'Checked weather 10 times',
    descriptionBn: '১০ বার আবহাওয়া দেখেছেন',
    icon: '☁️',
    category: 'achievement' as const
  }
};

// Simple SHA-256 hash function (browser-compatible)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Generate unique ID
export function generateId(): string {
  return `farmer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Register new farmer
export async function registerFarmer(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  language: 'bn' | 'en';
}): Promise<Farmer> {
  try {
    // Check if email already exists
    const existingFarmers = await getAllFarmers();
    const emailExists = existingFarmers.some(f => f.email === data.email);
    
    if (emailExists) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create farmer object
    const farmer: Farmer = {
      id: generateId(),
      name: data.name,
      email: data.email,
      passwordHash,
      phone: data.phone,
      language: data.language,
      createdAt: new Date(),
      lastLogin: new Date(),
      badges: []
    };

    // Store in localforage
    await farmerStore.setItem(`farmer_${farmer.id}`, farmer);
    
    // Store current user session
    await farmerStore.setItem('current_user', farmer.id);

    // Award "First Harvest" badge
    const firstBadge: Badge = {
      ...availableBadges.first_harvest,
      earnedAt: new Date()
    };

    farmer.badges.push(firstBadge);
    await farmerStore.setItem(`farmer_${farmer.id}`, farmer);

    return farmer;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Login farmer
export async function loginFarmer(email: string, password: string): Promise<Farmer> {
  try {
    const farmers = await getAllFarmers();
    const farmer = farmers.find(f => f.email === email);

    if (!farmer) {
      throw new Error('Invalid email or password');
    }

    const isValid = await verifyPassword(password, farmer.passwordHash);
    
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    farmer.lastLogin = new Date();
    await farmerStore.setItem(`farmer_${farmer.id}`, farmer);
    
    // Set current user
    await farmerStore.setItem('current_user', farmer.id);

    return farmer;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Get all farmers (for checking duplicates)
export async function getAllFarmers(): Promise<Farmer[]> {
  try {
    const farmers: Farmer[] = [];
    await farmerStore.iterate((value: any, key: string) => {
      if (key.startsWith('farmer_farmer_')) {
        farmers.push(value);
      }
    });
    return farmers;
  } catch (error) {
    console.error('Error fetching farmers:', error);
    return [];
  }
}

// Get current logged-in farmer
export async function getCurrentFarmer(): Promise<Farmer | null> {
  try {
    const userId = await farmerStore.getItem<string>('current_user');
    if (!userId) return null;
    
    const farmer = await farmerStore.getItem<Farmer>(`farmer_${userId}`);
    return farmer;
  } catch (error) {
    console.error('Error getting current farmer:', error);
    return null;
  }
}

// Logout
export async function logout(): Promise<void> {
  try {
    await farmerStore.removeItem('current_user');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Update farmer profile
export async function updateFarmer(farmerId: string, updates: Partial<Farmer>): Promise<Farmer | null> {
  try {
    const farmer = await farmerStore.getItem<Farmer>(`farmer_${farmerId}`);
    if (!farmer) return null;

    const updatedFarmer = { ...farmer, ...updates };
    await farmerStore.setItem(`farmer_${farmerId}`, updatedFarmer);
    
    return updatedFarmer;
  } catch (error) {
    console.error('Update error:', error);
    return null;
  }
}

// Award badge to farmer
export async function awardBadge(
  farmerId: string, 
  badgeKey: keyof typeof availableBadges
): Promise<Farmer | null> {
  try {
    const farmer = await farmerStore.getItem<Farmer>(`farmer_${farmerId}`);
    if (!farmer) return null;

    // Check if badge already earned
    const badgeExists = farmer.badges.some(b => b.id === availableBadges[badgeKey].id);
    if (badgeExists) return farmer;

    // Add new badge
    const newBadge: Badge = {
      ...availableBadges[badgeKey],
      earnedAt: new Date()
    };

    farmer.badges.push(newBadge);
    await farmerStore.setItem(`farmer_${farmerId}`, farmer);

    console.log(`🏆 Badge awarded: ${newBadge.name}`);
    return farmer;
  } catch (error) {
    console.error('Error awarding badge:', error);
    return null;
  }
}

// Check and award badges based on conditions
export async function checkAndAwardBadges(farmerId: string): Promise<void> {
  try {
    const { getFarmerBatches, getFarmerStats } = await import('./cropBatch');
    const stats = await getFarmerStats(farmerId);

    // Award "First Batch" badge
    if (stats.totalBatches >= 1) {
      await awardBadge(farmerId, 'first_batch');
    }

    // Award "Batch Master" badge
    if (stats.totalBatches >= 5) {
      await awardBadge(farmerId, 'batch_master');
    }

    // Award "Risk Mitigator" badge
    if (stats.interventionCount >= 3) {
      await awardBadge(farmerId, 'risk_mitigator');
    }

    // Award "Expert" badge (if saved 100kg)
    // This would be calculated from interventions that prevented loss
    // For now, we'll leave this for future implementation
  } catch (error) {
    console.error('Error checking badges:', error);
  }
}