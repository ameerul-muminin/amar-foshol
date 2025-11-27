'use client';

import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Advisory, getAdvisoryColors, getAdvisoryIcon, getRiskLevelBn } from '@/lib/advisory-service';

interface AdvisoryCardProps {
  advisory: Advisory;
  onDismiss?: (id: string) => void;
  compact?: boolean;
}

export default function AdvisoryCard({ advisory, onDismiss, compact = false }: AdvisoryCardProps) {
  const colors = getAdvisoryColors(advisory.type, advisory.riskLevel);
  const icon = getAdvisoryIcon(advisory.icon);
  const riskLevelText = getRiskLevelBn(advisory.riskLevel);

  if (compact) {
    return (
      <div
        className={`rounded-lg border-2 ${colors.border} bg-gradient-to-r ${colors.bg} p-4 shadow-md hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`text-2xl flex-shrink-0`}>{icon}</div>
            <div className="flex-1">
              <h3 className={`font-bold ${colors.text}`}>{advisory.titleBn}</h3>
              <p className={`text-sm ${colors.text} opacity-90 mt-1`}>{advisory.messageBn}</p>
            </div>
          </div>
          {onDismiss && (
            <button
              onClick={() => onDismiss(advisory.id)}
              className="p-1 hover:bg-black/10 rounded transition-colors flex-shrink-0"
              aria-label="বাতিল করুন"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card
      className={`border-2 shadow-lg overflow-hidden transition-all hover:shadow-2xl ${colors.border} bg-gradient-to-br ${colors.bg}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className={`text-4xl`}>{icon}</div>
            <div className="flex-1">
              <CardTitle className={colors.text}>{advisory.titleBn}</CardTitle>
              <div className={`text-xs font-semibold mt-1 inline-block px-2 py-1 rounded ${colors.icon} bg-white/50`}>
                {riskLevelText} • {advisory.affectedDays} দিন প্রভাবিত
              </div>
            </div>
          </div>
          {onDismiss && (
            <button
              onClick={() => onDismiss(advisory.id)}
              className={`p-2 hover:bg-white/30 rounded-lg transition-colors flex-shrink-0 ${colors.icon}`}
              aria-label="বাতিল করুন"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Message Section */}
        <div className={`p-3 rounded-lg bg-white/50 border-l-4 ${colors.border}`}>
          <p className={`${colors.text} font-medium leading-relaxed`}>{advisory.messageBn}</p>
        </div>

        {/* Action Section */}
        <div className="pt-2 border-t border-current/10">
          <div className={`text-sm font-bold ${colors.text} mb-2 flex items-center gap-2`}>
            <AlertCircle className="w-4 h-4" />
            সুপারিশকৃত পদক্ষেপ:
          </div>
          <div className={`text-sm ${colors.text} leading-relaxed bg-white/40 p-3 rounded`}>
            {advisory.actionBn}
          </div>
        </div>

        {/* Risk Indicator */}
        <div className="flex items-center gap-2 pt-2">
          <div className="text-xs font-bold uppercase tracking-wide">ঝুঁকি স্তর:</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-3 w-3 rounded-full transition-all ${
                  level <= advisory.riskLevel ? `${colors.icon}` : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <div className={`text-xs font-semibold ${colors.text} ml-auto`}>{riskLevelText}</div>
        </div>

        {/* Time Info */}
        <div className={`text-xs ${colors.text} opacity-75 flex items-center justify-between pt-2`}>
          <span>সময়: {new Date(advisory.timestamp).toLocaleString('bn-BD')}</span>
          <span className="text-right">শর্ত: {advisory.condition}</span>
        </div>
      </CardContent>
    </Card>
  );
}
