import type { SVGProps } from "react"

const CompassIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
   <svg width="25" height="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className="m-0 fill-terrain-grey translate-y-[3px]"
    style={{
    '--rotation': "0",
   } as React.CSSProperties} {...props} ><path d="M15.6,2.48l.35-2.48-1.89.51v4.4s1.73-.41,1.73-.41l-.19-2.02ZM14.05,25.09l.35,2.48-.19,2.02,1.73.4v-4.4s-1.9-.51-1.9-.51ZM29.49,13.73h-4.4s.4,1.73.4,1.73l2.02-.19,2.48.35-.51-1.89ZM2.43,14.07l-2.02-.19-.18.79-.06.23-.16.71h3.59l1.04.1-.11-.58.38-1.42-2.48.35Z"></path><path className="svg-arrow origin-center" d="M20.25,18.27l-1.56-3.96-1.64-2.44-5.84-2.47-2.86-.83.92,3.51,1.56,3.96,1.16,1.88.49.53.05.05.1.11,5.68,2.33,2.86.83-.92-3.51ZM19.21,19.66l-1.82-.95-3.47-1.19.65-1.53,1.23-.9.49-1.62,1.31,2.87,1.61,2.91v.42Z" style={{
    transform:"rotate(var(--rotation, 0))"
   }}></path></svg>
  )
}

export default CompassIcon



