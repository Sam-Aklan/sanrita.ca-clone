import * as THREE from 'three';

import { type RefObject } from 'react';
import {Environment,  PerspectiveCamera,} from "@react-three/drei";
import { fragmentMapShader, vertexMapShader } from '../lib/shaders/heightMapShader';
import { Pin } from './Pin';
import { BlobSimulation } from './BlobSimulation';
import CloudsSimulation from './CloudsSimulation';
import use3DScene from '../lib/hook/Scene/use3DScene';

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
            IconNode={pin.IconNode}
            SpotNode={pin.SpotNode}
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