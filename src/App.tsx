import { Canvas } from "@react-three/fiber";
import Scene from './components/Scene'
import HomePageWrapper from "./components/HomePageWrapper";
import { MapWrapper } from "./components/map-section/MapWrapper";
import MapPreferalMargins from "./components/map-section/MapPreferalMargins";
import GridLines from "./components/map-section/GridLines";
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
  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);
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
		
				<div className="absolute top-0 left-0 w-full h-full  overflow-hidden">

		<Canvas
		 gl={{antialias:true,alpha:true}}
        dpr={Math.min(window.devicePixelRatio,2)} 
        camera={{position:[0,0,0]}}
		>
			<Scene mapPlane={planeRef}/>
		</Canvas>
			</div>
		</div>
		</ReactLenis>
		
	);
};

export default App;
