"use client";

import { useEffect, useRef, useState } from 'react';
import type { FarmLocation } from '../lib/map-utils';
import { generateMockNeighbors, districtBounds, formatDateBn, getCropNameBn, getRiskLevelBn } from '../lib/map-utils';

declare global {
  interface Window { L: any; }
}

export default function MapClient({ division = 'ঢাকা', district = 'ঢাকা' }: { division?: string; district?: string }) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [neighbors, setNeighbors] = useState<FarmLocation[]>([]);

  useEffect(() => {
    // inject Leaflet CSS
    const cssId = 'leaflet-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // inject Leaflet script
    const scriptId = 'leaflet-js';
    const ensureLeaflet = () => new Promise<void>((resolve, reject) => {
      if ((window as any).L) return resolve();
      let s = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!s) {
        s = document.createElement('script');
        s.id = scriptId;
        s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        s.async = true;
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.body.appendChild(s);
      } else {
        s.onload = () => resolve();
      }
    });

    let cancelled = false;
    ensureLeaflet().then(() => {
      if (cancelled) return;
      setLoaded(true);
    }).catch((err) => console.error('Failed to load Leaflet', err));

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (!mapRef.current) return;
    const L = window.L;

    // create map only once
    if (!leafletMapRef.current) {
      // center on district bounds center
      const key = `${division}-${district}`;
      const bounds = (districtBounds as any)[key] ?? { latMin: 23.7, latMax: 23.9, lonMin: 90.3, lonMax: 90.5 };
      const centerLat = (bounds.latMin + bounds.latMax) / 2;
      const centerLon = (bounds.lonMin + bounds.lonMax) / 2;

      const map = L.map(mapRef.current, { zoomControl: true }).setView([centerLat, centerLon], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;
    // generate mock neighbors
    const mock = generateMockNeighbors(district, 15);
    setNeighbors(mock);

    // clear existing markers layer if exists
    if ((map as any)._markerLayer) {
      map.removeLayer((map as any)._markerLayer);
    }

    const markerLayer = window.L.layerGroup();

    // own farm marker at center
    const key = `${division}-${district}`;
    const bounds = (districtBounds as any)[key] ?? { latMin: 23.7, latMax: 23.9, lonMin: 90.3, lonMax: 90.5 };
    const centerLat = (bounds.latMin + bounds.latMax) / 2;
    const centerLon = (bounds.lonMin + bounds.lonMax) / 2;

    const ownIcon = window.L.divIcon({
      html: `<div style="width:18px;height:18px;border-radius:9px;background:#3b82f6;border:2px solid white;"></div>`,
      className: ''
    });

    const ownMarker = window.L.marker([centerLat, centerLon], { icon: ownIcon }).bindPopup(`<div class="p-2"><strong>আমি</strong><br/>${division} • ${district}</div>`);
    markerLayer.addLayer(ownMarker);

    for (const loc of mock) {
      const color = loc.riskLevel === 'high' ? '#ef4444' : loc.riskLevel === 'medium' ? '#eab308' : '#22c55e';
      const icon = window.L.divIcon({
        html: `<div style="width:14px;height:14px;border-radius:7px;background:${color};border:2px solid white;"></div>`,
        className: ''
      });

      const marker = window.L.marker([loc.lat, loc.lon], { icon });

      const popupHtml = `
        <div style="min-width:180px;font-family:inherit">
          <p style="font-weight:700;margin:0 0 6px">ফসল: ${getCropNameBn(loc.cropType)}</p>
          <p style="margin:0 0 6px">ঝুঁকি: ${getRiskLevelBn(loc.riskLevel)}</p>
          <p style="margin:0;font-size:12px;color:#6b7280">হালনাগাদ: ${formatDateBn(loc.lastUpdated)}</p>
        </div>
      `;

      marker.bindPopup(popupHtml);
      markerLayer.addLayer(marker);
    }

    markerLayer.addTo(map);
    (map as any)._markerLayer = markerLayer;

    // fit bounds loosely to district
    const pad = 0.02;
    const southWest = window.L.latLng(bounds.latMin - pad, bounds.lonMin - pad);
    const northEast = window.L.latLng(bounds.latMax + pad, bounds.lonMax + pad);
    map.fitBounds(window.L.latLngBounds(southWest, northEast), { padding: [20, 20] });

    return () => {
      // do not destroy map to preserve state; just remove marker layer
      if (map && (map as any)._markerLayer) {
        try { map.removeLayer((map as any)._markerLayer); } catch (e) {}
        (map as any)._markerLayer = null;
      }
    };
  }, [loaded, division, district]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">লোকাল রিস্ক মানচিত্র</h3>
        <div className="text-sm text-gray-500">জোন: {division} / {district}</div>
      </div>

      <div ref={mapRef} style={{ height: 420 }} className="rounded-md overflow-hidden border border-gray-100" />

      <div className="mt-3 flex items-center gap-3">
        <LegendItem color="#3b82f6" label="আমার ফার্ম" />
        <LegendItem color="#22c55e" label="নিম্ন ঝুঁকি" />
        <LegendItem color="#eab308" label="মধ্যম ঝুঁকি" />
        <LegendItem color="#ef4444" label="উচ্চ ঝুঁকি" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div style={{ width: 14, height: 14, background: color, borderRadius: 7, border: '2px solid #fff' }} />
      <div className="text-gray-700">{label}</div>
    </div>
  );
}
