# Manual Verification & Smoke Tests

This document lists quick manual tests to verify badge awarding, offline storage, and export functionality.

## 1. Badge Awarding (A2.4)

1. Start dev server: `npm run dev` and open the app in the browser.
2. Register a new farmer via `/register` (or existing flow). Note the farmer ID in console or profile page.
3. Go to `/dashboard/batches/new` and register the *first* crop batch for that farmer.
4. After submission, open `/dashboard/profile` and confirm the **প্রথম ব্যাচ / First Batch** badge appears under Achievements.

Expected: "প্রথম ব্যাচ" badge is present immediately after first successful batch registration.

## 2. Offline Save (A2.5)

1. Open the app and login as a farmer.
2. Turn off network (or use browser devtools offline mode).
3. Navigate to `/dashboard/batches/new`, fill the form and submit.
4. The app uses `localforage` to save the batch locally.
5. Re-enable network and confirm the batch still appears in `/dashboard/batches`.

Expected: Batch persists while offline and is visible after reconnect.

## 3. Export CSV / JSON (A2.5)

### Desktop
1. Open `/dashboard/batches` as a logged-in farmer with some batches registered.
2. Click the `CSV` or `JSON` export buttons near the language toggle (top-right).
3. A download should start with a filename like `batches_{farmerId}_{timestamp}.csv` or `.json`.
4. Open the CSV/JSON file to confirm fields and values are present.

### Mobile
1. On small screens (or with browser responsive mode), the export bar appears fixed at the bottom.
2. Tap `CSV` or `JSON` and confirm downloads start (or prompt to save).

Expected: Files download and contain your batch data. CSV uses Bangla numerals when app language is Bangla.

## 4. Quick Smoke Checklist

- [ ] `createCropBatch` awards badge `first_batch` when applicable.
- [ ] `getFarmerBatches` returns saved batches.
- [ ] Exports produce non-empty CSV/JSON files.
- [ ] Mobile export bar visible on small screens and functions correctly.

If any step fails, check browser console for errors and open an issue with logs and reproduction steps.
