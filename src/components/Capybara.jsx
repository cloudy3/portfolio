import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";

import capybaraScene from "../assets/3d/capybara.glb";

const Capybara = ({ scale, position }) => {
  const capybaraRef = useRef();
  const { scene, animations } = useGLTF(capybaraScene);
  const { actions } = useAnimations(animations, capybaraRef);

  useEffect(() => {
    actions["Idle"].play();
  }, [actions]);

  return (
    <mesh
      ref={capybaraRef}
      position={position}
      scale={scale}
      rotation={[-0.3, 0, 3]}
    >
      <primitive object={scene} />
    </mesh>
  );
};

const CapybaraCanvas = ({ scrollContainer }) => {};

export default CapybaraCanvas;
