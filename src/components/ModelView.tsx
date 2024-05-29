import { OrbitControls, PerspectiveCamera, View } from '@react-three/drei';
import * as THREE from 'three';
import Lights from './Lights';
import { MutableRefObject, Suspense, useMemo } from 'react';

import Loader from './Loader';
import IPhone from './IPhone';

interface ModelViewProps {
  index: number;
  groupRef: MutableRefObject<THREE.Group<THREE.Object3DEventMap>>;
  gsapType: string;
  size: string;
  controlRef: MutableRefObject<any>;
  setRotationState: any;
  item: {
    title: string;
    color: string[];
    img: string;
  };
}
const ModelView: React.FC<ModelViewProps> = ({
  index,
  groupRef,
  gsapType,
  controlRef,
  setRotationState,
  size,
  item,
}) => {
  const scaleProps = useMemo(() => {
    return index === 1 ? [15, 15, 15] : [17, 17, 17];
  }, [index]);

  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
    >
      <ambientLight intensity={0.3} />

      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      <Lights />

      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0, 0)}
        onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
      />

      <group
        ref={groupRef}
        name={`${index === 1} ? 'small' : 'large`}
        position={[0, 0, 0]}
      >
        <Suspense fallback={<Loader />}>
          <IPhone scale={scaleProps} item={item} size={size} />
        </Suspense>
      </group>
    </View>
  );
};

export default ModelView;
