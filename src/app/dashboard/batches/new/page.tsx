'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plant, 
  ArrowLeft, 
  Calendar,
  Scales,
  Warehouse,
  MapPin,
  Globe
} from '@phosphor-icons/react';

export default function NewBatchPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [isLoading, setIsLoading] = useState(false);
  const [farmer, setFarmer] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    cropType: 'paddy' as const,
    weightKg: '',
    harvestDate: '',
    division: '',
    district: '',
    storageType: '',
    notes: ''
  });

  // Error state
  const [errors, setErrors] = useState({
    weightKg: '',
    harvestDate: '',
    division: '',
    district: '',
    storageType: ''
  });

  // Available districts based on selected division
  const [availableDistricts, setAvailableDistricts] = useState<any[]>([]);

  // Translations
  const t = {
    bn: {
      title: 'নতুন ফসল নিবন্ধন',
      subtitle: 'আপনার ফসলের তথ্য যুক্ত করুন',
      cropType: 'ফসলের ধরন',
      paddy: 'ধান/চাল',
      weight: 'আনুমানিক ওজন (কেজি)',
      weightPlaceholder: 'যেমন: ১০০',
      harvestDate: 'কাটার তারিখ',
      division: 'বিভাগ',
      divisionPlaceholder: 'বিভাগ নির্বাচন করুন',
      district: 'জেলা',
      districtPlaceholder: 'জেলা নির্বাচন করুন',
      storageType: 'সংরক্ষণের ধরন',
      storagePlaceholder: 'সংরক্ষণ পদ্ধতি নির্বাচন করুন',
      notes: 'নোট (ঐচ্ছিক)',
      notesPlaceholder: 'অতিরিক্ত তথ্য...',
      submit: 'ফসল নিবন্ধন করুন',
      cancel: 'বাতিল',
      storage: {
        jute_bag: 'পাটের বস্তা',
        silo: 'সাইলো',
        open_area: 'খোলা জায়গা',
        warehouse: 'গুদামঘর',
        indoor: 'ঘরের ভিতর'
      },
      errors: {
        weightRequired: 'ওজন অবশ্যই প্রয়োজন',
        weightMin: 'ওজন কমপক্ষে ১ কেজি হতে হবে',
        dateRequired: 'কাটার তারিখ অবশ্যই প্রয়োজন',
        dateFuture: 'ভবিষ্যতের তারিখ নির্বাচন করা যাবে না',
        divisionRequired: 'বিভাগ নির্বাচন করুন',
        districtRequired: 'জেলা নির্বাচন করুন',
        storageRequired: 'সংরক্ষণের ধরন নির্বাচন করুন'
      }
    },
    en: {
      title: 'New Crop Batch',
      subtitle: 'Add your crop information',
      cropType: 'Crop Type',
      paddy: 'Paddy/Rice',
      weight: 'Estimated Weight (kg)',
      weightPlaceholder: 'e.g., 100',
      harvestDate: 'Harvest Date',
      division: 'Division',
      divisionPlaceholder: 'Select division',
      district: 'District',
      districtPlaceholder: 'Select district',
      storageType: 'Storage Type',
      storagePlaceholder: 'Select storage method',
      notes: 'Notes (Optional)',
      notesPlaceholder: 'Additional information...',
      submit: 'Register Crop',
      cancel: 'Cancel',
      storage: {
        jute_bag: 'Jute Bag Stack',
        silo: 'Silo',
        open_area: 'Open Area',
        warehouse: 'Warehouse',
        indoor: 'Indoor Storage'
      },
      errors: {
        weightRequired: 'Weight is required',
        weightMin: 'Weight must be at least 1 kg',
        dateRequired: 'Harvest date is required',
        dateFuture: 'Cannot select future date',
        divisionRequired: 'Please select a division',
        districtRequired: 'Please select a district',
        storageRequired: 'Please select storage type'
      }
    }
  };

  const text = t[lang];

  useEffect(() => {
    loadFarmer();
  }, []);

  useEffect(() => {
    if (formData.division) {
      loadDistricts();
    } else {
      setAvailableDistricts([]);
      setFormData(prev => ({ ...prev, district: '' }));
    }
  }, [formData.division]);

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
    }
  };

  const loadDistricts = async () => {
    try {
      const { getDistrictsByDivision } = await import('@/lib/locations');
      const districts = getDistrictsByDivision(formData.division);
      setAvailableDistricts(districts);
    } catch (error) {
      console.error('Error loading districts:', error);
    }
  };

  // Validation functions
  const validateWeight = (weight: string): string => {
    if (!weight) return text.errors.weightRequired;
    const num = parseFloat(weight);
    if (isNaN(num) || num < 1) return text.errors.weightMin;
    return '';
  };

  const validateDate = (date: string): string => {
    if (!date) return text.errors.dateRequired;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) return text.errors.dateFuture;
    return '';
  };

  const validateDivision = (division: string): string => {
    if (!division) return text.errors.divisionRequired;
    return '';
  };

  const validateDistrict = (district: string): string => {
    if (!district) return text.errors.districtRequired;
    return '';
  };

  const validateStorage = (storage: string): string => {
    if (!storage) return text.errors.storageRequired;
    return '';
  };

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      weightKg: validateWeight(formData.weightKg),
      harvestDate: validateDate(formData.harvestDate),
      division: validateDivision(formData.division),
      district: validateDistrict(formData.district),
      storageType: validateStorage(formData.storageType)
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setIsLoading(true);

    try {
      const { createCropBatch } = await import('@/lib/cropBatch');
      const { divisions } = await import('@/lib/locations');

      // Find division and district names in both languages
      const division = divisions.find(d => d.name === formData.division || d.nameBn === formData.division);
      const district = division?.districts.find(d => d.name === formData.district || d.nameBn === formData.district);

      if (!division || !district) {
        throw new Error('Invalid location');
      }

      // Create crop batch
      const batch = await createCropBatch({
        farmerId: farmer.id,
        cropType: formData.cropType,
        weightKg: parseFloat(formData.weightKg),
        harvestDate: new Date(formData.harvestDate),
        division: division.name,
        divisionBn: division.nameBn,
        district: district.name,
        districtBn: district.nameBn,
        storageType: formData.storageType as any,
        notes: formData.notes || undefined
      });

      console.log('✅ Crop batch registered:', batch.id);

      // Redirect to batches list
      router.push('/dashboard/batches');
    } catch (error) {
      console.error('Error creating batch:', error);
      alert(lang === 'bn' ? 'নিবন্ধন ব্যর্থ হয়েছে' : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!farmer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft size={20} weight="bold" />
              <span className="font-medium">{text.cancel}</span>
            </button>

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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{text.title}</h1>
          <p className="text-gray-600">{text.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
          {/* Crop Type (Fixed) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {text.cropType} *
            </label>
            <div className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 flex items-center gap-3">
              <Plant size={20} className="text-emerald-600" weight="duotone" />
              <span className="font-medium text-gray-900">{text.paddy}</span>
            </div>
          </div>

          {/* Weight */}
          <div>
            <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
              {text.weight} *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Scales size={20} weight="duotone" />
              </div>
              <input
                type="number"
                id="weight"
                value={formData.weightKg}
                onChange={(e) => handleChange('weightKg', e.target.value)}
                placeholder={text.weightPlaceholder}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                  errors.weightKg ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors`}
                min="1"
                step="0.01"
              />
            </div>
            {errors.weightKg && (
              <p className="mt-1.5 text-sm text-red-600">{errors.weightKg}</p>
            )}
          </div>

          {/* Harvest Date */}
          <div>
            <label htmlFor="harvestDate" className="block text-sm font-semibold text-gray-700 mb-2">
              {text.harvestDate} *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Calendar size={20} weight="duotone" />
              </div>
              <input
                type="date"
                id="harvestDate"
                value={formData.harvestDate}
                onChange={(e) => handleChange('harvestDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                  errors.harvestDate ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors`}
              />
            </div>
            {errors.harvestDate && (
              <p className="mt-1.5 text-sm text-red-600">{errors.harvestDate}</p>
            )}
          </div>

          {/* Division */}
          <div>
            <label htmlFor="division" className="block text-sm font-semibold text-gray-700 mb-2">
              {text.division} *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <MapPin size={20} weight="duotone" />
              </div>
              <select
                id="division"
                value={formData.division}
                onChange={async (e) => {
                  handleChange('division', e.target.value);
                  const { divisions } = await import('@/lib/locations');
                  const div = divisions.find(d => d.name === e.target.value);
                  if (div) {
                    setAvailableDistricts(div.districts);
                  }
                }}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                  errors.division ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors appearance-none bg-white`}
              >
                <option value="">{text.divisionPlaceholder}</option>
                {(() => {
                  const { divisions } = require('@/lib/locations');
                  return divisions.map((div: any) => (
                    <option key={div.name} value={div.name}>
                      {lang === 'bn' ? div.nameBn : div.name}
                    </option>
                  ));
                })()}
              </select>
            </div>
            {errors.division && (
              <p className="mt-1.5 text-sm text-red-600">{errors.division}</p>
            )}
          </div>

          {/* District */}
          <div>
            <label htmlFor="district" className="block text-sm font-semibold text-gray-700 mb-2">
              {text.district} *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <MapPin size={20} weight="duotone" />
              </div>
              <select
                id="district"
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                disabled={!formData.division}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                  errors.district ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed`}
              >
                <option value="">{text.districtPlaceholder}</option>
                {availableDistricts.map((dist: any) => (
                  <option key={dist.name} value={dist.name}>
                    {lang === 'bn' ? dist.nameBn : dist.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.district && (
              <p className="mt-1.5 text-sm text-red-600">{errors.district}</p>
            )}
          </div>

          {/* Storage Type */}
          <div>
            <label htmlFor="storageType" className="block text-sm font-semibold text-gray-700 mb-2">
              {text.storageType} *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Warehouse size={20} weight="duotone" />
              </div>
              <select
                id="storageType"
                value={formData.storageType}
                onChange={(e) => handleChange('storageType', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                  errors.storageType ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors appearance-none bg-white`}
              >
                <option value="">{text.storagePlaceholder}</option>
                <option value="jute_bag">{text.storage.jute_bag}</option>
                <option value="silo">{text.storage.silo}</option>
                <option value="open_area">{text.storage.open_area}</option>
                <option value="warehouse">{text.storage.warehouse}</option>
                <option value="indoor">{text.storage.indoor}</option>
              </select>
            </div>
            {errors.storageType && (
              <p className="mt-1.5 text-sm text-red-600">{errors.storageType}</p>
            )}
          </div>

          {/* Notes (Optional) */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
              {text.notes}
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder={text.notesPlaceholder}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20"
          >
            {isLoading ? 'প্রক্রিয়াধীন...' : text.submit}
          </button>
        </form>
      </main>
    </div>
  );
}