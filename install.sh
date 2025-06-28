#!/bin/bash

# BizBooking System Installation Script
# Coded by Ntombifuthi Mashinini © 2025

echo "🚀 Welcome to BizBooking System Installation"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created from template"
    echo "⚠️  Please edit .env file with your configuration"
else
    echo "✅ .env file already exists"
fi

# Install Tailwind CSS
echo "🎨 Setting up Tailwind CSS..."
cd client
npx tailwindcss init -p

if [ $? -eq 0 ]; then
    echo "✅ Tailwind CSS configured successfully"
else
    echo "⚠️  Tailwind CSS setup failed, but you can continue"
fi

cd ..

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Set up your email credentials for notifications"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📚 Documentation: README.md"
echo ""
echo "Built with ❤️ by Ntombifuthi Mashinini © 2025"

chmod +x install.sh
./install.sh 