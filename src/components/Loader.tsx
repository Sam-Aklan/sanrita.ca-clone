
import { useProgress } from '@react-three/drei'
import { useImagePreloader } from '../lib/hook/useImagesPreloader'
import { useEffect, useState } from 'react'

const imagesSources = [
  "./pics/fisher.jpg",
  "./pics/hut.jpg",
  "./pics/viliage.jpg",
  "./svg/terrain-pattern.svg"
]

const Loader = () => {
  const {isDone, progress}= useImagePreloader(imagesSources)
  const {active,progress:progress3D} = useProgress()
  const [totalProgress, setTotalProgress] = useState(0)

  useEffect(()=>setTotalProgress(Math.floor(Math.min(progress,progress3D))),[progress,progress3D])

  useEffect(() => {
    if (isDone && !active) {
      const triggerResize = () => {
        window.dispatchEvent(new Event('resize'));
      };
      // Dispatch immediately to size the canvas
      triggerResize();
      // Dispatch again after a short delay to allow layout to settle
      const timer = setTimeout(triggerResize, 100);
      return () => clearTimeout(timer);
    }
  }, [isDone, active]);

  if(isDone && !active) return null

  return (
    <div className="fixed inset-0 z-[100] w-screen h-dvh flex items-center justify-center bg-icy-blue">
      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
        <div className="loader"/>
        <p className='text-adventure-yellow text-sm font-mono'>
          {`loading: ${totalProgress}`}
        </p>
      </div>
    </div>
  )
}

export default Loader