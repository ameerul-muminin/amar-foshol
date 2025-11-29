"use client";

import MapClient from '@/components/MapClient';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { getDivisions, getDistrictsForDivision } from '@/lib/map-utils';
import { useRouter } from 'next/navigation';
import { Plant, Globe, SignOut } from '@phosphor-icons/react';

export default function DashboardMapPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const divisions = getDivisions();
  const [selectedDivision, setSelectedDivision] = useState<string>(divisions[0] ?? 'ঢাকা');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => {
    const ds = getDistrictsForDivision(divisions[0] ?? 'ঢাকা');
    return ds[0] ?? 'ঢাকা';
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { getCurrentFarmer } = await import('@/lib/auth');
        const current = await getCurrentFarmer();
        if (!current) {
          router.push('/login');
          return;
        }
        setLang(current.language || 'bn');
        // if farmer has division/district in profile, prefer that
        // (some profiles may not have these fields; guard accordingly)
        try {
          // @ts-ignore - optional field
          if (current.division) setSelectedDivision(current.division);
          // @ts-ignore
          if (current.district) setSelectedDistrict(current.district);
        } catch {}
      } catch (e) {
        console.error(e);
        router.push('/login');
      }
    };
    load();
  }, [router]);

  const handleLogout = async () => {
    try {
      const { logout } = await import('@/lib/auth');
      await logout();
      router.push('/');
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header subtitle={lang === 'bn' ? 'মানচিত্র' : 'Map'} lang={lang} setLang={setLang} onLogout={handleLogout} onBack={() => router.push('/dashboard')} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">বিভাগ / Division</label>
            <select
              value={selectedDivision}
              onChange={(e) => {
                const d = e.target.value;
                setSelectedDivision(d);
                const ds = getDistrictsForDivision(d);
                setSelectedDistrict(ds[0] ?? ds[0] ?? 'ঢাকা');
              }}
              className="w-full rounded-md border border-gray-200 p-2"
            >
              {divisions.map((div) => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">জেলা / District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full rounded-md border border-gray-200 p-2"
            >
              {getDistrictsForDivision(selectedDivision).map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <button
              onClick={() => {
                // no-op here; MapClient updates automatically via props
              }}
              className="w-full bg-emerald-600 text-white rounded-md px-4 py-2"
            >
              দেখান / Show Map
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <MapClient division={selectedDivision} district={selectedDistrict} />
        </div>
      </main>
    </div>
  );
}
