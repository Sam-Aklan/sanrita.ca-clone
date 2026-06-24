const vertexBlobShader = /*glsl*/`
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}


`

const fragmentBlobShader = /*glsl*/`
precision mediump float;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uPrevMouse;
uniform vec2 uMouseVelocity;
uniform float uMousePressure;
uniform float uIdle;

uniform sampler2D uPrevTrail;
uniform sampler2D uTrail;
uniform float uTime;
uniform float uBlobSize;

uniform sampler2D uHeightMap;

varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// ===== METABALL FUNCTION (from blob shader) =====
float metaball(vec2 p, float r)
{
    return r / dot(p, p);
}

float blobShape(vec2 uv)
{
   
  const int STEPS = 5;

float shape = 0.0;

for(int i = 0; i < STEPS; i++)
{
    float t = float(i) / float(STEPS - 1);

    vec2 interpMouse = mix(uPrevMouse, uMouse, t);

    vec2 mouse = interpMouse; // UV space is 0 to 1, no need to remap to -1,1
    // mouse.x *= uResolution.x / uResolution.y;

    vec2 localUV = uv - mouse;

    // Height map integration (Option C - Noise/Distortion)
    float h = texture2D(uHeightMap, uv).r;
    h = smoothstep(0.03, 0.45, h); // Adjust height reading
    h = pow(h, 1.6);
    
    // Distort localUV wildly based on height and time
    float noise1 = snoise(uv * 15.0 + uTime * 2.0);
    float noise2 = snoise(uv * 15.0 - uTime * 2.0 + 100.0);
    vec2 distortion = vec2(noise1, noise2) * h * 0.01; // More distortion on higher terrain
    localUV += distortion;

    vec2 vel = uMouseVelocity;
    float speed = length(vel);
    vec2 dir = normalize(vel + 1e-5);

    vec2 offset1 = dir * speed * 2.5;
    vec2 offset2 = vec2(-dir.y, dir.x) * speed * 1.8;
    vec2 offset3 = -dir * speed * 2.0;
    vec2 offset4 = vec2(dir.y, -dir.x) * speed * 1.5;

    float baseMass = mix(0.6, 2.2, uMousePressure);
    // ADJUST BLOB SIZE HERE: Change the multiplier (e.g., 0.7) to scale the overall blob size
    float mass = baseMass * uBlobSize * 0.1;

    float r = 0.0;

    r += metaball(localUV, 0.9 * mass);
    r += metaball(localUV - offset1, 0.45 * mass);
    r += metaball(localUV - offset2, 0.35 * mass);
    r += metaball(localUV - offset3, 0.4 * mass);
    r += metaball(localUV - offset4, 0.3 * mass);

    float turbulence = sin(dot(localUV, dir * 6.0) + speed * 8.0) * 0.08;
    r += turbulence;

    float threshold = mix(1.25, 0.7, clamp(speed * 2.0, 0.0, 1.0));

    // Create neon border
    float outer = smoothstep(threshold, threshold + 0.15, r);
    float inner = smoothstep(threshold + 0.15, threshold + 0.3, r);
    float border = outer - inner;

    // Create grid lines inside the transparent core (using continuous symmetric distance to avoid aliasing)
    vec2 gridVal = abs(fract((uv + distortion) * 30.0) - 0.5);
    float thickness = 0.04;
    float edgeX = smoothstep(0.5 - thickness, 0.5, gridVal.x);
    float edgeY = smoothstep(0.5 - thickness, 0.5, gridVal.y);
    float gridLine = max(edgeX, edgeY);

    float blob = max(border, gridLine * inner * 0.8);

    shape = max(shape, blob);
}

return shape;
}

void main()
{
    vec2 frag = gl_FragCoord.xy;

    vec4 prev = texture2D(uPrevTrail, vUv);
    float pigment = prev.r;
    float wetness = prev.g;

    // ===== GLOW DECAY (Neon effect) =====
    float dryingRate = 0.015; // Faster decay for glowing trail
    wetness = max(prev.g - dryingRate, 0.0);
    pigment *= 0.92; // Fade out pigment

    // ===== MOTION =====
    vec2 mousePx = uMouse * uResolution;
vec2 prevMousePx = uPrevMouse * uResolution;

vec2 motion = mousePx - prevMousePx;

    float speed = length(motion);

    // ===== IDLE DISSOLVE (from blob shader) =====

    float dissolveSpeed = length(uMouseVelocity);
    float motionFade = smoothstep(0.002, 0.0002, dissolveSpeed);
float activeFactor = 1.0 - motionFade;

    // Only paint when blob exists (CRITICAL)
    if (uMousePressure > 0.01 || activeFactor > 0.05)
    {
        // Sample metaball shape at this fragment
        float shape = blobShape(vUv);
        
        // Velocity thinning (faster = thinner paint)
        float speedNorm = clamp(speed / 120.0, 0.0, 1.0);
        float velocityThin = mix(1.0, 0.55, speedNorm);

        // Pressure widening & wetness boost
        float pressureGain = mix(0.7, 1.8, .1);

        shape *= velocityThin * pressureGain;

        shape *= velocityThin * pressureGain;

        // Neon Energy bloom
        float bloom = smoothstep(0.1, 0.8, shape);
        bloom *= wetness * 0.4;

        float stroke = max(shape, bloom);

        // Deposit pigment (PERMANENT MEMORY)
        pigment = max(pigment, stroke);

        // Deposit wetness (fluid behavior)
        float wetDeposit = stroke * (1.5 + uMousePressure * 1.5);
        wetness = max(wetness, wetDeposit);
    }

    // ===== CAPILLARY SPREAD (unchanged watercolor physics) =====
    if (wetness > 0.2)
    {
        vec2 px = 1.0 / uResolution;

        float spread =
            texture2D(uPrevTrail, vUv + vec2(px.x,0)).r +
            texture2D(uPrevTrail, vUv - vec2(px.x,0)).r +
            texture2D(uPrevTrail, vUv + vec2(0,px.y)).r +
            texture2D(uPrevTrail, vUv - vec2(0,px.y)).r;

        spread *= 0.25;
        pigment = mix(pigment, spread, wetness * 0.04);
    }

    pigment = pow(pigment, 1.05);

    gl_FragColor = vec4(pigment, wetness, 0.0, 1.0);
   
}

`
export {vertexBlobShader,fragmentBlobShader}