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

  async createArrowGroup(
    type: string,
    pos: THREE.Vector3,
    count: number
  ): Promise<ArrowGroupController> {
    const loader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();
    const baseTexture = textureLoader.load("./model/basetexture.jpg");

    // 先載入一次取得動畫數據
    const loadSingle = (): Promise<THREE.Group> => {
      return new Promise((resolve, reject) => {
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

                const newMaterials = materials.map(() => {
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

            resolve(object);
          },
          undefined,
          reject
        );
      });
    };

    // 載入所有箭頭
    const objects: THREE.Group[] = [];
    const mixers: THREE.AnimationMixer[] = [];
    let clips: THREE.AnimationClip[] = [];

    for (let i = 0; i < count; i++) {
      const object = await loadSingle();
      objects.push(object);
      mixers.push(new THREE.AnimationMixer(object));
    }

    // 修正動畫 duration（只需處理一次，所有物件共用同樣的 clips）
    if (objects[0].animations && objects[0].animations.length > 0) {
      objects[0].animations.forEach((clip) => {
        let maxTime = 0;
        let minTime = Infinity;

        clip.tracks.forEach((track) => {
          if (track.times.length > 0) {
            minTime = Math.min(minTime, track.times[0]);
            maxTime = Math.max(maxTime, track.times[track.times.length - 1]);
          }
        });

        if (minTime > 0) {
          clip.tracks.forEach((track) => {
            for (let i = 0; i < track.times.length; i++) {
              track.times[i] -= minTime;
            }
          });
        }

        // clip.duration = maxTime - minTime;
        clip.duration = 3;
      });

      clips = objects[0].animations;
    }

    // 追蹤所有 actions
    let currentActions: THREE.AnimationAction[] = [];
    let staggerTimeouts: number[] = [];

    const controller: ArrowGroupController = {
      objects,
      mixers,
      clips,

      play(clipIndex: number, options?: PlayOptions) {
        if (clipIndex < 0 || clipIndex >= clips.length) {
          console.warn(`Invalid clip index: ${clipIndex}`);
          return;
        }

        // 清除之前的延遲
        staggerTimeouts.forEach((t) => clearTimeout(t));
        staggerTimeouts = [];

        // 停止所有當前動畫
        currentActions.forEach((action) => action.stop());
        currentActions = [];

        const delay = options?.staggerDelay ?? 250; // 預設 0.25 秒

        mixers.forEach((mixer, index) => {
          const timeoutId = window.setTimeout(() => {
            const action = mixer.clipAction(clips[clipIndex]);

            if (options?.loop !== undefined) {
              action.loop = options.loop;
            }
            if (options?.clampWhenFinished !== undefined) {
              action.clampWhenFinished = options.clampWhenFinished;
            }
            if (options?.timeScale !== undefined) {
              action.timeScale = options.timeScale;
            }

            action.reset().play();
            currentActions.push(action);
          }, index * delay);

          staggerTimeouts.push(timeoutId);
        });
      },

      pause() {
        currentActions.forEach((action) => {
          action.paused = true;
        });
      },

      resume() {
        currentActions.forEach((action) => {
          action.paused = false;
        });
      },

      stop() {
        staggerTimeouts.forEach((t) => clearTimeout(t));
        staggerTimeouts = [];

        currentActions.forEach((action) => action.stop());
        currentActions = [];
      },

      setSpeed(speed: number) {
        currentActions.forEach((action) => {
          action.timeScale = speed;
        });
      },

      getClipNames() {
        return clips.map((clip, i) => `${i}: ${clip.name}`);
      },
    };

    return controller;
  }
}

interface ArrowGroupController {
  objects: THREE.Group[];
  mixers: THREE.AnimationMixer[];
  clips: THREE.AnimationClip[];

  play: (clipIndex: number, options?: PlayOptions) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setSpeed: (speed: number) => void;
  getClipNames: () => string[];
}

interface PlayOptions {
  loop?: THREE.AnimationActionLoopStyles;
  clampWhenFinished?: boolean;
  timeScale?: number;
  staggerDelay?: number; // 間隔延遲，預設 0.25 秒
}
