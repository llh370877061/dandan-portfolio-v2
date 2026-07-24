// ========== 地图生成 ==========
// 每张地图用一个函数生成 Three.js 场景内容

function createMap(scene, mapId) {
  const mapGroup = new THREE.Group();
  mapGroup.name = 'map';

  const groundMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const wallMat = new THREE.MeshLambertMaterial({ color: 0x555555 });
  const concreteMat = new THREE.MeshLambertMaterial({ color: 0x666666 });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
  const woodMat = new THREE.MeshLambertMaterial({ color: 0x8B6914 });
  const metalMat = new THREE.MeshLambertMaterial({ color: 0x888888 });

  // 地面
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    groundMat
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  mapGroup.add(ground);

  if (mapId === 'city') {
    buildCity(mapGroup, wallMat, concreteMat, darkMat, metalMat);
  } else if (mapId === 'office') {
    buildOffice(mapGroup, wallMat, concreteMat, metalMat);
  } else if (mapId === 'manor') {
    buildManor(mapGroup, wallMat, concreteMat, woodMat);
  }

  // 围墙
  const boundaryMat = new THREE.MeshLambertMaterial({ color: 0x444444 });
  const walls = [
    { pos: [0, 2.5, -50], size: [100, 5, 1] },
    { pos: [0, 2.5, 50], size: [100, 5, 1] },
    { pos: [-50, 2.5, 0], size: [1, 5, 100] },
    { pos: [50, 2.5, 0], size: [1, 5, 100] },
  ];
  walls.forEach(w => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(...w.size), boundaryMat);
    m.position.set(...w.pos);
    m.castShadow = true;
    mapGroup.add(m);
  });

  scene.add(mapGroup);
  return mapGroup;
}

function addBox(group, mat, x, y, z, w, h, d) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addCylinder(group, mat, x, y, z, r, h) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 8), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}

// ========== 废弃城市 ==========
function buildCity(group, wallMat, concreteMat, darkMat, metalMat) {
  const rustMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 });

  // 楼房1（左上）
  addBox(group, wallMat, -20, 4, -20, 12, 8, 10);
  addBox(group, darkMat, -17, 4, -20, 6, 6, 0.3); // 窗户

  // 楼房2（右上）
  addBox(group, wallMat, 20, 5, -25, 14, 10, 12);
  addBox(group, darkMat, 20, 5, -25, 8, 8, 0.3);

  // 商场（左下）
  addBox(group, wallMat, -20, 3, 20, 14, 6, 10);
  addBox(group, concreteMat, -20, 3, 20, 10, 5.5, 9.5); // 内部挖空感

  // 商场（右下）
  addBox(group, wallMat, 22, 3, 18, 12, 6, 10);

  // 路障
  for (let i = 0; i < 5; i++) {
    addBox(group, rustMat, -5 + i * 3, 0.5, -5, 2, 1, 0.8);
  }

  // 废弃车辆
  for (let i = 0; i < 3; i++) {
    const carGroup = new THREE.Group();
    addBox(carGroup, metalMat, 0, 0.6, 0, 4, 1.2, 2);
    addBox(carGroup, darkMat, 0, 1.5, -0.3, 3, 0.8, 1.5);
    carGroup.position.set(-8 + i * 12, 0, 5 + i * 8);
    carGroup.rotation.y = Math.random() * 0.5 - 0.25;
    group.add(carGroup);
  }

  // 桶
  for (let i = 0; i < 4; i++) {
    addCylinder(group, rustMat, 8 + i * 3, 0.75, -8, 0.5, 1.5);
  }

  // 路面纹理线
  const roadMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
  addBox(group, roadMat, 0, 0.01, 0, 20, 0.02, 100);

  // 天桥
  addBox(group, concreteMat, 0, 5, -10, 16, 0.5, 3);
  addBox(group, wallMat, -7, 2.5, -10, 0.5, 5, 0.5);
  addBox(group, wallMat, 7, 2.5, -10, 0.5, 5, 0.5);

  // 岗亭
  addBox(group, metalMat, 10, 1.5, 0, 3, 3, 3);
}

// ========== 办公楼 ==========
function buildOffice(group, wallMat, concreteMat, metalMat) {
  const glassMat = new THREE.MeshLambertMaterial({ color: 0x88aacc, transparent: true, opacity: 0.4 });
  const deskMat = new THREE.MeshLambertMaterial({ color: 0x654321 });
  const floorMat2 = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });

  // 上层楼板
  addBox(group, concreteMat, 0, 4, -15, 30, 0.5, 25);

  // 走廊墙壁
  addBox(group, wallMat, 0, 2, -2, 30, 4, 0.4);
  addBox(group, wallMat, 0, 2, 8, 30, 4, 0.4);

  // 会议室（左上）
  addBox(group, wallMat, -10, 2, -18, 8, 4, 6);
  addBox(group, glassMat, -10, 2, -15, 6, 3, 0.2); // 玻璃墙

  // 办公区1
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      addBox(group, deskMat, 5 + c * 4, 0.5, -12 + r * 4, 2, 1, 1.5);
    }
  }

  // 办公区2
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      addBox(group, deskMat, -8 + c * 4, 0.5, 2 + r * 4, 2, 1, 1.5);
    }
  }

  // 服务器间（右下）
  addBox(group, wallMat, 18, 2, 15, 8, 4, 6);
  for (let i = 0; i < 4; i++) {
    addBox(group, metalMat, 16 + i * 2, 1.5, 15, 1, 3, 1.5);
  }

  // 茶水间（左下）
  addBox(group, wallMat, -18, 2, 15, 6, 4, 6);

  // 电梯（中间）
  addBox(group, metalMat, 0, 2, -25, 3, 4, 3);
  addBox(group, metalMat, 0, 2, 30, 3, 4, 3);

  // 地下车库入口
  addBox(group, concreteMat, 0, -2, 38, 20, 0.5, 10);
  addBox(group, wallMat, -10, -1, 38, 0.5, 3, 10);
  addBox(group, wallMat, 10, -1, 38, 0.5, 3, 10);
}

// ========== 庄园 ==========
function buildManor(group, wallMat, concreteMat, woodMat) {
  const marbleMat = new THREE.MeshLambertMaterial({ color: 0xddddcc });
  const greenMat = new THREE.MeshLambertMaterial({ color: 0x2d5a1e });
  const roofMat = new THREE.MeshLambertMaterial({ color: 0x8B0000 });

  // 花园草地
  const garden = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 20),
    greenMat
  );
  garden.rotation.x = -Math.PI / 2;
  garden.position.set(0, 0.02, -25);
  group.add(garden);

  // 树木
  for (let i = 0; i < 8; i++) {
    const treeGroup = new THREE.Group();
    addCylinder(treeGroup, woodMat, 0, 1.5, 0, 0.3, 3);
    const leaves = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 6, 6),
      greenMat
    );
    leaves.position.y = 3.5;
    leaves.castShadow = true;
    treeGroup.add(leaves);
    treeGroup.position.set(
      -12 + (i % 4) * 8 + Math.random() * 3,
      0,
      -25 + Math.floor(i / 4) * 8 + Math.random() * 3
    );
    group.add(treeGroup);
  }

  // 喷泉
  addCylinder(group, marbleMat, 0, 0.5, -25, 2, 1);
  addCylinder(group, marbleMat, 0, 1.5, -25, 0.5, 2);

  // 主楼外墙
  addBox(group, wallMat, 0, 4, 5, 24, 8, 16);

  // 大厅内部（柱子）
  for (let i = 0; i < 4; i++) {
    addCylinder(group, marbleMat, -8 + i * 5, 2, 5, 0.5, 4);
  }

  // 画室
  addBox(group, woodMat, -8, 2, 10, 6, 4, 4);

  // 书房
  addBox(group, woodMat, 0, 2, 10, 5, 4, 4);
  // 书架
  for (let i = 0; i < 3; i++) {
    addBox(group, woodMat, -1.5 + i * 1.5, 2, 11.5, 0.8, 3.5, 0.5);
  }

  // 藏宝室
  addBox(group, wallMat, 8, 2, 10, 5, 4, 4);

  // 楼梯
  for (let i = 0; i < 6; i++) {
    addBox(group, marbleMat, -11, i * 0.5, 0 + i, 3, 0.5, 1);
  }

  // 地下室入口
  addBox(group, wallMat, 0, -1, 18, 4, 2, 4);

  // 酒窖
  addBox(group, wallMat, -8, -2, 25, 8, 3, 6);
  for (let i = 0; i < 4; i++) {
    addBox(group, woodMat, -10 + i * 2, -2, 25, 1, 2.5, 1);
  }

  // 密室通道
  addBox(group, wallMat, 8, -2, 25, 6, 3, 8);

  // 屋顶
  addBox(group, roofMat, 0, 8.5, 5, 26, 1, 18);

  // 花坛
  for (let i = 0; i < 4; i++) {
    addBox(group, marbleMat, -10 + i * 7, 0.4, -20, 2, 0.8, 1.5);
    addBox(group, greenMat, -10 + i * 7, 1, -20, 1.8, 0.4, 1.3);
  }
}

// 出生点坐标
function getSpawnPoint(mapId) {
  const points = {
    city: { x: 0, y: 1.7, z: 10 },
    office: { x: 0, y: 1.7, z: 12 },
    manor: { x: 0, y: 1.7, z: -18 },
  };
  return points[mapId] || points.city;
}

// 敌人出生点
function getEnemySpawns(mapId) {
  const spawns = {
    city: [
      { x: -15, y: 1, z: -15 },
      { x: 15, y: 1, z: -20 },
      { x: -20, y: 1, z: 15 },
      { x: 20, y: 1, z: 10 },
      { x: 0, y: 5, z: -10 },   // 天桥上
    ],
    office: [
      { x: -10, y: 1, z: -15 },
      { x: 10, y: 1, z: -10 },
      { x: -8, y: 1, z: 5 },
      { x: 15, y: 1, z: 12 },
      { x: 0, y: -1, z: 30 },
    ],
    manor: [
      { x: -10, y: 1, z: -28 },
      { x: 10, y: 1, z: -22 },
      { x: 0, y: 1, z: 10 },
      { x: -8, y: -1, z: 25 },
      { x: 8, y: -1, z: 25 },
    ],
  };
  return spawns[mapId] || spawns.city;
}

// 掩体位置（用于AI寻路）
function getCoverPoints(mapId) {
  const covers = {
    city: [
      { x: -5, z: -5 }, { x: 3, z: -5 }, { x: -8, z: 5 },
      { x: 12, z: 8 }, { x: -15, z: -8 }, { x: 18, z: -15 },
    ],
    office: [
      { x: -8, z: -12 }, { x: 5, z: -8 }, { x: -15, z: 5 },
      { x: 12, z: 10 }, { x: 0, z: -2 }, { x: 18, z: 12 },
    ],
    manor: [
      { x: -8, z: -20 }, { x: 8, z: -22 }, { x: -5, z: 5 },
      { x: 5, z: 10 }, { x: -10, z: 20 }, { x: 8, z: 22 },
    ],
  };
  return covers[mapId] || covers.city;
}
