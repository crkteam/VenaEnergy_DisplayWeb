<template>
  <div ref="container" class="w-full h-full" />
</template>

<script setup lang="ts">
import { ref, defineExpose, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { Vector2, Vector3 } from "three";
import { ObjectCreator } from "@/component/bottom-layer/object-creator";
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
  focusLookAt: Vector3;
}

const container = ref<HTMLDivElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.Camera;
let renderer: THREE.WebGLRenderer;

// 相機視差效果相關變數
let targetCameraPosition: Vector3 = new Vector3(6.5, 10, 13);
let lockedCameraPosition: Vector3 = new Vector3(6.5, 10, 13);
let currentCameraOffset = { x: 0, y: 0 };
const parallaxStrength = 0.5;
const lockedParallaxStrength = 0.3;
const smoothness = 0.1;

// 相機焦點相關變數
let isLocked = false;
let currentLookAt: Vector3 = new Vector3(0, 0, 0);
let isIntroPlaying = true;

// 開場動畫的起始位置
const introCameraPosition: Vector3 = new Vector3(6.5, 20, 13);
const introLookAt: Vector3 = new Vector3(0, 5, 2.5);

// 統一配置所有 area 的資訊
const areaConfigs: AreaConfig[] = [
  {
    type: "A",
    position: new Vector3(-2.5, 0, -1.5),
    cameraPosition: new Vector3(2.25, 3.5, 3.75),
    focusLookAt: new Vector3(-1.5, 1, -2),
  },
  {
    type: "B",
    position: new Vector3(-2.5, 0, 4.5),
    cameraPosition: new Vector3(2.25, 3.5, 9.75),
    focusLookAt: new Vector3(-1.5, 1, 4),
  },
  {
    type: "C",
    position: new Vector3(4, 0, -1.5),
    cameraPosition: new Vector3(8.75, 3.5, 3.75),
    focusLookAt: new Vector3(5, 1, -2),
  },
  {
    type: "D",
    position: new Vector3(5, 0, 4.5),
    cameraPosition: new Vector3(9.75, 3.5, 9.75),
    focusLookAt: new Vector3(6, 1, 4),
  },
];

// 從配置生成相機位置映射
const areaCameraPositions: Record<string, AreaCameraConfig> =
  areaConfigs.reduce((acc, config) => {
    acc[config.type] = {
      position: config.cameraPosition,
      lookAt: config.focusLookAt,
    };
    return acc;
  }, {} as Record<string, AreaCameraConfig>);

onMounted(() => {
  initThree();
  update();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onWindowResize);
  container.value?.removeEventListener("mousemove", onMouseMove);
  if (renderer) {
    renderer.dispose();
  }

  gsap.killTweensOf(camera.position);
  gsap.killTweensOf(currentLookAt);
});

const initThree = async () => {
  if (!container.value) return;

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

  // 添加事件監聯
  window.addEventListener("resize", onWindowResize);
  container.value.addEventListener("mousemove", onMouseMove);
};

// 開場動畫
const playIntroAnimation = () => {
  isIntroPlaying = true;

  gsap.to(camera.position, {
    x: targetCameraPosition.x,
    y: targetCameraPosition.y,
    z: targetCameraPosition.z,
    duration: 2,
    ease: "power2.out",
    onComplete: () => {
      isIntroPlaying = false;
    },
  });

  gsap.to(currentLookAt, {
    x: 0,
    y: 0,
    z: 0,
    duration: 2.5,
    ease: "power2.out",
  });
};

let mixers: THREE.AnimationMixer[] = [];

// 儲存 arrowGroup 的引用
let arrowGroupInstance: Awaited<
  ReturnType<ObjectCreator["createArrowGroup"]>
> | null = null;

const loadAllAreas = async (objectCreator: ObjectCreator) => {
  const areaPromises = areaConfigs.map((config) =>
    objectCreator.createArea(config.type, config.position)
  );

  const areas = await Promise.all(areaPromises);

  areas.forEach((area) => {
    scene.add(area);
  });

  const v3 = new Vector3(0.5, 0, 1);
  const road = await objectCreator.createRoad(v3);
  scene.add(road);

  const arrowGroup = await objectCreator.createArrowGroup("TEST", v3, 7);

  // 儲存引用
  arrowGroupInstance = arrowGroup;

  arrowGroup.objects.forEach((obj) => scene.add(obj));
  arrowGroup.mixers.forEach((mixer) => mixers.push(mixer));

  arrowGroup.play(0, {
    staggerDelay: 428,
  });
};

const onMouseMove = (event: MouseEvent) => {
  if (!container.value) return;

  if (isIntroPlaying) return;

  const rect = container.value.getBoundingClientRect();
  const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  const strength = isLocked ? lockedParallaxStrength : parallaxStrength;

  currentCameraOffset.x = mouseX * strength;
  currentCameraOffset.y = mouseY * strength;
};

// 鎖定相機到指定 area（由外部呼叫）
const lockCameraToArea = (areaType: string) => {
  const cameraConfig = areaCameraPositions[areaType];

  if (!cameraConfig) {
    console.warn(`找不到 area ${areaType} 的相機配置`);
    return;
  }

  isLocked = true;
  lockedCameraPosition = cameraConfig.position.clone();

  gsap.killTweensOf(camera.position);
  gsap.killTweensOf(currentLookAt);

  gsap.to(camera.position, {
    x: cameraConfig.position.x,
    y: cameraConfig.position.y,
    z: cameraConfig.position.z,
    duration: 1,
    ease: "power2.inOut",
  });

  gsap.to(currentLookAt, {
    x: cameraConfig.lookAt.x,
    y: cameraConfig.lookAt.y,
    z: cameraConfig.lookAt.z,
    duration: 1,
    ease: "power2.inOut",
  });
};

const unlockCamera = () => {
  isLocked = false;

  gsap.killTweensOf(camera.position);
  gsap.killTweensOf(currentLookAt);

  gsap.to(camera.position, {
    x: targetCameraPosition.x,
    y: targetCameraPosition.y,
    z: targetCameraPosition.z,
    duration: 1,
    ease: "power2.inOut",
  });

  gsap.to(currentLookAt, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1,
    ease: "power2.inOut",
  });
};

// 播放 arrow 動畫（由外部呼叫）
const playArrowAnimation = (
  state: number,
  options?: { staggerDelay?: number }
) => {
  if (arrowGroupInstance) {
    arrowGroupInstance.play(state, options);
  } else {
    console.warn("arrowGroup 尚未初始化");
  }
};

// 停止 arrow 動畫（由外部呼叫）
const stopArrowAnimation = () => {
  if (arrowGroupInstance) {
    arrowGroupInstance.stop?.();
  }
};

// 取得 arrowGroup 實例（如果外部需要更多控制）
const getArrowGroup = () => arrowGroupInstance;

defineExpose({
  unlockCamera,
  lockCameraToArea,
  playArrowAnimation,
  stopArrowAnimation,
  getArrowGroup,
});

const clock = new THREE.Clock();

const update = () => {
  requestAnimationFrame(update);

  const delta = clock.getDelta();

  if (!isIntroPlaying) {
    const basePosition = isLocked ? lockedCameraPosition : targetCameraPosition;
    const newX = basePosition.x + currentCameraOffset.x;
    const newY = basePosition.y + currentCameraOffset.y;

    camera.position.x += (newX - camera.position.x) * smoothness;
    camera.position.y += (newY - camera.position.y) * smoothness;
  }

  camera.lookAt(currentLookAt);
  renderer.render(scene, camera);

  mixers.forEach((mixer) => {
    mixer.update(delta);
  });
};

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
