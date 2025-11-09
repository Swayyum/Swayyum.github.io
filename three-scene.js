// Copyright © 2025 Sam Analytic Solutions
// All rights reserved.

// Simple, reliable Three.js particle system
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;

function initThreeJS() {
    // Check if Three.js loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js failed to load!');
        return false;
    }

    console.log('Three.js loaded successfully!');

    const heroSection = document.querySelector('.hero');
    if (!heroSection) {
        console.error('Hero section not found');
        return false;
    }

    // Create container for canvas
    const container = document.createElement('div');
    container.id = 'threejs-container';
    container.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
    `;
    heroSection.style.position = 'relative';
    heroSection.appendChild(container);

    // Scene setup
    scene = new THREE.Scene();
    
    // Camera
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 2000);
    camera.position.z = 500;

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create particles
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Colors: bright blue, purple, white
    const color1 = new THREE.Color(0x8b9aff);
    const color2 = new THREE.Color(0xb794f6);
    const color3 = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Position
        positions[i3] = (Math.random() - 0.5) * 2000;
        positions[i3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i3 + 2] = (Math.random() - 0.5) * 1000;

        // Color
        const rand = Math.random();
        let color;
        if (rand < 0.33) {
            color = color1;
        } else if (rand < 0.66) {
            color = color2;
        } else {
            color = color3;
        }
        
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    const material = new THREE.PointsMaterial({
        size: 4,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse movement
    document.addEventListener('mousemove', onMouseMove);
    
    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();

    console.log('3D particles initialized!');
    return true;
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    const container = document.getElementById('threejs-container');
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function animate() {
    requestAnimationFrame(animate);

    if (!particles) return;

    const time = Date.now() * 0.001;

    // Rotate particles
    particles.rotation.x = time * 0.1;
    particles.rotation.y = time * 0.2;

    // Mouse interaction
    if (camera) {
        camera.position.x += (mouseX * 100 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 100 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
    }

    // Animate particles
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + positions[i] * 0.01) * 0.5;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Initialize when ready
function startThreeJS() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                if (!initThreeJS()) {
                    console.warn('Retrying Three.js initialization...');
                    setTimeout(startThreeJS, 500);
                }
            }, 100);
        });
    } else {
        setTimeout(() => {
            if (!initThreeJS()) {
                console.warn('Retrying Three.js initialization...');
                setTimeout(startThreeJS, 500);
            }
        }, 100);
    }
}

// Also try on window load
window.addEventListener('load', () => {
    if (!particles) {
        setTimeout(startThreeJS, 200);
    }
});

// Start initialization
startThreeJS();
