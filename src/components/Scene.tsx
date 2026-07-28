import * as THREE from 'three';

import { useCallback, useEffect,useMemo,useRef, useState, type RefObject } from 'react';
import {Environment, OrbitControls, PerspectiveCamera, useTexture} from "@react-three/drei";
import { useThree, useFrame, type ThreeEvent } from '@react-three/fiber';
import { fragmentMapShader, vertexMapShader } from '../lib/shaders/heightMapShader';
import type { PerspectiveCamera as CameraType } from 'three'
import { Pin } from './Pin';
import { BlobSimulation } from './BlobSimulation';
import CloudsSimulation from './CloudsSimulation';

type PinData = {
  id: number
  title: string
  u: number
  v: number
  z?: number
  radius?: number
  color?: string
  image?:string
}
const pins: PinData[] = [
  { id: 1, title: 'port', u: 0.588, v: 0.46, z: .25, radius: 0.1, color: 'blue' },
  { id: 2, title: 'harbour', u: 0.14, v: 0.39, z: 0.10, radius: 0.1, color: 'cyan', image:"./pics/fisher.jpg" },
  { id: 3, title: 'city', u: 0.7, v: 0.73, z: 0.35, radius: 0.1, color: 'pink', image:"./pics/hut.jpg" },
  { id: 4, title: 'mountain', u: 0.54, v: 0.245, z: 0.05, radius: 0.1, color: 'red', image:"./pics/viliage.jpg" },
  { id: 5, title: 'diving', u: 0.31, v: 0.16, z: -0.002, radius: 0.1, color: 'green', },
]

interface SceneProps{
  mapPlaneRef:RefObject<THREE.PlaneGeometry | null>
  scrollProgress: RefObject<{ value: number }>
}

const Scene = ({mapPlaneRef, scrollProgress}:SceneProps) => {
  const cameraRef = useRef<CameraType>(null)
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
    uStrength: {value:3.},
  uLightDir: { value: new THREE.Vector3(1,1,1).normalize() }
   }).current;

    const {size,}= useThree()
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

    useEffect(() => {
      const handleGlobalPointerUp = () => {
        dragging.current = false;
        setIsDragging(false);
      };
      window.addEventListener('pointerup', handleGlobalPointerUp);
      return () => {
        window.removeEventListener('pointerup', handleGlobalPointerUp);
      };
    }, []);

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
 const isDesktop = size.width >= 800;
    const sidebarWidth = isDesktop ? 350 : 0;
    const mapWrapperWidth = size.width - sidebarWidth;
     // target dimensions of the plane in pixels:
    // - width fits vertical gridlines (w - 55 * 2) minus 40px padding = mapWrapperWidth - 150
    // - height fits horizontal gridlines (h - 40) minus 40px padding = size.height - 80
    const targetWidthPx = size.height - 120;
    const targetHeightPx = mapWrapperWidth - 170;
        return [sidebarWidth,targetWidthPx,targetHeightPx]
    },[size.width])
   
   

    // convert to Three.js units:
    const planeWidthUnits = useMemo(() => {
      if (targetWidthPx <= 0 || pixelToUnit <= 0) return 1;
      return targetWidthPx * pixelToUnit;
    }, [targetWidthPx, pixelToUnit]);

    const planeHeightUnits = useMemo(() => {
      if (targetHeightPx <= 0 || pixelToUnit <= 0) return 1;
      return targetHeightPx * pixelToUnit;
    }, [targetHeightPx, pixelToUnit]);

    // Center of MapWrapper is offset to the right by sidebarWidth / 2.
    // Center of gridlines aligns with center of MapWrapper.
    // Translate this offset to Three.js units.
    const initialX = useMemo(() => {
      return (sidebarWidth / 2) * pixelToUnit;
    }, [sidebarWidth, pixelToUnit]);

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

const onPointerDownHandler = useCallback((e:ThreeEvent<PointerEvent>)=>{
 dragging.current = true;
 setIsDragging(true);
 last.current = [e.clientX, e.clientY]
},[scrollProgress])
const onPointerUpHandler = useCallback((_e:ThreeEvent<PointerEvent>)=>{
 dragging.current = false;
 setIsDragging(false);
},[])
const onPointerMoveHandler = useCallback((e:ThreeEvent<PointerEvent>)=>{

  if (e.uv) {
    setPointerUv(e.uv.clone());
  }

  const p = scrollProgress.current ? scrollProgress.current.value : 0;
  if (p < 1) return;

  if(!mapRef.current || !dragging.current)return

  const dx = e.clientX - last.current[0]
  const dy = e.clientY - last.current[1]

  last.current = [e.clientX, e.clientY]
if(isDragging){

  mapRef.current.position.x += dx * 0.01
  mapRef.current.position.y -= dy * 0.01
}
mapRef.current.position.x += dx * 0.003
  mapRef.current.position.y -= dy * 0.003

  mapRef.current.position.x = THREE.MathUtils.clamp(mapRef.current.position.x, -10.0, 10)
  mapRef.current.position.y = THREE.MathUtils.clamp(mapRef.current.position.y, -5.0, 5.0)

},[isDragging, scrollProgress])

  useFrame(() => {
    const p = scrollProgress.current ? scrollProgress.current.value : 0;
    
    const isRotated = mapRef.current ? Math.abs(mapRef.current.rotation.z - Math.PI/2) < 0.1 : false;
    const targetScaleX = isRotated ? (viewport.height / planeHeightUnits) : (viewport.width / planeHeightUnits);
    const targetScaleY = isRotated ? (viewport.width / planeWidthUnits) : (viewport.height / planeWidthUnits);

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
  });

  return (
    <>
    <Environment files={"./city-lightings.hdr"}/>
      {/* <OrbitControls
      // enabled={false}
      // enableZoom
     onChange={()=>{

       if(cameraRef.current) console.log("camera postion", cameraRef.current.position.z)
     }}
      />  */}
     <PerspectiveCamera
        makeDefault
        near={0.1}
        far={10000}
        position={[0,0.,10]}
        aspect={size.width / size.height}
        fov={75}
        ref={cameraRef}
      />
      {heightMap && (
        <BlobSimulation 
          heightMap={heightMap} 
          pointerUv={pointerUv} 
          isHovered={isHovered}
          isOverPin={isOverPin || isDragging}
          mapMaterialRef={materialRef} 
          mapRef={mapRef}
          dimensions={dimensions}
          resolutionRef={resolutionRef}
        />
      )}
    <group position={[initialX,0.,-0.3]} ref={mapRef} 
    // rotation={[0,0,Math.PI/2]} 
    >
      <group ref={mapScaleGroupRef} name="mapScaleGroup">
        <mesh 
          renderOrder={100} 
          onPointerDown={onPointerDownHandler}
          onPointerUp={onPointerUpHandler}
          onPointerMove={onPointerMoveHandler}   
          onPointerOver={() => setIsHovered(true)}
          onPointerOut={() => setIsHovered(false)}
        >
          <planeGeometry args={[planeHeightUnits, planeWidthUnits,100 , 100]} ref={mapPlaneRef} />
          <shaderMaterial
            ref={materialRef}
            vertexShader={vertexMapShader}
            fragmentShader={fragmentMapShader}
            uniforms={sharedUniforms}
            needsUpdate={true}
          />
        </mesh>
        <CloudsSimulation
          width={planeHeightUnits}
          height={planeWidthUnits}
          resolutionRef={resolutionRef}
          scrollProgressRef={scrollProgress}
        />
      </group>

      <group ref={pinsGroupRef}>
        {pins.map((pin) => (
          <Pin
            key={pin.id}
            title={pin.title}
            image={pin.image}
            radius={pin.radius ?? 0.03}
            color={pin.color ?? 'white'}
            position={toPlanePos(
              pin.u,
              pin.v,
              pin.z ?? 0.05
            ) as [number,number,number]}
            onHoverChange={(hovered) => handlePinHover(pin.id, hovered)}
          />
        ))}
      </group>
    </group>
    
    </>
  )
}

export default Scene