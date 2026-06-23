import * as THREE from 'three';
import { useFrame, createPortal } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import { fragmentBlobShader, vertexBlobShader } from '../lib/shaders/blobShader';

type BlobSimulationProps = {
  resolution?: number;
  heightMap: THREE.Texture;
  pointerUv: THREE.Vector2;
  isHovered: boolean;
  mapMaterialRef: React.RefObject<THREE.ShaderMaterial | null>;
};

export const BlobSimulation = ({
  resolution = 512,
  heightMap,
  pointerUv,
  isHovered,
  mapMaterialRef,
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

  const mesh = useMemo(
    () => new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material),
    [material]
  );

  useMemo(() => scene.add(mesh), [scene, mesh]);

  // Update heightMap uniform if it changes
  useMemo(() => {
    uniforms.current.uHeightMap.value = heightMap;
  }, [heightMap]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    uniforms.current.uTime.value = time;

    // Update Mouse
    const prevMouse = uniforms.current.uMouse.value.clone();
    uniforms.current.uPrevMouse.value.copy(prevMouse);
    uniforms.current.uMouse.value.copy(pointerUv);

    // Calculate Velocity
    const velocity = new THREE.Vector2().subVectors(pointerUv, prevMouse);
    uniforms.current.uMouseVelocity.value.copy(velocity);

    // Update Pressure based on hover
    uniforms.current.uMousePressure.value = isHovered ? 1.0 : 0.0;

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
