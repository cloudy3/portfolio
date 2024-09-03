import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import tokyoScene from "../assets/3d/tokyo.glb";

const Tokyo = ({ scale, position, rotationX, rotationY }) => {
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
      rotation={[rotationX, rotationY, 0]}
    >
      <primitive object={scene} />
    </mesh>
  );
};

const TokyoCanvas = ({ scrollContainer }) => {
  const [rotationX, setRotationX] = useState(-0.04);
  const [rotationY, setRotationY] = useState(-1.65);
  const [scale, setScale] = useState([0.018, 0.018, 0.018]);
  const [position, setPosition] = useState([2, 0.2, -2.5]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = scrollContainer.current?.scrollTop || 0;
      // const rotationXValue = -0.04 + scrollTop * -0.0002;
      const rotationXValue = -0.04;
      const rotationYValue = -1.65 + scrollTop * -0.004;
      setRotationX(rotationXValue);
      setRotationY(rotationYValue);

      // Parallax effect for cat
      const catElement = document.querySelector(".parallax__cat");
      if (catElement) {
        catElement.style.transform = `translateY(-50%) translateX(${
          scrollTop * 0.1
        }px)`;
      }

      // Parallax effect for stars
      const starsElement = document.querySelector(".parallax__stars");
      if (starsElement) {
        starsElement.style.backgroundPosition = `${scrollTop * -0.5}px ${
          scrollTop * 0.5
        }px`;
      }
    };

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScale([0.005, 0.005, 0.005]);
        setPosition([0.2, 0, 0]);
      } else if (window.innerWidth < 1024) {
        setScale([0.008, 0.008, 0.008]);
        setPosition([0.2, 0, 0]);
      } else if (window.innerWidth < 1280) {
        setScale([0.012, 0.012, 0.012]);
        setPosition([0.2, 0, 0]);
      } else if (window.innerWidth < 1536) {
        setScale([0.018, 0.018, 0.018]);
        setPosition([0.2, 0, 0]);
      } else {
        setScale([0.015, 0.015, 0.015]);
        setPosition([2, -0.4, -2.5]);
      }
    };

    handleResize();

    const scrollElement = scrollContainer.current || window;
    scrollElement.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
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
