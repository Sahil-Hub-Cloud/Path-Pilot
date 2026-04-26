# Supabase Database Setup Guide

## Quick Setup Steps

### 1. Access Supabase SQL Editor
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `ihcxwzkijtsfofxrrljm`
3. Click on **SQL Editor** in the left sidebar

### 2. Run the Migration
1. Click **New Query**
2. Copy the entire contents of [`001_bharat_schema.sql`](file:///d:/Chatbot/path-pilot/supabase/migrations/001_bharat_schema.sql)
3. Paste into the SQL editor
4. Click **Run** (or press `Ctrl+Enter`)

### 3. Verify Tables Created
After running the migration, verify in the **Table Editor**:

**Expected Tables (10)**:
- ✅ `circadian_profiles` - Student energy patterns
- ✅ `performance_data` - Study performance tracking
- ✅ `burnout_metrics` - Burnout indicators
- ✅ `burnout_predictions` - AI predictions
- ✅ `career_scenarios` - Career simulation data
- ✅ `student_skills` - Skill tracking
- ✅ `knowledge_graphs` - Content ingestion results
- ✅ `schedules` - Bio-logic schedules
- ✅ `mastery_proofs` - Skill certificates
- ✅ `interventions` - Burnout interventions

### 4. Test the Connection
Run this command in your project directory to test the Supabase connection:

```bash
npm run dev
```

Then test the API endpoint:
```bash
curl http://localhost:3000/api/bharat/v2?action=health
```

Expected response:
```json
{
  "success": true,
  "health": {
    "neuralIngestion": true,
    "bioLogicScheduler": true,
    "burnoutPredictor": true,
    "careerSimulator": true,
    "vernacularAI": true,
    "whatsappInterface": false,
    "proofOfMastery": true
  }
}
```

## Environment Variables Configured

✅ **Supabase URL**: `https://ihcxwzkijtsfofxrrljm.supabase.co`
✅ **Supabase Anon Key**: Configured in `.env.local`

## Row Level Security (RLS)

All tables have RLS enabled with policies:
- Students can only access their own data
- Career scenarios are publicly readable
- Mastery proofs are verifiable by anyone (by hash)

## Next Steps

1. **Run the migration** in Supabase SQL Editor
2. **Start the dev server**: `npm run dev`
3. **Test the API** endpoints
4. **Build UI components** for the Bharat features

## Troubleshooting

**Issue**: Tables not showing up
- **Solution**: Check SQL Editor for error messages, run migration again

**Issue**: RLS blocking queries
- **Solution**: Ensure you're authenticated with Firebase before making requests

**Issue**: Connection errors
- **Solution**: Verify `.env.local` has correct Supabase credentials

## API Usage Examples

### Process Student Content
```typescript
const response = await fetch('/api/bharat/v2', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'ingest',
    studentId: 'user123',
    data: {
      type: 'PDF',
      content: pdfBuffer
    }
  })
});
```

### Generate Personalized Plan
```typescript
const response = await fetch('/api/bharat/v2', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generatePlan',
    studentId: 'user123'
  })
});
```

### Monitor Student Health
```typescript
const response = await fetch('/api/bharat/v2', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'monitorHealth',
    studentId: 'user123'
  })
});
```

---

**Ready to go!** 🚀 Run the migration and start building the UI.
