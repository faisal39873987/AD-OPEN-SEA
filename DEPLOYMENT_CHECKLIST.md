# Production Deployment Checklist

## Pre-Deployment Verification
- [ ] All tests pass in staging environment
- [ ] Run environment verification: `npm run verify:env`
- [ ] Ensure Stripe API version matches in code (currently '2023-10-16')
- [ ] Verify all environment variables are correctly set in Vercel
- [ ] Supabase tables are created (services, chat_log)
- [ ] Sample service data is loaded into Supabase
- [ ] Backup of current production data is created

## Deployment Steps
1. **Preparation**
   - [ ] Run local verification script: `./scripts/verify-supabase.sh`
   - [ ] Ensure all required environment variables are set in Vercel or GitHub
   - [ ] Review and merge latest changes from clean-branch

2. **Deployment**
   - [ ] Merge to main branch:
     ```
     git checkout main
     git merge clean-branch
     git push origin main
     ```
   - [ ] Verify deployment completes successfully in Vercel
   - [ ] Check application is accessible at https://adplus.app

3. **Post-Deployment Verification**
   - [ ] Test chat functionality with specific queries:
     - "Looking for a plumber"
     - "Cleaning in Reem"
     - "I want AC repair"
   - [ ] Verify responses come from Supabase for queries with matching services
   - [ ] Verify fallback to GPT works for queries without matching services
   - [ ] Check chat history is being stored in the chat_log table

## Critical Features to Validate
- [ ] **Supabase Integration**
  - Verify service search functionality works
  - Check chat history is stored in chat_log table
  - Validate service display in chat interface
- [ ] **GPT Fallback**
  - Verify GPT responds when no services match
  - Check response quality and relevance
- [ ] **Authentication & Payment**
  - Test login and registration flow
  - Verify subscription modal functionality
  - Check payment processing (if enabled)

## User Experience Validation
- [ ] Test on mobile devices (iOS and Android)
- [ ] Verify responsive design works at all breakpoints
- [ ] Test dark mode functionality
- [ ] Verify loading states and animations

## Post-Launch Monitoring
- [ ] Set up Google Analytics in Vercel (optional)
- [ ] Monitor server logs for errors
- [ ] Check Supabase query performance
- [ ] Review user feedback and address issues

## 🎉 Success Criteria
Once deployed, you should have:
- ✅ A live application at adplus.app
- ✅ Intelligent chat system with Supabase integration
- ✅ Automatic fallback to GPT when needed
- ✅ Chat history stored in Supabase
- ✅ Responsive UI that works on all devices

- [ ] **Lazy Loading**
  - Confirm components load only when needed
  - Verify scroll-based loading triggers correctly

- [ ] **Image Optimization**
  - Check that images load with correct resolution for device
  - Verify image loading times are optimized

- [ ] **Stripe Integration**
  - Test complete payment flow with test cards
  - Verify webhooks are working correctly
  - Check order creation and fulfillment

- [ ] **Overall Performance**
  - Lighthouse score above 90 for Performance
  - Time-to-Interactive < 3.5 seconds
  - First Contentful Paint < 1.5 seconds

## Rollback Plan
- Clear steps for emergency rollback if issues are detected
- Defined criteria for rollback decision
- Team members responsible for making rollback decision

## Monitoring
- [ ] Set up alerts for key metrics
- [ ] Schedule post-deployment review (24 hours after)
