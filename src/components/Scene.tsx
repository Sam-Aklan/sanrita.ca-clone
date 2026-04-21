import * as THREE from 'three';

import { useEffect,useMemo,useRef } from 'react';
import {Environment, OrbitControls, PerspectiveCamera, useTexture} from "@react-three/drei";
import { useThree } from '@react-three/fiber';
import { fragmentMapShader, vertexMapShader } from '../lib/shaders/heightMapShader';
import type { PerspectiveCamera as CameraType } from 'three'

const Scene = () => {
  const cameraRef = useRef<CameraType>(null)
    const [mountain, heightMap]= useTexture(['./Mountain-annonated.png','./height-map-optimaized.jpg']);

   const sharedUniforms = useRef({
    uHeightMap: { value: heightMap },
  uColorMap: { value: mountain },

  uTexelSize: { value: new THREE.Vector2() },
  uHeightScale: { value: 5},
    uStrength: {value:1.},
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

    const diminsion = useMemo(()=>{
      if(!cameraRef.current) return  {}
      const camera = cameraRef.current
      const distance = Math.abs(camera.position.z - 0.) // plane z position

    const fov = THREE.MathUtils.degToRad(camera.fov)

    const height = 2 * Math.tan(fov / 2) * distance
    const width = height * camera.aspect


    return { width, height }
    },[size,cameraRef.current])

    console.log("width",diminsion.width, "height", diminsion.height)

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
        position={[0,0.,1.]}
        aspect={size.width / size.height}
        fov={75}
        ref={cameraRef}
      />
    <group position={[0,0.,0.]} scale={1}>
     <axesHelper args={[10]}/>
       <mesh 
     renderOrder={100} 
    // rotation={[-Math.PI / 2.5, 0, 0]}
     >
        <planeGeometry args={[diminsion?.width, diminsion?.height,100 , 100]} />
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