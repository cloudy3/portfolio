"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { detectWebGLSupport } from "@/lib/webgl";

export { detectWebGLSupport };

// Cloud sprite system using procedural cloud texture
function CloudParticleSystem({ count = 400 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Create cloud texture procedurally
  const cloudTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    // Create gradient for cloud-like appearance with blue tinge
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(240, 248, 255, 1)"); // Alice blue center
    gradient.addColorStop(0.3, "rgba(230, 240, 255, 0.9)"); // Light blue
    gradient.addColorStop(0.6, "rgba(200, 220, 255, 0.6)"); // Sky blue
    gradient.addColorStop(0.8, "rgba(180, 200, 240, 0.3)"); // Deeper blue
    gradient.addColorStop(1, "rgba(160, 180, 220, 0)"); // Fade to transparent blue

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    // Add some noise for more realistic cloud texture
    const imageData = ctx.getImageData(0, 0, 64, 64);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 0.1;
      data[i + 3] *= 1 - noise; // Modify alpha channel
    }

    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Generate cloud sprites
  const cloudSprites = useMemo(() => {
    const sprites = [];
    for (let i = 0; i < count; i++) {
      // Create cloud-like distribution in layers
      const layer = Math.floor(Math.random() * 4);
      const layerHeight = layer * 6 - 12;

      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 20 + 8;
      const clusterOffset = (Math.random() - 0.5) * 8;

      sprites.push({
        position: [
          Math.cos(angle) * radius + clusterOffset,
          layerHeight + (Math.random() - 0.5) * 3,
          Math.sin(angle) * radius + clusterOffset - 8,
        ] as [number, number, number],
        scale: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.2,
        speed: Math.random() * 0.5 + 0.2,
      });
    }
    return sprites;
  }, [count]);

  // Mouse interaction
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouseRef.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Animate each cloud sprite
    groupRef.current.children.forEach((child, index) => {
      if (child instanceof THREE.Sprite) {
        const sprite = cloudSprites[index];
        const speed = sprite.speed;

        // Organic movement
        child.position.x =
          sprite.position[0] + Math.sin(time * speed + index) * 1.2;
        child.position.y =
          sprite.position[1] + Math.cos(time * speed * 0.7 + index) * 0.6;
        child.position.z =
          sprite.position[2] + Math.sin(time * speed * 0.5 + index) * 0.4;

        // Gentle horizontal drift
        child.position.x += time * 0.1;

        // Reset if drifted too far
        if (child.position.x > 30) {
          child.position.x = -30;
        }

        // Mouse influence
        const mouseInfluence = 0.5;
        const mouseDistanceX = mouseRef.current.x * 10 - child.position.x;
        const mouseDistanceY = mouseRef.current.y * 10 - child.position.y;
        const mouseDistance = Math.sqrt(
          mouseDistanceX * mouseDistanceX + mouseDistanceY * mouseDistanceY
        );
        const mouseEffect = Math.max(0, 1 - mouseDistance / 8) * mouseInfluence;

        child.position.x += mouseDistanceX * mouseEffect * 0.01;
        child.position.y += mouseDistanceY * mouseEffect * 0.008;
      }
    });
  });

  if (!cloudTexture) return null;

  return (
    <group ref={groupRef}>
      {cloudSprites.map((sprite, index) => (
        <sprite
          key={index}
          position={sprite.position}
          scale={[sprite.scale, sprite.scale, 1]}
        >
          <spriteMaterial
            map={cloudTexture}
            transparent
            opacity={sprite.opacity}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

// Individual cloud component made of multiple spheres
function CloudCluster({
  position,
  scale,
  speed,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  speed: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate multiple spheres to create a cloud-like cluster
  const sphereData = useMemo(() => {
    const spheres = [];
    const numSpheres = 12 + Math.floor(Math.random() * 8); // 12-20 spheres per cloud

    for (let i = 0; i < numSpheres; i++) {
      // Create more organic distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2.5;
      const height = (Math.random() - 0.5) * 1.5;

      spheres.push({
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        scale: 0.4 + Math.random() * 0.8, // Varying sizes
        opacity: 0.15 + Math.random() * 0.25,
      });
    }
    return spheres;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Organic floating movement for the entire cloud
    groupRef.current.position.x = position[0] + Math.sin(time * speed) * 1.5;
    groupRef.current.position.y =
      position[1] + Math.cos(time * speed * 0.7) * 0.8;
    groupRef.current.position.z =
      position[2] + Math.sin(time * speed * 0.5) * 0.5;

    // Subtle rotation
    groupRef.current.rotation.y = time * speed * 0.03;
    groupRef.current.rotation.z = Math.sin(time * speed * 0.3) * 0.02;

    // Breathing effect
    const breathe = 1 + Math.sin(time * speed * 0.8) * 0.08;
    groupRef.current.scale.set(
      scale[0] * breathe,
      scale[1] * breathe,
      scale[2] * breathe
    );

    // Animate individual spheres within the cloud for organic movement
    groupRef.current.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh) {
        const sphereSpeed = speed * (0.3 + index * 0.05);
        const originalPos = sphereData[index].position;
        child.position.x =
          originalPos[0] + Math.sin(time * sphereSpeed + index) * 0.15;
        child.position.y =
          originalPos[1] + Math.cos(time * sphereSpeed * 0.8 + index) * 0.1;
        child.position.z =
          originalPos[2] + Math.sin(time * sphereSpeed * 0.6 + index) * 0.08;
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {sphereData.map((sphere, index) => (
        <mesh key={index} position={sphere.position}>
          <sphereGeometry args={[sphere.scale, 16, 12]} />
          <meshLambertMaterial
            color="#e6f3ff"
            opacity={sphere.opacity}
            transparent
            fog={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Floating cloud shapes component
function FloatingClouds() {
  const cloudData = useMemo(
    () => [
      {
        position: [-8, 4, -12] as [number, number, number],
        scale: [1.5, 1.0, 1.2] as [number, number, number],
        speed: 0.3,
      },
      {
        position: [6, -1, -15] as [number, number, number],
        scale: [1.8, 1.2, 1.4] as [number, number, number],
        speed: 0.25,
      },
      {
        position: [-3, 6, -18] as [number, number, number],
        scale: [1.6, 1.1, 1.3] as [number, number, number],
        speed: 0.35,
      },
      {
        position: [10, 2, -10] as [number, number, number],
        scale: [1.4, 0.9, 1.1] as [number, number, number],
        speed: 0.28,
      },
      {
        position: [-12, -3, -20] as [number, number, number],
        scale: [2.0, 1.3, 1.6] as [number, number, number],
        speed: 0.22,
      },
    ],
    []
  );

  return (
    <>
      {cloudData.map((data, index) => (
        <CloudCluster
          key={index}
          position={data.position}
          scale={data.scale}
          speed={data.speed}
        />
      ))}
    </>
  );
}

// Loading fallback component
function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white opacity-50"></div>
    </div>
  );
}

// Fallback component for unsupported browsers
function WebGLFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-3000"></div>
      </div>
    </div>
  );
}

// Main ThreeScene component
interface ThreeSceneProps {
  className?: string;
  particleCount?: number;
  enableClouds?: boolean;
}

export default function ThreeScene({
  className = "",
  particleCount = 800,
  enableClouds = true,
}: ThreeSceneProps) {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setWebGLSupported(detectWebGLSupport());

    // Detect mobile devices for performance optimization
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
          userAgent
        );
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show loading state while checking WebGL support
  if (webGLSupported === null) {
    return (
      <div className={`relative ${className}`}>
        <SceneLoader />
      </div>
    );
  }

  // Show fallback if WebGL is not supported
  if (!webGLSupported) {
    return (
      <div className={`relative ${className}`}>
        <WebGLFallback />
      </div>
    );
  }

  // Optimize settings for mobile devices
  const optimizedParticleCount = isMobile
    ? Math.min(particleCount * 0.4, 300)
    : particleCount;
  const optimizedClouds = isMobile ? false : enableClouds;
  const pixelRatio: [number, number] = isMobile ? [1, 1.5] : [1, 2];

  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: !isMobile, // Disable antialiasing on mobile for performance
          alpha: true,
          powerPreference: isMobile ? "low-power" : "high-performance",
          stencil: false,
          depth: false,
        }}
        dpr={pixelRatio} // Reduced pixel ratio for mobile
        performance={{ min: isMobile ? 0.3 : 0.5 }} // Lower performance threshold for mobile
        frameloop={isMobile ? "demand" : "always"} // Reduce frame rate on mobile when not interacting
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} color="#e6f3ff" />
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.3}
            color="#ffffff"
          />
          <directionalLight
            position={[-5, 5, 10]}
            intensity={0.15}
            color="#87ceeb"
          />
          <CloudParticleSystem count={optimizedParticleCount} />
          {optimizedClouds && <FloatingClouds />}
        </Suspense>
      </Canvas>
    </div>
  );
}
