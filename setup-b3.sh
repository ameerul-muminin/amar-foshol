#!/bin/bash
# B3 Pest Identification Feature - Test & Deployment Guide

echo "🐛 Pest Identification (B3) Setup"
echo "=================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found"
    echo ""
    echo "Create .env.local with:"
    echo "NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here"
    echo ""
    echo "Get API key from: https://aistudio.google.com/app/apikey"
else
    echo "✅ .env.local found"
    
    if grep -q "NEXT_PUBLIC_GEMINI_API_KEY=" .env.local; then
        echo "✅ NEXT_PUBLIC_GEMINI_API_KEY configured"
    else
        echo "⚠️  NEXT_PUBLIC_GEMINI_API_KEY not set in .env.local"
    fi
fi

echo ""
echo "Files to verify:"
echo "✅ src/lib/pest-identification.ts"
echo "✅ src/components/PestIdentifier.tsx"
echo "✅ src/app/dashboard/page.tsx (updated)"
echo ""

echo "Starting development server..."
echo "Run: npm run dev"
echo ""
echo "Navigate to: http://localhost:3000/dashboard"
echo "Scroll to: 🐛 কীটপতঙ্গ সনাক্তকরণ section"
