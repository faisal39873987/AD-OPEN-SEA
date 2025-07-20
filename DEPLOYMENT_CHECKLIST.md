# Production Deployment Checklist

## Pre-Deployment Verification
- [ ] All tests pass in staging environment
- [ ] Verify all environment variables are correctly set
- [ ] Database migrations are ready if needed
- [ ] Backup of current production data is created

## Deployment Steps
1. **Preparation**
   - [ ] Notify team of deployment time window
   - [ ] Ensure CI/CD pipeline is green
   - [ ] Review and merge latest changes

2. **Deployment**
   - [ ] Deploy to production environment
   - [ ] Verify deployment completes successfully
   - [ ] Check application health (server status, database connections)

3. **Post-Deployment Verification**
   - [ ] Run smoke tests
   - [ ] Verify core functionality
   - [ ] Check performance metrics
   - [ ] Monitor error logs

## Critical Features to Validate
- [ ] **Supabase Integration**
  - Verify all data retrieval operations
  - Check real-time subscriptions if used
  - Validate authentication flows

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
