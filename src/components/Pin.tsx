import { Html } from "@react-three/drei"
import { useState, useRef, useEffect } from "react"

type PinType ={
    position:[number,number,number],
    title:string,
    radius:number,
    color?:string,
    image?:string,
}

function Pin({ position, title, image, radius, color }: PinType) {
  const [hovered, setHovered] = useState(false)
  const hoverTimeoutRef = useRef<number | null>(null)

  const handlePointerOver = () => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current)
    // Wait 150ms before showing the tooltip to filter out transient/fast sweeps
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHovered(true)
    }, 150)
  }

  const handlePointerOut = () => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current)
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

  return (
    <group position={position}>
      
      {/* 3D Pin Dot */}
      <mesh
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial color={color ? color : "red"} />
      </mesh>

      {/* HTML Tooltip */}
      {hovered && (
        <Html 
          pointerEvents="none" 
          center
          style={{ transform: "translate(-50%, -130%)" }} // Offset above the pin
          className="pointer-events-none"
        >
          <div className="bg-black text-white p-3 rounded-xl text-xs pointer-events-none select-none">
           {image ? <img src={image} className="rounded mb-2" /> : undefined}
            <h3>{title}</h3>
          </div>
        </Html>
      )}
    </group>
  )
}

export{ Pin}