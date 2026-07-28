import React from 'react'

const MapIcon = ({...props}:React.SVGProps<{}>) => {
  return (
    <svg width="20" height="15" fill="var(--color-forest-green)" className="translate-y-[3px] mobile:w-5 mobile:h-3.75 w-4 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.1 69.68"><path d="m60.37 58.96-28.2 10.72 3.26-54.6-3.26-9.73L54.97 0h5.4zM87.1 5.36 65.33 0v58.96l8.78 1.38 12.99 9.34-.92-39.51zm-59.88 0L19.8 3.02 0 0l1.7 39.23L0 58.97l27.22 10.72-1.38-6.32 1.38-58Zm-7.89 29.27-6.14 10.54-4.43-9.15-3.64-13.87 3.26-4.25 5.07-1.84L19.94 19l2.75 4.76-3.35 10.87Z"></path><path d="M12.18 21.15 9.8 24.61l.76 4.55 4.66.98L18.25 27v-4.55l-3.36-1.84z"></path></svg>
  )
}

export default MapIcon