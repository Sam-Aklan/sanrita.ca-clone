import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import gsap from "gsap";
import * as THREE from "three";
import { ReactLenis, type LenisRef } from "lenis/react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import HomePageWrapper from "./components/HomePageWrapper";
import { MapWrapper } from "./components/map-section/MapWrapper";
import MapPreferalMargins from "./components/map-section/MapPreferalMargins";
import GridLines from "./components/map-section/GridLines";
import CSSPlugin from "gsap/CSSPlugin";
gsap.registerPlugin(ScrollTrigger, useGSAP,CSSPlugin);


const App = () => {
  const lenisRef = useRef<LenisRef>(null);
  const planeRef = useRef<THREE.PlaneGeometry>(null);
  const scrollProgress = useRef({ value: 0 });
  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  useGSAP(() => {
    gsap.to(scrollProgress.current, {
      value: 1,
      scrollTrigger: {
        trigger: ".home-container",
        start: "top top",
        end: `+=${window.innerWidth * 2.5}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: ({ progress }) => {
          gsap.to([".c-main", ".c-main .c-icons", ".c-main .c-title"], {
            "--scroll-aside": 350 * progress,
            "--scroll-normalized": progress,
            "--scroll-value": progress,
          });

          gsap.to(".c-home-wrapper .creative-studio",{
             "--scroll-aside-title-translate-x":15 * progress,
            "--scroll-aside-title-translate-y":15 * progress,
            "--scroll-aside-title": -10 + 390 * progress,
          })

          gsap.to(["article.c-home_grid-content","article.c-home_grid-lines "],{
            "--scroll-wrapper-padding":40 - 40 *progress,
            "--scroll-wrapper-opacity":100 - 100 *progress,
            "--scroll-gridlines-opacity":100 - 100 * progress,
          })

        },
        
      },
    });
  });
  return (
    <ReactLenis>
      <div className=" text-white/95 w-full h-full text-2xl font-bold text-center overflow-hidden">
        {/* main content */}
        <div className="home-container">
          <HomePageWrapper>
            <MapWrapper>
              <MapPreferalMargins />
              <GridLines />
            </MapWrapper>
          </HomePageWrapper>
        </div>

        {/* <div className=" r3f_renderer absolute top-0 left-0 w-full h-full">
			<div className="w-full h-full overflow-x-hidden">

		<Canvas
		 gl={{antialias:true,alpha:true}}
        dpr={Math.min(window.devicePixelRatio,2)} 
        camera={{position:[0,0,0]}}
		>
			<Scene mapPlaneRef={planeRef} scrollProgress={scrollProgress}/>
		</Canvas>
			</div>
			</div> */}
      </div>
    </ReactLenis>
  );
};

export default App;
