# AD Pulse - Abu Dhabi Services

## Overview

AD Pulse is a comprehensive Abu Dhabi services platform with an intelligent ChatGPT-style interface to help users find the best service providers.

## Key Features

- 🤖 **ChatGPT-style chat interface** - Intelligent conversation
- 🔐 **Secure authentication** - Powered by Supabase
- 💳 **Integrated payment system** - With Stripe
- 📱 **Fully responsive design** - Works on all devices
- 🌙 **Dark/Light mode support** - For better user experience
- 🔍 **Smart service search** - Find exactly what you need
- 📊 **Admin dashboard** - Manage your services
- 🎯 **Service provider management** - Complete administration

## Requirements

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

## Quick Setup

1. **Clone the project:**
```bash
git clone <repository-url>
cd ad_pulse_web
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment setup:**
```bash
cp .env.example .env.local
```

4. **Update your .env.local file:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://cceuyhebxxqafmrmnqhq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_GPT_ASSISTANT_URL=https://chat.openai.com/g/g-tivLXVzze-abu-dhabi-open-sea-guide
```

5. **Run development server:**
```bash
npm run dev
```

6. **Build for production:**
```bash
npm run build
npm start
```

## Project Structure

```
ad_pulse_web/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx           # Home page (ChatGPT style)
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── services/          # Services pages
│   │   ├── pricing/           # Pricing pages
│   │   ├── settings/          # User settings
│   │   └── api/               # API routes
│   ├── components/            # Reusable React components
│   │   ├── Navigation.tsx     # Navigation bar
│   │   ├── ChatInterface.tsx  # Chat interface
│   │   └── ServiceCard.tsx    # Service card
│   ├── lib/                   # Utility libraries
│   │   ├── supabase.ts       # Supabase setup
│   │   └── stripe.ts         # Stripe setup
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   └── styles/               # CSS files
├── database/                 # Database files
├── public/                   # Public assets
└── scripts/                  # Automation scripts
```

## Main Pages

### 🏠 Home Page (`/`)
- ChatGPT-style intelligent interface
- Conversation management
- Smart service suggestions
- Local storage for conversations

### 🔐 Authentication
- **Login** (`/login`) - With Supabase Auth
- **Registration** (`/register`) - Create new account
- **Password Recovery** (`/reset-password`)

### 🛠️ Services
- **Services List** (`/services`) - View all services
- **Service Details** (`/services/[id]`) - Service page
- **Add Service** (`/services/add`) - For service providers
- **Manage Services** (`/services/manage`)

### 💰 Pricing & Payment
- **Pricing Plans** (`/pricing`) - View different plans
- **Payment** (`/payment`) - Secure payment page
- **Payment Success** (`/payment-success`) - Confirmation

### ⚙️ Settings
- **Profile** (`/profile`) - Manage profile
- **Settings** (`/settings`) - Account settings
- **Upgrade Plan** (`/upgrade`)

## API Endpoints

### 📝 Chat API
- **POST /api/chat** - Handles chat requests
  - Returns smart responses based on user input
  - Integrates with service suggestions

### 💳 Payment API
- **POST /api/create-payment-intent** - Creates Stripe payment intent
- **GET /api/get-plans** - Retrieves subscription plans
- **POST /api/create-subscription** - Processes subscriptions

### 🔒 User API
- **GET /api/user/profile** - Gets user profile data
- **PUT /api/user/profile** - Updates user profile
- **GET /api/user/subscriptions** - Retrieves user subscriptions

### 🛠️ Service API
- **GET /api/services** - Lists all services
- **GET /api/services/[id]** - Gets specific service
- **POST /api/services** - Creates new service
- **PUT /api/services/[id]** - Updates service

## Database

The project uses Supabase with the following tables:
- `users` - User data
- `services` - Available services
- `service_providers` - Service providers
- `bookings` - Bookings
- `payments` - Payments
- `reviews` - Reviews

## Deployment

### Vercel (Recommended)
1. Connect the project to Vercel
2. Set up environment variables in Vercel
3. Automatic deployment from Git

### Required Environment Variables for Production:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_GPT_ASSISTANT_URL=
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Performance Analysis
npm run lighthouse
```

## Contributing

1. Fork the project
2. Create a new branch
3. Make changes
4. Submit a Pull Request

## Support

For support or to report issues:
- Create a new Issue on GitHub
- Contact via email

## License

This project is licensed under the MIT License.

---

## Current Project Status

✅ **Completed:**
- Project builds successfully
- Main ChatGPT interface completed
- Authentication system with Supabase
- Environment variable management
- Cleanup of duplicate files

🔄 **In Progress:**
- Improving smart responses
- Adding more service types
- Performance optimization

🎯 **Next Steps:**
- Comprehensive testing of all pages
- Enhancing user experience
- Adding more features
