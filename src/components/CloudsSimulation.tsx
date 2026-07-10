import {useRef } from 'react'
import * as THREE from 'three'
import { fragmentClouds, vertexClouds } from '../lib/shaders/clouds'
import { useFrame } from '@react-three/fiber'

type CloudsSimulationProps = {
  width: number;
  height: number;
  widthPx: number;
  heightPx: number;
};

const CloudsSimulation = ({ width, height, widthPx, heightPx }: CloudsSimulationProps) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null)

    const uniforms = useRef({
        uTime: { value: 0 },
  uResolution: { value: new THREE.Vector2(widthPx, heightPx) },
  uWindDirection: { value: new THREE.Vector2(Math.cos(0.3), Math.sin(0.3)) },
  uWindSpeed: { value: 0.02 },
  uCloudScale: { value: 6.0 },
  uCloudOpacity: { value: .8 },
  uCloudCutoff: { value: 0.3 },
  uCloudFeather: { value: 0.2 },
  uHazeAmount: { value: 0.05 },
  uCloudStretch: { value: 3.0 },
  uCloudCoverage: { value:1.},
  uCurlStrength: { value: 4.0 },
    })

    useFrame(({clock})=>{
       const time = clock.getElapsedTime();
       if (materialRef.current) {
           materialRef.current.uniforms.uTime.value = time ;
           materialRef.current.uniforms.uResolution.value.set(widthPx, heightPx);
       }
    })
   
  return (
   <group position={[0,0,.5]}>
    <mesh frustumCulled={false}>
        <planeGeometry args={[width, height]} />
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