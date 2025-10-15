<template>
  <div ref="container" class="container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const container = ref(null);
let scene, camera, renderer;

onMounted(() => {
  initThree();
  update();
});

onBeforeUnmount(() => {
  // 清理資源
  window.removeEventListener("resize", onWindowResize);
  if (renderer) {
    renderer.dispose();
  }
});

const initThree = () => {
  if (!container.value) return;

  // 場景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f4f8); // 淺藍灰背景

  // 正交相機設定
  const aspect = container.value.clientWidth / container.value.clientHeight;
  const frustumSize = 10; // 控制視野大小，數字越大看到的範圍越廣

  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2, // left
    (frustumSize * aspect) / 2, // right
    frustumSize / 2, // top
    frustumSize / -2, // bottom
    0.1, // near
    1000 // far
  );

  camera.position.set(
    Math.sqrt(2) * 10, // x
    10, // y (高度)
    Math.sqrt(2) * 10 // z
  );
  camera.lookAt(0, 0, 0);

  // 渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true, // 支援透明背景
  });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  container.value.appendChild(renderer.domElement);

  // 添加環境光和方向光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  // 測試：添加一些等距風格的方塊
  createIsometricScene();

  window.addEventListener("resize", onWindowResize);
};

// 創建等距風格的場景
const createIsometricScene = () => {
  // 地板
  // const floorGeometry = new THREE.PlaneGeometry(20, 20);
  // const floorMaterial = new THREE.MeshStandardMaterial({
  //   color: 0xe8f0f8,
  // });
  // const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  // scene.add(floor);

  const loader = new FBXLoader();
  const textureLoader = new THREE.TextureLoader();

  const baseTexture = textureLoader.load("/model/basetexture.jpg");

  // 載入單個 FBX 文件
  loader.load(
    "model/Area_a.fbx", // FBX 文件路徑
    (object) => {
      // 遍歷模型的所有網格，套用貼圖
      object.traverse((child) => {
        if (child.isMesh) {
          // 套用基礎貼圖
          child.material.map = baseTexture;

          // 如果需要其他類型的貼圖
          // child.material.normalMap = unchangeTexture; // 法線貼圖
          // child.material.roughnessMap = unchangeTexture; // 粗糙度貼圖

          child.material.needsUpdate = true; // 重要！告訴 Three.js 更新材質
        }
      });

      // 載入成功
      console.log("FBX 載入成功", object);

      // 調整模型位置、大小、旋轉
      object.position.set(0, 0, 0);
      object.scale.set(0.075, 0.075, 0.075); // 根據模型大小調整
      object.rotation.y = Math.PI / 4;

      // 添加到場景
      scene.add(object);
    }
  );
};

const update = () => {
  requestAnimationFrame(update);
  scene.rotation.y += 0.001;
  renderer.render(scene, camera);
};

// 響應式調整
const onWindowResize = () => {
  const aspect = container.value.clientWidth / container.value.clientHeight;
  const frustumSize = 10;

  camera.left = (frustumSize * aspect) / -2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = frustumSize / -2;

  camera.updateProjectionMatrix();

  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
