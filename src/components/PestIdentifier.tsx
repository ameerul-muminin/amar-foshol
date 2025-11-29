'use client';

import { useState, useRef } from 'react';
import { Upload, Loader, X, Info } from 'lucide-react';
import { compressImage, analyzePestImage, getRiskLabelBn, getRiskColor, getRiskIcon } from '@/lib/pest-identification';
import type { PestAnalysisResult } from '@/lib/pest-identification';

interface PestIdentifierProps {
  lang?: 'bn' | 'en';
  onAnalysisComplete?: (result: PestAnalysisResult) => void;
}

export default function PestIdentifier({ lang = 'bn', onAnalysisComplete }: PestIdentifierProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PestAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const translations = {
    bn: {
      title: '🐛 কীটপতঙ্গ সনাক্তকরণ',
      subtitle: 'আপনার ফসলের ছবি আপলোড করুন এবং সমস্যা চিহ্নিত করুন',
      uploadButton: 'ছবি আপলোড করুন',
      cameraButton: 'ক্যামেরা দিয়ে তুলুন',
      analyzing: 'বিশ্লেষণ হচ্ছে...',
      noRisk: 'কীটপতঙ্গ সনাক্ত হয়নি',
      description: 'বর্ণনা',
      symptoms: 'লক্ষণসমূহ',
      immediate: '🚨 এখনই করুন',
      shortTerm: '📅 ৩-৭ দিনে করুন',
      prevention: '🛡️ ভবিষ্যতে প্রতিরোধ',
      localTreatment: '🌿 স্থানীয় পদ্ধতি',
      chemicalOptions: '🧪 রাসায়নিক বিকল্প',
      estimatedLoss: '⚠️ সম্ভাব্য ক্ষতি',
      sources: 'তথ্যসূত্র',
      dragDrop: 'ছবি এখানে টেনে আনুন বা ক্লিক করুন',
      loading: 'লোড হচ্ছে...',
      maxSize: 'সর্বোচ্চ ৫MB',
      tryAnother: 'অন্য ছবি চেষ্টা করুন',
    },
    en: {
      title: '🐛 Pest Identifier',
      subtitle: 'Upload a photo of your crop to identify problems',
      uploadButton: 'Upload Image',
      cameraButton: 'Take Photo',
      analyzing: 'Analyzing...',
      noRisk: 'No pest detected',
      description: 'Description',
      symptoms: 'Symptoms',
      immediate: '🚨 Immediate Actions',
      shortTerm: '📅 3-7 Days',
      prevention: '🛡️ Prevention',
      localTreatment: '🌿 Local Methods',
      chemicalOptions: '🧪 Chemical Options',
      estimatedLoss: '⚠️ Estimated Loss',
      sources: 'Sources',
      dragDrop: 'Drag image here or click',
      loading: 'Loading...',
      maxSize: 'Max 5MB',
      tryAnother: 'Try another image',
    },
  };

  const t = translations[lang];

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError(lang === 'bn' ? 'শুধুমাত্র ছবি ফাইল আপলোড করুন' : 'Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(lang === 'bn' ? 'ছবি ১০MB এর কম হতে হবে' : 'Image must be less than 10MB');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Compress image
      const compressed = await compressImage(file, 1);

      // Analyze with Gemini
      const analysisResult = await analyzePestImage(compressed);

      if (analysisResult.success && analysisResult.data) {
        setResult(analysisResult.data);
        onAnalysisComplete?.(analysisResult.data);
      } else {
        setError(analysisResult.error || (lang === 'bn' ? 'বিশ্লেষণ ব্যর্থ হয়েছে' : 'Analysis failed'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === 'bn' ? 'একটি ত্রুটি ঘটেছে' : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const resetAnalysis = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Header */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t.title}</h3>
        <p className="text-sm text-gray-600 mb-6">{t.subtitle}</p>

        {!result ? (
          <>
            {/* Upload Area */}
            {!preview ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDragDrop}
                className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center cursor-pointer hover:bg-emerald-50 transition-colors"
              >
                <Upload className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <p className="text-gray-900 font-medium mb-2">{t.dragDrop}</p>
                <p className="text-sm text-gray-500 mb-4">{t.maxSize}</p>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                  >
                    {t.uploadButton}
                  </button>
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    {t.cameraButton}
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </div>
            ) : (
              <>
                {/* Image Preview */}
                <div className="relative mb-6">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
                  />
                  {!loading && (
                    <button
                      onClick={resetAnalysis}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-8 bg-blue-50 rounded-lg border border-blue-200">
                    <Loader className="w-5 h-5 animate-spin text-blue-500 mr-2" />
                    <p className="text-blue-900 font-medium">{t.analyzing}</p>
                  </div>
                )}
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-red-900 mb-4">
                <p className="font-medium mb-2">❌ {lang === 'bn' ? 'ত্রুটি' : 'Error'}</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Image Thumbnail */}
            {preview && (
              <div className="mb-6">
                <img
                  src={preview}
                  alt="Analyzed"
                  className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                />
              </div>
            )}

            {/* Analysis Result */}
            <div className={`rounded-lg p-6 border-2 mb-6 ${getRiskColor(result.riskLevel)}`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                    {getRiskIcon(result.riskLevel)} {result.pestNameBn}
                  </h2>
                  <p className="text-sm opacity-80">{result.pestNameLatin}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{Math.round(result.confidence * 100)}%</p>
                  <p className="text-sm opacity-75">{lang === 'bn' ? 'আত্মবিশ্বাস' : 'Confidence'}</p>
                </div>
              </div>

              {/* Risk Level Badge */}
              <p className="text-lg font-bold mb-4">{getRiskLabelBn(result.riskLevel)}</p>

              {/* Description */}
              <p className="mb-6 leading-relaxed">{result.descriptionBn}</p>

              {/* Symptoms */}
              {result.symptomsBn && result.symptomsBn.length > 0 && (
                <section className="mb-6">
                  <h3 className="font-bold mb-3">📋 {t.symptoms}</h3>
                  <ul className="space-y-2">
                    {result.symptomsBn.map((symptom, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-lg">→</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Action Plan */}
              <section className="mb-6">
                {result.actionPlan.immediateBn && result.actionPlan.immediateBn.length > 0 && (
                  <div className="mb-4 p-4 bg-red-100 rounded-lg">
                    <h3 className="font-bold mb-2">{t.immediate}</h3>
                    <ul className="space-y-2">
                      {result.actionPlan.immediateBn.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span>✓</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.actionPlan.shortTermBn && result.actionPlan.shortTermBn.length > 0 && (
                  <div className="mb-4 p-4 bg-yellow-100 rounded-lg">
                    <h3 className="font-bold mb-2">{t.shortTerm}</h3>
                    <ul className="space-y-2">
                      {result.actionPlan.shortTermBn.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span>✓</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.actionPlan.preventionBn && result.actionPlan.preventionBn.length > 0 && (
                  <div className="p-4 bg-green-100 rounded-lg">
                    <h3 className="font-bold mb-2">{t.prevention}</h3>
                    <ul className="space-y-2">
                      {result.actionPlan.preventionBn.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span>✓</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              {/* Local Treatment */}
              {result.localTreatmentBn && result.localTreatmentBn.length > 0 && (
                <section className="mb-6">
                  <h3 className="font-bold mb-3">{t.localTreatment}</h3>
                  <ul className="space-y-2">
                    {result.localTreatmentBn.map((method, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span>🌿</span>
                        <span>{method}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Chemical Options */}
              {result.chemicalOptionsBn && result.chemicalOptionsBn.length > 0 && (
                <section className="mb-6 p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-bold mb-3">{t.chemicalOptions}</h3>
                  <ul className="space-y-2">
                    {result.chemicalOptionsBn.map((chemical, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span>⚗️</span>
                        <span>{chemical}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Estimated Loss */}
              <section className="mb-6 p-4 bg-orange-100 rounded-lg">
                <h3 className="font-bold mb-2">{t.estimatedLoss}</h3>
                <p>{result.estimatedLossBn}</p>
              </section>

              {/* Sources */}
              {result.sources && result.sources.length > 0 && (
                <section className="text-sm text-gray-600 pt-4 border-t border-gray-300">
                  <details>
                    <summary className="cursor-pointer font-medium">{t.sources}</summary>
                    <ul className="mt-2 space-y-1">
                      {result.sources.map((source, idx) => (
                        <li key={idx}>• {source}</li>
                      ))}
                    </ul>
                  </details>
                </section>
              )}
            </div>

            {/* Try Another Button */}
            <button
              onClick={resetAnalysis}
              className="w-full px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              {t.tryAnother}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
