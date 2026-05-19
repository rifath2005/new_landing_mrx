import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { buildCar } from '../lib/carModel';

interface Scene3DProps {
  scrollProgress: number;
  className?: string;
}

export default function Scene3D({ scrollProgress, className }: Scene3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const carRef = useRef<THREE.Group | null>(null);
  const frameRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const userRotRef = useRef({ y: 0, x: 0 });
  const goldLightRef = useRef<THREE.PointLight | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);

  const initScene = useCallback(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth;
    const h = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Environment gradient background via fog
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.04);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(6, 3, 6);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // Ambient
    const ambient = new THREE.AmbientLight(0x1a1a2e, 0.6);
    scene.add(ambient);

    // Key light (cool white from top-front)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(-5, 8, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    scene.add(keyLight);

    // Gold accent light
    const goldLight = new THREE.PointLight(0xd4af37, 3.5, 12);
    goldLight.position.set(-3, 3, -4);
    scene.add(goldLight);
    goldLightRef.current = goldLight;

    // Rim light from behind
    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.8);
    rimLight.position.set(5, 2, -5);
    scene.add(rimLight);
    rimLightRef.current = rimLight as unknown as THREE.PointLight;

    // Ground reflection plane
    const groundGeo = new THREE.PlaneGeometry(20, 20);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.8,
      roughness: 0.3,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Reflection grid lines
    const gridHelper = new THREE.GridHelper(20, 20, 0xd4af37, 0x222222);
    (gridHelper.material as THREE.LineBasicMaterial).transparent = true;
    (gridHelper.material as THREE.LineBasicMaterial).opacity = 0.15;
    scene.add(gridHelper);

    // Car
    const car = buildCar();
    scene.add(car);
    carRef.current = car;

    // Particle field
    const pCount = 300;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 30;
      pPos[i * 3 + 1] = Math.random() * 10;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    return { renderer, scene, camera };
  }, []);

  useEffect(() => {
    const result = initScene();
    if (!result) return;

    const { renderer, camera } = result;

    const onResize = () => {
      const el = mountRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let animTime = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      animTime += 0.008;

      if (goldLightRef.current) {
        goldLightRef.current.intensity = 3.0 + Math.sin(animTime * 1.5) * 0.8;
      }

      if (carRef.current) {
        carRef.current.rotation.y = userRotRef.current.y + Math.sin(animTime * 0.3) * 0.05;
        carRef.current.position.y = Math.sin(animTime * 0.6) * 0.04;
      }

      if (sceneRef.current && cameraRef.current) {
        renderer.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [initScene]);

  // Scroll-driven camera animation
  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    const t = scrollProgress;
    // Phase 0-0.33: fly in from side
    // Phase 0.33-0.66: orbit behind
    // Phase 0.66-1.0: pull back for full overview
    let cx, cy, cz;
    if (t < 0.33) {
      const p = t / 0.33;
      cx = 6 - p * 2;
      cy = 3 + p * 0.5;
      cz = 6 - p * 4;
    } else if (t < 0.66) {
      const p = (t - 0.33) / 0.33;
      cx = 4 + p * 4;
      cy = 3.5 - p * 0.5;
      cz = 2 - p * 6;
    } else {
      const p = (t - 0.66) / 0.34;
      cx = 8 - p * 2;
      cy = 3 + p * 2;
      cz = -4 + p * 8;
    }

    camera.position.set(cx, cy, cz);
    camera.lookAt(0, 0.5, 0);
  }, [scrollProgress]);

  // Mouse drag for manual rotation
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current || !carRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    userRotRef.current.y += dx * 0.01;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    carRef.current.rotation.y = userRotRef.current.y;
  }, []);

  const onMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current || !carRef.current) return;
    const dx = e.touches[0].clientX - lastMouseRef.current.x;
    userRotRef.current.y += dx * 0.01;
    lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    carRef.current.rotation.y = userRotRef.current.y;
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onMouseUp}
      style={{ cursor: 'grab' }}
    />
  );
}
