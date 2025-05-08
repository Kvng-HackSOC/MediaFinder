// scripts/deploy.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get environment from args
const args = process.argv.slice(2);
const env = args[0] || 'development';

console.log(`Deploying for ${env} environment...`);

// Build frontend
console.log('Building frontend...');
execSync('cd frontend && npm run build', { stdio: 'inherit' });

// Copy build files to backend
console.log('Copying build files to backend...');
const buildDir = path.join(__dirname, '..', 'frontend', 'build');
const destDir = path.join(__dirname, '..', 'backend', 'build');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy function
const copyDir = (src, dest) => {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};

copyDir(buildDir, destDir);

console.log('Deployment preparation complete!');