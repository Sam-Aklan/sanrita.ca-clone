const vertexMapShader = /*glsl*/`
uniform sampler2D uHeightMap;
uniform float uStrength;

varying vec2 vUv;
varying float vHeight;
varying vec3 vWorldPos;

float remapHeight(float h){

    // remove dark bias
    h = smoothstep(0.03, 0.45, h);

    // mountain boost
    h = pow(h, 1.6);

    return h;
}

void main(){

    vUv = uv;

    float h = texture2D(uHeightMap, uv).r;
    h = remapHeight(h);

    vHeight = h;

    vec3 pos = position;

    pos.z += h * uStrength;

    vec4 world = modelMatrix * vec4(pos,1.0);

    vWorldPos = world.xyz;

    gl_Position = projectionMatrix * viewMatrix * world;
}
`;
const fragmentMapShader = /*glsl*/`
uniform sampler2D uColorMap;
uniform vec3 uLightDir;
uniform sampler2D uBlobTexture; // Added for Blob Simulation

varying vec2 vUv;
varying float vHeight;

void main(){

    vec3 color = texture2D(uColorMap, vUv).rgb;

    vec3 lightDir = normalize(uLightDir);

    float light = dot(normalize(vec3(0.0,0.0,1.0)), lightDir);
    light = light * 0.7 + 0.7; // increase or decrease lights

    // terrain shading
    color *= mix(0.65, 1.35, vHeight);

    // coastlines brighter
    color *= mix(1.2, 1.0, smoothstep(0.0,0.08,vHeight));

    // ===== NEON BLOB GLOW =====
    vec4 blobData = texture2D(uBlobTexture, vUv);
    float glowPigment = blobData.r;
    float borderPigment = blobData.b;
    
    // Glowing neon color (e.g., bright cyan/blue)
    vec3 neonGlowColor = vec3(0.0, 0.7, 1.0); // Saturated neon cyan/blue
    vec3 neonBorderColor = vec3(0.85, 1.0, 1.0); // Extremely bright, almost white core!
    
    // Add glowing effect (additive blending)
    // The border is composited with higher intensity so it remains crisp and distinguishable
    color += neonGlowColor * glowPigment * 1.8 + neonBorderColor * borderPigment * 4.0; 

    gl_FragColor = vec4(color * light,1.0);
}
`;

export {fragmentMapShader, vertexMapShader}