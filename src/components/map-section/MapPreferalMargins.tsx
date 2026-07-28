import CompassIcon from "../icons/CompassIcon"
import LeftGraduated from "../icons/LeftGraduated"
import RightGraduated from "../icons/RightGraduated"
import SpiderIcon from "../icons/SpiderIcon"

const MapPreferalMargins = () => {
  return (
    <article className="c-home_grid-content || col-1 row-1 grid grid-cols-(--grid-content-cols) grid-rows-(--grid-content-rows) w-full h-full relative overflow-clip page-home-module__mOmtjG__c-home_grid-content">
        {/* top */}
        <div className="c-home_grid-content_row-1 || desktop-only col-span-3 row-span-1 opacity-(--scroll-wrapper-opacity)">
            <div className="grid grid-cols-4 justify-around w-[calc(100%-55px*2)] h-full mx-auto place-items-center [&>p]:text-terrain-grey [&>p]:text-[10px] text-center">
                <p><SpiderIcon/></p>
                <p>19:35:23 GMT</p>
                <p>EST.2024</p>
                <p><CompassIcon/></p>
            </div>
        </div>
        {/* left */}
        <div className="c-home_grid-content_col-1 || desktop-only col-span-1 row-start-2 row-span-1 [writing-mode:vertical-lr] text-center place-self-center rotate-180 uppercase text-terrain-grey opacity-(--scroll-wrapper-opacity)"><p className="tracking-[0.3em] text-[10px] flex flex-col-reverse text-terrain-grey"><span>Design &amp; development</span> <span>Purveyors</span></p></div>
        {/* right */}
        <div className="c-home_grid-content_col-3 || desktop-only col-start-3 col-span-1 row-start-2 row-span-1 [writing-mode:vertical-lr] text-center place-self-center rotate-0 uppercase text-terrain-grey opacity-(--scroll-wrapper-opacity)">
            <p className="tracking-[0.3em] text-[10px] flex flex-col">
                <span>hand-crafted</span> 
                <span>digital design Refuge</span>
                </p>
            </div>
        {/* bottom */}
        <div className="c-home_grid-content_row-3 || desktop-only col-span-3 row-start-3 row-span-1 opacity-(--scroll-wrapper-opacity)">
        <div className="grid grid-cols-4 justify-around w-[calc(100%-45px*2)] h-full mx-auto place-items-center [&>p]:text-terrain-grey [&>p]:text-[10px] [&>p]:flex [&>p]:flex-col [&>p]:tracking-[0.3em] text-center uppercase">
            <p className="justify-self-start -translate-x-5">
                <LeftGraduated/>
            </p>
            <p className="text-terrain-grey">
                <span>Gold idEAs</span> <span>seekers</span>
            </p>
            <p className="text-terrain-grey"><span>Republic of</span> <span>collaborative minds</span></p>
            <p className="justify-self-end -translate-x-5">
                <RightGraduated/>
            </p>
        </div>
        </div>
        {/* center */}

        <div className="c-home_grid-content_map || grid col-start-2 col-span-1 row-start-2 row-span-1 relative w-full h-full">
            <div className="c-scroll_warn | col-1 row-1 relative z-12 place-content-center text-center pointer-events-none!">
                <p className="text-h1-like text-adventure-yellow uppercase">
                    scroll to enter the world
                </p>

              
            </div>
              <div className="relative z-10 col-1 row-1 w-full h-full touch-none pointer-events-auto"/>
        </div>
    </article>
  )
}

export default MapPreferalMargins