// Copyright © 2025 Sam Analytic Solutions
// All rights reserved.

class ThreeScene {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.createParticles();
        this.animate();
        this.handleResize();
        this.handleMouseMove();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
        this.camera.position.z = 800; // Closer for better visibility

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
    }

    createParticles() {
        const particleCount = 3000; // Increased for more visibility
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        // Brighter, more visible colors
        const color1 = new THREE.Color(0x8b9aff); // Brighter blue
        const color2 = new THREE.Color(0xb794f6); // Brighter purple
        const color3 = new THREE.Color(0xffffff); // White for some particles

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position - closer to camera for better visibility
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i3 + 2] = (Math.random() - 0.5) * 1500; // Closer range

            // Color - mix of all three colors for variety
            const color = new THREE.Color();
            const rand = Math.random();
            if (rand < 0.4) {
                color.copy(color1);
            } else if (rand < 0.8) {
                color.copy(color2);
            } else {
                color.copy(color3);
            }
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Larger sizes for better visibility
            sizes[i] = Math.random() * 5 + 2; // Increased from 3+1 to 5+2
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mouse: { value: new THREE.Vector2(0, 0) }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                uniform vec2 mouse;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // More pronounced wave effect for visibility
                    pos.x += sin(time * 0.5 + position.y * 0.01) * 15.0;
                    pos.y += cos(time * 0.3 + position.x * 0.01) * 15.0;
                    pos.z += sin(time * 0.4 + position.x * 0.01) * 10.0;
                    
                    // More noticeable mouse interaction
                    vec2 mouseEffect = (mouse - vec2(pos.x, pos.y)) * 0.0002;
                    pos.xy += mouseEffect;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    // Increased opacity for better visibility
                    gl_FragColor = vec4(vColor, alpha * 1.2);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        this.material = material;
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (this.particles && this.material) {
            const time = Date.now() * 0.001;
            this.material.uniforms.time.value = time;
            this.material.uniforms.mouse.value = this.mouse;
            
            // Rotate particles
            this.particles.rotation.x += 0.0005;
            this.particles.rotation.y += 0.001;
        }

        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }

    handleMouseMove() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.mouse.x *= 500;
            this.mouse.y *= 500;
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }
        if (this.particles) {
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }
    }
}

// Initialize when DOM is ready
let threeScene = null;

const initThreeScene = () => {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded. 3D effects will not be available.');
        return;
    }

    console.log('Three.js loaded, initializing 3D scene...');

    const heroSection = document.querySelector('.hero');
    if (!heroSection) {
        console.warn('Hero section not found');
        return;
    }

    try {
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'three-canvas-container';
        canvasContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
        `;
        heroSection.style.position = 'relative';
        heroSection.appendChild(canvasContainer);
        
        threeScene = new ThreeScene(canvasContainer);
        console.log('3D scene initialized successfully!');
        
        // Ensure hero content is above canvas
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.position = 'relative';
            heroContent.style.zIndex = '1';
        }
    } catch (error) {
        console.error('Error initializing Three.js scene:', error);
    }
};

// Wait for Three.js to load properly
const waitForThree = () => {
    if (typeof THREE !== 'undefined' && THREE.Scene) {
        initThreeScene();
    } else {
        // Try again after a short delay
        setTimeout(waitForThree, 50);
    }
};

// Start waiting when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(waitForThree, 100);
    });
} else {
    setTimeout(waitForThree, 100);
}

// Also try when window loads (in case Three.js loads after DOMContentLoaded)
window.addEventListener('load', () => {
    if (!threeScene) {
        setTimeout(waitForThree, 100);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (threeScene) {
        threeScene.destroy();
    }
});

