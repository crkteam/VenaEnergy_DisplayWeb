<template>
  <div ref="container" class="container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { Vector2, Vector3 } from "three";
import { ObjectCreator } from "@/component/bottomLayer/object-creator";
import gsap from "gsap";

// 定義類型
interface AreaCameraConfig {
  position: Vector3;
  lookAt: Vector3;
}

interface AreaConfig {
  type: string;
  position: Vector3;
  cameraPosition: Vector3;
}

const container = ref<HTMLDivElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.Camera;
let renderer: THREE.WebGLRenderer;

let raycaster: THREE.Raycaster;
let mouse: THREE.Vector2;
let clickableObjects: THREE.Object3D[] = []; // 儲存可點擊的物件

// 相機視差效果相關變數
let targetCameraPosition: Vector3 = new Vector3(5.5, 6.5, 10);
let lockedCameraPosition: Vector3 = new Vector3(5.5, 6.5, 10); // 鎖定時的基礎相機位置
let currentCameraOffset = { x: 0, y: 0 };
const parallaxStrength = 0.5; // 自由模式視差強度
const lockedParallaxStrength = 0.3; // 鎖定模式視差強度 (較小)
const smoothness = 0.1; // 平滑度,越小越平滑

// 相機焦點相關變數
let isLocked = false; // 是否鎖定在某個 area
let currentLookAt: Vector3 = new Vector3(0, 0, 0); // 當前看向的目標點
let isIntroPlaying = true; // 是否正在播放開場動畫

// 開場動畫的起始位置
const introCameraPosition: Vector3 = new Vector3(5.5, 15, 10); // 從更高的位置開始
const introLookAt: Vector3 = new Vector3(0, 5, 2.5); // 開始時看向較高的位置

// 統一配置所有 area 的資訊
const areaConfigs: AreaConfig[] = [
  {
    type: "A",
    position: new Vector3(-2.5, 0, -1.5),
    cameraPosition: new Vector3(-0.5, 4.5, 7.5),
  },
  {
    type: "B",
    position: new Vector3(-2.5, 0, 4.5),
    cameraPosition: new Vector3(-2.5, 6.5, 12),
  },
  {
    type: "C",
    position: new Vector3(4, 0, -1.5),
    cameraPosition: new Vector3(4, 6.5, 8),
  },
  {
    type: "D",
    position: new Vector3(5, 0, 4.5),
    cameraPosition: new Vector3(5, 6.5, 12),
  },
];

// 從配置生成相機位置映射
const areaCameraPositions: Record<string, AreaCameraConfig> =
  areaConfigs.reduce((acc, config) => {
    acc[config.type] = {
      position: config.cameraPosition,
      lookAt: config.position, // 直接使用 area 的位置
    };
    return acc;
  }, {} as Record<string, AreaCameraConfig>);

onMounted(() => {
  initThree();
  update();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onWindowResize);
  window.removeEventListener("keydown", onKeyDown);
  container.value?.removeEventListener("click", onMouseClick);
  container.value?.removeEventListener("mousemove", onMouseMove);
  if (renderer) {
    renderer.dispose();
  }

  // 清除所有 GSAP 動畫
  gsap.killTweensOf(camera.position);
  gsap.killTweensOf(currentLookAt);
});

const initThree = async () => {
  if (!container.value) return;

  // 初始化 Raycaster 和 Mouse
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // 場景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f4f8);

  // 物件生成器
  let objectCreator = new ObjectCreator();
  let view = new Vector2(
    container.value.clientWidth,
    container.value.clientHeight
  );

  // 相機 - 從開場位置開始
  camera = objectCreator.createCamera(view, introCameraPosition);

  // 設定初始 lookAt
  currentLookAt.copy(introLookAt);

  // 渲染器
  renderer = objectCreator.createRenderer(view);
  container.value.appendChild(renderer.domElement);

  // 打光
  objectCreator.addLight(scene);

  // 批量創建所有 areas
  await loadAllAreas(objectCreator);

  // 播放開場動畫
  playIntroAnimation();

  // 添加事件監聽
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", onKeyDown);
  container.value.addEventListener("click", onMouseClick);
  container.value.addEventListener("mousemove", onMouseMove);
};

// 開場動畫
const playIntroAnimation = () => {
  isIntroPlaying = true;

  // 相機位置動畫
  gsap.to(camera.position, {
    x: targetCameraPosition.x,
    y: targetCameraPosition.y,
    z: targetCameraPosition.z,
    duration: 2, // 動畫時長
    ease: "power2.out", // 緩動效果
    onComplete: () => {
      isIntroPlaying = false; // 動畫完成後允許互動
    },
  });

  // lookAt 動畫
  gsap.to(currentLookAt, {
    x: 0,
    y: 0,
    z: 0,
    duration: 2.5,
    ease: "power2.out",
  });
};

// 批量載入所有 areas
const loadAllAreas = async (objectCreator: ObjectCreator) => {
  const areaPromises = areaConfigs.map((config) =>
    objectCreator.createFBX(config.type, config.position)
  );

  const areas = await Promise.all(areaPromises);

  areas.forEach((area) => {
    scene.add(area);
    clickableObjects.push(area);
  });
};

const onMouseMove = (event: MouseEvent) => {
  if (!container.value) return;

  // 開場動畫期間不響應滑鼠移動
  if (isIntroPlaying) return;

  // 計算滑鼠位置 (-1 到 +1)
  const rect = container.value.getBoundingClientRect();
  const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // 根據鎖定狀態使用不同的視差強度
  const strength = isLocked ? lockedParallaxStrength : parallaxStrength;

  // 計算目標偏移量
  currentCameraOffset.x = mouseX * strength;
  currentCameraOffset.y = mouseY * strength;
};

const onMouseClick = (event: MouseEvent) => {
  if (!container.value) return;

  // 開場動畫期間不響應點擊
  if (isIntroPlaying) return;

  // 計算滑鼠在 three.js 正規化座標系統中的位置 (-1 到 +1)
  const rect = container.value.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // 更新 raycaster
  raycaster.setFromCamera(mouse, camera);

  // 檢測射線與物件的交點
  const intersects = raycaster.intersectObjects(clickableObjects, true);

  if (intersects.length > 0) {
    // 找到最上層的父物件(FBX 模型)
    let clickedObject = intersects[0].object;
    while (clickedObject.parent && !clickedObject.userData.type) {
      clickedObject = clickedObject.parent;
    }

    // 處理點擊事件
    handleObjectClick(clickedObject);
  }
};

const handleObjectClick = (object: THREE.Object3D) => {
  const areaType = object.userData.type as string;
  console.log("點擊了:", areaType);

  // 鎖定到該 area
  lockCameraToArea(areaType);
};

const lockCameraToArea = (areaType: string) => {
  const cameraConfig = areaCameraPositions[areaType];

  if (!cameraConfig) {
    console.warn(`找不到 area ${areaType} 的相機配置`);
    return;
  }

  // 設定鎖定狀態
  isLocked = true;

  // 儲存鎖定時的基礎相機位置
  lockedCameraPosition = cameraConfig.position.clone();

  // 停止之前的動畫
  gsap.killTweensOf(camera.position);
  gsap.killTweensOf(currentLookAt);

  // 使用 GSAP 動畫相機位置
  gsap.to(camera.position, {
    x: cameraConfig.position.x,
    y: cameraConfig.position.y,
    z: cameraConfig.position.z,
    duration: 1,
    ease: "power2.inOut",
  });

  // 同時動畫 lookAt 目標 (使用 area 的位置)
  gsap.to(currentLookAt, {
    x: cameraConfig.lookAt.x,
    y: cameraConfig.lookAt.y,
    z: cameraConfig.lookAt.z,
    duration: 1,
    ease: "power2.inOut",
  });

  console.log(`相機鎖定到 Area ${areaType}`);
};

const unlockCamera = () => {
  isLocked = false;

  // 停止之前的動畫
  gsap.killTweensOf(camera.position);
  gsap.killTweensOf(currentLookAt);

  // 使用 GSAP 動畫回到初始位置
  gsap.to(camera.position, {
    x: targetCameraPosition.x,
    y: targetCameraPosition.y,
    z: targetCameraPosition.z,
    duration: 1,
    ease: "power2.inOut",
  });

  // 動畫 lookAt 回到中心點
  gsap.to(currentLookAt, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1,
    ease: "power2.inOut",
  });

  console.log("相機解鎖,恢復到初始視角");
};

// 按 ESC 鍵解鎖相機
const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isLocked) {
    unlockCamera();
  }
};

const update = () => {
  requestAnimationFrame(update);

  // 開場動畫期間不應用視差效果
  if (!isIntroPlaying) {
    // 應用視差效果 (自由模式和鎖定模式都適用)
    const basePosition = isLocked ? lockedCameraPosition : targetCameraPosition;
    const newX = basePosition.x + currentCameraOffset.x;
    const newY = basePosition.y + currentCameraOffset.y;

    camera.position.x += (newX - camera.position.x) * smoothness;
    camera.position.y += (newY - camera.position.y) * smoothness;
  }

  // 始終更新 lookAt
  camera.lookAt(currentLookAt);
  renderer.render(scene, camera);
};

// 響應式調整
const onWindowResize = () => {
  if (!container.value) return;

  const aspect = container.value.clientWidth / container.value.clientHeight;
  const frustumSize = 10;

  if (camera instanceof THREE.OrthographicCamera) {
    camera.left = (frustumSize * aspect) / -2;
    camera.right = (frustumSize * aspect) / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;

    camera.updateProjectionMatrix();
  }

  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
