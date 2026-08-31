"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LoginScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.15, 6.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      mount.classList.add("login-scene-unavailable");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.set(-0.16, 0.48, 0.05);
    scene.add(group);

    const bag = new THREE.Mesh(
      new THREE.BoxGeometry(2.25, 2.45, 0.72, 4, 4, 2),
      new THREE.MeshStandardMaterial({ color: "#14634a", metalness: 0.18, roughness: 0.4 }),
    );
    bag.scale.set(1, 1, 0.82);
    group.add(bag);

    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.11, 18, 48, Math.PI),
      new THREE.MeshStandardMaterial({ color: "#e07a2d", metalness: 0.3, roughness: 0.28 }),
    );
    handle.rotation.z = Math.PI;
    handle.position.y = 1.12;
    group.add(handle);

    const mark = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.34, 0.1, 72, 12),
      new THREE.MeshStandardMaterial({ color: "#f6dfbc", metalness: 0.35, roughness: 0.25 }),
    );
    mark.position.z = 0.42;
    group.add(mark);

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.72, 1.72, 0.22, 48),
      new THREE.MeshStandardMaterial({ color: "#f0c99a", roughness: 0.56 }),
    );
    pedestal.position.y = -1.55;
    group.add(pedestal);

    const ambient = new THREE.HemisphereLight("#fff6e9", "#14634a", 1.8);
    const keyLight = new THREE.DirectionalLight("#ffffff", 2.8);
    keyLight.position.set(3, 4, 5);
    const warmLight = new THREE.PointLight("#e07a2d", 22, 10);
    warmLight.position.set(-2.8, 0.4, 2.2);
    scene.add(ambient, keyLight, warmLight);

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    mount.addEventListener("pointermove", onPointerMove);
    resize();

    let frameId = 0;
    const render = (time: number) => {
      if (!reducedMotion) {
        group.rotation.y += (0.48 + pointer.x * 0.18 - group.rotation.y) * 0.035;
        group.rotation.x += (-0.16 - pointer.y * 0.12 - group.rotation.x) * 0.035;
        group.position.y = Math.sin(time * 0.0012) * 0.08;
        mark.rotation.set(time * 0.00045, time * 0.0007, 0);
      }
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };
    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      bag.geometry.dispose();
      handle.geometry.dispose();
      mark.geometry.dispose();
      pedestal.geometry.dispose();
      [bag, handle, mark, pedestal].forEach((mesh) => mesh.material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="login-scene" aria-hidden="true" />;
}