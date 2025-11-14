# 🏋️ Fitness Tracker Application

A comprehensive full-stack fitness tracking application built with .NET 8 backend and React + TypeScript frontend. Track your workouts, nutrition, calories, macros, and achieve your fitness goals with an intuitive interface and powerful analytics.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Stripe Integration](#stripe-integration)
  - [Setting Up Stripe](#setting-up-stripe)
  - [Testing Stripe Payments](#testing-stripe-payments)
  - [Webhook Configuration](#webhook-configuration)
- [Database Configuration](#database-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This Fitness Tracker is an all-in-one solution for health enthusiasts, personal trainers, and anyone looking to maintain a healthy lifestyle. The application provides:

- **Comprehensive Workout Tracking**: Create custom workout routines, log exercises, track sets/reps/weight
- **Nutrition Management**: Track daily calorie intake, macronutrients (protein, carbs, fats), and monitor food consumption
- **Goal Setting & Monitoring**: Set fitness goals and track progress with detailed analytics
- **User Metrics**: Monitor body weight, measurements, and other health metrics over time
- **Reports & Analytics**: Visual dashboards with charts and graphs for workout and nutrition insights
- **Premium Subscriptions**: Stripe-powered payment system for premium features

---

## ✨ Features

### 🏃 Workout Management
- Create and manage weekly workout routines
- Add day-specific routines with target body parts
- Extensive exercise library with categories
- Log workout sessions with sets, reps, and weight
- Track workout history and progress

### 🍎 Nutrition Tracking
- Food database (system-wide and custom foods)
- Log daily food intake with portions
- Track calories and macronutrients (protein, carbs, fat, fiber)
- Daily, weekly, and monthly nutrition summaries
- Goal-based calorie and macro tracking
- Compare current vs previous periods

### 📊 Analytics & Reports
- Dashboard with visual charts (pie charts, bar graphs)
- Exercise distribution analysis
- Calorie trends over time
- Goal adherence tracking
- Daily/weekly/monthly comparisons

### 👤 User Management
- Secure authentication with JWT tokens
- User profile with customizable settings
- Timezone support for accurate local date tracking
- Role-based access control (Admin/User)

### 💳 Premium Features (Stripe Integration)
- Monthly and yearly subscription plans
- Secure payment processing via Stripe
- Webhook support for payment events
- Subscription management

### 🎨 UI/UX Features
- Dark/Light theme toggle
- Responsive design for all devices
- Modern, intuitive interface
- Smooth animations and transitions
- Accessible design patterns

---

## 🛠️ Tech Stack

### Backend
- **.NET 8** - Web API
- **ASP.NET Core Identity** - Authentication & Authorization
- **Entity Framework Core 8** - ORM
- **PostgreSQL** - Database
- **JWT Bearer Authentication** - Token-based auth
- **Stripe.NET** - Payment processing
- **Swagger/OpenAPI** - API documentation

### Frontend
- **React 19** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router v7** - Routing
- **Recharts** - Data visualization
- **React Icons** - Icon library
- **Stripe.js** - Payment UI components
- **CSS Modules** - Scoped styling

---

## 📦 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **Stripe Account** (for payment features) - [Sign up](https://stripe.com/)

### Recommended Tools
- **Visual Studio 2022** or **VS Code** (with C# extension)
- **Postman** or **Insomnia** (for API testing)
- **pgAdmin** or **DBeaver** (for database management)

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd fitness
```

### 2️⃣ Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd backend
```

#### Step 2: Restore NuGet Packages
```bash
dotnet restore
```

#### Step 3: Configure Database Connection

Edit `appsettings.json` and update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=new_fitness;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

**Replace `YOUR_PASSWORD` with your PostgreSQL password.**

#### Step 4: Configure JWT Settings

Update the JWT section in `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "your_super_secret_key_that_is_at_least_32_characters_long",
    "Issuer": "FitnessApp",
    "Audience": "FitnessAppUsers",
    "ExpireDays": 7
  }
}
```

**⚠️ Important**: Generate a strong, unique secret key for production!

#### Step 5: Apply Database Migrations

```bash
dotnet ef database update
```

This will:
- Create the database schema
- Seed initial data (default admin user, exercises, etc.)

#### Step 6: Build the Backend

```bash
dotnet build
```

### 3️⃣ Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd ../frontend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
```

#### Step 4: Configure API Base URL

Edit `frontend/src/apiclient/apiClient.ts` and update the API URL if needed:

```typescript
const API_BASE_URL = 'http://localhost:5017'; // Your backend URL
```

---

## 💳 Stripe Integration

### Setting Up Stripe

#### 1. Create a Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free account
3. Verify your email

#### 2. Get Your API Keys
1. Log in to Stripe Dashboard
2. Navigate to **Developers** → **API Keys**
3. Copy your **Publishable Key** (starts with `pk_test_`)
4. Copy your **Secret Key** (starts with `sk_test_`)

#### 3. Configure Backend Stripe Settings

Update `backend/appsettings.json`:

```json
{
  "Stripe": {
    "SecretKey": "sk_test_YOUR_SECRET_KEY",
    "WebhookSecret": "whsec_YOUR_WEBHOOK_SECRET",
    "MonthlyPriceId": "price_YOUR_MONTHLY_PRICE_ID",
    "YearlyPriceId": "price_YOUR_YEARLY_PRICE_ID"
  }
}
```

#### 4. Create Products and Prices in Stripe

##### Using Stripe Dashboard:
1. Go to **Products** → **Add Product**
2. Create "Fitness Premium - Monthly":
   - Name: "Premium Monthly Subscription"
   - Price: $9.99 (or your desired amount)
   - Billing period: Monthly
   - Save and copy the **Price ID** (starts with `price_`)
3. Create "Fitness Premium - Yearly":
   - Name: "Premium Yearly Subscription"
   - Price: $99.99 (or your desired amount)
   - Billing period: Yearly
   - Save and copy the **Price ID**

##### Using Stripe CLI:
```bash
# Create Monthly Product
stripe products create \
  --name "Premium Monthly Subscription" \
  --description "Access to all premium features"

# Create Monthly Price
stripe prices create \
  --product prod_XXXXX \
  --unit-amount 999 \
  --currency usd \
  --recurring[interval]=month

# Create Yearly Price
stripe prices create \
  --product prod_XXXXX \
  --unit-amount 9999 \
  --currency usd \
  --recurring[interval]=year
```

#### 5. Configure Frontend Environment

Update `frontend/.env`:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_PUBLISHABLE_KEY
```

### Testing Stripe Payments

Stripe provides test card numbers for development:

#### Successful Payment:
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

#### Other Test Cards:
- **Decline**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`
- **3D Secure Required**: `4000 0025 0000 3155`

### Webhook Configuration

Webhooks allow Stripe to notify your application about payment events.

#### Development (Using Stripe CLI):

1. **Install Stripe CLI**: [Download](https://stripe.com/docs/stripe-cli)

2. **Login to Stripe**:
```bash
stripe login
```

3. **Forward Webhooks to Local Server**:
```bash
stripe listen --forward-to http://localhost:5017/api/payment/webhook
```

4. **Copy the Webhook Secret**:
   - The CLI will output a webhook secret (starts with `whsec_`)
   - Add it to `appsettings.json`

#### Production:

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add Endpoint**
3. Enter your endpoint URL: `https://yourdomain.com/api/payment/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing Secret** and update your production config

### Stripe Payment Flow

1. User clicks "Subscribe" on frontend
2. Frontend calls `/api/payment/create-checkout-session`
3. Backend creates Stripe Checkout session
4. User redirects to Stripe-hosted payment page
5. User enters payment details
6. Stripe processes payment
7. User redirects back to success/cancel page
8. Webhook notifies backend of payment status
9. Backend updates user subscription status

---

## 🗄️ Database Configuration

### PostgreSQL Setup

#### 1. Install PostgreSQL
Download and install from [postgresql.org](https://www.postgresql.org/download/)

#### 2. Create Database

Using PostgreSQL CLI:
```bash
psql -U postgres
```

```sql
CREATE DATABASE new_fitness;
\q
```

Using pgAdmin:
1. Open pgAdmin
2. Right-click **Databases** → **Create** → **Database**
3. Name: `new_fitness`
4. Save

#### 3. Verify Connection

Test your connection string:
```bash
psql -h localhost -p 5432 -U postgres -d new_fitness
```

### Database Schema

The application uses Entity Framework Core migrations. The schema includes:

- **Users** - User accounts and profiles
- **Foods** - Food items with nutritional data
- **IntakeEntries** - Daily food consumption logs
- **DailySummaries** - Aggregated nutrition data
- **Exercises** - Exercise catalog
- **Workouts** - Workout sessions
- **WeeklyRoutines** - Workout plans
- **Goals** - User fitness goals
- **UserMetrics** - Body measurements and metrics
- **AuditLogs** - System audit trail

### Managing Migrations

#### Create a New Migration:
```bash
cd backend
dotnet ef migrations add YourMigrationName
```

#### Apply Migrations:
```bash
dotnet ef database update
```

#### Rollback Migration:
```bash
dotnet ef database update PreviousMigrationName
```

#### Drop Database:
```bash
dotnet ef database drop
```

---

## 🏃 Running the Application

### Running Backend

#### Option 1: Using .NET CLI
```bash
cd backend
dotnet run
```

The backend will start at: `https://localhost:5017`

#### Option 2: Using Visual Studio
1. Open `Fitness.sln` in Visual Studio
2. Press `F5` or click **Debug** → **Start Debugging**

#### Option 3: Using VS Code
1. Open backend folder in VS Code
2. Press `F5` (requires C# extension)

**Swagger UI**: Navigate to `https://localhost:5017/swagger` to explore the API.

### Running Frontend

#### Development Mode:
```bash
cd frontend
npm run dev
```

The frontend will start at: `http://localhost:5173`

#### Build for Production:
```bash
npm run build
```

Output will be in `frontend/dist/`

#### Preview Production Build:
```bash
npm run preview
```

### Running Both Simultaneously

#### Terminal 1 (Backend):
```bash
cd backend
dotnet run
```

#### Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Then open your browser to `http://localhost:5173`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5017/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "displayName": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiration": "2025-11-21T10:30:00Z"
}
```

### Workout Endpoints

#### Get All Exercises
```http
GET /api/exercises
Authorization: Bearer {token}
```

#### Create Workout
```http
POST /api/workouts
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Upper Body Day",
  "date": "2025-11-14",
  "notes": "Heavy lifting session"
}
```

### Nutrition Endpoints

#### Get Foods
```http
GET /api/foods?nameContains=chicken&page=1&pageSize=25
Authorization: Bearer {token}
```

#### Log Intake
```http
POST /api/intake
Authorization: Bearer {token}
Content-Type: application/json

{
  "foodId": "uuid-here",
  "quantityGrams": 150,
  "loggedAtLocal": "2025-11-14T12:30:00",
  "timezone": "America/New_York"
}
```

#### Get Daily Report
```http
GET /api/reports/daily?date=2025-11-14
Authorization: Bearer {token}
```

### Payment Endpoints

#### Create Checkout Session
```http
POST /api/payment/create-checkout-session
Authorization: Bearer {token}
Content-Type: application/json

{
  "subscriptionType": "monthly"
}
```

### Full API Documentation

Access interactive API documentation at: **http://localhost:5017/swagger**

---

## 📁 Project Structure

```
fitness/
├── backend/                          # .NET 8 Web API
│   ├── Controllers/                  # API Controllers
│   │   ├── AuthController.cs         # Authentication endpoints
│   │   ├── ExercisesController.cs    # Exercise management
│   │   ├── WorkoutsController.cs     # Workout tracking
│   │   ├── FoodsController.cs        # Food catalog
│   │   ├── IntakeController.cs       # Nutrition logging
│   │   ├── ReportsController.cs      # Analytics & reports
│   │   ├── PaymentController.cs      # Stripe integration
│   │   └── ...
│   ├── Models/                       # Domain models & DTOs
│   │   ├── User.cs
│   │   ├── Exercise.cs
│   │   ├── Food.cs
│   │   ├── IntakeEntry.cs
│   │   └── ...
│   ├── Services/                     # Business logic
│   │   ├── ExerciseService.cs
│   │   ├── FoodService.cs
│   │   ├── StripeService.cs
│   │   └── ...
│   ├── Data/                         # Database context
│   │   ├── ApplicationDbContext.cs
│   │   └── Seed/                     # Database seeders
│   ├── Migrations/                   # EF Core migrations
│   ├── appsettings.json             # Configuration
│   └── Program.cs                    # Application entry point
│
├── frontend/                         # React + TypeScript
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── Nutrition/
│   │   │   │   └── CalorieTracker/
│   │   │   ├── Workout/
│   │   │   └── ...
│   │   ├── pages/                   # Page components
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ExercisePage.tsx
│   │   │   ├── CalorieTrackerPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── ...
│   │   ├── layout/                  # Layout components
│   │   │   ├── Navbar/
│   │   │   └── LoggedInLayout.tsx
│   │   ├── contexts/                # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── apiclient/              # API client
│   │   │   └── apiClient.ts
│   │   ├── App.tsx                 # Root component
│   │   ├── App.css                 # Global styles
│   │   └── main.tsx                # Application entry
│   ├── public/                     # Static assets
│   ├── .env                        # Environment variables
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md                        # This file
```

---

## 🔐 Environment Variables

### Backend (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=new_fitness;Username=postgres;Password=YOUR_PASSWORD"
  },
  "Jwt": {
    "Key": "your_super_secret_key_that_is_at_least_32_characters_long",
    "Issuer": "FitnessApp",
    "Audience": "FitnessAppUsers",
    "ExpireDays": 7
  },
  "Stripe": {
    "SecretKey": "sk_test_YOUR_SECRET_KEY",
    "WebhookSecret": "whsec_YOUR_WEBHOOK_SECRET",
    "MonthlyPriceId": "price_YOUR_MONTHLY_PRICE_ID",
    "YearlyPriceId": "price_YOUR_YEARLY_PRICE_ID"
  }
}
```

### Frontend (.env)

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_PUBLISHABLE_KEY
```

---

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Failed
- Verify PostgreSQL is running: `pg_isready`
- Check connection string in `appsettings.json`
- Ensure database exists: `psql -l | grep new_fitness`

#### JWT Token Issues
- Ensure JWT Key is at least 32 characters
- Check token expiration settings
- Verify Issuer and Audience match

#### CORS Errors
- Backend CORS is configured for `http://localhost:5173`
- Update `Program.cs` if frontend runs on different port
- Clear browser cache

#### Stripe Payment Fails
- Verify Stripe keys are correct (test mode vs live mode)
- Check webhook secret is properly configured
- Use test card numbers during development
- Check Stripe logs in dashboard

#### Frontend Build Errors
- Delete `node_modules` and reinstall: `npm ci`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version: `node --version` (should be v18+)

#### Migration Errors
- Drop database and recreate: `dotnet ef database drop`
- Reapply migrations: `dotnet ef database update`
- Check model configurations in `ApplicationDbContext.cs`

---

## 🧪 Testing

### Test User Credentials
After running migrations, a test user is seeded:

- **Email**: `test@test.com`
- **Password**: `Test@123`

### API Testing with Swagger
1. Navigate to `http://localhost:5017/swagger`
2. Click **Authorize** button
3. Login to get JWT token
4. Paste token in format: `Bearer YOUR_TOKEN_HERE`
5. Test endpoints directly from Swagger UI

---

## 🚀 Deployment

### Backend Deployment

#### Deploy to Azure App Service:
1. Publish profile in Visual Studio
2. Or use Azure CLI:
```bash
az webapp up --name your-app-name --resource-group your-rg
```

#### Deploy to AWS/Heroku/DigitalOcean:
- Build: `dotnet publish -c Release`
- Deploy `bin/Release/net8.0/publish/` contents

### Frontend Deployment

#### Build for Production:
```bash
npm run build
```

#### Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

#### Deploy to Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Environment Variables for Production
- Update all test API keys to live keys
- Use environment variables for secrets
- Enable HTTPS
- Configure proper CORS origins
- Set secure JWT keys

---

## 📖 Additional Resources

- [.NET Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Stripe Documentation](https://stripe.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

Developed with ❤️ by [Your Name]

---

## 🙏 Acknowledgments

- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- Charts by [Recharts](https://recharts.org/)
- Payment processing by [Stripe](https://stripe.com/)
- Database by [PostgreSQL](https://www.postgresql.org/)

---

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

**Happy Tracking! 💪🏋️‍♂️🥗**
