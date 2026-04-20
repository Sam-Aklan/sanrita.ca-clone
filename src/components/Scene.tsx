import * as THREE from 'three';

import { useEffect,useRef } from 'react';
import {Environment, OrbitControls, PerspectiveCamera, useTexture} from "@react-three/drei";
import { useThree } from '@react-three/fiber';
import { fragmentMapShader, vertexMapShader } from '../lib/shaders/heightMapShader';
import type { PerspectiveCamera as CameraType } from 'three'

const Scene = () => {
  const cameraRef = useRef<CameraType>(null)
    const [mountain, heightMap]= useTexture(['./Mountain-optimazied.jpg','./height-map-optimaized.jpg']);

   const sharedUniforms = useRef({
    uHeightMap: { value: heightMap },
  uColorMap: { value: mountain },

  uTexelSize: { value: new THREE.Vector2() },
  uHeightScale: { value: 10},
    uStrength: {value:5.},
  uLightDir: { value: new THREE.Vector3(3,5,1).normalize() }
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
  return (
    <>
    <Environment files={"./city-lightings.hdr"}/>
     <OrbitControls
     onChange={(e)=>{
      if(cameraRef.current) console.log("camera postion", cameraRef.current.position.z)
    }}
     />
     <PerspectiveCamera
        makeDefault
        near={0.1}
        far={10000}
        position={[0,10.5,5.5]}
        aspect={size.width / size.height}
        fov={45}
        ref={cameraRef}
      />
    <group position={[0,-4,-4]} scale={1}>
     
       <mesh 
     renderOrder={100} 
    rotation={[-Math.PI / 2, 0, 0]}
     >
        <planeGeometry args={[12, 8, 100, 100]} />
        <shaderMaterial
          vertexShader={vertexMapShader}
          // transparent
          // side={THREE.DoubleSide}
          fragmentShader={fragmentMapShader}
          uniforms={sharedUniforms}
          needsUpdate={true}
          
        />
        {/* <meshStandardMaterial color={'red'}/> */}
      </mesh>
    </group>
    
    </>
  )
}

export default Scene