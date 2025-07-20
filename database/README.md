# Abu Dhabi OpenSea - Supabase Database Setup
# تهيئة قاعدة بيانات أبوظبي البحر المفتوح

## Prerequisites (المتطلبات المسبقة)

1. **Supabase Account**: Create an account at [supabase.com](https://supabase.com)
2. **New Project**: Create a new project in Supabase dashboard
3. **Database Access**: Get your project URL and anon key

## Step 1: Update Environment Variables

Update your `.env` file with your Supabase credentials:

```env
SUPABASE_URL=https://cceuyhebxxqafmrmnqhq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXV5aGVieHhxYWZtcm1ucWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NzM5NTUsImV4cCI6MjA2NzQ0OTk1NX0.Z3DoMvHUwa7QU0HeMglW49t-qUmkb_Tm2iW3ljN8_Io
```

## Step 2: Run Database Setup

1. **Open Supabase Dashboard**:
   - Go to your project dashboard
   - Navigate to "SQL Editor"

2. **Execute Setup Script**:
   - Copy the contents of `database/setup.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

3. **Verify Tables Created**:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

## Step 3: Enable Authentication (Optional)

If you want user authentication:

1. **Enable Auth Providers**:
   - Go to Authentication > Settings
   - Enable email/password or social providers

2. **Configure Auth Settings**:
   - Set site URL to your app domain
   - Configure redirect URLs if needed

## Database Schema Overview

### Core Tables:

- **`analytics_events`**: Track user actions and app usage
- **`notifications`**: Store app notifications for users  
- **`service_providers`**: Maritime service providers data
- **`bookings`**: User bookings and reservations
- **`user_profiles`**: Extended user profile information
- **`reviews`**: User reviews and ratings

### Security Features:

- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **User-specific policies** for data access
- ✅ **Authenticated access** for sensitive operations
- ✅ **Auto-updating timestamps** with triggers

### Performance Optimizations:

- ✅ **Indexes** on frequently queried columns
- ✅ **Views** for common query patterns
- ✅ **Functions** for automated calculations

## Step 4: Test Connection

Run your Flutter app to test the connection:

```bash
flutter run
```

Check the console for:
- ✅ Supabase initialized successfully
- 🔗 Supabase connection verified

## Sample Queries

### Get All Service Providers:
```sql
SELECT * FROM service_providers_with_ratings;
```

### Get User Notifications:
```sql
SELECT * FROM notifications WHERE user_id = auth.uid() ORDER BY created_at DESC;
```

### Log Analytics Event:
```sql
INSERT INTO analytics_events (event_name, parameters, user_id) 
VALUES ('app_opened', '{"platform": "mobile"}', auth.uid());
```

## Troubleshooting

### Connection Issues:
- ✅ Verify URL and anon key in `.env`
- ✅ Check project status in Supabase dashboard
- ✅ Ensure network connectivity

### Permission Errors:
- ✅ Verify RLS policies are correctly set
- ✅ Check user authentication status
- ✅ Review table permissions

### Performance Issues:
- ✅ Check if indexes are created
- ✅ Review query execution plans
- ✅ Monitor database usage in dashboard

## Next Steps

1. **Customize Tables**: Add fields specific to your business needs
2. **API Integration**: Connect with OpenAI and Stripe services  
3. **Real-time Features**: Enable real-time subscriptions for live updates
4. **Data Migration**: Import existing data if migrating from another system

## Support

For issues:
- 📖 [Supabase Documentation](https://supabase.com/docs)
- 💬 [Supabase Community](https://github.com/supabase/supabase/discussions)
- 🔧 [Flutter Supabase Package](https://pub.dev/packages/supabase_flutter)

---

**🌊 Abu Dhabi OpenSea Database Ready! 🚀**
