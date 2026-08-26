import { Html } from "@react-three/drei"
import { useState, useRef,type JSX } from "react"
import { useFrame } from "@react-three/fiber"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

gsap.registerPlugin(useGSAP)

type PinType ={
    position:[number,number,number],
    title?:string,
    color?:string,
    SpotNode:JSX.Element,
    IconNode:JSX.Element,
    image?:string,
    onHoverChange?: (hovered: boolean) => void,
}

function Pin({ position, title, image, color,IconNode,SpotNode, onHoverChange }: PinType) {
  const [hovered, setHovered] = useState(false)
  const hoverTimeoutRef = useRef<number | null>(null)
  const spotWrapperRef = useRef<HTMLDivElement>(null)
  const iconWrapperRef = useRef<HTMLDivElement>(null)
  const hoverScaleRef = useRef({ value: 1 })

  // Cleanup timer on unmount
  const {contextSafe}= useGSAP(()=>{

       return () => {
      if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current)
    }
  },[])

  const mouseEnterCallback = contextSafe(()=>{
     if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current)
    onHoverChange?.(true)
    // Wait 150ms before showing the tooltip to filter out transient/fast sweeps
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHovered(true)
    }, 500);

    gsap.to(hoverScaleRef.current, {
      value: 1.25,
      duration: 0.3,
      overwrite: "auto",
    })
  })

  const mouseLeaveCallback = contextSafe(()=>{
     if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current)
    onHoverChange?.(false)
    // Wait 150ms before hiding to prevent abrupt flashing on quick leaves
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHovered(false)
    }, 500)
    setHovered(false)

    gsap.to(hoverScaleRef.current, {
      value: 1,
      duration: 0.3,
      overwrite: "auto",
    })
  })
 
  useFrame(({camera})=>{
    if (!spotWrapperRef.current || !iconWrapperRef.current) return
    const scale = (7 / camera.position.z) * .5 * hoverScaleRef.current.value;
    // console.log("scale",scale)
    spotWrapperRef.current.style.transform = `scale(${scale})`
    iconWrapperRef.current.style.transform = `scale(${scale})`
  })

  return (
    <group position={position}>
      
      {/* 3D Pin Dot */}
      <mesh
        onPointerOver={mouseEnterCallback}
        onPointerOut={mouseLeaveCallback}
      >
        <planeGeometry args={[1,1]} />
        <meshBasicMaterial transparent={true} opacity={0}   depthWrite={false} color={color} />
        <Html
         center
         className="pointer-events-none flex items-center justify-center"
         position={[0,0,0]}
         >
          <div
         className="origin-center"
          ref={spotWrapperRef}>

         {SpotNode}
          </div>
        </Html>
        <Html
         center
         className="pointer-events-none flex items-center justify-center"
         position={[0,0,0]}
         >
          <div
         className="origin-center "
          ref={iconWrapperRef}
          >
            {IconNode}
          </div>
        </Html>
      </mesh>

      {/* HTML Tooltip */}
      {hovered && (
        <Html 
          pointerEvents="none" 
          style={{ transform: `translate(-50%, ${image?-20:-280}%)` }} // Offset above the pin
          className="pointer-events-none"
        >
          <div className="text-adventure-yellow font-f37stout  rounded-xl text-md pointer-events-none select-none w-80 md:w-130 h-auto image-wrapper">
           {image ? <img src={image} className="rounded mb-2 w-full h-full bg-cover" /> : undefined}
            {title && !image?<h3>{title}</h3>:undefined}
          </div>
        </Html>
      )}
    </group>
  )
}

export{ Pin}