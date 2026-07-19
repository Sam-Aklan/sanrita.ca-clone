import  { useState } from 'react'
import MapIcon from '../icons/MapIcon'
import FireIcon from '../icons/FireIcon'
import AboutIcon from '../icons/AboutIcon'
import ContactIcon from '../icons/ContactIcon'
import LinkedInIcon from '../icons/LinkedIn'
import PlaygroundIcon from '../icons/PlaygroundIcon'
import RoadIcon from '../icons/RoadIcon'
import TrailIcon from '../icons/TrailIcon'
import ViewportIcon from '../icons/ViewportIcon'
import FishingSpotIcon from '../icons/FishingSpotIcon'
import SidbarTab from './SidbarTab'
import { cn } from '../../lib/utils'
import GithubIcon from '../icons/GithubIcon'

const tabs = [
    {key:"map",IconNode:<MapIcon/>,isLink:true},
    {key:"project",IconNode:<FireIcon/>, isLink:true},
    {key:"about",IconNode:<AboutIcon/>, isLink:true},
    {key:"contact",IconNode:<ContactIcon/>, isLink:true},
    {key:"github",IconNode:<GithubIcon/>, isLink:true,},
    {key:"LinkedIn",IconNode:<LinkedInIcon/>, isLink:true},
    {key:"Playground",IconNode:<PlaygroundIcon/>, isLink:true},
    {key:"Road",IconNode:<RoadIcon/>, isLink:false},
    {key:"trail",IconNode:<TrailIcon/>, isLink:false},
    {key:"viewport",IconNode:<ViewportIcon/>, isLink:false},
    {key:"fishing spot",IconNode:<FishingSpotIcon/>, isLink:false},
]

function Sidebar({isDropDown=false}:{isDropDown?:boolean}) {
  const [activeTab, setActiveTab] = useState("map")
  return (
    <div className={cn('c-icons || w-full h-full flex-1 flex flex-col justify-center gap-0 [&>a]:pointer-events-auto [&>a]:flex *:py-[6px] *:font-mono font-thin max-mobile:*:py-10 col-2 row-3 relative ',isDropDown?undefined:"-translate-x-(--scroll-aside) ")}>
      {tabs.map((icon,)=> <SidbarTab 
      key={icon.key} 
      keyLabel={icon.key} 
      IconNode={icon.IconNode} 
      isActive={activeTab === icon.key} 
      isLink={icon.isLink} 
      setActive={setActiveTab}
      isDropDown={isDropDown}/>)}
      
    </div>
  )
}

export { Sidebar}