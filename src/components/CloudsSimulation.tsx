import {useRef } from 'react'
import * as THREE from 'three'
import { fragmentClouds, vertexClouds } from '../lib/shaders/clouds'
import { useFrame } from '@react-three/fiber'

const CloudsSimulation = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null)

    const uniforms = useRef({
        uTime: { value: 0 },
  uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  uWindDirection: { value: new THREE.Vector2(Math.cos(0.3), Math.sin(0.3)) },
  uWindSpeed: { value: 0.02 },
  uCloudScale: { value: 8.0 },
  uCloudOpacity: { value: 0.6 },
  uCloudCutoff: { value: 0.3 },
  uCloudFeather: { value: 0.2 },
  uHazeAmount: { value: 0.05 },
  uCloudStretch: { value: 3.0 },
  uCloudCoverage: { value: .8 },
  uCurlStrength: { value: 4.0 },
    })

    useFrame(({clock})=>{
       const time = clock.getElapsedTime();
       if (materialRef.current) {
           materialRef.current.uniforms.uTime.value = time ;
       }
    })
   
  return (
   <group position={[0,0,1.]}>
    <mesh frustumCulled={false}>
        <planeGeometry args={[2,2]} />
        <shaderMaterial
        ref={materialRef}
        vertexShader={vertexClouds}
        fragmentShader={fragmentClouds}
        uniforms={uniforms.current}
        transparent
         depthTest={false}
          depthWrite={false}/>
        
    </mesh>
   </group>
  )
}

export default CloudsSimulation