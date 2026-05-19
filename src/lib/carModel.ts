import * as THREE from 'three';

export function buildCar(): THREE.Group {
  const car = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.95,
    roughness: 0.1,
    envMapIntensity: 1.5,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x88aacc,
    metalness: 0.1,
    roughness: 0.05,
    transparent: true,
    opacity: 0.45,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 1.0,
    roughness: 0.05,
    envMapIntensity: 2.0,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.0,
    roughness: 0.9,
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 1.0,
    roughness: 0.05,
  });

  const redMat = new THREE.MeshStandardMaterial({
    color: 0xff2200,
    emissive: 0xff1100,
    emissiveIntensity: 0.6,
    metalness: 0.0,
    roughness: 0.5,
  });

  // --- Main body (lower) ---
  const bodyGeo = new THREE.BoxGeometry(4.0, 0.5, 1.8);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 0.3, 0);
  car.add(body);

  // --- Hood slope (front) ---
  const hoodShape = new THREE.Shape();
  hoodShape.moveTo(-2.0, 0);
  hoodShape.lineTo(-0.5, 0.55);
  hoodShape.lineTo(-0.5, 0.5);
  hoodShape.lineTo(-2.0, -0.05);
  hoodShape.closePath();
  const hoodExtSettings: THREE.ExtrudeGeometryOptions = {
    depth: 1.6,
    bevelEnabled: false,
  };
  const hoodGeo = new THREE.ExtrudeGeometry(hoodShape, hoodExtSettings);
  const hood = new THREE.Mesh(hoodGeo, bodyMat);
  hood.position.set(0, 0.55, -0.8);
  car.add(hood);

  // --- Cabin ---
  const cabinGeo = new THREE.BoxGeometry(1.8, 0.65, 1.6);
  const cabin = new THREE.Mesh(cabinGeo, bodyMat);
  cabin.position.set(0.1, 0.88, 0);
  car.add(cabin);

  // --- Windshield ---
  const windshieldGeo = new THREE.PlaneGeometry(1.55, 0.55);
  const windshield = new THREE.Mesh(windshieldGeo, glassMat);
  windshield.position.set(-0.8, 1.0, 0);
  windshield.rotation.y = Math.PI / 2;
  windshield.rotation.z = -0.35;
  car.add(windshield);

  // --- Rear glass ---
  const rearGlassGeo = new THREE.PlaneGeometry(1.55, 0.5);
  const rearGlass = new THREE.Mesh(rearGlassGeo, glassMat);
  rearGlass.position.set(0.98, 0.97, 0);
  rearGlass.rotation.y = Math.PI / 2;
  rearGlass.rotation.z = 0.3;
  car.add(rearGlass);

  // --- Side windows ---
  const sideWinGeo = new THREE.PlaneGeometry(1.6, 0.5);
  const sideWinL = new THREE.Mesh(sideWinGeo, glassMat);
  sideWinL.position.set(0.1, 1.0, -0.8);
  car.add(sideWinL);
  const sideWinR = new THREE.Mesh(sideWinGeo, glassMat);
  sideWinR.position.set(0.1, 1.0, 0.8);
  sideWinR.rotation.y = Math.PI;
  car.add(sideWinR);

  // --- Trunk / rear ---
  const trunkGeo = new THREE.BoxGeometry(0.9, 0.38, 1.8);
  const trunk = new THREE.Mesh(trunkGeo, bodyMat);
  trunk.position.set(1.55, 0.6, 0);
  car.add(trunk);

  // --- Front bumper ---
  const frontBumperGeo = new THREE.BoxGeometry(0.12, 0.32, 1.8);
  const frontBumper = new THREE.Mesh(frontBumperGeo, chromeMat);
  frontBumper.position.set(-2.05, 0.26, 0);
  car.add(frontBumper);

  // --- Rear bumper ---
  const rearBumperGeo = new THREE.BoxGeometry(0.12, 0.32, 1.8);
  const rearBumper = new THREE.Mesh(rearBumperGeo, chromeMat);
  rearBumper.position.set(2.05, 0.26, 0);
  car.add(rearBumper);

  // --- Grille ---
  const grilleGeo = new THREE.BoxGeometry(0.05, 0.22, 1.0);
  const grille = new THREE.Mesh(grilleGeo, chromeMat);
  grille.position.set(-2.02, 0.28, 0);
  car.add(grille);

  // --- Headlights ---
  const headlightGeo = new THREE.BoxGeometry(0.06, 0.12, 0.3);
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffd700,
    emissiveIntensity: 1.2,
  });
  [-0.55, 0.55].forEach((z) => {
    const hl = new THREE.Mesh(headlightGeo, headlightMat);
    hl.position.set(-2.02, 0.38, z);
    car.add(hl);
  });

  // --- Tail lights ---
  [-0.55, 0.55].forEach((z) => {
    const tl = new THREE.Mesh(headlightGeo, redMat);
    tl.position.set(2.02, 0.38, z);
    car.add(tl);
  });

  // --- Gold accent stripe ---
  const stripeGeo = new THREE.BoxGeometry(3.8, 0.04, 0.06);
  const stripeL = new THREE.Mesh(stripeGeo, chromeMat);
  stripeL.position.set(0, 0.56, -0.9);
  car.add(stripeL);
  const stripeR = new THREE.Mesh(stripeGeo, chromeMat);
  stripeR.position.set(0, 0.56, 0.9);
  car.add(stripeR);

  // --- Exhaust pipes ---
  const exhaustGeo = new THREE.CylinderGeometry(0.055, 0.06, 0.2, 12);
  [0.5, 0.72].forEach((z) => {
    const ex = new THREE.Mesh(exhaustGeo, chromeMat);
    ex.rotation.z = Math.PI / 2;
    ex.position.set(2.12, 0.18, z);
    car.add(ex);
  });

  // --- Wheels (4 corners) ---
  const wheelPositions = [
    { x: -1.25, z: -0.95 },
    { x: -1.25, z: 0.95 },
    { x: 1.25, z: -0.95 },
    { x: 1.25, z: 0.95 },
  ];
  wheelPositions.forEach((pos) => {
    const wheelGroup = new THREE.Group();

    const tireGeo = new THREE.TorusGeometry(0.38, 0.14, 16, 40);
    const tire = new THREE.Mesh(tireGeo, tireMat);
    wheelGroup.add(tire);

    const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 20);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    wheelGroup.add(rim);

    // Spokes
    for (let i = 0; i < 5; i++) {
      const spokeGeo = new THREE.BoxGeometry(0.05, 0.5, 0.04);
      const spoke = new THREE.Mesh(spokeGeo, rimMat);
      spoke.rotation.z = (i * Math.PI * 2) / 5;
      spoke.rotation.x = Math.PI / 2;
      wheelGroup.add(spoke);
    }

    wheelGroup.rotation.x = Math.PI / 2;
    wheelGroup.position.set(pos.x, 0.38, pos.z);
    car.add(wheelGroup);
  });

  // --- Underbody / floor ---
  const floorGeo = new THREE.BoxGeometry(3.9, 0.06, 1.75);
  const floorMesh = new THREE.Mesh(floorGeo, bodyMat);
  floorMesh.position.set(0, 0.03, 0);
  car.add(floorMesh);

  car.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  return car;
}
