import { MutableRefObject } from 'react';
import * as THREE from 'three';

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
