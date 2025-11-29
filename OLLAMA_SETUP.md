# Ollama Setup Guide for Pest Identification

## Step 1: Download Ollama
1. Visit: https://ollama.ai
2. Click "Download" for Windows
3. Run the installer
4. Follow installation prompts (will add to PATH)

## Step 2: Download a Vision Model
Open PowerShell and run:
```powershell
ollama pull llava
```

This downloads the LLaVA model (~4.7GB). First time takes 5-10 minutes.

## Step 3: Start Ollama Server
Open PowerShell and run:
```powershell
ollama serve
```

Leave this running in background. You should see:
```
Listening on 127.0.0.1:11434
```

## Step 4: Test Connection
Open another PowerShell and run:
```powershell
Invoke-WebRequest http://localhost:11434/api/tags | ConvertTo-Json
```

You should see the llava model listed.

## Step 5: Restart Dev Server
```powershell
npm run dev
```

## Step 6: Test Feature
1. Go to: http://localhost:3000/dashboard
2. Scroll to "🐛 কীটপতঙ্গ সনাক্তকরণ"
3. Upload a pest image
4. The LLM will analyze it!

---

## Troubleshooting

### Ollama not found after install
- Restart PowerShell or computer
- Check: `ollama --version`

### "Connection refused" on port 11434
- Make sure `ollama serve` is running in another terminal
- Don't close that terminal!

### Model download takes too long
- Normal! LLaVA is ~4.7GB
- First time only
- Close Ollama and run `ollama pull llava` again if interrupted

### Upload fails with error
- Check browser console (F12)
- Make sure Ollama is still running
- Try a different pest image (JPG, PNG, clear lighting)

---

## Alternative: Use Replicate API (If Ollama issues)

If Ollama installation fails:

1. Get free API key: https://replicate.com
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_REPLICATE_API_KEY=r8_...
   ```
3. Code already supports this fallback!

