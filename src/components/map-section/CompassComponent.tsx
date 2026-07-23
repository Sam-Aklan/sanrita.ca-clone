import CompassIcon from '../icons/CompassIcon'
import useCompassAnimation from '../../lib/hook/MapPreferalMargins/useCompassAnimation'

const CompassComponent = () => {
    const {compassRef}= useCompassAnimation()
  return (
    <CompassIcon width={55} height={55} ref={compassRef} fill='var(--bg-adventure-yellow)' />
  )
}

export default CompassComponent