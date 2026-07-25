
import ViewportIcon from './ViewportIcon'
import { SpotIcon2 } from './Spots'

const ViewportSpot = () => {
  return (
     <div className='relative'>
        <ViewportIcon className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 fill-adventure-yellow'/>
        <SpotIcon2/>
    </div>
  )
}

export default ViewportSpot