import * as THREE from 'three';

import { useCallback, useEffect,useMemo,useRef, useState } from 'react';
import {Environment, PerspectiveCamera, useTexture} from "@react-three/drei";
import { useThree, type ThreeEvent } from '@react-three/fiber';
import { fragmentMapShader, vertexMapShader } from '../lib/shaders/heightMapShader';
import type { PerspectiveCamera as CameraType } from 'three'
import { Pin } from './Pin';
import { BlobSimulation } from './BlobSimulation';

type PinData = {
  id: number
  title: string
  u: number
  v: number
  z?: number
  radius?: number
  color?: string
}
const pins: PinData[] = [
  { id: 1, title: 'port', u: 0.46, v: 0.40, z: 0.05, radius: 0.03, color: 'blue' },
  { id: 2, title: 'harbour', u: 0.12, v: 0.55, z: 0.10, radius: 0.03, color: 'cyan' },
  { id: 3, title: 'city', u: 0.483, v: 0.78, z: 0.10, radius: 0.03, color: 'pink' },
  { id: 4, title: 'mountain', u: 0.829, v: 0.915, z: 0.38, radius: 0.03, color: 'red' },
]

const Scene = () => {
  const cameraRef = useRef<CameraType>(null)
  const mapRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  // hold and drag refs
  const dragging = useRef(false)
const last = useRef([0,0])
// textures
    const [mountain, heightMap]= useTexture(['./Mountain-annonated.png','./height-map-optimaized.jpg']);
// uniforms
   const sharedUniforms = useRef({
    uHeightMap: { value: heightMap },
  uColorMap: { value: mountain },
  uBlobTexture: { value: null }, // Added for blob simulation

  uTexelSize: { value: new THREE.Vector2() },
  uHeightScale: { value: 20},
    uStrength: {value:.5},
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

    },[heightMap,mountain])
// calculate width and height so the panel fits the entire screen
    const dimensions = useMemo(()=>{
      if(!cameraRef.current) return  {}
      const camera = cameraRef.current
      const distance = Math.abs(camera.position.z - 0.) // plane z position

    const fov = THREE.MathUtils.degToRad(camera.fov)

    const height = 2 * Math.tan(fov / 2) * distance
    const width = height * camera.aspect


    return { width, height }
    },[size,cameraRef.current])

  //  const roundUp = useCallback((num:number)=> Math.ceil(num * 1000)/1000,[])

   const toPlanePos = useCallback(( u:number,
  v:number,
  z:number=0.05
  )=>{
      
  // const x = roundUp((u / dimensions.width) + 0.5);
  // const y = roundUp((v / dimensions.height) + .5);
   const x = (u - 0.5) * (dimensions.width ?? 0);
   const y = (v - 0.5) * (dimensions.height ?? 0);

  return [x, y,z]

    },[dimensions])

const onPointerDownHandler = useCallback((e:ThreeEvent<PointerEvent>)=>{
 dragging.current = true;
 setIsDragging(true);
 last.current = [e.clientX, e.clientY]
},[])
const onPointerUpHandler = useCallback((_e:ThreeEvent<PointerEvent>)=>{
 dragging.current = false;
 setIsDragging(false);
},[])
const onPointerMoveHandler = useCallback((e:ThreeEvent<PointerEvent>)=>{

  if (e.uv) {
    setPointerUv(e.uv.clone());
  }

  if(!mapRef.current || ! dragging.current)return

  const dx = e.clientX - last.current[0]
  const dy = e.clientY - last.current[1]

  last.current = [e.clientX, e.clientY]

  mapRef.current.position.x += dx * 0.002
  mapRef.current.position.y -= dy * 0.002

  mapRef.current.position.x = THREE.MathUtils.clamp(mapRef.current.position.x,-.8,.5)
  mapRef.current.position.y = THREE.MathUtils.clamp(mapRef.current.position.y,-.43,.1)

},[])


  return (
    <>
    <Environment files={"./city-lightings.hdr"}/>
      {/* <OrbitControls
     onChange={(e)=>{

       if(cameraRef.current) console.log("camera postion", cameraRef.current.position.z)
     }}
      />  */}
     <PerspectiveCamera
        makeDefault
        near={0.1}
        far={10000}
        position={[0,0.,1.]}
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
          aspect={size.width / size.height}
          mapRef={mapRef}
          dimensions={dimensions}
        />
      )}
    <group position={[0,0.,0.3]} scale={1} ref={mapRef}>
     <axesHelper args={[10]}/>
       <mesh 
     renderOrder={100} 
     onPointerDown={onPointerDownHandler}
     onPointerUp={onPointerUpHandler}
     onPointerMove={onPointerMoveHandler}   
     onPointerOver={() => setIsHovered(true)}
     onPointerOut={() => setIsHovered(false)}
     >
        <planeGeometry args={[dimensions?.width, dimensions?.height,100 , 100]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexMapShader}
         
          fragmentShader={fragmentMapShader}
          uniforms={sharedUniforms}
          needsUpdate={true}
          
        />
        {/* <meshStandardMaterial color={'red'}/> */}
      </mesh>

       {pins.map((pin) => (
            <Pin
              key={pin.id}
              title={pin.title}
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
    
    </>
  )
}

export default Scene