import { Canvas } from "@react-three/fiber";
import Scene from './components/Scene'
import gsap from "gsap";
import * as THREE from 'three'
import { ReactLenis, type LenisRef } from "lenis/react";
import {useGSAP} from '@gsap/react'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
gsap.registerPlugin(ScrollTrigger,useGSAP)


const App = () => {
	const lenisRef = useRef<LenisRef>(null);
	const planeRef = useRef<THREE.PlaneGeometry>(null)
	const scrollProgress = useRef({ value: 0 })
  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  useGSAP(()=>{
	gsap.to(scrollProgress.current, {
		value: 1,
		scrollTrigger:{
			trigger:".r3f_renderer",
			start:"top top",
			end: `+=${window.innerWidth*3}px`,
			pin:true,
			pinSpacing:true,
			scrub:1,
		}
	})
  })
	return (
		<ReactLenis>
			<div className=" text-white/95 w-full h-full text-2xl font-bold text-center overflow-hidden">
		
		
		{/* main content */}

		{/* <HomePageWrapper>
			<MapWrapper>
				<MapPreferalMargins/>
				<GridLines/>
			</MapWrapper>
		</HomePageWrapper> */}
		
				<div className=" r3f_renderer absolute top-0 left-0 w-full h-full">
			<div className="w-full h-full overflow-x-hidden">

		<Canvas
		 gl={{antialias:true,alpha:true}}
        dpr={Math.min(window.devicePixelRatio,2)} 
        camera={{position:[0,0,0]}}
		>
			<Scene mapPlaneRef={planeRef} scrollProgress={scrollProgress}/>
		</Canvas>
			</div>
			</div>
		</div>
		</ReactLenis>
		
	);
};

export default App;
