import * as THREE from 'three';

import { useCallback, useEffect,useMemo,useRef } from 'react';
import {Environment, OrbitControls, PerspectiveCamera, useTexture} from "@react-three/drei";
import { useThree } from '@react-three/fiber';
import { fragmentMapShader, vertexMapShader } from '../lib/shaders/heightMapShader';
import type { PerspectiveCamera as CameraType } from 'three'
import { Pin } from './Pin';

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
    const [mountain, heightMap]= useTexture(['./mountain-sea/Mountain By Sea Heightmap Diffuse.jpg','./mountain-sea/Mountain By Sea Heightmap.png']);

   const sharedUniforms = useRef({
    uHeightMap: { value: heightMap },
  uColorMap: { value: mountain },

  uTexelSize: { value: new THREE.Vector2() },
  uHeightScale: { value: 2},
    uStrength: {value:.3},
  uLightDir: { value: new THREE.Vector3(1,1,1).normalize() }
   }).current;

    const {size}= useThree()

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
   const x = (u - 0.5) * dimensions.width
    const y = (v - 0.5) * dimensions.height

  return [x, y,z]

    },[dimensions])

//     const pins = useMemo(()=>{
//      const anchors = [
//       {u:-0.15,v:-0.165},
// {u:-1.4,v:0.1},
// {u:-0.05,v:.45},
// {u:1.07,v:.57},
//     ]
//     return anchors.map(pin=>toPlanePos(pin.u,pin.v))
//   }
//     ,[toPlanePos])

    console.log("width",dimensions.width, "height", dimensions.height)
    console.log("pins",pins)


  return (
    <>
    <Environment files={"./city-lightings.hdr"}/>
     <OrbitControls
     onChange={(e)=>{
      // if(cameraRef.current) console.log("camera postion", cameraRef.current.position.z)
    }}
     />
     <PerspectiveCamera
        makeDefault
        near={0.1}
        far={10000}
        position={[0,0.,1.]}
        aspect={size.width / size.height}
        fov={75}
        ref={cameraRef}
      />
    <group position={[0,0.,0.3]} scale={1} ref={mapRef}>
     <axesHelper args={[10]}/>
       <mesh 
     renderOrder={100} 
   
     >
        <planeGeometry args={[dimensions?.width, dimensions?.height,100 , 100]} />
        <shaderMaterial
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
            />
          ))}
    </group>
    
    </>
  )
}

export default Scene