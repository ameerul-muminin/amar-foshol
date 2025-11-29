"use client";

import React, { useEffect, useState } from 'react';
import { computeMonthlyLossPrevention, saveMonthlySummary, getMonthlySummaries } from '@/lib/lossPrevention';
import { getFarmerBatches, getFarmerBatches as _unused } from '@/lib/cropBatch';
import { getCurrentFarmer } from '@/lib/auth';

const LossPreventionScore: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [savedKg, setSavedKg] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<any>>([]);

  const fetchAndCompute = async () => {
    setLoading(true);
    try {
      const farmer = await getCurrentFarmer();
      if (!farmer) return;
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const res = await computeMonthlyLossPrevention(farmer.id, month, year);
      setSavedKg(res.savedKg);
      setScore(res.score);

      // persist summary for trend chart
      await saveMonthlySummary(farmer.id, month, year, res);

      // load recent history
      const h = await getMonthlySummaries(farmer.id, 6);
      setHistory(h.reverse());
    } catch (e) {
      console.error('Error computing loss prevention', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndCompute();
  }, []);

  return (
    <div className="score-card bg-white p-4 rounded-2xl shadow-sm text-center">
      <h3 className="text-lg font-semibold mb-3">🥬 এই মাসে বাঁচানো খাদ্য</h3>
      <div className="flex items-center justify-center mb-3">
        <div style={{
          width: 120, height: 120,
          borderRadius: '50%', background: `conic-gradient(#10B981 ${score}%, #EF4444 ${score}%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: 24, fontWeight: 700 }}>{score}%</span>
        </div>
      </div>
      <p className="mb-3"><strong>{savedKg} কেজি</strong> খাদ্য বাঁচিয়েছেন!</p>

      <div className="mb-3">
        {loading ? (
          <span className="text-sm text-gray-500">লোড হচ্ছে...</span>
        ) : (
          <button onClick={fetchAndCompute} className="px-4 py-2 rounded-md bg-emerald-600 text-white">স্কোর আপডেট করুন</button>
        )}
      </div>

      {/* Small trend sparkline */}
      {history && history.length > 0 && (
        <div className="mt-4 text-left">
          <h4 className="text-sm text-gray-600 mb-2">৬ মাসের ট্রেন্ড</h4>
          <div className="flex items-end gap-2 h-20">
            {history.map((h, idx) => (
              <div key={idx} className="flex-1 h-full flex items-end">
                <div style={{ height: `${Math.min(100, (h.score || 0))}%` }} className="bg-emerald-400 w-full rounded-t-md"></div>
                <div className="text-xs text-gray-500 mt-1 text-center w-full">{h.month}/{String(h.year).slice(-2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LossPreventionScore;
