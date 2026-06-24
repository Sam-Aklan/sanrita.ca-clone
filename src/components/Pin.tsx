import { Html } from "@react-three/drei"
import { } from "react"

type PinType ={
    position:[number,number,number],
    title:string,
    radius:number,
    color?:string,
    image?:string,
    hovered:boolean,
}

function Pin({ position, title, image,radius,color,hovered }:PinType) {
  return (
    <group position={position}>
      
      {/* 3D Pin Dot */}
      <mesh>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial color={color?color:"red"} />
      </mesh>

      {/* HTML Tooltip */}
      {hovered && (
        <Html pointerEvents="none">
          <div className="bg-black text-white p-3 rounded-xl text-xs pointer-events-none select-none">
           {image? <img src={image} className="rounded mb-2" />:undefined}
            <h3>{title}</h3>
          </div>
        </Html>
      )}
    </group>
  )
}

export{ Pin}