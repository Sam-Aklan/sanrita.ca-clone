
import HomePageWrapper from './HomePageWrapper'
import { MapWrapper } from '../map-section/MapWrapper'
import MapPreferalMargins from '../map-section/MapPreferalMargins'
import GridLines from '../map-section/GridLines'
import useHomePage from '../../lib/hook/HomePage/useHomePage'
import { Canvas } from '@react-three/fiber'
import Scene from '../Scene'
import { SpotIcon1, SpotIcon2, SpotIcon3 } from '../icons/Spots'
import SpiderIcon from '../icons/SpiderIcon'

const HomePage = () => {
    const {paragraphElementRef, planeRef,scrollProgress,isDesktop}= useHomePage()
  return (
    <div className=" text-white/95 w-full h-full text-2xl font-bold text-center overflow-hidden home-wrapper relative">
        {/* main content */}
        <div className="home-container relative">
          <HomePageWrapper>
            <MapWrapper>

      <div className=" r3f_renderer absolute top-0 left-0 w-full h-full -z-0.5 ">
			<div className="w-full h-full overflow-x-hidden ">

		<Canvas
		 gl={{antialias:true,alpha:true}}
        dpr={Math.min(window.devicePixelRatio,2)} 
        camera={{position:[0,0,0]}}
        style={{ touchAction: 'none' }}
		>
			<Scene mapPlaneRef={planeRef} scrollProgress={scrollProgress}/>
		</Canvas>
			</div>
			</div>
              {isDesktop?<>
              <MapPreferalMargins textRef={paragraphElementRef}/>
              <GridLines />
              </>:undefined}
            </MapWrapper>
          </HomePageWrapper>
        </div>

       
      </div>
  )
}

export default HomePage