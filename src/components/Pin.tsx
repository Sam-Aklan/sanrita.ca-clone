import { Html } from "@react-three/drei"
import { useState, useRef, useEffect } from "react"
import AboutSpot from "./icons/AboutSpot"
import { SpotIcon1 } from "./icons/Spots"
import { useFrame } from "@react-three/fiber"
import AboutIcon from "./icons/AboutIcon"

type PinType ={
    position:[number,number,number],
    title?:string,
    radius:number,
    color?:string,
    image?:string,
    onHoverChange?: (hovered: boolean) => void,
}

function Pin({ position, title, image, radius, color, onHoverChange }: PinType) {
  const [hovered, setHovered] = useState(false)
  const hoverTimeoutRef = useRef<number | null>(null)
  const iconWrapperRef = useRef<HTMLDivElement>(null)

  const handlePointerOver = () => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current)
    onHoverChange?.(true)
    // Wait 150ms before showing the tooltip to filter out transient/fast sweeps
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHovered(true)
    }, 150)
  }

  const handlePointerOut = () => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current)
    onHoverChange?.(false)
    // Wait 150ms before hiding to prevent abrupt flashing on quick leaves
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHovered(false)
    }, 150)
    setHovered(false)
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current)
    }
  }, [])
  useFrame(({camera})=>{
    if(!iconWrapperRef.current) return
    const scale = (7 / camera.position.z) * .8;
    // console.log("scale",scale)
    iconWrapperRef.current.style.transform = `scale(${scale})`
  })

  return (
    <group position={position}>
      
      {/* 3D Pin Dot */}
      <mesh
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[1,1]} />
        <meshBasicMaterial transparent={true}  depthWrite={false} color={color} />
        <Html
         center
         className="pointer-events-none flex items-center justify-center"
         position={[0,0,0]}
         >
          <div
         className="origin-center "
          ref={iconWrapperRef}>

         <SpotIcon1 />
          </div>
        </Html>
        <Html
         center
         className="pointer-events-none flex items-center justify-center"
         position={[0,0,0]}
         >
          <div
         className="origin-center "
          // ref={iconWrapperRef}
          >
            <AboutIcon fill="var(--color-adventure-yellow)"/>
          </div>
        </Html>
      </mesh>

      {/* HTML Tooltip */}
      {hovered && (
        <Html 
          pointerEvents="none" 
          center
          style={{ transform: "translate(-50%, -20%)" }} // Offset above the pin
          className="pointer-events-none"
        >
          <div className=" text-white  rounded-xl text-xs pointer-events-none select-none w-50 md:w-75 h-auto image-wrapper">
           {image ? <img src={image} className="rounded mb-2 w-full h-full bg-cover" /> : undefined}
            <h3>{title}</h3>
          </div>
        </Html>
      )}
    </group>
  )
}

export{ Pin}