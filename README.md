# Portfolio Website

A modern, responsive portfolio website showcasing GitHub projects, built with HTML, CSS, JavaScript, and enhanced with **Three.js** for stunning 3D visual effects.

## Features

- 🎨 Modern and clean design
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Fast loading with vanilla JavaScript
- 🔄 Dynamic GitHub repository fetching
- ✨ Smooth animations and transitions
- 🎯 SEO-friendly structure
- 🌟 **Three.js 3D particle system** with interactive mouse effects
- 🎭 **Animated 3D background** in hero section
- 🛠️ **Node.js development environment** for easy local development

## Project Structure

```
site/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # JavaScript functionality
├── three-scene.js      # Three.js 3D scene manager
├── package.json        # Node.js dependencies
├── build.js            # Build script
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Deployment to GitHub Pages

### Option 1: Using GitHub Repository (Recommended)

1. **Create a new repository** on GitHub:
   - Repository name: `Swayyum.github.io` (replace with your username)
   - Make it public
   - Don't initialize with README (since you already have files)

2. **Initialize git and push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Portfolio website"
   git branch -M main
   git remote add origin https://github.com/Swayyum/Swayyum.github.io.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click on **Settings**
   - Scroll down to **Pages** section
   - Under **Source**, select `main` branch
   - Click **Save**

4. **Your site will be live at**: `https://Swayyum.github.io`

### Option 2: Using a Different Repository Name

If you want to use a different repository name (e.g., `portfolio`):

1. Create repository with your desired name
2. Push your code to the repository
3. Go to Settings → Pages
4. Select `main` branch as source
5. Your site will be at: `https://Swayyum.github.io/portfolio/`

**Note**: If using a subdirectory, update all internal links in `index.html` to use relative paths with the subdirectory prefix.

## Local Development

### Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- A modern web browser with WebGL support

### Setup and Run

1. **Install dependencies** (optional, for development server):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   # or
   npm start
   ```
   This will start a local server at `http://localhost:8000` and open it in your browser.

### Alternative Development Methods

1. **Using Python 3**:
   ```bash
   python3 -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

2. **Using Node.js http-server directly**:
   ```bash
   npx http-server -p 8000
   ```

3. **Using VS Code Live Server**:
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

### Build (Optional)

Run the build script:
```bash
npm run build
```

This creates a `dist` folder with optimized files (currently just copies files, ready for future enhancements).

## Customization

### Update GitHub Username

In `script.js`, change the `GITHUB_USERNAME` constant:
```javascript
const GITHUB_USERNAME = 'YourUsername';
```

### Update Personal Information

Edit `index.html` to update:
- Name and bio in the hero section
- About section content
- Contact links (GitHub, LinkedIn)
- Footer information

### Customize Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    /* ... other variables */
}
```

### Modify Project Display

- Change number of projects shown: Edit `slice(0, 9)` in `script.js`
- Adjust sorting: Modify the `sort()` function in `displayProjects()`
- Filter repositories: Update the `filter()` function

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Copyright © 2025 Sam Analytic Solutions
All rights reserved.

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with modern features (Grid, Flexbox, Custom Properties)
- **JavaScript (ES6+)** - Interactivity and GitHub API integration
- **Three.js** - 3D graphics and particle system
- **Node.js** - Development environment and build tools

## Three.js Features

The portfolio includes an interactive 3D particle system in the hero section:

- **2000 animated particles** that respond to mouse movement
- **Wave animations** creating dynamic motion
- **Color gradients** matching the site's theme
- **Performance optimized** with WebGL rendering
- **Responsive** - adapts to screen size automatically

The 3D scene is initialized automatically when the page loads and includes:
- Custom shaders for particle rendering
- Mouse interaction effects
- Smooth animations using requestAnimationFrame
- Automatic cleanup on page unload

## Credits

- Font: [Inter](https://fonts.google.com/specimen/Inter) by Google Fonts
- Icons: SVG icons embedded in HTML
- 3D Library: [Three.js](https://threejs.org/) - JavaScript 3D library

