import { Html } from "@react-three/drei"
import { useState } from "react"

type PinType ={
    position:[number,number,number],
    title:string,
    radius:number,
    color?:string,
    image?:string,
}

function Pin({ position, title, image,radius,color }:PinType) {
  const [hovered, setHovered] = useState(false)

  return (
    <group position={position}>
      
      {/* 3D Pin Dot */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial color={color?color:"red"} />
      </mesh>

      {/* HTML Tooltip */}
      {hovered && (
        <Html>
          <div className="bg-black text-white p-3 rounded-xl  text-xs">
           {image? <img src={image} className="rounded mb-2" />:undefined}
            <h3>{title}</h3>
          </div>
        </Html>
      )}
    </group>
  )
}

export{ Pin}