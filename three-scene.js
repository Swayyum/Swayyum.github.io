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
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 1000;

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
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const color1 = new THREE.Color(0x6366f1); // Primary color
        const color2 = new THREE.Color(0x8b5cf6); // Secondary color

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i3 + 2] = (Math.random() - 0.5) * 2000;

            // Color (interpolate between two colors)
            const color = new THREE.Color();
            color.lerpColors(color1, color2, Math.random());
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Size
            sizes[i] = Math.random() * 3 + 1;
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
                    
                    // Add wave effect
                    pos.x += sin(time * 0.5 + position.y * 0.01) * 10.0;
                    pos.y += cos(time * 0.3 + position.x * 0.01) * 10.0;
                    
                    // Mouse interaction
                    vec2 mouseEffect = (mouse - vec2(pos.x, pos.y)) * 0.0001;
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
                    gl_FragColor = vec4(vColor, alpha * 0.8);
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

    const heroSection = document.querySelector('.hero');
    if (!heroSection) {
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

// Wait for Three.js to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for Three.js script to load
        setTimeout(initThreeScene, 100);
    });
} else {
    setTimeout(initThreeScene, 100);
}

// Also try when window loads (in case Three.js loads after DOMContentLoaded)
window.addEventListener('load', () => {
    if (!threeScene && typeof THREE !== 'undefined') {
        setTimeout(initThreeScene, 100);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (threeScene) {
        threeScene.destroy();
    }
});

