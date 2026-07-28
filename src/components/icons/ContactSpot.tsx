import ContactIcon from "./ContactIcon"
import { SpotIcon3 } from "./Spots"

const ContactSpot = () => {
  return (
     <div className='relative'>
        <ContactIcon className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 fill-adventure-yellow'/>
        <SpotIcon3/>
    </div>
  )
}

export default ContactSpot