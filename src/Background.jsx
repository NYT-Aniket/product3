import React from 'react'
import { Environment, Sphere } from "@react-three/drei";
import { Gradient, LayerMaterial } from 'lamina';
import * as THREE from 'three';

const Background = () => {
  return (
    <>
    <Environment files="/venice_sunset_1k.hdr" />

      <Sphere scale={[100, 100, 100]} rotation={[Math.PI / 25, 0, 0]}>
        <LayerMaterial
          lighting="physical"
          transmission={0.5}
          side={THREE.BackSide}
        >
          <Gradient 
            colorA="#357ca1"
            colorB="white"
            axes={"y"}
            start={0}
            end={-0.5}
          />
        </LayerMaterial>
      </Sphere>
    </>
  )
}

export default Background;