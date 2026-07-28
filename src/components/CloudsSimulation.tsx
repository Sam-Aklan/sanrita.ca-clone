import {useRef } from 'react'
import * as THREE from 'three'
import { fragmentClouds, vertexClouds } from '../lib/shaders/clouds'
import { useFrame } from '@react-three/fiber'

type CloudsSimulationProps = {
  width: number;
  height: number;
  resolutionRef: React.RefObject<THREE.Vector2>;
  scrollProgressRef:React.RefObject<{ value: number }>
};

const CloudsSimulation = ({ width, height, resolutionRef,scrollProgressRef }: CloudsSimulationProps) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null)
    const cloudGroupRef = useRef<THREE.Group>(null)
    const uniforms = useRef({
       uTime: { value: 0 },
  uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  uWindDirection: { value: new THREE.Vector2(Math.cos(0.8), Math.sin(0.8)) },
  uWindSpeed: { value: 0.02 },
  uCloudScale: { value: 15},
  uCloudOpacity: { value: 1.},
  uCloudCutoff: { value: 0.3 },
  uCloudFeather: { value: 0.4 },
  uHazeAmount: { value: 0.05 },
  uCloudStretch: { value: 1.0 },
  uCloudCoverage: { value: 0.8 },
  uCurlStrength: { value: 0.2 },
    })

    useFrame(({clock})=>{
       const time = clock.getElapsedTime();
       if (materialRef.current) {
           materialRef.current.uniforms.uTime.value = time ;
           if (resolutionRef.current) {
               materialRef.current.uniforms.uResolution.value.copy(resolutionRef.current);
           }
       }
       const progress = scrollProgressRef.current ? scrollProgressRef.current.value : 0;
       const mappedProgress = THREE.MathUtils.clamp(THREE.MathUtils.mapLinear(progress, 0.6, 1.0, 0.8, 9.0), 0.8, 9.0);
       //  console.log("z clouds", mappedProgress)
       if (cloudGroupRef.current) {
           cloudGroupRef.current.position.z = mappedProgress;
       }
    })
   
  return (
   <group position={[0,0,.8]} ref={cloudGroupRef}>
    <mesh frustumCulled={false}>
        <planeGeometry args={[width , height]} />
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