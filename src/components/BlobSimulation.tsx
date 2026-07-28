import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect } from 'react';
import { fragmentBlobShader, vertexBlobShader } from '../lib/shaders/blobShader';

type BlobSimulationProps = {
  resolution?: number;
  resolutionRef: React.RefObject<THREE.Vector2>;
  heightMap: THREE.Texture;
  pointerUv: THREE.Vector2;
  isHovered: boolean;
  isOverPin: boolean;
  mapMaterialRef: React.RefObject<THREE.ShaderMaterial | null>;
  mapRef: React.RefObject<THREE.Group | null>;
  dimensions: { width?: number; height?: number };
};

export const BlobSimulation = ({
  resolution = 1024,
  resolutionRef,
  heightMap,
  pointerUv,
  isHovered,
  isOverPin,
  mapMaterialRef,
  mapRef,
  dimensions,
}: BlobSimulationProps) => {
  const fbo1 = useFBO(resolution, resolution, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    type: THREE.HalfFloatType,
  });

  const fbo2 = useFBO(resolution, resolution, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    type: THREE.HalfFloatType,
  });

  const [activeFBO, setActiveFBO] = useState(fbo1);

  const scene = useMemo(() => new THREE.Scene(), []);
  const camera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1), []);

  const uniforms = useRef({
    uResolution: { value: new THREE.Vector2(resolution, resolution) },
    uMouse: { value: new THREE.Vector2(-1, -1) },
    uPrevMouse: { value: new THREE.Vector2(-1, -1) },
    uMouseVelocity: { value: new THREE.Vector2(0, 0) },
    uMousePressure: { value: 0.0 }, // Updated dynamically
    uIdle: { value: 0.0 },
    uTime: { value: 0.0 },
    uBlobSize: { value: 0.03 },
    uPrevTrail: { value: fbo1.texture },
    uHeightMap: { value: heightMap },
    uAspect: { value: 1.0 },
    uPinHover: { value: 0.0 },
  });

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexBlobShader,
        fragmentShader: fragmentBlobShader,
        uniforms: uniforms.current,
        depthWrite: false,
        depthTest: false,
      }),
    []
  );

  const mesh = useMemo(() => {
    return new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  }, [material]);

  useEffect(() => {
    scene.add(mesh);
    return () => {
      scene.remove(mesh);
      mesh.geometry.dispose();
    };
  }, [scene, mesh]);

  useEffect(() => {
    const w = dimensions.width ?? 2;
    const h = dimensions.height ?? 2;
    mesh.scale.set(w, h, 1);
  }, [mesh, dimensions.width, dimensions.height]);

  useEffect(() => {
    const w = dimensions.width ?? 2;
    const h = dimensions.height ?? 2;
    const halfW = w / 2;
    const halfH = h / 2;
    camera.left = -halfW;
    camera.right = halfW;
    camera.top = halfH;
    camera.bottom = -halfH;
    camera.updateProjectionMatrix();
  }, [camera, dimensions.width, dimensions.height]);

  // Update heightMap uniform if it changes
  useMemo(() => {
    uniforms.current.uHeightMap.value = heightMap;
  }, [heightMap]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    uniforms.current.uTime.value = time;
    if (resolutionRef.current) {
      uniforms.current.uResolution.value.copy(resolutionRef.current);
      uniforms.current.uAspect.value = resolutionRef.current.x / resolutionRef.current.y;
    }

    // Smoothly interpolate the pin hover state (0.0 to 1.0)
    const targetPinHover = isOverPin ? 1.0 : 0.0;
    uniforms.current.uPinHover.value = THREE.MathUtils.lerp(
      uniforms.current.uPinHover.value,
      targetPinHover,
      0.15
    );

    // 1. Project the mouse coordinate onto the infinite map plane
    let targetMouse = pointerUv;
    let hasProjected = false;

    if (mapRef.current && dimensions.width && dimensions.height && state.raycaster && state.raycaster.ray) {
      // Get world Z of the map plane
      const worldPos = new THREE.Vector3();
      mapRef.current.getWorldPosition(worldPos);
      const worldZ = worldPos.z;

      // Define the infinite plane parallel to XY at world Z
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -worldZ);
      const intersectPoint = new THREE.Vector3();
      
      if (state.raycaster.ray.intersectPlane(plane, intersectPoint)) {
        // Convert world intersection to map's local space
        const localPoint = intersectPoint.clone();
        mapRef.current.worldToLocal(localPoint);

        const scaleGroup = mapRef.current.getObjectByName('mapScaleGroup');
        const scaleX = scaleGroup ? scaleGroup.scale.x : 1;
        const scaleY = scaleGroup ? scaleGroup.scale.y : 1;

        // Convert local coordinates to UV space [0, 1]
        const u = (localPoint.x / (dimensions.width * scaleX)) + 0.5;
        const v = (localPoint.y / (dimensions.height * scaleY)) + 0.5;
        targetMouse = new THREE.Vector2(u, v);
        hasProjected = true;
      }
    }

    // Update Mouse
    const prevMouse = uniforms.current.uMouse.value.clone();
    uniforms.current.uPrevMouse.value.copy(prevMouse);
    
    const currentMouse = uniforms.current.uMouse.value;

    // Smoothly interpolate the mouse position to avoid frame-rate mismatch jitter
    if (currentMouse.x < 0.0 || targetMouse.x < 0.0) {
      currentMouse.copy(targetMouse);
    } else {
      currentMouse.lerp(targetMouse, 0.18); // Smoothly slide towards target coordinates
    }

    // Calculate Velocity based on the smoothed coordinates
    const velocity = new THREE.Vector2().subVectors(currentMouse, prevMouse);
    
    // Clamp the velocity to prevent excessive distortion when moving very fast
    const maxVelocity = 0.01; // Maximum displacement in UV space per frame
    if (velocity.length() > maxVelocity) {
      velocity.setLength(maxVelocity);
    }
    
    uniforms.current.uMouseVelocity.value.copy(velocity);

    // Calculate uMousePressure based on distance of targetMouse to the map boundaries [0, 1]
    let pressure = 0.0;
    if (hasProjected) {
      const distToBox = Math.max(
        0,
        -targetMouse.x,
        targetMouse.x - 1.0,
        -targetMouse.y,
        targetMouse.y - 1.0
      );
      // Smoothly fade pressure from 1.0 down to 0.0 over a margin of 0.15 UV units outside the map
      pressure = THREE.MathUtils.clamp(1.0 - distToBox / 0.15, 0.0, 1.0);
    } else {
      pressure = isHovered ? 1.0 : 0.0;
    }

    // Update pressure uniform
    uniforms.current.uMousePressure.value = pressure;

    // Swap FBOs
    const readFBO = activeFBO === fbo1 ? fbo2 : fbo1;
    const writeFBO = activeFBO === fbo1 ? fbo1 : fbo2;

    uniforms.current.uPrevTrail.value = readFBO.texture;

    state.gl.setRenderTarget(writeFBO);
    state.gl.render(scene, camera);
    state.gl.setRenderTarget(null);

    if (mapMaterialRef.current && mapMaterialRef.current.uniforms.uBlobTexture) {
      mapMaterialRef.current.uniforms.uBlobTexture.value = writeFBO.texture;
    }
    setActiveFBO(writeFBO);
  });

  return null; // Logic-only component
};
