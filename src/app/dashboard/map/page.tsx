"use client";

import MapClient from '@/components/MapClient';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardMapPage() {
  const router = useRouter();

  useEffect(() => {
    // placeholder for any auth checks in future
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-lg">মানচিত্র</h1>
            <div className="flex items-center gap-2">
              <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-600">বৈকল্পিক</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          <MapClient division="ঢাকা" district="ঢাকা" />
        </div>
      </main>
    </div>
  );
}
