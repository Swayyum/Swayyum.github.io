// Copyright © 2025 Sam Analytic Solutions
// All rights reserved.

// Aurora Background Effect - Vanilla JavaScript version
let renderer, program, mesh, animationId;
let OGL = null;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

function hexToRgb(hex) {
    // Convert hex to RGB manually if Color class not available
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        return [
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255
        ];
    }
    return [0.5, 0.5, 0.5];
}

async function loadOGL() {
    if (OGL) return OGL;
    
    try {
        // Try importing from CDN
        const module = await import('https://cdn.jsdelivr.net/npm/ogl@1.0.11/src/index.mjs');
        OGL = module;
        console.log('OGL loaded successfully');
        return OGL;
    } catch (error) {
        console.error('Failed to load OGL:', error);
        // Try alternative CDN
        try {
            const script = document.createElement('script');
            script.type = 'module';
            script.textContent = `
                import * as OGL from 'https://unpkg.com/ogl@1.0.11/src/index.mjs';
                window.OGL = OGL;
            `;
            document.head.appendChild(script);
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (window.OGL) {
                OGL = window.OGL;
                return OGL;
            }
        } catch (e) {
            console.error('Alternative OGL load failed:', e);
        }
        return null;
    }
}

async function initAurora() {
    // Load OGL first
    const oglModule = await loadOGL();
    if (!oglModule) {
        console.error('OGL library failed to load. Aurora background will not be available.');
        return false;
    }

    const { Renderer, Program, Mesh, Color, Triangle } = oglModule;

    const heroSection = document.querySelector('.hero');
    if (!heroSection) {
        console.error('Hero section not found');
        return false;
    }

    // Check if already initialized
    if (document.getElementById('aurora-container')) {
        console.log('Aurora already initialized');
        return true;
    }

    // Create container
    const container = document.createElement('div');
    container.id = 'aurora-container';
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

    try {
        // Initialize renderer
        renderer = new Renderer({
            alpha: true,
            premultipliedAlpha: true,
            antialias: true
        });
        const gl = renderer.gl;
        
        if (!gl) {
            console.error('WebGL not supported');
            return false;
        }

        gl.clearColor(0, 0, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.canvas.style.backgroundColor = 'transparent';
        gl.canvas.style.width = '100%';
        gl.canvas.style.height = '100%';
        gl.canvas.style.display = 'block';

        // Color stops - matching your example
        const colorStops = ["#3A29FF", "#FF94B4", "#FF3232"];
        const colorStopsArray = colorStops.map(hex => {
            try {
                const c = new Color(hex);
                return [c.r, c.g, c.b];
            } catch (e) {
                return hexToRgb(hex);
            }
        });

        // Create geometry
        const geometry = new Triangle(gl);
        if (geometry.attributes.uv) {
            delete geometry.attributes.uv;
        }

        // Create program
        program = new Program(gl, {
            vertex: VERT,
            fragment: FRAG,
            uniforms: {
                uTime: { value: 0 },
                uAmplitude: { value: 1.0 },
                uColorStops: { value: colorStopsArray },
                uResolution: { value: [container.offsetWidth || window.innerWidth, container.offsetHeight || window.innerHeight] },
                uBlend: { value: 0.5 }
            }
        });

        // Create mesh
        mesh = new Mesh(gl, { geometry, program });
        
        container.appendChild(gl.canvas);

        // Resize handler
        function resize() {
            if (!container || !renderer) return;
            const width = container.offsetWidth || window.innerWidth;
            const height = container.offsetHeight || window.innerHeight;
            renderer.setSize(width, height);
            if (program) {
                program.uniforms.uResolution.value = [width, height];
            }
        }
        window.addEventListener('resize', resize);
        resize();

        // Start animation
        animate();

        console.log('✅ Aurora background initialized successfully!');
        return true;
    } catch (error) {
        console.error('Error initializing Aurora:', error);
        return false;
    }
}

function animate() {
    animationId = requestAnimationFrame(animate);

    if (!program || !mesh || !renderer) return;

    const time = performance.now() * 0.01;
    program.uniforms.uTime.value = time * 0.5 * 0.1;

    try {
        renderer.render({ scene: mesh });
    } catch (error) {
        console.error('Render error:', error);
        cancelAnimationFrame(animationId);
    }
}

// Initialize when DOM is ready
async function startAurora() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            await initAurora();
        });
    } else {
        await new Promise(resolve => setTimeout(resolve, 100));
        await initAurora();
    }
}

window.addEventListener('load', async () => {
    if (!mesh) {
        await new Promise(resolve => setTimeout(resolve, 200));
        await initAurora();
    }
});

// Start initialization
startAurora();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});
