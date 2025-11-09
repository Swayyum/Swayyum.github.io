// Copyright © 2025 Sam Analytic Solutions
// All rights reserved.

// OGL Particle Background - ES Module version
import { Renderer, Camera, Transform, Geometry, Program, Mesh } from 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/src/index.mjs';

let renderer, camera, scene, particles;
let mouse = { x: 0, y: 0 };
let animationId;

function initOGL() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) {
        console.error('Hero section not found');
        return false;
    }

    // Create container
    const container = document.createElement('div');
    container.id = 'ogl-container';
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

    // Initialize renderer
    renderer = new Renderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    // Camera
    camera = new Camera(gl);
    camera.position.z = 5;

    // Scene
    scene = new Transform();

    // Create particles
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Colors: bright blue, purple, white
    const color1 = [0.545, 0.604, 1.0]; // #8b9aff
    const color2 = [0.718, 0.580, 0.965]; // #b794f6
    const color3 = [1.0, 1.0, 1.0]; // white

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Position
        positions[i3] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;

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
        
        colors[i3] = color[0];
        colors[i3 + 1] = color[1];
        colors[i3 + 2] = color[2];

        // Size
        sizes[i] = Math.random() * 0.1 + 0.05;
    }

    // Geometry
    const geometry = new Geometry(gl, {
        position: { size: 3, data: positions },
        color: { size: 3, data: colors },
        size: { size: 1, data: sizes }
    });

    // Program
    const program = new Program(gl, {
        vertex: /* glsl */`
            attribute vec3 position;
            attribute vec3 color;
            attribute float size;
            
            uniform float uTime;
            uniform vec2 uMouse;
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                
                vec3 pos = position;
                
                // Wave animation
                pos.x += sin(uTime * 0.5 + position.y * 0.5) * 0.5;
                pos.y += cos(uTime * 0.3 + position.x * 0.5) * 0.5;
                pos.z += sin(uTime * 0.4 + position.x * 0.5) * 0.3;
                
                // Mouse interaction
                vec2 mouseEffect = (uMouse - vec2(pos.x, pos.y)) * 0.1;
                pos.xy += mouseEffect;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * 300.0 / -mvPosition.z;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragment: /* glsl */`
            precision highp float;
            
            varying vec3 vColor;
            
            void main() {
                float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                gl_FragColor = vec4(vColor, alpha * 0.9);
            }
        `,
        uniforms: {
            uTime: { value: 0 },
            uMouse: { value: [0, 0] }
        },
        transparent: true,
        depthTest: false,
        depthWrite: false
    });

    // Mesh
    particles = new Mesh(gl, { geometry, program });
    particles.setParent(scene);

    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Resize handler
    function resize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.perspective({
            aspect: width / height
        });
    }
    window.addEventListener('resize', resize);
    resize();

    // Start animation
    animate();

    console.log('OGL particle system initialized!');
    return true;
}

function animate() {
    animationId = requestAnimationFrame(animate);

    if (!particles) return;

    const time = performance.now() * 0.001;

    // Update uniforms
    particles.program.uniforms.uTime.value = time;
    particles.program.uniforms.uMouse.value = [mouse.x * 5, mouse.y * 5];

    // Rotate scene
    scene.rotation.y = time * 0.1;
    scene.rotation.x = time * 0.05;

    // Camera follows mouse
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 2 - camera.position.y) * 0.05;

    if (renderer && scene && camera) {
        renderer.render({ scene, camera });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => initOGL(), 100);
    });
} else {
    setTimeout(() => initOGL(), 100);
}

window.addEventListener('load', () => {
    if (!particles) {
        setTimeout(() => initOGL(), 200);
    }
});
