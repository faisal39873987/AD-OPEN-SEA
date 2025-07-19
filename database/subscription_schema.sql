-- Add subscription-related tables for Abu Dhabi OpenSea
-- This extends the existing database schema

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    searches_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Search Usage Tracking Table
CREATE TABLE IF NOT EXISTS search_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    plan_at_time VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Provider Access Logs
CREATE TABLE IF NOT EXISTS provider_access_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL,
    access_type VARCHAR(50) NOT NULL, -- 'view', 'contact', 'details'
    plan_at_time VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscription Plans Configuration (for admin management)
CREATE TABLE IF NOT EXISTS subscription_plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'AED',
    interval_type VARCHAR(20) DEFAULT 'month',
    search_limit INTEGER, -- NULL means unlimited
    contact_info_access BOOLEAN DEFAULT false,
    chat_support VARCHAR(20) DEFAULT 'limited',
    features JSONB DEFAULT '[]',
    stripe_product_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, price, search_limit, contact_info_access, chat_support, features) VALUES
('free', 'Free Plan', 0, 1, false, 'limited', 
 '["View limited search results (1 result only)", "Hidden contact info (only names and basic details)", "Limited GPT-4 chat", "Basic service browsing"]'),
('standard', 'Standard Plan', 49, 20, true, 'priority', 
 '["View full details (up to 20 results/month)", "Full access to contact info (name, phone, email)", "Priority Email support", "Full GPT-4 chat access", "Advanced search filters"]'),
('pro', 'Pro Plan', 99, NULL, true, 'premium', 
 '["Unlimited search results", "Detailed contact info (phone, WhatsApp, email)", "Premium live chat & phone support", "Detailed analytics reports", "Unlimited GPT-4 chat access", "Priority listing for your services", "Advanced business insights"]')
ON CONFLICT (id) DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_search_usage_user_id ON search_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_search_usage_timestamp ON search_usage(timestamp);
CREATE INDEX IF NOT EXISTS idx_provider_access_logs_user_id ON provider_access_logs(user_id);

-- RLS Policies
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- User Subscriptions Policies
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Search Usage Policies
CREATE POLICY "Users can view their own search usage" ON search_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search usage" ON search_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Provider Access Logs Policies
CREATE POLICY "Users can view their own access logs" ON provider_access_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own access logs" ON provider_access_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscription Plans Policies (read-only for users)
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans
    FOR SELECT USING (true);

-- Functions for subscription management
CREATE OR REPLACE FUNCTION get_user_current_subscription(user_uuid UUID)
RETURNS TABLE (
    plan_id VARCHAR(50),
    status VARCHAR(50),
    searches_used INTEGER,
    search_limit INTEGER,
    contact_info_access BOOLEAN,
    current_period_end TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        us.plan_id,
        us.status,
        us.searches_used,
        sp.search_limit,
        sp.contact_info_access,
        us.current_period_end
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = user_uuid 
    AND us.status = 'active'
    AND us.current_period_end > NOW()
    ORDER BY us.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access contact info
CREATE OR REPLACE FUNCTION can_access_contact_info(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_access BOOLEAN := false;
BEGIN
    SELECT sp.contact_info_access INTO has_access
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = user_uuid 
    AND us.status = 'active'
    AND us.current_period_end > NOW()
    ORDER BY us.created_at DESC
    LIMIT 1;
    
    RETURN COALESCE(has_access, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check search limits
CREATE OR REPLACE FUNCTION can_perform_search(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    search_limit INTEGER;
    searches_used INTEGER;
BEGIN
    SELECT sp.search_limit, us.searches_used 
    INTO search_limit, searches_used
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = user_uuid 
    AND us.status = 'active'
    AND us.current_period_end > NOW()
    ORDER BY us.created_at DESC
    LIMIT 1;
    
    -- If no subscription found, default to free plan limits
    IF search_limit IS NULL AND searches_used IS NULL THEN
        -- Check if user has used their free search today
        SELECT COUNT(*) INTO searches_used
        FROM search_usage
        WHERE user_id = user_uuid 
        AND timestamp::date = CURRENT_DATE;
        
        RETURN searches_used < 1; -- Free plan: 1 search per day
    END IF;
    
    -- If search_limit is NULL, it means unlimited
    IF search_limit IS NULL THEN
        RETURN true;
    END IF;
    
    RETURN COALESCE(searches_used, 0) < search_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_subscriptions_updated_at 
    BEFORE UPDATE ON user_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at 
    BEFORE UPDATE ON subscription_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
