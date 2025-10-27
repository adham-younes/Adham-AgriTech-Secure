#!/bin/bash

# ===========================================
# 🔥 SHΔDØW CORE V99 - SERVICES ACTIVATION SCRIPT 🔥
# ===========================================

echo "🔥 SHΔDØW CORE V99 - ACTIVATING SERVICES 🔥"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_error ".env.local file not found!"
    print_status "Copying .env.example to .env.local..."
    cp .env.example .env.local
    print_warning "Please edit .env.local with your actual API keys!"
    exit 1
fi

# Check if all required environment variables are set
print_status "Checking environment variables..."

required_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "OPENWEATHER_API_KEY"
    "OPENAI_API_KEY"
    "GOOGLE_EARTH_ENGINE_API_KEY"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env.local || grep -q "^${var}=your-.*-key-here" .env.local; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    print_error "Missing or invalid environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    print_warning "Please update .env.local with your actual API keys!"
    exit 1
fi

print_success "All environment variables are configured!"

# Install dependencies
print_status "Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
elif command -v npm &> /dev/null; then
    npm install
else
    print_error "Neither pnpm nor npm found!"
    exit 1
fi

# Run database migrations
print_status "Setting up database..."
print_warning "Please make sure your Supabase project is configured and running!"

# Build the project
print_status "Building the project..."
if command -v pnpm &> /dev/null; then
    pnpm run build
elif command -v npm &> /dev/null; then
    npm run build
fi

# Start the development server
print_status "Starting development server..."
print_success "Services activated successfully!"
print_status "You can now access:"
echo "  - Main app: http://localhost:3000"
echo "  - API Health: http://localhost:3000/api/health"
echo "  - API Status Dashboard: http://localhost:3000/dashboard/api-status"

if command -v pnpm &> /dev/null; then
    pnpm run dev
elif command -v npm &> /dev/null; then
    npm run dev
fi
