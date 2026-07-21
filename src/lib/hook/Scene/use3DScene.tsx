import * as THREE from 'three';

import { useCallback, useEffect,useMemo,useRef, useState, type RefObject } from 'react';
import { useTexture} from "@react-three/drei";
import { useThree, useFrame, type ThreeEvent } from '@react-three/fiber';
import type { PerspectiveCamera as CameraType } from 'three'
import useWindowSize from '../useWindowSize';
import { pins } from '../../data/sceneData';


const use3DScene = ({scrollProgress}:{scrollProgress: RefObject<{ value: number }>}) => {
  const {isDesktop}= useWindowSize()
  const cameraRef = useRef<CameraType>(null)
  const cameraPosition = useMemo(()=>isDesktop?[0,0,10]:[0,0,7],[isDesktop])
  const mapRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  // hold and drag refs
  const dragging = useRef(false)
  const last = useRef([0,0])
  const pinsGroupRef = useRef<THREE.Group>(null)
  const mapScaleGroupRef = useRef<THREE.Group>(null)
  const resolutionRef = useRef<THREE.Vector2>(new THREE.Vector2(1024, 1024))
// textures
    const [mountain, heightMap]= useTexture(['./mountain-sea/optimize-image.jpg','./mountain-sea/Mountain By Sea Heightmap.png']);
// uniforms
   const sharedUniforms = useRef({
    uHeightMap: { value: heightMap },
  uColorMap: { value: mountain },
  uBlobTexture: { value: null }, // Added for blob simulation

  uTexelSize: { value: new THREE.Vector2() },
  uHeightScale: { value: 4.},
    uStrength: {value:.8},
  uLightDir: { value: new THREE.Vector3(1,1,1).normalize() }
   }).current;

    const {size}= useThree()
    const [pointerUv, setPointerUv] = useState(new THREE.Vector2(-1, -1));
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredPins, setHoveredPins] = useState<Set<number>>(new Set());

    const handlePinHover = useCallback((id: number, hovered: boolean) => {
      setHoveredPins((prev) => {
        const next = new Set(prev);
        if (hovered) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
    }, []);

    const isOverPin = hoveredPins.size > 0;
    const [isDragging, setIsDragging] = useState(false);



    useEffect(()=>{

      if(!heightMap || !mountain) return
      const image = heightMap.image as HTMLImageElement
      sharedUniforms.uTexelSize.value.set(1/image.width, 1/image.height)
      // console.log("height", image.height, "width", image.width)
      heightMap.wrapS = THREE.ClampToEdgeWrapping;
      heightMap.wrapT = THREE.ClampToEdgeWrapping;

      mountain.wrapS = THREE.ClampToEdgeWrapping;
      mountain.wrapT = THREE.ClampToEdgeWrapping;
      sharedUniforms.uHeightMap.value = heightMap
      sharedUniforms.uColorMap.value = mountain
      

    },[heightMap,mountain])
    // viewport size in Three.js coordinates
    const viewport = useMemo(() => {
      if (!cameraRef.current) return { width: 0, height: 0 };
      const camera = cameraRef.current;
      const distance = Math.abs(camera.position.z - 0.0);
      const fov = THREE.MathUtils.degToRad(camera.fov);
      const height = 2 * Math.tan(fov / 2) * distance;
      const width = height * camera.aspect;
      return { width, height };
    }, [size, cameraRef.current]);

    const pixelToUnit = useMemo(() => {
      if (!viewport.height) return 0;
      return viewport.height / size.height;
    }, [viewport, size]);

   const [sidebarWidth,targetWidthPx,targetHeightPx] = useMemo(()=>{
    const sidebarWidth = isDesktop ? 350 : 0;
    const mapWrapperWidth = size.width - sidebarWidth;
     // target dimensions of the plane in pixels:
    // - width fits vertical gridlines (w - 55 * 2) minus 40px padding = mapWrapperWidth - 150
    // - height fits horizontal gridlines (h - 40) minus 40px padding = size.height - 80
    const targetWidthPx = isDesktop?size.height - 120:size.height;
    const targetHeightPx = isDesktop?mapWrapperWidth - 170: mapWrapperWidth;
        return [sidebarWidth,targetWidthPx,targetHeightPx]
    },[size.width, isDesktop])
   
   

    // convert to Three.js units:
    const planeWidthUnits = useMemo(() => {
      if (targetWidthPx <= 0 || pixelToUnit <= 0) return 1;
      return isDesktop?targetWidthPx *pixelToUnit:targetWidthPx * pixelToUnit * 3.;
    }, [targetWidthPx, pixelToUnit, isDesktop]);

    const planeHeightUnits = useMemo(() => {
      if (targetHeightPx <= 0 || pixelToUnit <= 0) return 1;
      return isDesktop?targetHeightPx * pixelToUnit:targetHeightPx * pixelToUnit * 3.;
    }, [targetHeightPx, pixelToUnit, isDesktop]);

    // Center of MapWrapper is offset to the right by sidebarWidth / 2.
    // Center of gridlines aligns with center of MapWrapper.
    // Translate this offset to Three.js units.
    const initialX = useMemo(() => {
      return isDesktop?(sidebarWidth / 2) * pixelToUnit:0;
    }, [sidebarWidth, pixelToUnit,isDesktop]);

    // Pass dimensions of local plane geometry to BlobSimulation and toPlanePos.
    // Since the plane is rotated by Math.PI/2 around Z:
    // - Local X size of the mesh is planeHeightUnits (maps to screen height)
    // - Local Y size of the mesh is planeWidthUnits (maps to screen width)
    const dimensions = useMemo(() => {
      return {
        width: planeHeightUnits,
        height: planeWidthUnits,
      };
    }, [planeHeightUnits, planeWidthUnits]);

   const toPlanePos = useCallback(( u:number,
  v:number,
  z:number=0.05
  )=>{
      
   const x = (u - 0.5) * planeHeightUnits;
   const y = (v - 0.5) * planeWidthUnits;

  return [x, y,z]

    },[planeHeightUnits, planeWidthUnits])

    useEffect(() => {
      const getPointerCoords = (e: PointerEvent | TouchEvent): [number, number] | null => {
        if ('touches' in e && e.touches && e.touches.length > 0) {
          return [e.touches[0].clientX, e.touches[0].clientY];
        }
        if ('clientX' in e && typeof (e as PointerEvent).clientX === 'number') {
          return [(e as PointerEvent).clientX, (e as PointerEvent).clientY];
        }
        return null;
      };

      const handleGlobalPointerMove = (e: PointerEvent | TouchEvent) => {
        if (!dragging.current || !mapRef.current) return;

        const p = scrollProgress.current ? scrollProgress.current.value : 0;
        if (p < 1) return;

        const coords = getPointerCoords(e);
        if (!coords) return;
        const [clientX, clientY] = coords;

        const dx = clientX - last.current[0];
        const dy = clientY - last.current[1];
        last.current = [clientX, clientY];

        const moveScale = pixelToUnit > 0 ? pixelToUnit : 0.008;

        mapRef.current.position.x += dx * moveScale;
        mapRef.current.position.y -= dy * moveScale;

        mapRef.current.position.x = THREE.MathUtils.clamp(mapRef.current.position.x, -10.0, 10.0);
        mapRef.current.position.y = THREE.MathUtils.clamp(mapRef.current.position.y, -5.0, 5.0);
      };

      const handleGlobalPointerEnd = () => {
        dragging.current = false;
        setIsDragging(false);
      };

      window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });
      window.addEventListener('pointerup', handleGlobalPointerEnd);
      window.addEventListener('pointercancel', handleGlobalPointerEnd);
      window.addEventListener('touchmove', handleGlobalPointerMove, { passive: true });
      window.addEventListener('touchend', handleGlobalPointerEnd);
      window.addEventListener('touchcancel', handleGlobalPointerEnd);

      return () => {
        window.removeEventListener('pointermove', handleGlobalPointerMove);
        window.removeEventListener('pointerup', handleGlobalPointerEnd);
        window.removeEventListener('pointercancel', handleGlobalPointerEnd);
        window.removeEventListener('touchmove', handleGlobalPointerMove);
        window.removeEventListener('touchend', handleGlobalPointerEnd);
        window.removeEventListener('touchcancel', handleGlobalPointerEnd);
      };
    }, [pixelToUnit, scrollProgress]);

    const onPointerDownHandler = useCallback((e: ThreeEvent<PointerEvent>) => {
      const p = scrollProgress.current ? scrollProgress.current.value : 0;
      // if (p < 1) return;

      dragging.current = true;
      setIsDragging(true);

      const nativeEv = (e.nativeEvent || e) as unknown as PointerEvent | TouchEvent;
      if ('touches' in nativeEv && nativeEv.touches && nativeEv.touches.length > 0) {
        last.current = [nativeEv.touches[0].clientX, nativeEv.touches[0].clientY];
      } else if ('clientX' in nativeEv && typeof (nativeEv as PointerEvent).clientX === 'number') {
        last.current = [(nativeEv as PointerEvent).clientX, (nativeEv as PointerEvent).clientY];
      } else {
        last.current = [e.clientX, e.clientY];
      }

      if (e.target && 'setPointerCapture' in (e.target as unknown as HTMLElement)) {
        try {
          (e.target as unknown as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
          // pointer capture unsupported or unnecessary on proxy
        }
      }
    }, [scrollProgress]);

    const onPointerUpHandler = useCallback((e: ThreeEvent<PointerEvent>) => {
      dragging.current = false;
      setIsDragging(false);
      if (e.target && 'releasePointerCapture' in (e.target as unknown as HTMLElement)) {
        try {
          (e.target as unknown as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    }, []);

    const onPointerMoveHandler = useCallback((e: ThreeEvent<PointerEvent>) => {
      if (e.uv) {
        setPointerUv(e.uv.clone());
      }
    }, []);

  useFrame(() => {
    const p = scrollProgress.current ? scrollProgress.current.value : 0;
    
    const isRotated = mapRef.current ? Math.abs(mapRef.current.rotation.z - Math.PI/2) < 0.1 : false;
    const targetScaleX = isRotated ? (viewport.height / planeHeightUnits) : (viewport.width / planeHeightUnits);
    const targetScaleY = isRotated ? (viewport.width / planeWidthUnits) : (viewport.height / planeWidthUnits);
    
    if(isDesktop){
      const currentScaleX = THREE.MathUtils.lerp(1, targetScaleX, p);
    const currentScaleY = THREE.MathUtils.lerp(1, targetScaleY, p);

    if (mapScaleGroupRef.current) {
      mapScaleGroupRef.current.scale.set(currentScaleX, currentScaleY, 1);
    }

    if (mapRef.current) {
      if (p < 1) {
        mapRef.current.position.x = THREE.MathUtils.lerp(initialX, 0, p);
        mapRef.current.position.y = 0;
      }
    }

    const currentWidthPx = targetHeightPx * currentScaleX;
    const currentHeightPx = targetWidthPx * currentScaleY;
    resolutionRef.current.set(currentWidthPx, currentHeightPx);

    if (pinsGroupRef.current) {
      pinsGroupRef.current.children.forEach((pinGroup, index) => {
        const pinData = pins[index];
        if (pinGroup instanceof THREE.Group && pinData) {
          pinGroup.position.x = (pinData.u - 0.5) * planeHeightUnits * currentScaleX;
          pinGroup.position.y = (pinData.v - 0.5) * planeWidthUnits * currentScaleY;
        }
      });
    }

     const pMapper = THREE.MathUtils.clamp(THREE.MathUtils.mapLinear(p, .9, 1., 0, 1.), 0, 1)
    if (cameraRef.current) {
      cameraRef.current.position.z = THREE.MathUtils.lerp(10, 7, pMapper)
    }

    } else {
      if (mapScaleGroupRef.current) {
        mapScaleGroupRef.current.scale.set(1, 1, 1);
      }

      if (mapRef.current) {
      if (p < 1) {
        mapRef.current.position.x = THREE.MathUtils.lerp(initialX, 0, p);
        mapRef.current.position.y = 0;
      }
    }

    const currentWidthPx = targetHeightPx * targetScaleX;
    const currentHeightPx = targetWidthPx * targetScaleY;
    resolutionRef.current.set(targetHeightPx, targetWidthPx);

    // if (pinsGroupRef.current) {
    //   pinsGroupRef.current.children.forEach((pinGroup, index) => {
    //     const pinData = pins[index];
    //     if (pinGroup instanceof THREE.Group && pinData) {
    //       // pinGroup.position.x = (pinData.u - 0.5) * planeHeightUnits * targetScaleX;
    //       // pinGroup.position.y = (pinData.v - 0.5) * planeWidthUnits * targetScaleY;
    //       pinGroup.position.x = (pinData.u - 0.5) * planeHeightUnits ;
    //       pinGroup.position.y = (pinData.v - 0.5) * planeWidthUnits;
    //     }
    //   });
    // }

    //  const pMapper = THREE.MathUtils.clamp(THREE.MathUtils.mapLinear(p, .9, 1., 0, 1.), 0, 1)
    // if (cameraRef.current) {
    //   cameraRef.current.position.z = 5
    // }

    }

   
   
  });
   
 return{
    materialRef,
    pointerUv,
    isDragging,
    isHovered,
    initialX,
    onPointerDownHandler,
    onPointerMoveHandler,
    onPointerUpHandler,
    pins,
    size,
    cameraRef,
    heightMap,
    mapRef,
    resolutionRef,
    mapScaleGroupRef,
    planeHeightUnits,
    planeWidthUnits,
    sharedUniforms,
    pinsGroupRef,
    toPlanePos,
    handlePinHover,
    dimensions,
    isOverPin,
    setIsHovered,
    cameraPosition,
    isDesktop

}
}

export default use3DScene