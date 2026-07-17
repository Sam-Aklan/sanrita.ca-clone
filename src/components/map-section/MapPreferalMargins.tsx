import { useCallback, useRef, type MouseEvent, type RefObject } from "react"
import CompassIcon from "../icons/CompassIcon"
import LeftGraduated from "../icons/LeftGraduated"
import RightGraduated from "../icons/RightGraduated"
import SpiderIcon from "../icons/SpiderIcon"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

const MapPreferalMargins = ({textRef}:{textRef:RefObject<HTMLParagraphElement | null>}) => {
   const articleRef= useRef<HTMLElement>(null);
   const compassRef =useRef<SVGSVGElement>(null)
   const currentRotationRef = useRef(0)

   const onMouseMove = useCallback((ev: globalThis.MouseEvent) => {
     if (!compassRef.current) return
     const { clientX, clientY } = ev

     const rect = compassRef.current.getBoundingClientRect()
     const cx = rect.left + rect.width / 2
     const cy = rect.top + rect.height / 2

     const dx = clientX - cx
     const dy = clientY - cy

     // Calculate angle to mouse in degrees
     const angleRad = Math.atan2(dy, dx)
     const targetRotation = angleRad * (180 / Math.PI)

     // Needle points to -135deg by default. To point to angleDeg, rotation should be:
    //  const targetRotation = angleDeg + 135

     // Normalize to find shortest path rotation to prevent 360-degree spin jumps
     const currentRotation = currentRotationRef.current
     let diff = (targetRotation - currentRotation) % 360
     if (diff > 180) {
       diff -= 360
     } else if (diff < -180) {
       diff += 360
     }
     const nextRotation = currentRotation + diff
     currentRotationRef.current = nextRotation

     // Animate CSS custom property '--rotation' with a springy physical ease
     gsap.to(compassRef.current, {
       "--rotation": `${nextRotation}deg`,
       duration: 0.8,
       ease: "elastic.out(1, 0.4)",
       overwrite: "auto",
     })
   }, [])

   useGSAP(() => {
     const element = articleRef.current
     if (!element) return
     element.addEventListener("mousemove", onMouseMove)
     return () => {
       element.removeEventListener("mousemove", onMouseMove)
     }
   }, [onMouseMove])

  return (
    <article className="c-home_grid-content || col-1 row-1 grid grid-cols-(--grid-content-cols) grid-rows-(--grid-content-rows) w-full h-full relative overflow-clip page-home-module__mOmtjG__c-home_grid-content z-100" ref={articleRef}>
        {/* top */}
        <div className="c-home_grid-content_row-1 || desktop-only col-span-3 row-span-1 opacity-(--scroll-wrapper-opacity)">
            <div className="grid grid-cols-4 justify-around w-[calc(100%-55px*2)] h-full mx-auto place-items-center [&>p]:text-terrain-grey [&>p]:text-[10px] text-center">
                <p><SpiderIcon/></p>
                <p>19:35:23 GMT</p>
                <p>EST.2024</p>
                <p><CompassIcon ref={compassRef}/></p>
            </div>
        </div>
        {/* left */}
        <div className="c-home_grid-content_col-1 || desktop-only col-span-1 row-start-2 row-span-1 [writing-mode:vertical-lr] text-center place-self-center rotate-180 uppercase text-terrain-grey opacity-(--scroll-wrapper-opacity)"><p className="tracking-[0.3em] text-[10px] flex flex-col-reverse text-terrain-grey"><span>Design &amp; development</span> <span>Purveyors</span></p></div>
        {/* right */}
        <div className="c-home_grid-content_col-3 || desktop-only col-start-3 col-span-1 row-start-2 row-span-1 [writing-mode:vertical-lr] text-center place-self-center rotate-0 uppercase text-terrain-grey opacity-(--scroll-wrapper-opacity)">
            <p className="tracking-[0.3em] text-[10px] flex flex-col">
                <span>hand-crafted</span> 
                <span>digital design Refuge</span>
                </p>
            </div>
        {/* bottom */}
        <div className="c-home_grid-content_row-3 || desktop-only col-span-3 row-start-3 row-span-1 opacity-(--scroll-wrapper-opacity)">
        <div className="grid grid-cols-4 justify-around w-[calc(100%-45px*2)] h-full mx-auto place-items-center [&>p]:text-terrain-grey [&>p]:text-[10px] [&>p]:flex [&>p]:flex-col [&>p]:tracking-[0.3em] text-center uppercase">
            <p className="justify-self-start -translate-x-5">
                <LeftGraduated/>
            </p>
            <p className="text-terrain-grey">
                <span>Gold idEAs</span> <span>seekers</span>
            </p>
            <p className="text-terrain-grey"><span>Republic of</span> <span>collaborative minds</span></p>
            <p className="justify-self-end -translate-x-5">
                <RightGraduated/>
            </p>
        </div>
        </div>
        {/* center */}

        <div className="c-home_grid-content_map || grid col-start-2 col-span-1 row-start-2 row-span-1 relative w-full h-full">
            <div className="c-scroll_warn | col-1 row-1 relative z-12 place-content-center text-center pointer-events-none! overflow-hidden">
                <p className="text-h1-like text-adventure-yellow uppercase" ref={textRef}>
                    scroll to enter the world
                </p>

              
            </div>
              <div className="relative z-10 col-1 row-1 w-full h-full touch-none pointer-events-none"/>
        </div>
    </article>
  )
}

export default MapPreferalMargins