import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

export default function Background() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
          colorA: { value: new THREE.Color("#357ca1") },
          colorB: { value: new THREE.Color("#ffffff") },
        },
        vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 colorA;
          uniform vec3 colorB;
          varying vec3 vWorldPosition;
          void main() {
            float t = (normalize(vWorldPosition).y + 1.0) * 0.5;
            gl_FragColor = vec4(mix(colorB, colorA, t), 1.0);
          }
        `,
      }),
    []
  );

  return (
    <>
      {/* lighting only */}
      <Environment preset="sunset" />

      {/* sky */}
      <mesh scale={[100, 100, 100]}>
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={material} attach="material" />
      </mesh>
    </>
  );
}