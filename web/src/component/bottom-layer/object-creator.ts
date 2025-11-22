import { Camera } from "three/src/cameras/Camera";
import * as THREE from "three";
import { Vector2, Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export class ObjectCreator {
  createCamera(view: Vector2, pos: Vector3): Camera {
    const aspect = view.x / view.y;
    const fov = 45; // 視野角度,通常 45-75 度之間
    const near = 0.1;
    const far = 1000;

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.set(pos.x, pos.y, pos.z);
    camera.lookAt(0, 0, 0);

    return camera;
  }

  createRenderer(view: Vector2): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(view.x, view.y);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    return renderer;
  }

  addLight(scene: THREE.Scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.25);
    directionalLight.position.set(-1.25, 5.5, 5);
    directionalLight.lookAt(0, 0, 0);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -12;
    directionalLight.shadow.camera.right = 12;
    directionalLight.shadow.camera.top = 12;
    directionalLight.shadow.camera.bottom = -12;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 30;
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.35);
    directionalLight2.position.set(2.5, 5.5, -2.5);
    directionalLight2.lookAt(0, 0, 0);
    scene.add(directionalLight2);
  }

  createArea(type: string, pos: THREE.Vector3): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      const loader = new FBXLoader();
      const textureLoader = new THREE.TextureLoader();

      const baseTexture = textureLoader.load("./model/basetexture.jpg");
      const floorTexture = textureLoader.load("./model/floortexture.jpg");
      const unchangeTexture = textureLoader.load("./model/unchangetexture.jpg");

      loader.load(
        "./model/Area_" + type + ".fbx",
        (object) => {
          object.traverse((child) => {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child instanceof THREE.Mesh) {
              const materials = Array.isArray(child.material)
                ? child.material
                : [child.material];

              const newMaterials = materials.map((mat) => {
                if (mat.name === "lambert1") {
                  return new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    map: floorTexture,
                  });
                }

                if (mat.name === "lambert2") {
                  return new THREE.MeshStandardMaterial({
                    map: unchangeTexture,
                  });
                }

                return new THREE.MeshStandardMaterial({
                  color: 0xffffff,
                  map: baseTexture,
                });
              });

              child.material = Array.isArray(child.material)
                ? newMaterials
                : newMaterials[0];
            }
          });

          object.position.set(pos.x, pos.y, pos.z);

          const scale = 0.075;
          object.scale.set(scale, scale, scale);

          object.userData.type = type;

          // 成功載入後 resolve
          resolve(object);
        },
        undefined, // onProgress callback (可選)
        (error) => {
          // 載入失敗時 reject
          console.error("載入 FBX 時發生錯誤:", error);
          reject(error);
        }
      );
    });
  }

  createRoad(pos: THREE.Vector3): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      const loader = new FBXLoader();
      const textureLoader = new THREE.TextureLoader();

      const baseTexture = textureLoader.load("./model/basetexture.jpg");
      loader.load(
        "./model/road/Road.fbx",
        (object) => {
          object.traverse((child) => {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child instanceof THREE.Mesh) {
              const materials = Array.isArray(child.material)
                ? child.material
                : [child.material];

              const newMaterials = materials.map((mat) => {
                return new THREE.MeshStandardMaterial({
                  color: 0xffffff,
                  map: baseTexture,
                });
              });

              child.material = Array.isArray(child.material)
                ? newMaterials
                : newMaterials[0];
            }
          });

          object.position.set(pos.x, pos.y, pos.z);

          const scale = 0.075;
          object.scale.set(scale, scale, scale);

          // 成功載入後 resolve
          resolve(object);
        },
        undefined, // onProgress callback (可選)
        (error) => {
          // 載入失敗時 reject
          console.error("載入 FBX 時發生錯誤:", error);
          reject(error);
        }
      );
    });
  }

  createArrow(
    type: string,
    pos: THREE.Vector3
  ): Promise<{
    object: THREE.Group;
    mixer: THREE.AnimationMixer;
  }> {
    return new Promise((resolve, reject) => {
      const loader = new FBXLoader();
      const textureLoader = new THREE.TextureLoader();

      const baseTexture = textureLoader.load("./model/basetexture.jpg");

      loader.load(
        "./model/road/Animation.fbx",
        (object) => {
          object.traverse((child) => {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child instanceof THREE.Mesh) {
              const materials = Array.isArray(child.material)
                ? child.material
                : [child.material];

              const newMaterials = materials.map((mat) => {
                return new THREE.MeshStandardMaterial({
                  color: 0xaaffff,
                  map: baseTexture,
                });
              });

              child.material = Array.isArray(child.material)
                ? newMaterials
                : newMaterials[0];
            }
          });

          object.position.set(pos.x, pos.y, pos.z);

          const scale = 0.075;
          object.scale.set(scale, scale, scale);

          object.userData.type = type;

          // 創建動畫混合器
          const mixer = new THREE.AnimationMixer(object);

          // 如果 FBX 有動畫數據
          console.log(object.animations);
          if (object.animations && object.animations.length > 0) {
            // 播放第一個動畫
            const action = mixer.clipAction(object.animations[0]);
            action.play();
          }

          // 返回物件和混合器
          resolve({ object, mixer });
        },
        undefined,
        (error) => {
          console.error("載入 FBX 時發生錯誤:", error);
          reject(error);
        }
      );
    });
  }
}
