import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import tokyoScene from "../assets/3d/tokyo.glb";

const Tokyo = ({ scale, position }) => {
  const tokyoRef = useRef();
  const { scene, animations } = useGLTF(tokyoScene);
  const { actions } = useAnimations(animations, tokyoRef);

  useEffect(() => {
    actions["Take 001"].play();
  }, [actions]);

  return (
    <mesh
      ref={tokyoRef}
      position={position}
      scale={scale}
      rotation={[-0.04, -2.05, 0]}
    >
      <primitive object={scene} />
    </mesh>
  );
};

const TokyoCanvas = ({ scrollContainer }) => {
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [scale, setScale] = useState([0.5, 0.5, 0.5]);
  const [position, setPosition] = useState([0, 0, -3]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = scrollContainer.current.scrollTop;
      const rotationXValue = scrollTop * -0.0006;
      const rotationYValue = scrollTop * -0.00075;
      setRotationX(rotationXValue);
      setRotationY(rotationYValue);
    };

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScale([0.5, 0.5, 0.5]);
        setPosition([0.2, -0.1, 0]);
      } else if (window.innerWidth < 1024) {
        setScale([0.65, 0.65, 0.65]);
        setPosition([0.2, -0.3, 0]);
      } else if (window.innerWidth < 1280) {
        setScale([0.8, 0.8, 0.8]);
        setPosition([0.2, -0.4, 0]);
      } else if (window.innerWidth < 1536) {
        setScale([0.5, 0.5, 0.5]);
        setPosition([0.2, -0.5, 0]);
      } else {
        setScale([0.02, 0.02, 0.02]);
        setPosition([-0.1, 0.7, -2.5]);
      }
    };

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollContainer]);

  return (
    <Canvas
      className={`w-full h-screen bg-transparent z-10`}
      camera={{ near: 0.1, far: 1000 }}
    >
      <Suspense>
        <directionalLight position={[1, 1, 1]} intensity={2} />
        <ambientLight intensity={1} />
        <hemisphereLight
          skyColor="#ffcd74"
          groundColor="#add8e6"
          intensity={1}
        />
        <Tokyo
          rotationX={rotationX}
          rotationY={rotationY}
          scale={scale}
          position={position}
        />
      </Suspense>
    </Canvas>
  );
};

export default TokyoCanvas;
