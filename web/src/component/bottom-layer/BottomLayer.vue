<template>
  <div ref="container" class="w-full h-full" />
</template>

<script setup lang="ts">
import {
  ref,
  defineEmits,
  defineExpose,
  onMounted,
  onBeforeUnmount,
  defineProps,
} from "vue";
import * as THREE from "three";
import { Vector2, Vector3 } from "three";
import {
  ObjectCreator,
  MultiAnimationController,
  AnimationGroupType,
  AnimationState,
} from "@/component/bottom-layer/object-creator";
import gsap from "gsap";
import { BottomColorData } from "@/types/bottom";

const props = defineProps<{
  bottomColorData: BottomColorData;
}>();

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

// 定義事件
const emit = defineEmits<{
  (e: "areaClick", areaType: string): void;
}>();

const container = ref<HTMLDivElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.Camera;
let renderer: THREE.WebGLRenderer;

// 點擊偵測
const raycaster = new THREE.Raycaster();
const mouse = new Vector2();
const clickableAreas: THREE.Object3D[] = [];

// 相機視差效果相關變數
let targetCameraPosition: Vector3 = new Vector3(3, 7, 14);
let lockedCameraPosition: Vector3 = new Vector3(3, 7, 14);
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

// 動畫控制器
let animController: MultiAnimationController | null = null;

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
  container.value?.removeEventListener("click", onMouseClick);
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
  scene.background = new THREE.Color(props.bottomColorData.bgColor);

  // 物件生成器
  let objectCreator = new ObjectCreator(props.bottomColorData);
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

  // 網格地板
  addGrid();

  // 批量創建所有 areas
  await loadAllAreas(objectCreator);

  // 播放開場動畫
  playIntroAnimation();

  // 添加事件監聯
  window.addEventListener("resize", onWindowResize);
  container.value.addEventListener("mousemove", onMouseMove);
  container.value.addEventListener("click", onMouseClick);
};

const addGrid = () => {
  // 水平地板網格
  const gridHelper = new THREE.GridHelper(
    50, // 大小
    50, // 分割數
    props.bottomColorData.gridPrimaryColor, // 主線顏色
    props.bottomColorData.gridSecondaryColor // 次線顏色
  );
  gridHelper.position.y = -0.01; // 稍微下移避免 z-fighting
  scene.add(gridHelper);
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

const loadAllAreas = async (objectCreator: ObjectCreator) => {
  const areaPromises = areaConfigs.map((config) =>
    objectCreator.createArea(config.type, config.position)
  );

  const areas = await Promise.all(areaPromises);

  areas.forEach((area) => {
    scene.add(area);
    clickableAreas.push(area);
  });

  const v3 = new Vector3(0.5, 0, 1);

  // 建立動畫控制器，並設定各組的實例數量和延遲
  animController = await objectCreator.createMultiAnimationGroup(v3, {
    A: { count: 7, delay: 0.25 },
    B: { count: 7, delay: 0.25 },
    C: { count: 2, delay: 0.25 },
    D: { count: 2, delay: 0.25 },
    X: { count: 7, delay: 0.2 },
  });

  // 將所有物件加入場景
  animController.getAllObjects().forEach((obj) => scene.add(obj));

  // 設定狀態 - 會同時控制該組所有實例
  animController.setStates({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    X: 0,
  });
};

// 點擊事件處理
const onMouseClick = (event: MouseEvent) => {
  if (!container.value || isIntroPlaying) return;

  const rect = container.value.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableAreas, true);

  if (intersects.length > 0) {
    let obj: THREE.Object3D | null = intersects[0].object;
    while (obj && !obj.userData.type) {
      obj = obj.parent;
    }
    if (obj?.userData.type) {
      emit("areaClick", obj.userData.type);
    }
  }
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

// 設定單一動畫組狀態（由外部呼叫）
const setAnimationState = (type: AnimationGroupType, state: AnimationState) => {
  if (animController) {
    animController.setState(type, state);
  } else {
    console.warn("animController 尚未初始化");
  }
};

// 批次設定動畫狀態（由外部呼叫）
const setAnimationStates = (
  states: Partial<Record<AnimationGroupType, AnimationState>>
) => {
  if (animController) {
    animController.setStates(states);
  } else {
    console.warn("animController 尚未初始化");
  }
};

// 設定所有動畫狀態（由外部呼叫）
const setAllAnimationStates = (state: AnimationState) => {
  if (animController) {
    animController.setAllStates(state);
  } else {
    console.warn("animController 尚未初始化");
  }
};

// 取得動畫狀態（由外部呼叫）
const getAnimationState = (type: AnimationGroupType): AnimationState => {
  if (animController) {
    return animController.getState(type);
  }
  return "stop";
};

// 取得所有動畫狀態（由外部呼叫）
const getAllAnimationStates = (): Record<
  AnimationGroupType,
  AnimationState
> => {
  if (animController) {
    return animController.getAllStates();
  }
  return { A: "stop", B: "stop", C: "stop", D: "stop", X: "stop" };
};
// 恢復所有動畫（從暫停狀態繼續播放）
const resumeAllAnimations = () => {
  if (animController) {
    animController.resumeAll();
  } else {
    console.warn("animController 尚未初始化");
  }
};

// 取得動畫控制器實例（如果外部需要更多控制）
const getAnimController = () => animController;

defineExpose({
  unlockCamera,
  lockCameraToArea,
  setAnimationState,
  setAnimationStates,
  setAllAnimationStates,
  resumeAllAnimations,
  getAnimationState,
  getAllAnimationStates,
  getAnimController,
});

const clock = new THREE.Clock();

const update = () => {
  requestAnimationFrame(update);

  const delta = clock.getDelta();

  // 更新動畫控制器
  if (animController) {
    animController.update(delta);
  }

  if (!isIntroPlaying) {
    const basePosition = isLocked ? lockedCameraPosition : targetCameraPosition;
    const newX = basePosition.x + currentCameraOffset.x;
    const newY = basePosition.y + currentCameraOffset.y;

    camera.position.x += (newX - camera.position.x) * smoothness;
    camera.position.y += (newY - camera.position.y) * smoothness;
  }

  camera.lookAt(currentLookAt);
  renderer.render(scene, camera);
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
