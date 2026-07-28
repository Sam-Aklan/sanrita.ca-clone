import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCallback, useRef } from "react";

const useCompassAnimation = () => {
  const articleRef= useRef<HTMLElement>(null);
   const compassRef =useRef<SVGSVGElement>(null)
   const currentRotationRef = useRef(0)

   const getPointerCoords = useCallback((e: PointerEvent | TouchEvent): [number, number] | null => {
        if ('touches' in e && e.touches && e.touches.length > 0) {
          return [e.touches[0].clientX, e.touches[0].clientY];
        }
        if ('clientX' in e && typeof (e as PointerEvent).clientX === 'number') {
          return [(e as PointerEvent).clientX, (e as PointerEvent).clientY];
        }
        return null;
      },[]);

      const onTouchMoveCallback = useCallback((e:PointerEvent | TouchEvent)=>{
        const coords = getPointerCoords(e);

        if(!coords || !compassRef.current) return
        const [clientX, clientY] = coords;

         const rect = compassRef.current.getBoundingClientRect()
     const cx = rect.left + rect.width / 2
     const cy = rect.top + rect.height / 2

     const dx = clientX - cx
     const dy = clientY - cy

     const angleRad = Math.atan2(dy, dx)
     const targetRotation = angleRad * (180 / Math.PI)

     const currentRotation = currentRotationRef.current
     let diff = (targetRotation - currentRotation) % 360
     if (diff > 180) {
       diff -= 360
     } else if (diff < -180) {
       diff += 360
     }
     const nextRotation = currentRotation + diff
     currentRotationRef.current = nextRotation

     gsap.to(compassRef.current, {
       "--rotation": `${nextRotation}deg`,
       duration: 0.8,
       ease: "elastic.out(1, 0.4)",
       overwrite: "auto",
     })

      },[])
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
     window.addEventListener("mousemove", onMouseMove);
     window.addEventListener("touchmove",onTouchMoveCallback);
     return () => {
       window.removeEventListener("mousemove", onMouseMove)
       window.removeEventListener("touchmove", onTouchMoveCallback)
     }
   }, [onMouseMove])
   
   return {articleRef,compassRef}
}

export default useCompassAnimation