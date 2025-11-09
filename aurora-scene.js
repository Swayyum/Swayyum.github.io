// Copyright © 2025 Sam Analytic Solutions
// All rights reserved.

// Aurora Background Effect - Pure WebGL (no dependencies)
let gl, program, animationId;
let timeUniform, resolutionUniform, colorStopsUniform, amplitudeUniform, blendUniform;

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

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

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  // Color ramp
  vec3 rampColor;
  if (uv.x < 0.5) {
    rampColor = mix(uColorStops[0], uColorStops[1], uv.x * 2.0);
  } else {
    rampColor = mix(uColorStops[1], uColorStops[2], (uv.x - 0.5) * 2.0);
  }
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  gl_FragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
    ] : [0.5, 0.5, 0.5];
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

function initAurora() {
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

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    `;
    container.appendChild(canvas);

    // Get WebGL context
    gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        console.error('WebGL not supported');
        container.remove();
        return false;
    }

    console.log('WebGL context created');

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) {
        console.error('Failed to create shaders');
        return false;
    }

    // Create program
    program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
        console.error('Failed to create program');
        return false;
    }

    // Create quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
    ]), gl.STATIC_DRAW);

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    timeUniform = gl.getUniformLocation(program, 'uTime');
    resolutionUniform = gl.getUniformLocation(program, 'uResolution');
    colorStopsUniform = gl.getUniformLocation(program, 'uColorStops');
    amplitudeUniform = gl.getUniformLocation(program, 'uAmplitude');
    blendUniform = gl.getUniformLocation(program, 'uBlend');

    // Color stops
    const colorStops = ["#3A29FF", "#FF94B4", "#FF3232"];
    const colorStopsArray = [];
    colorStops.forEach(hex => {
        const rgb = hexToRgb(hex);
        colorStopsArray.push(...rgb);
    });

    // Setup WebGL state
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    // Resize handler
    function resize() {
        const width = container.offsetWidth || window.innerWidth;
        const height = container.offsetHeight || window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
    }
    window.addEventListener('resize', resize);
    resize();

    // Render function
    function render() {
        if (!gl || !program) return;

        const width = canvas.width;
        const height = canvas.height;

        gl.useProgram(program);

        // Set uniforms
        gl.uniform1f(timeUniform, performance.now() * 0.001 * 0.5);
        gl.uniform2f(resolutionUniform, width, height);
        gl.uniform3fv(colorStopsUniform, colorStopsArray);
        gl.uniform1f(amplitudeUniform, 1.0);
        gl.uniform1f(blendUniform, 0.5);

        // Set attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Clear and draw
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // Start animation loop
    function animate() {
        animationId = requestAnimationFrame(animate);
        render();
    }
    animate();

    console.log('✅ Aurora background initialized successfully!');
    return true;
}

// Initialize when DOM is ready
function startAurora() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => initAurora(), 100);
        });
    } else {
        setTimeout(() => initAurora(), 100);
    }
}

window.addEventListener('load', () => {
    if (!gl) {
        setTimeout(() => initAurora(), 200);
    }
});

// Start initialization
startAurora();

// Cleanup
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});
