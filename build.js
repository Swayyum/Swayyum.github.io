// Copyright © 2025 Sam Analytic Solutions
// All rights reserved.

const fs = require('fs');
const path = require('path');

console.log('Building portfolio site...');

// Simple build script for future enhancements
// Currently, the site is static and doesn't need building
// This file is here for potential future build steps like:
// - Minification
// - Bundling
// - Asset optimization

const buildDir = path.join(__dirname, 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

// Copy files to dist (for now, just a placeholder)
const filesToCopy = ['index.html', 'styles.css', 'script.js', 'three-scene.js'];

filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(buildDir, file);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✓ Copied ${file}`);
    }
});

console.log('Build complete!');
console.log('Note: For GitHub Pages, push the root files directly.');

