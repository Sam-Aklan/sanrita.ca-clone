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
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, useGSAP,CSSPlugin,SplitText);


const App = () => {
  const lenisRef = useRef<LenisRef>(null);
  const planeRef = useRef<THREE.PlaneGeometry>(null);
  const paragraphElementRef = useRef<HTMLParagraphElement>(null)
  const scrollProgress = useRef({ value: 0 });
  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  useGSAP(() => {
    if (!paragraphElementRef.current) return;
    const split = new SplitText(paragraphElementRef.current,{type:"chars",charsClass:'char',});
    split.chars.forEach(char=>{
      char.innerHTML = `<span>${char.innerHTML}</span>`
    })
 
    const chars = paragraphElementRef.current.querySelectorAll(".char span");

    gsap.set(chars,{
      transformOrigin:"center bottom",
      transform:"scaleX(1) scaleY(1)",
      display:"inline-block",
      opacity:1
    })
    // console.log(chars)
    gsap.to(scrollProgress.current, {
      value: 1,
      scrollTrigger: {
        trigger: ".home-wrapper",
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
          const mapper = gsap.utils.mapRange(.15,.85,1.,0.);
          const mappedProgress = gsap.utils.clamp(0,1,mapper(progress));

          gsap.to(chars,{
             transform:`scaleX(${mappedProgress}) scaleY(${gsap.utils.clamp(0.4,1.,mappedProgress)})`,
            opacity:mappedProgress,
            stagger:.08
          })

        },
        snap:{
          snapTo:1.,
          delay:.01,
          inertia:false,
        }
        
      },
    });
  });
  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false }}>
      <div className=" text-white/95 w-full h-full text-2xl font-bold text-center overflow-hidden home-wrapper relative">
        {/* main content */}
        <div className="home-container relative">
          <HomePageWrapper>
            <MapWrapper>
               <div className=" r3f_renderer absolute top-0 left-0 w-full h-full -z-0.5">
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
              <MapPreferalMargins textRef={paragraphElementRef}/>
              <GridLines />
            </MapWrapper>
          </HomePageWrapper>
        </div>

       
      </div>
    </ReactLenis>
  );
};

export default App;
