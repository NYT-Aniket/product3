import {
  Float,
  PerspectiveCamera,
  Text,
  useScroll,
} from "@react-three/drei";
import Background from "../Background";
import { Model as Drone } from "../Drone";
import { Model as Cloud } from "../Cloud";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const LINE_NO = 1000;
const INSTA_URL = "https://www.instagram.com/mrt_aniket/";

const makeRoundedRect = (w, h, r) => {
  const hw = w / 2, hh = h / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  shape.closePath();
  return shape;
};

const CARD_W = 1.3;
const CARD_H = 2.05;
const CARD_R = 0.13;

const TEXT_SECTIONS = [
  {
    position: [-3, 0, -20],
    title: "Welcome.",
    subtitle: "Scroll to fly through my story",
  },
  {
    position: [4, 0.5, -55],
    title: "About Me",
    subtitle: "Passionate developer & designer\ncreating beautiful experiences",
  },
  {
    position: [-4, 0, -105],
    title: "My Skills",
    subtitle: "React  ·  Three.js  ·  UI / UX\nMotion Design  ·  Creative Dev",
  },
  {
    position: [3.5, 0.3, -165],
    title: "Projects",
    subtitle: "Handcrafted with care\nand a lot of ☕",
  },
  {
    position: [-3.5, 0, -225],
    title: "Let's Build",
    subtitle: "Open for collaborations\n& freelance projects",
  },
  {
    position: [0, 0.5, -285],
    title: "Say Hello",
    subtitle: "Find me on Instagram ↓",
  },
];

const IMAGE_SECTIONS = [
  {
    position: [2.8, 0, -80],
    rotation: [0, -0.35, 0],
    image: "/assets/img-1.jpg",
    title: "Portfolio v1",
    subtitle: "2025",
  },
  {
    position: [-3.2, 0.4, -135],
    rotation: [0, 0.35, 0],
    image: "/assets/img-2.jpg",
    title: "Mobile App",
    subtitle: "UI Design",
  },
  {
    position: [3.5, 0, -190],
    rotation: [0, -0.3, 0],
    image: "/assets/img-3.jpg",
    title: "Brand Identity",
    subtitle: "Visual Design",
  },
  {
    position: [-2.8, 0, -250],
    rotation: [0, 0.3, 0],
    image: "/assets/img-4.jpg",
    title: "Web Experience",
    subtitle: "Creative Dev",
  },
];

const clouds = [
  { opacity: 0.5, scale: [0.3, 0.3, 0.3], position: [-2, 1, -3] },
  { opacity: 0.5, scale: [0.2, 0.3, 0.4], position: [-1.5, -0.5, -2] },
  { opacity: 0.7, scale: [0.3, 0.3, 0.4], position: [2, -0.2, -2] },
  { opacity: 0.7, scale: [0.4, 0.4, 0.4], position: [1, -0.2, -12] },
  { opacity: 0.7, scale: [0.5, 0.5, 0.5], position: [-1, 1, -53] },
  { opacity: 0.3, scale: [0.8, 0.8, 0.8], position: [0, 1, -100] },
  { opacity: 0.6, scale: [0.4, 0.4, 0.4], position: [-3, 0.5, -120] },
  { opacity: 0.5, scale: [0.3, 0.3, 0.3], position: [2, -0.5, -140] },
  { opacity: 0.7, scale: [0.5, 0.5, 0.5], position: [-1, 1, -160] },
  { opacity: 0.4, scale: [0.6, 0.6, 0.6], position: [3, 0.2, -180] },
  { opacity: 0.6, scale: [0.4, 0.3, 0.4], position: [-2, -0.3, -200] },
  { opacity: 0.5, scale: [0.5, 0.5, 0.5], position: [1, 0.8, -220] },
  { opacity: 0.7, scale: [0.3, 0.4, 0.3], position: [-4, 0.5, -240] },
  { opacity: 0.4, scale: [0.7, 0.7, 0.7], position: [2, -0.2, -260] },
  { opacity: 0.3, scale: [0.9, 0.9, 0.9], position: [0, 1, -300] },
];

const TextSection = ({ position, title, subtitle }) => (
  <group position={position}>
    <mesh position={[1.6, -0.28, -0.015]}>
      <planeGeometry args={[4, 1.15]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.045} />
    </mesh>

    <Text
      color="#ffffff"
      anchorX="left"
      anchorY="top"
      fontSize={0.46}
      maxWidth={3.9}
      letterSpacing={-0.035}
      lineHeight={1}
      outlineWidth={0.005}
      outlineColor="rgba(0,0,0,0.35)"
    >
      {title}
    </Text>

    <Text
      color="rgba(255,255,255,0.68)"
      anchorX="left"
      anchorY="top"
      fontSize={0.17}
      maxWidth={3.9}
      position={[0, -0.58, 0]}
      lineHeight={1.6}
      letterSpacing={0.01}
      outlineWidth={0.004}
      outlineColor="rgba(0,0,0,0.25)"
    >
      {subtitle}
    </Text>
  </group>
);

const ImageCard = ({ position, rotation = [0, 0, 0], image, title, subtitle }) => {
  const [texture, setTexture] = useState(null);
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();
  const scaleTarget = useRef(1);
  const scaleVec = useRef(new THREE.Vector3(1, 1, 1));

  useEffect(() => {
    new THREE.TextureLoader().load(image, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      const cardAspect = CARD_W / CARD_H;
      const imgAspect = t.image.width / t.image.height;

      if (imgAspect > cardAspect) {
        const s = cardAspect / imgAspect;
        t.repeat.set(s, 1);
        t.offset.set((1 - s) / 2, 0);
      } else {
        const s = imgAspect / cardAspect;
        t.repeat.set(1, s);
        t.offset.set(0, (1 - s) / 2);
      }

      t.needsUpdate = true;
      setTexture(t);
    });
  }, [image]);

  const gradientTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 512;
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.42, "rgba(0,0,0,0)");
    g.addColorStop(0.78, "rgba(0,0,0,0.78)");
    g.addColorStop(1, "rgba(0,0,0,0.94)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 512);
    return new THREE.CanvasTexture(c);
  }, []);

  const cardShape = useMemo(() => makeRoundedRect(CARD_W, CARD_H, CARD_R), []);
  const glowShape = useMemo(
    () => makeRoundedRect(CARD_W + 0.06, CARD_H + 0.06, CARD_R + 0.03),
    []
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    scaleTarget.current = THREE.MathUtils.lerp(
      scaleTarget.current,
      hovered ? 1.07 : 1.0,
      delta * 14
    );
    const s = scaleTarget.current;
    scaleVec.current.set(s, s, s);
    groupRef.current.scale.copy(scaleVec.current);
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.006]}>
        <shapeGeometry args={[glowShape]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={hovered ? 0.3 : 0.09} />
      </mesh>

      {texture && (
        <mesh>
          <shapeGeometry args={[cardShape]} />
          <meshBasicMaterial map={texture} />
        </mesh>
      )}

      <mesh position={[0, 0, 0.001]}>
        <shapeGeometry args={[cardShape]} />
        <meshBasicMaterial map={gradientTex} transparent depthWrite={false} />
      </mesh>

      <Text
        color="#ffffff"
        anchorX="left"
        anchorY="bottom"
        fontSize={0.155}
        maxWidth={CARD_W - 0.22}
        position={[-CARD_W / 2 + 0.14, -CARD_H / 2 + 0.29, 0.007]}
        letterSpacing={-0.028}
      >
        {title}
      </Text>

      <Text
        color="rgba(255,255,255,0.55)"
        anchorX="left"
        anchorY="bottom"
        fontSize={0.1}
        maxWidth={CARD_W - 0.22}
        position={[-CARD_W / 2 + 0.14, -CARD_H / 2 + 0.15, 0.007]}
        letterSpacing={0.015}
      >
        {subtitle}
      </Text>

      <Text
        color={hovered ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.28)"}
        anchorX="right"
        anchorY="bottom"
        fontSize={0.078}
        position={[CARD_W / 2 - 0.12, -CARD_H / 2 + 0.15, 0.007]}
        letterSpacing={0.03}
      >
        VIEW ↗
      </Text>

      <mesh
        onClick={() => window.open(INSTA_URL, "_blank")}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <shapeGeometry args={[cardShape]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
};

export const Experience = () => {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, -10),
          new THREE.Vector3(-2, 0, -20),
          new THREE.Vector3(-3, 0, -30),
          new THREE.Vector3(0, 0, -40),
          new THREE.Vector3(5, 0, -50),
          new THREE.Vector3(7, 0, -60),
          new THREE.Vector3(5, 0, -70),
          new THREE.Vector3(0, 0, -80),
          new THREE.Vector3(0, 0, -90),
          new THREE.Vector3(0, 0, -100),
          new THREE.Vector3(-3, 0, -120),
          new THREE.Vector3(-5, 0, -140),
          new THREE.Vector3(0, 0, -160),
          new THREE.Vector3(5, 0, -180),
          new THREE.Vector3(3, 0, -200),
          new THREE.Vector3(0, 0, -220),
          new THREE.Vector3(-4, 0, -240),
          new THREE.Vector3(0, 0, -260),
          new THREE.Vector3(0, 0, -300),
        ],
        false,
        "catmullrom",
        0.5
      ),
    []
  );

  const linePoints = useMemo(() => curve.getPoints(LINE_NO), [curve]);
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -2);
    s.lineTo(0, 0.2);
    return s;
  }, []);

  const cameraGroup = useRef();
  const drone = useRef();
  const scroll = useScroll();

  useFrame((_, delta) => {
    const curPointIndex = Math.min(
      Math.round(scroll.offset * linePoints.length),
      linePoints.length - 1
    );
    const curPoint = linePoints[curPointIndex];
    const pointAhead = linePoints[Math.min(curPointIndex + 1, linePoints.length - 1)];

    const xDisplacement = (pointAhead.x - curPoint.x) * 24;
    const targetAngle = THREE.MathUtils.clamp(
      xDisplacement / 30,
      -Math.PI / 4,
      Math.PI / 4
    );

    if (drone.current) {
      drone.current.rotation.z = THREE.MathUtils.lerp(
        drone.current.rotation.z,
        targetAngle,
        delta * 2
      );
    }

    if (cameraGroup.current) {
      cameraGroup.current.position.lerp(curPoint, delta * 24);
    }
  });

  return (
    <>
      <group ref={cameraGroup}>
        <Background />
        <PerspectiveCamera position={[0, 0, 5]} fov={39} makeDefault />

        <group ref={drone} position={[0, 0.85, 0]}>
          <Float floatIntensity={0.35} speed={2.7}>
            <Drone
              scale={0.11}
              position-y={-0.8}
              rotation-y={Math.PI}
            />
          </Float>
        </group>
      </group>

      {TEXT_SECTIONS.map((s, i) => (
        <TextSection key={`t${i}`} {...s} />
      ))}
      {IMAGE_SECTIONS.map((s, i) => (
        <ImageCard key={`c${i}`} {...s} />
      ))}

      <group position={[0, -5, 0]}>
        <mesh>
          <extrudeGeometry
            args={[shape, { steps: LINE_NO, bevelEnabled: false, extrudePath: curve }]}
          />
          <meshStandardMaterial color="lightblue" opacity={0.7} transparent />
        </mesh>
      </group>

      {clouds.map((props, i) => (
        <Cloud key={i} {...props} />
      ))}
    </>
  );
};