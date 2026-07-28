import React from 'react'

const FireIcon = ({className,fill,...props}:React.SVGProps<SVGSVGElement>) => {
  return (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.67 93.1" fill={fill||`var(--color-forest-green)`} className={`${className || "translate-y-[3px] w-3.75 h-4.75 mobile:w-5 mobile:h-6.5"}`}><path d="m44.53 30.36-4.05-17.94L33.73 0 14.84 19.32 0 34.5l14.84 26.22h25.64l10.79-9.66 5.4-31.74zm-9.64 23.73-3.08 2.58H20.25v-6.99l4.24-4.05 5.4-5.15 1.93 3.31 1.16 4.78 7.52-6.07-5.59 11.59Zm-1.18 24.84 22.96-12.75-9.7-1.42L27.59 76.1l-.78.37-21.45-7.66-1.31 3.84L20 79.75 4.05 87.43 8.2 93.1l18.59-10.33 23.2 10.33 2.63-3.84-7.88-6.39z"></path></svg>
  )
}

export default FireIcon