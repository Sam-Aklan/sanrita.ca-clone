import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import CSSPlugin from "gsap/CSSPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from 'three'
import useWindowSize from "../useWindowSize";
gsap.registerPlugin(ScrollTrigger, useGSAP,CSSPlugin,SplitText);

const useHomePage = () => {
      const planeRef = useRef<THREE.PlaneGeometry>(null);
    const {isDesktop} = useWindowSize()
    const paragraphElementRef = useRef<HTMLParagraphElement>(null)
  const scrollProgress = useRef({ value: 0 });
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
        // snap:{
        //   snapTo:1.,
        //   delay:.01,
        //   inertia:false,
        // }
        
      },
    });
  },{dependencies:[]});
  return {paragraphElementRef,planeRef,scrollProgress,isDesktop}
}

export default useHomePage