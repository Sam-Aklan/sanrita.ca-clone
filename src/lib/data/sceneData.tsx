
import type { JSX } from "react"
import AboutIcon from "../../components/icons/AboutIcon"
import { SpotIcon1, SpotIcon2, SpotIcon3 } from "../../components/icons/Spots"
import FishingSpotIcon from "../../components/icons/FishingSpotIcon"
import FireIcon from "../../components/icons/FireIcon"
import ViewportIcon from "../../components/icons/ViewportIcon"
import ContactIcon from "../../components/icons/ContactIcon"

type PinData = {
  id: number
  title: string
  u: number
  v: number,
  SpotNode:JSX.Element,
  IconNode:JSX.Element,
  z?: number,
  color?: string
  image?:string
}


const disktopPins: PinData[] = [
  { id: 1, title: 'port', u: 0.588, v: 0.46,z:.9,  color: 'blue',IconNode:<FireIcon fill="var(--color-adventure-yellow)" className="w-5 h-6.25 mobile:w-10 mobile:h-8.25"/>, SpotNode:<SpotIcon1 className="w-13.5 h-13.5 mobile:w-15 mobile:h-15"/>},
  { id: 2, title: 'harbour', u: 0.14, v: 0.39, z:.3,  color: 'cyan', image:"./pics/fisher.jpg",IconNode:<FishingSpotIcon fill="var(--color-adventure-yellow)" className="mobile:w-9 mobile:h-9"/>,SpotNode:<SpotIcon2 className="w-13.5 h-13.5 mobile:w-15 mobile:h-15"/> },
  { id: 3, title: 'city', u: 0.7, v: 0.73, z: 1.3,  color: 'pink', image:"./pics/hut.jpg",IconNode:<AboutIcon fill="var(--color-adventure-yellow)" className="mobile:w-11 mobile:h-11 w-12 h-12"/>,SpotNode:<SpotIcon3 className="w-15 h-15 mobile:w-20 mobile:h-20"/> },
  { id: 4, title: 'mountain', u: 0.54, v: 0.245, z: .6,  color: 'red', image:"./pics/viliage.jpg",IconNode:<ContactIcon fill="var(--color-adventure-yellow)" className="'w-5 h-5 mobile:w-7 mobile:h-7'"/>,SpotNode:<SpotIcon2 className="w-13.5 h-13.5 mobile:w-15 mobile:h-15"/> },
  { id: 6, title: 'harbour', u: 0.14, v: 0.6, z:.3,  color: 'black', image:"./pics/fisher.jpg",IconNode:<ViewportIcon fill="var(--color-adventure-yellow)" className="mobile:w-11.5 mobile:h-7 w-8.25 h-5" />,SpotNode:<SpotIcon1 className="w-13.5 h-13.5 mobile:w-15 mobile:h-15"/> },
  { id: 7, title: 'mountain', u: 0.9, v: 0.2, z: 1.,  color: 'black', image:"./pics/viliage.jpg",IconNode:<ViewportIcon fill="var(--color-adventure-yellow)" className="mobile:w-11.5 mobile:h-7 w-8.25 h-5" />,SpotNode:<SpotIcon1 className="w-13.5 h-13.5 mobile:w-15 mobile:h-15"/> },
  { id: 5, title: 'diving', u: 0.335, v: 0.13, z: .6,  color: 'green',IconNode:<FishingSpotIcon fill="var(--color-adventure-yellow)" className="mobile:w-9 mobile:h-9"/>,SpotNode:<SpotIcon3 className="w-13.5 h-13.5 mobile:w-15 mobile:h-15"/> },
]
const mobilePins: PinData[] = [
 { id: 1, title: 'port', u: 0.605, v: 0.45, z:1.,  color: 'blue',IconNode:<FireIcon fill="var(--color-adventure-yellow)" className="w-5 h-6.25 mobile:w-10 mobile:h-8.25"/>, SpotNode:<SpotIcon1 className="w-13.5 h-13.5 mobile:w-15 mobile:h-15"/>},
  { id: 2, title: 'harbour', u: 0.14, v: 0.39, z:.2,  color: 'cyan', image:"./pics/fisher.jpg",IconNode:<FishingSpotIcon fill="var(--color-adventure-yellow)" className="w-7 h-7 mobile:w-9 mobile:h-9"/>, SpotNode: <SpotIcon2 className="w-13.5 h-13.5 mobile:w-15 mobile:h-15"/> },
  { id: 3, title: 'city', u: 0.7, v: 0.73, z: 1.5,  color: 'pink', image:"./pics/hut.jpg",IconNode:<AboutIcon fill="var(--color-adventure-yellow)" className="mobile:w-15 mobile:h-15 w-8 h-8"/>, SpotNode: <SpotIcon1 className="w-13.5 h-13.5 mobile:w-15 mobile:h-15"/> },
  { id: 4, title: 'mountain', u: 0.54, v: 0.23, z: .5,  color: 'red', image:"./pics/viliage.jpg",IconNode:<ContactIcon fill="var(--color-adventure-yellow)" className="'w-5 h-5 mobile:w-7 mobile:h-7'"/>, SpotNode: <SpotIcon1/> },
  { id: 5, title: 'diving', u: 0.31, v: 0.145, z: .45,  color: 'green',IconNode:<FishingSpotIcon fill="var(--color-adventure-yellow)" className=" w-7 h-7 mobile:w-9 mobile:h-9"/>,SpotNode:<SpotIcon3 className="w-13.5 h-13.5 mobile:w-15 mobile:h-15"/> },
   { id: 6, title: 'harbour', u: 0.14, v: 0.6, z:.3,  color: 'black', image:"./pics/fisher.jpg",IconNode:<ViewportIcon fill="var(--color-adventure-yellow)" className="mobile:w-11.5 mobile:h-7 w-8.25 h-5" />,SpotNode:<SpotIcon1 className="w-13.5 h-13.5 mobile:w-15 mobile:h-15"/> },
  { id: 7, title: 'mountain', u: 0.9, v: 0.2, z: 1.,  color: 'black', image:"./pics/viliage.jpg",IconNode:<ViewportIcon fill="var(--color-adventure-yellow)" className="mobile:w-11.5 mobile:h-7 w-8.25 h-5" />,SpotNode:<SpotIcon1 className="w-13.5 h-13.5 mobile:w-15 mobile:h-15"/>},
]

export {disktopPins, mobilePins}