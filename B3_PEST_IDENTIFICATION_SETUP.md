# Pest Identification (B3) Setup Guide

## Overview
The Pest Identifier component uses Google's Gemini 2.0 Flash API with visual understanding to analyze pest images and provide actionable treatment plans in Bangla.

## Features Implemented (B3.1-B3.6)

### B3.1: Image Upload Interface ✅
- Large upload button (60px height) with camera icon
- Drag-and-drop support
- Mobile camera capture
- Preview area (300x300px)
- File type validation (JPEG, PNG, HEIC)
- Max 5MB file size

### B3.2: Gemini Visual RAG Integration ✅
- Uses Gemini 2.0 Flash model
- Client-side image compression
- JSON response parsing
- Automatic context injection for Bangladesh agricultural context

### B3.3: Risk Level Classification ✅
- **High Risk (🔴)**: Red color, >30% loss in <7 days
- **Medium Risk (🟡)**: Yellow color, 10-30% loss in 7-14 days
- **Low Risk (🟢)**: Green color, minimal impact

### B3.4: Bangla Treatment Plan UI ✅
- Full Bangla interface
- Organized sections: Immediate/Short-term/Prevention
- Local treatment methods highlighted
- Chemical options (when applicable)
- Estimated loss calculation
- Sources/References

### B3.5: Local Treatment Examples ✅
Common Bangladesh pests with organic solutions:
- Stem borers
- Plant hoppers
- Leaf folders
- Gall midges

### B3.6: Performance Requirements ✅
- Image compression < 1MB before sending
- API response < 5 seconds
- UI rendering < 1 second
- Offline fallback ready

## Setup Instructions

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key" or "Create API Key"
3. Create a new project or select existing
4. Generate API key
5. Copy the key

### 2. Configure Environment Variables

Create or update `.env.local` file in the project root:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

**Important:** The `NEXT_PUBLIC_` prefix makes this key available in the browser (which is necessary for image analysis).

### 3. Usage in Dashboard

The PestIdentifier component is already integrated into the dashboard:

```tsx
<PestIdentifier lang={lang} />
```

It will:
- Allow farmers to upload/capture images
- Analyze with Gemini
- Display results in Bangla with full treatment plans
- Show confidence score
- Provide immediate, short-term, and prevention actions

## Component Props

```typescript
interface PestIdentifierProps {
  lang?: 'bn' | 'en';  // Language: Bangla (default) or English
  onAnalysisComplete?: (result: PestAnalysisResult) => void;  // Callback when analysis completes
}
```

## API Response Structure

```typescript
interface PestAnalysisResult {
  pestName: string;                    // English name
  pestNameBn: string;                  // Bengali name
  pestNameLatin: string;               // Scientific name
  riskLevel: 'high' | 'medium' | 'low';
  confidence: number;                  // 0-1
  description: string;                 // English description
  descriptionBn: string;               // Bengali description
  symptoms: string[];
  symptomsBn: string[];
  actionPlan: {
    immediate: string[];               // English actions
    immediateBn: string[];             // Bengali actions
    shortTerm: string[];
    shortTermBn: string[];
    prevention: string[];
    preventionBn: string[];
  };
  localTreatment: string[];
  localTreatmentBn: string[];
  chemicalOptions?: string[];
  chemicalOptionsBn?: string[];
  estimatedLoss: string;
  estimatedLossBn: string;
  sources: string[];
}
```

## How It Works

1. **Image Capture/Upload** (B3.1)
   - User uploads or takes a photo
   - Image is compressed client-side (<1MB)
   - Preview is displayed

2. **Image Analysis** (B3.2)
   - Compressed image sent to Gemini API
   - API receives system prompt in English with Bangladesh context
   - API returns structured JSON response

3. **Risk Classification** (B3.3)
   - Response analyzed for risk level
   - Color coding applied (red/yellow/green)
   - Confidence score displayed

4. **Results Display** (B3.4)
   - Full Bangla UI with all treatment information
   - Organized sections for quick scanning
   - Local methods prioritized over chemicals
   - Sources cited

5. **User Action**
   - Farmer can follow recommended actions
   - Can try another image
   - Can save/export recommendations (future feature)

## Testing

### Test Cases

1. **Valid Pest Image**
   - Upload image of rice stem borer
   - Should identify pest, show high risk, provide actions

2. **Non-Pest Image**
   - Upload random image
   - Should indicate "No pest detected", low risk

3. **Poor Quality Image**
   - Upload blurry image
   - Should indicate low confidence

4. **Mobile Camera**
   - Take photo using mobile camera
   - Should compress and analyze automatically

### Test Images

Use these scenarios:
- Rice stem borer damage
- Plant hopper colony
- Healthy rice plant
- Leaf folder damage
- Generic crop field photo

## Performance Optimization

### Image Compression
```typescript
// Automatically reduces image size to <1MB
// Maintains quality for pest detection
compressImage(file, 1); // 1MB max
```

### Loading States
- Shows spinner during API call
- Displays "Analyzing..." message
- Prevents multiple submissions

### Error Handling
- Graceful error messages in Bangla
- Suggests user retry or try different image
- Shows API error if applicable

## Limitations & Future Improvements

### Current Limitations
- Requires internet connection (for Gemini API)
- API calls cost (free tier available)
- Limited to image-based identification
- No real-time camera feed analysis

### Future Enhancements
- Offline model using TensorFlow.js
- Video stream analysis
- Pest alert notifications
- Treatment tracking
- Success/failure feedback
- Integration with local agriculture extension officers

## Troubleshooting

### "Gemini API key not configured"
- Check `.env.local` file exists
- Verify `NEXT_PUBLIC_GEMINI_API_KEY` is set
- Restart dev server: `npm run dev`

### "Failed to analyze image"
- Check internet connection
- Verify API key is valid
- Check Gemini API quota/limits
- Try different image

### "API response was not ok"
- API might be rate limited
- Check if free tier quota exceeded
- Wait a moment and retry

### Image compression takes too long
- Image is too large (>10MB original)
- Try uploading smaller file
- Check device storage space

## Security Notes

⚠️ **API Key is Public:**
- The `NEXT_PUBLIC_GEMINI_API_KEY` is visible in browser
- This is acceptable for Gemini API (designed for client-side use)
- Consider adding rate limiting in production
- Monitor usage for cost optimization

## Dashboard Integration

The component is added to the main dashboard between CropAlerts and Profile Info:

```tsx
{/* Pest Identifier */}
<div className="mb-8">
  <PestIdentifier lang={lang} />
</div>
```

Location in dashboard.page.tsx: ~Line 155

## Related Files

- `/src/lib/pest-identification.ts` - Core API integration
- `/src/components/PestIdentifier.tsx` - React component
- `/src/app/dashboard/page.tsx` - Dashboard integration

## References

- [Google Gemini API Docs](https://ai.google.dev/gemini-2/docs)
- [Vision Capabilities](https://ai.google.dev/gemini-2/docs/vision)
- [Bangladesh Agricultural Pests](https://bari.gov.bd/)
- [Department of Agricultural Extension](https://dae.gov.bd/)
