import { useRef, useState } from 'react'
import OpenMenuIcon from '../icons/OpenMenuIcon'
import CloseMenuIcon from '../icons/CloseMenuIcon'
import { Sidebar } from '../SidebarSection'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const DropDownBar = () => {
    const [isClicked, setIsClicked] = useState(false)
    const DropDownRef = useRef<HTMLDivElement>(null)
    const whiskersRef= useRef<HTMLDivElement>(null)
    const boardRef= useRef<HTMLDivElement>(null)
    const timeLineRef = useRef<gsap.core.Timeline|null>(null)
    const {contextSafe}= useGSAP(()=>{
        gsap.set([whiskersRef.current,boardRef.current],{
            clipPath: "inset(0% 0% 100% 0%)",
            pointerEvents: "none"
        })
        timeLineRef.current = gsap.timeline({
            paused: true,
            onComplete:()=>{
                 gsap.set([whiskersRef.current,boardRef.current],{
                    pointerEvents:"auto"
                })
            },
            onReverseComplete: () => {
                gsap.set("img.topology-image", { clearProps: "opacity" });
                gsap.set([whiskersRef.current,boardRef.current],{
                    pointerEvents:"none"
                })
            }
        });
        timeLineRef.current.to(whiskersRef.current,{
                clipPath:"inset(0% 0% 0% 0%)",
                duration:.3,
                ease:"power2.inOut"
            }).to(".toggle-btn",{
                opacity:(i)=>i%2===0?0:1,
                rotate:(i)=>i%2===0?-360:360,
            },"<",).
            to("img.topology-image",{
                opacity:.15
            },"<")
            .to(boardRef.current,{
                clipPath:"inset(0% 0% 0% 0%)",
                duration:.4,
                ease:"power2.inOut"
            },"-=.1").from(".sidbar-tab",{
                y:20,
                opacity:0,
                stagger:.05
            },"-=.1")
        
    },{scope:DropDownRef})

    const onOpenMenu= contextSafe(()=>{
        if(!timeLineRef.current)return
        
        if(!isClicked){
           timeLineRef.current.play();
        }else{
      
        timeLineRef.current.reverse()
        }
})



  return (
    <div className='mobile:col-4 mobile:row-1 mobile:translate-x-[calc(100%-var(--scroll-aside))] c-trail-box | mobile:relative mobile:h-40 w-47.5 h-10 absolute top-0 right-0 m-3 z-20' >
        <div className='grid grid-rows-[auto_auto_1fr] m-6 place-self-end overflow-hidden w-47.5  max-mobile:overflow-visible max-mobile:absolute max-mobile:top-0 max-mobile:m-0 max-mobile:[clip-path:polygon(0%_0%,calc(100%-15px)_0%,100%_15px,100%_100%,0%_100%)] pointer-events-auto ' ref={DropDownRef}>
            <div className='group pointer-events-auto row-1 flex items-center cursor-pointer relative overflow-hidden'>
                <div className="w-full h-10">
                    <div className='c-button w-full h-full bg-adventure-yellow [clip-path:polygon(0%_0%,calc(100%-10px)_0%,100%_10px,100%_100%,0%_100%)] place-content-center'
                    onClick={()=>{
                        setIsClicked(prev=>!prev)
                        onOpenMenu()
                        }}>
                        {/* bar */}
                        <div className='group block pointer-events-auto   relative h-full overflow-hidden'
                        >
                        
                        <div className='icon-container relative text-eyebrow font-bold text-forest-green uppercase px-4 flex gap-x-2 justify-between items-center overflow-hidden w-full h-full'>
                            <p className='text-eyebrow font-bold uppercase flex-1 text-forest-green text-nowrap overflow-hidden'>
                            show trails
                            </p>
                            <div className="grid basis-0 group-hover:rotate-360 transition-transform duration-300 ease-in-out">
                                <div className='toggle-btn c-icon || inline-block col-1 row-1 text-right opacity-100 '>
                                    <div className='relative before:undefined'>
                                        <div>
                                            <OpenMenuIcon/>
                                        </div>
                                    </div>

                                </div>

                                <div className='toggle-btn c-icon || inline-block col-1 row-1 text-right opacity-0 '>
                                    <div className='relative before:undefined'>
                                        <div>
                                            <CloseMenuIcon/>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            {/* toplogy image */}
                            <img srcSet='./svg/terrian-pattern.svg' alt="topology-image" className='topology-image absolute left-0 top-0 scale-[7] -translate-x-1/4 translate-y-1/2 w-auto h-auto max-w-[200px] max-h-[100px] opacity-0 group-hover:opacity-15 transition-all duration-500  pointer-events-none' />
                        </div>
                         </div>

                    </div>
                </div>

            </div>

               {/* whiskers */}
                        <div className='w-full row-start-2 row-span-1 pointer-events-none inline-flex justify-around h-2.5 || after:inline-block after:w-full after:h-full after:border-r-2 after:mx-4 after:border-r-adventure-yellow || before:inline-block before:mx-4 before:w-full before:h-full before:border-l-2 before:border-l-adventure-yellow  overflow-hidden'
                        ref={whiskersRef}
                        />

                        {/* board */}

                        <div className='row-start-3 row-span-1 bg-adventure-yellow cursor-default! p-5  pointer-events-none'
                        ref={boardRef}>
                            <Sidebar isDropDown/>
                        </div>

        </div>
        
    </div>
  )
}

export  {DropDownBar}