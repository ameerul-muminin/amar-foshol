'use client';

import React, { useState } from 'react';
import { AlertCircle, ChevronDown, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import AdvisoryCard from './advisory-card';
import { Advisory, clearAdvisoryHistory, getAdvisoryHistory } from '@/lib/advisory-service';

interface AdvisoryPanelProps {
  advisories: Advisory[];
  showHistory?: boolean;
  compact?: boolean;
}

export default function AdvisoryPanel({
  advisories,
  showHistory = true,
  compact = false,
}: AdvisoryPanelProps) {
  const [dismissedAdvisories, setDismissedAdvisories] = useState<Set<string>>(new Set());
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [historyAdvisories, setHistoryAdvisories] = useState<Advisory[]>([]);
  const [expandedHistory, setExpandedHistory] = useState(false);

  const visibleAdvisories = advisories.filter((a) => !dismissedAdvisories.has(a.id));

  const handleDismiss = (id: string) => {
    setDismissedAdvisories((prev) => new Set([...prev, id]));
  };

  const handleShowHistory = () => {
    if (!showHistoryPanel) {
      const history = getAdvisoryHistory(20);
      setHistoryAdvisories(history);
      setShowHistoryPanel(true);
    } else {
      setShowHistoryPanel(false);
    }
  };

  const handleClearHistory = () => {
    clearAdvisoryHistory();
    setHistoryAdvisories([]);
    alert('উপদেশ ইতিহাস মুছে দেওয়া হয়েছে');
  };

  if (visibleAdvisories.length === 0 && !showHistory) {
    return null;
  }

  // Group advisories by type
  const criticalAdvisories = visibleAdvisories.filter((a) => a.type === 'critical');
  const warningAdvisories = visibleAdvisories.filter((a) => a.type === 'warning');
  const infoAdvisories = visibleAdvisories.filter((a) => a.type === 'info');
  const successAdvisories = visibleAdvisories.filter((a) => a.type === 'success');

  if (compact) {
    return (
      <div className="space-y-2">
        {/* Critical Alerts */}
        {criticalAdvisories.map((advisory) => (
          <AdvisoryCard
            key={advisory.id}
            advisory={advisory}
            onDismiss={handleDismiss}
            compact
          />
        ))}

        {/* Warnings */}
        {warningAdvisories.map((advisory) => (
          <AdvisoryCard
            key={advisory.id}
            advisory={advisory}
            onDismiss={handleDismiss}
            compact
          />
        ))}

        {/* Info & Success */}
        {[...infoAdvisories, ...successAdvisories].slice(0, 2).map((advisory) => (
          <AdvisoryCard
            key={advisory.id}
            advisory={advisory}
            onDismiss={handleDismiss}
            compact
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Advisories */}
      {visibleAdvisories.length > 0 && (
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            কৃষি পরামর্শ ও সতর্কতা
          </h2>

          {/* Summary Stats */}
          {(criticalAdvisories.length > 0 ||
            warningAdvisories.length > 0) && (
            <Card className="mb-6 border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {criticalAdvisories.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-red-100/50 rounded-lg">
                      <div className="text-3xl">🚨</div>
                      <div>
                        <div className="text-xs font-bold text-red-700 uppercase">সতর্কতা</div>
                        <div className="text-2xl font-bold text-red-900">
                          {criticalAdvisories.length}
                        </div>
                      </div>
                    </div>
                  )}
                  {warningAdvisories.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-yellow-100/50 rounded-lg">
                      <div className="text-3xl">⚠️</div>
                      <div>
                        <div className="text-xs font-bold text-yellow-700 uppercase">সতর্কতা</div>
                        <div className="text-2xl font-bold text-yellow-900">
                          {warningAdvisories.length}
                        </div>
                      </div>
                    </div>
                  )}
                  {successAdvisories.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-green-100/50 rounded-lg">
                      <div className="text-3xl">✅</div>
                      <div>
                        <div className="text-xs font-bold text-green-700 uppercase">ভালো</div>
                        <div className="text-2xl font-bold text-green-900">
                          {successAdvisories.length}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Critical Advisories */}
          {criticalAdvisories.length > 0 && (
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-bold text-red-900">🚨 গুরুতর সতর্কতা</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {criticalAdvisories.map((advisory) => (
                  <AdvisoryCard
                    key={advisory.id}
                    advisory={advisory}
                    onDismiss={handleDismiss}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Warning Advisories */}
          {warningAdvisories.length > 0 && (
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-bold text-yellow-900">⚠️ সতর্কতা</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {warningAdvisories.map((advisory) => (
                  <AdvisoryCard
                    key={advisory.id}
                    advisory={advisory}
                    onDismiss={handleDismiss}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Info & Success Advisories */}
          {[...infoAdvisories, ...successAdvisories].length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-emerald-900">
                ℹ️ তথ্য ও পরামর্শ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...infoAdvisories, ...successAdvisories].map((advisory) => (
                  <AdvisoryCard
                    key={advisory.id}
                    advisory={advisory}
                    onDismiss={handleDismiss}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Advisories Message */}
      {visibleAdvisories.length === 0 && (
        <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="pt-8 text-center pb-8">
            <div className="text-6xl mb-4">☀️</div>
            <p className="text-xl text-emerald-900 font-semibold mb-2">কোন সতর্কতা নেই</p>
            <p className="text-emerald-700">
              বর্তমানে আপনার এলাকার আবহাওয়া ফসল সংরক্ষণের জন্য নিরাপদ।
            </p>
          </CardContent>
        </Card>
      )}

      {/* History Panel */}
      {showHistory && (
        <Card className="border-2 border-gray-300 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-emerald-900 flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                সতর্কতা ইতিহাস
              </CardTitle>
              <button
                onClick={handleShowHistory}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${showHistoryPanel ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </CardHeader>

          {showHistoryPanel && (
            <CardContent className="space-y-4">
              {historyAdvisories.length > 0 ? (
                <>
                  {/* Expandable History */}
                  <div className="space-y-2">
                    {historyAdvisories.slice(0, expandedHistory ? undefined : 5).map((advisory) => (
                      <div
                        key={advisory.id}
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-300 text-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-gray-900">{advisory.titleBn}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              {new Date(advisory.timestamp).toLocaleString('bn-BD')}
                            </div>
                          </div>
                          <div className="text-lg">{advisory.icon}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Expand/Collapse Button */}
                  {historyAdvisories.length > 5 && (
                    <Button
                      onClick={() => setExpandedHistory(!expandedHistory)}
                      variant="ghost"
                      className="w-full text-emerald-600 hover:bg-emerald-50"
                    >
                      {expandedHistory ? 'কম দেখান' : `আরও দেখান (${historyAdvisories.length - 5})`}
                    </Button>
                  )}

                  {/* Clear Button */}
                  <Button
                    onClick={handleClearHistory}
                    variant="ghost"
                    className="w-full text-red-600 hover:bg-red-50"
                  >
                    ইতিহাস মুছুন
                  </Button>
                </>
              ) : (
                <p className="text-center text-gray-500 py-4">কোন ইতিহাস নেই</p>
              )}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
