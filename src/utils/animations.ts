import gsap from 'gsap';
import { MutableRefObject } from 'react';
import * as THREE from 'three';
import { ScrollTrigger } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);

interface AnimateWithGsapTimelineProps {
  timeline: gsap.core.Timeline;
  rotationRef: MutableRefObject<THREE.Group<THREE.Object3DEventMap>>;
  firstTarget: string;
  secondTarget: string;
  rotationState: any;
  animationProps: any;
}

export const animateWithGsapTimeline = ({
  timeline,
  rotationRef,
  rotationState,
  firstTarget,
  secondTarget,
  animationProps,
}: AnimateWithGsapTimelineProps) => {
  timeline.to(rotationRef.current.rotation, {
    y: rotationState,
    duration: 1,
    ease: 'power2.inOut',
  });

  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: 'power2.inOut',
    },
    '<'
  );

  timeline.to(
    secondTarget,
    {
      ...animationProps,
      ease: 'power2.inOut',
    },
    '<'
  );
};

export const animateWithGsap = (
  target: string,
  animationProps: gsap.TweenVars,
  scrollProps?: ScrollTrigger.Vars
) => {
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: 'restart reverse restart reverse',
      start: 'top 85%',
      ...scrollProps,
    },
  });
};
