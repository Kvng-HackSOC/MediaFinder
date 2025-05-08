#!/bin/bash

echo "Checking for required files..."

# Check main files
[ -f "server.js" ] && echo "✅ server.js exists" || echo "❌ server.js MISSING"
[ -f "package.json" ] && echo "✅ package.json exists" || echo "❌ package.json MISSING"

# Check config directory
[ -d "config" ] && echo "✅ config directory exists" || echo "❌ config directory MISSING"
[ -f "config/db.js" ] && echo "✅ config/db.js exists" || echo "❌ config/db.js MISSING"

# Check middleware directory
[ -d "middleware" ] && echo "✅ middleware directory exists" || echo "❌ middleware directory MISSING"
[ -f "middleware/authMiddleware.js" ] && echo "✅ middleware/authMiddleware.js exists" || echo "❌ middleware/authMiddleware.js MISSING"

# Check routes directory
[ -d "routes" ] && echo "✅ routes directory exists" || echo "❌ routes directory MISSING"
[ -f "routes/authRoutes.js" ] && echo "✅ routes/authRoutes.js exists" || echo "❌ routes/authRoutes.js MISSING"
[ -f "routes/searchRoutes.js" ] && echo "✅ routes/searchRoutes.js exists" || echo "❌ routes/searchRoutes.js MISSING"
[ -f "routes/contactRoutes.js" ] && echo "✅ routes/contactRoutes.js exists" || echo "❌ routes/contactRoutes.js MISSING"

echo "File check complete."