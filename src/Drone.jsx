import React, { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function MiniCamera() {
  return (
    <group position={[0, -0.42, 0.06]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.045, 0.07, 24]} />
        <meshStandardMaterial color="#101214" metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.03, 0.045]}>
        <boxGeometry args={[0.08, 0.04, 0.06]} />
        <meshStandardMaterial color="#1a1d22" metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[0, -0.035, 0.085]}>
        <sphereGeometry args={[0.018, 18, 18]} />
        <meshStandardMaterial
          color="#1f2a33"
          metalness={0.1}
          roughness={0.15}
          emissive="#0a0d10"
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh position={[0, -0.055, 0.02]}>
        <cylinderGeometry args={[0.008, 0.008, 0.08, 12]} />
        <meshStandardMaterial color="#2a2f35" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

export function Model(props) {
  const { nodes, materials } = useGLTF("/models/airplane/Drone.glb");

  const rotor1 = useRef();
  const rotor2 = useRef();
  const rotor3 = useRef();
  const rotor4 = useRef();

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d9d9d9",
        metalness: 0.35,
        roughness: 0.55,
      }),
    []
  );

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#111111",
        metalness: 0.15,
        roughness: 0.7,
      }),
    []
  );

  useFrame((_, delta) => {
    const speed = delta * 10;
    if (rotor1.current) rotor1.current.rotation.y += speed;
    if (rotor2.current) rotor2.current.rotation.y -= speed;
    if (rotor3.current) rotor3.current.rotation.y += speed;
    if (rotor4.current) rotor4.current.rotation.y -= speed;
  });

  return (
    <group {...props} dispose={null} scale={0.11}>
      {nodes.Plane && (
        <mesh geometry={nodes.Plane.geometry} material={materials["Material.001"]} />
      )}

      {nodes.Cylinder && (
        <mesh
          geometry={nodes.Cylinder.geometry}
          material={accentMaterial}
          position={[0.35, 0.343, 0.615]}
        />
      )}

      {nodes.Cylinder001 && (
        <mesh geometry={nodes.Cylinder001.geometry} material={bodyMaterial}>
          {nodes.Cylinder002 && (
            <mesh geometry={nodes.Cylinder002.geometry} material={bodyMaterial}>
              {nodes.Circle && (
                <mesh
                  ref={rotor1}
                  geometry={nodes.Circle.geometry}
                  material={accentMaterial}
                  position={[0.537, 0, -0.067]}
                  rotation={[0, -Math.PI / 4, 0]}
                >
                  {nodes.Circle002_1 && (
                    <mesh
                      ref={rotor2}
                      geometry={nodes.Circle002_1.geometry}
                      material={accentMaterial}
                      position={[-0.333, 0, 0.427]}
                      rotation={[0, Math.PI / 4, 0]}
                    />
                  )}
                </mesh>
              )}

              {nodes.Circle001 && (
                <mesh
                  ref={rotor3}
                  geometry={nodes.Circle001.geometry}
                  material={accentMaterial}
                  position={[0.537, 0, -0.067]}
                  rotation={[0, -Math.PI / 4, 0]}
                />
              )}

              {nodes.Circle002 && (
                <mesh
                  ref={rotor4}
                  geometry={nodes.Circle002.geometry}
                  material={accentMaterial}
                  position={[-0.333, 0, 0.427]}
                  rotation={[0, Math.PI / 4, 0]}
                />
              )}
            </mesh>
          )}
        </mesh>
      )}

      <MiniCamera />
    </group>
  );
}

useGLTF.preload("/models/airplane/Drone.glb");