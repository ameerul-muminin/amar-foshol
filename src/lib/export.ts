import { toBanglaNumber } from './bangla-numbers';
import { CropBatch } from './cropBatch';

function safeFormatDate(date: Date | string, lang: 'bn' | 'en') {
  const d = new Date(date);
  if (lang === 'bn') {
    // Simple dd-mm-yyyy with Bangla digits
    const day = toBanglaNumber(String(d.getDate()));
    const month = toBanglaNumber(String(d.getMonth() + 1));
    const year = toBanglaNumber(String(d.getFullYear()));
    return `${day}-${month}-${year}`;
  }
  return d.toISOString().split('T')[0];
}

export function batchesToCSV(batches: CropBatch[], lang: 'bn' | 'en' = 'en') {
  const headers = [
    lang === 'bn' ? 'আইডি' : 'ID',
    lang === 'bn' ? 'ফসলের ধরন' : 'Crop',
    lang === 'bn' ? 'ওজন (কেজি)' : 'Weight (kg)',
    lang === 'bn' ? 'কাটার তারিখ' : 'Harvest Date',
    lang === 'bn' ? 'বিভাগ' : 'Division',
    lang === 'bn' ? 'জেলা' : 'District',
    lang === 'bn' ? 'সংরক্ষণ' : 'Storage',
    lang === 'bn' ? 'স্থিতি' : 'Status',
    lang === 'bn' ? 'নোট' : 'Notes'
  ];

  const rows = batches.map((b) => {
    const weight = lang === 'bn' ? toBanglaNumber(String(b.weightKg)) : String(b.weightKg);
    return [
      b.id,
      lang === 'bn' ? 'ধান/চাল' : 'Paddy/Rice',
      weight,
      safeFormatDate(b.harvestDate, lang),
      lang === 'bn' ? b.divisionBn || b.division : b.division,
      lang === 'bn' ? b.districtBn || b.district : b.district,
      lang === 'bn' ? (b.storageType ? b.storageType : '') : b.storageType,
      lang === 'bn' ? b.status : b.status,
      b.notes ? (`"${(b.notes || '').replace(/"/g, '""')}"`) : ''
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export function downloadCSV(content: string, filename = 'batches.csv') {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadJSON(data: any, filename = 'batches.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
