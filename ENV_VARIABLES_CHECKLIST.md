# Environment Variables Checklist

This document lists all the required environment variables for the AD Pulse application when deploying to production.

## Required Environment Variables

Ensure all these variables are set in your deployment platform (Vercel or GitHub Actions):

| Variable | Description | Required | Notes |
|----------|-------------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ | Format: `https://your-project-id.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ | Public key for client-side access |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ | Private key for server-side access |
| `OPENAI_API_KEY` | OpenAI API key | ✅ | For GPT fallback when Supabase search finds no results |
| `NEXT_PUBLIC_SITE_URL` | Production site URL | ✅ | Set to `https://adplus.app` |
| `NEXT_PUBLIC_GPT_ASSISTANT_URL` | OpenAI assistant URL | ✅ | For fallback to GPT when no data found |
| `STRIPE_SECRET_KEY` | Stripe secret key | ✅ | For payment processing |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | ✅ | For client-side Stripe integration |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | ✅ | For validating Stripe webhook events |

## Environment Files Structure

The project uses different environment files for different purposes:

| File | Purpose | When Used |
|------|---------|-----------|
| `.env.example` | Template for environment variables | Reference only, not used in the application |
| `.env.local` | Local development environment | Used during local development (`npm run dev`) |
| `.env.production` | Production environment | Used when building for production (`npm run build`) |

### Vercel Setup Instructions

1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its corresponding value
4. Make sure to add variables to all relevant environments (Production, Preview, Development)
5. Click **Save** after adding all variables
6. Deploy or redeploy your application to apply the changes

### GitHub Actions Setup

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets** → **Actions**
3. Click **New repository secret**
4. Add each variable with its corresponding value
5. These secrets will be accessible in your GitHub Actions workflows

## Chat System Architecture

The AD Pulse chat interface uses a smart routing system that works as follows:

1. **Supabase First Approach**: When a user sends a message, the system first searches the Supabase database for relevant services using full-text search.

2. **Context Awareness**: The system extracts and stores session context such as location, service type, and user intent in the Supabase `sessions` table.

3. **Follow-up Questions**: If the user's message doesn't contain enough information (missing location or service type), the system asks contextual follow-up questions.

4. **OpenAI Fallback**: If no matching services are found in Supabase, the system falls back to OpenAI's GPT model to generate a helpful response.

5. **Message Persistence**: All messages (from both user and assistant) are saved in the Supabase `chat_messages` table with timestamps.

### Required Supabase Database Tables

Ensure these tables exist in your Supabase database:

1. **`services`**: Contains service providers data with full-text search enabled
2. **`chat_sessions`**: Stores conversation sessions with user_id and timestamps
3. **`chat_messages`**: Contains individual messages linked to sessions
4. **`sessions`**: Stores session context information for personalized responses

### Environment Variables for Chat Functionality

For the chat system to work properly, ensure these variables are set:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Connect to Supabase for database searches |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Authenticate client-side Supabase requests |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side database operations |
| `OPENAI_API_KEY` | Fallback to AI when no database results found |

## Validation

After setting up the environment variables, you can validate they're working correctly by:

1. Running the verification scripts:
   - For database: `./scripts/verify-supabase.sh`
   - For all environment variables: `node ./scripts/verify-env-variables.js`
2. Deploying a test version of the application
3. Testing the chat functionality with queries like:
   - "Looking for a plumber"
   - "Cleaning in Reem"
   - "I want AC repair"

### Automated Environment Verification

We provide a comprehensive verification script that checks:
- Presence of all required environment variables
- Supabase connection status
- OpenAI API key validity
- Stripe key format

To run this check before deployment:

```bash
# Install dependencies if needed
npm install chalk @supabase/supabase-js

# Run the verification script
node ./scripts/verify-env-variables.js
```

This script will provide detailed feedback if any issues are found with your environment configuration.

## Troubleshooting

If you encounter issues with the chat functionality:

### Connection Issues (مشاكل الاتصال)
- **Supabase Connection**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- **Database Missing Tables**: Run the database setup scripts in the `/database` folder
- **Full-text Search Not Working**: Check that the services table has proper text search indexes
- **Build Failures**: If build fails during `getStaticProps` or `getServerSideProps`, check that your API keys haven't expired or been changed

### Deployment Issues (مشاكل النشر)
- **Missing Environment Variables**: Ensure all required variables are set in Vercel
- **Expired API Keys**: Regularly check and update API keys in your deployment settings
- **After Changes**: Always use "Redeploy" in Vercel after updating environment variables
- **Connection Timeouts**: Check that your Supabase project hasn't been paused due to inactivity

### OpenAI Integration Issues
- **"OpenAI API key is not configured" Error**: Check that `OPENAI_API_KEY` is set correctly in environment variables
- **Rate Limit Errors**: Consider implementing a rate limiting system or upgrading your OpenAI plan
- **Slow Responses**: Ensure your server has adequate resources; consider caching common responses

### Authentication Issues
- **Session Persistence Failures**: Check Supabase permissions for the sessions table
- **User Authentication Errors**: Verify the auth settings in your Supabase project

### Message Log Issues
- **Messages Not Saving**: Check database permissions and table structure for chat_messages
- **Missing Context**: Ensure the sessionContext.ts file is properly processing and storing context

For more technical help, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)

## Monitoring and Alerts

Consider setting up monitoring for the chat system:

1. **Error Rate**: Track failed chat requests in application logs
2. **Response Time**: Monitor average response time for chat messages
3. **OpenAI Usage**: Track OpenAI API usage to manage costs
4. **Database Performance**: Monitor Supabase query performance for the chat system

## Quick Guide for Arabic Users (دليل سريع للمستخدمين العرب)

### ما يجب فعله عند فشل النشر:

1. **تحقق من المتغيرات البيئية في Vercel**:
   - انتقل إلى إعدادات مشروعك في Vercel
   - اختر **Environment Variables**
   - تأكد من وجود جميع المتغيرات المطلوبة:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - `STRIPE_SECRET_KEY`
     - `STRIPE_WEBHOOK_SECRET`
     - `NEXT_PUBLIC_SITE_URL`
     - `NEXT_PUBLIC_GPT_ASSISTANT_URL`
     - `OPENAI_API_KEY`

2. **إعادة النشر بعد التحقق**:
   - اضغط على **Redeploy** في لوحة تحكم Vercel
   - تحقق من سجلات البناء للتأكد من عدم وجود أخطاء

3. **اختبار الوظائف الرئيسية**:
   - واجهة المحادثة والبحث في Supabase
   - معالجة الدفع عبر Stripe
   - الردود الاحتياطية من OpenAI GPT

4. **استكشاف الأخطاء وإصلاحها**:
   - إذا فشل بناء التطبيق أثناء استدعاء `getStaticProps` أو `getServerSideProps`، تحقق من صلاحية جميع مفاتيح API
   - إذا توقفت وظائف البحث، تأكد من اتصال Supabase وتمكين البحث النصي الكامل
