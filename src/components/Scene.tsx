import * as THREE from 'three';

import { useCallback, useEffect,useMemo,useRef, useState, type RefObject } from 'react';
import {Environment, OrbitControls, PerspectiveCamera, useTexture} from "@react-three/drei";
import { useThree, useFrame, type ThreeEvent } from '@react-three/fiber';
import { fragmentMapShader, vertexMapShader } from '../lib/shaders/heightMapShader';
import type { PerspectiveCamera as CameraType } from 'three'
import { Pin } from './Pin';
import { BlobSimulation } from './BlobSimulation';
import CloudsSimulation from './CloudsSimulation';
import use3DScene from '../lib/hook/Scene/use3DScene';

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
interface SceneProps{
  mapPlaneRef:RefObject<THREE.PlaneGeometry | null>
  scrollProgress: RefObject<{ value: number }>
}

const Scene = ({mapPlaneRef, scrollProgress}:SceneProps) => {
  const {cameraPosition,cameraRef,dimensions,
    handlePinHover,heightMap,initialX,
    isDragging,isHovered,
    isOverPin,mapRef,mapScaleGroupRef,
    materialRef, onPointerDownHandler,onPointerMoveHandler,
    onPointerUpHandler,pins,pinsGroupRef,
    planeHeightUnits,planeWidthUnits,pointerUv,
    resolutionRef,setIsHovered, sharedUniforms,
    size, toPlanePos, isDesktop, mapRotation
  }= use3DScene({scrollProgress:scrollProgress})

console.log("progress",scrollProgress)
  return (
    <>
    <Environment files={"./city-lightings.hdr"}/>
     <PerspectiveCamera
        makeDefault
        near={0.1}
        far={10000}
        position={cameraPosition as [number, number, number]}
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
    <group position={[initialX,0.,-0.3]} ref={mapRef}>
      <group ref={mapScaleGroupRef} name="mapScaleGroup" rotation={mapRotation as [number, number, number]}>
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
        {isDesktop?<CloudsSimulation
          width={planeHeightUnits}
          height={planeWidthUnits}
          resolutionRef={resolutionRef}
          scrollProgressRef={scrollProgress}
        />:undefined}
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