# AD PLUS Assistant - Unified ChatGPT-Style Interface

A clean, professional Next.js web application with a unified single-page chat interface, designed to provide instant information about services in Abu Dhabi.

## 🎯 Features

- **Unified Single-Page Interface**: ChatGPT-style dark theme with minimalistic design
- **Service Categories**: Personal trainers, Yacht rentals, Apartment rentals, Beauty clinics, Kids services, Housekeeping
- **Smart Search**: Automatically searches Supabase database for relevant services
- **GPT Assistant Fallback**: Redirects to custom GPT assistant when no services found
- **Authentication**: Login/Register/Password Reset via Supabase Auth with Google OAuth
- **Payment Integration**: Stripe payment processing for service bookings
- **Real-time Chat**: Interactive chat interface with animated messages

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Stripe Keys (Test Mode)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret

   # GPT Assistant Fallback URL
   NEXT_PUBLIC_GPT_ASSISTANT_URL=https://chatgpt.com/g/g-6878b2d4d774819186609d62df9274c2-ad-plus?model=gpt-4-5
   ```

4. Run the database migration:
   ```bash
   # Execute the SQL file in your Supabase dashboard
   database/ad_plus_setup.sql
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

The application uses the following tables:

- **services**: Service listings with category, pricing, and contact information
- **user_requests**: Chat interactions and responses
- **user_feedback**: User ratings and feedback for services
- **bookings**: Payment and booking records

## 🔐 Security Features

- Row Level Security (RLS) policies implemented
- Authenticated user access control
- Secure payment processing with Stripe
- OAuth integration with Google

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

3. Set up Stripe webhooks for payment confirmation

## 📱 Usage

1. Visit the application
2. Use the chat interface to search for services
3. Sign in to access booking features
4. Complete payments through the integrated Stripe modal
5. View service details and contact information

## 🎨 Design Philosophy

- **Minimalistic**: Clean, distraction-free interface
- **ChatGPT-inspired**: Familiar chat-based interaction
- **Dark Theme**: Professional black and white color scheme
- **Mobile-first**: Responsive design for all devices

## 🔧 API Endpoints

- `POST /api/create-payment-intent`: Create Stripe payment intent
- `POST /api/webhooks/stripe`: Handle Stripe webhook events

## 📋 Service Categories

- 🏋️‍♂️ Personal trainers
- ⛵ Yacht rentals
- 🏠 Apartment rentals
- ✨ Beauty clinics
- 👶 Kids services
- 🧹 Housekeeping

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🔗 Links

- [Live Demo](https://your-domain.com)
- [GPT Assistant](https://chatgpt.com/g/g-6878b2d4d774819186609d62df9274c2-ad-plus?model=gpt-4-5)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Stripe Dashboard](https://dashboard.stripe.com/)

---

Built with ❤️ for Abu Dhabi service providers and customers.
