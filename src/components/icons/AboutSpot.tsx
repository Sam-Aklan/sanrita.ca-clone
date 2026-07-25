import AboutIcon from './AboutIcon'
import { SpotIcon1 } from './Spots'

const AboutSpot = () => {
  return (
     <div className='relative'>
        <AboutIcon className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 fill-adventure-yellow'/>
        <SpotIcon1/>
    </div>
  )
}

export default AboutSpot