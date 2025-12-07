import { Camera } from "three/src/cameras/Camera";
import * as THREE from "three";
import { Vector2, Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

// 動畫組類型
export type AnimationGroupType = "A" | "B" | "C" | "D" | "X";

// 動畫狀態
export type AnimationState = 0 | 1 | "stop";

// 單一動畫組控制器
export interface SingleAnimationController {
  object: THREE.Group;
  mixer: THREE.AnimationMixer;
  clips: THREE.AnimationClip[];
  currentState: AnimationState;

  setState: (state: AnimationState) => void;
  getState: () => AnimationState;
}

// 完整的五組動畫控制器
export interface MultiAnimationController {
  controllers: Map<AnimationGroupType, SingleAnimationController>;

  // 設定單一組的狀態
  setState: (type: AnimationGroupType, state: AnimationState) => void;

  // 取得單一組的狀態
  getState: (type: AnimationGroupType) => AnimationState;

  // 設定所有組的狀態
  setAllStates: (state: AnimationState) => void;

  // 批次設定多組狀態
  setStates: (
    states: Partial<Record<AnimationGroupType, AnimationState>>
  ) => void;

  // 更新所有 mixer
  update: (delta: number) => void;

  // 取得所有 objects（用於加入 scene）
  getAllObjects: () => THREE.Group[];

  // 取得所有狀態
  getAllStates: () => Record<AnimationGroupType, AnimationState>;
}

export class ObjectCreator {
  createCamera(view: Vector2, pos: Vector3): Camera {
    const aspect = view.x / view.y;
    const fov = 45;
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

          resolve(object);
        },
        undefined,
        (error) => {
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

              const newMaterials = materials.map(() => {
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

          resolve(object);
        },
        undefined,
        (error) => {
          console.error("載入 FBX 時發生錯誤:", error);
          reject(error);
        }
      );
    });
  }

  /**
   * 創建多組動畫控制器（A、B、C、D、X）
   * 每組有獨立的動畫檔案和兩個動畫
   */
  async createMultiAnimationGroup(
    pos: THREE.Vector3
  ): Promise<MultiAnimationController> {
    const animationTypes: AnimationGroupType[] = ["A", "B", "C", "D", "X"];
    const controllers = new Map<
      AnimationGroupType,
      SingleAnimationController
    >();

    // 載入每一組動畫
    for (const type of animationTypes) {
      const controller = await this.loadSingleAnimationGroup(type, pos);
      controllers.set(type, controller);
    }

    // 建立完整控制器
    const multiController: MultiAnimationController = {
      controllers,

      setState(type: AnimationGroupType, state: AnimationState) {
        const controller = controllers.get(type);
        if (controller) {
          controller.setState(state);
        } else {
          console.warn(`Animation group "${type}" not found`);
        }
      },

      getState(type: AnimationGroupType): AnimationState {
        const controller = controllers.get(type);
        return controller ? controller.getState() : "stop";
      },

      setAllStates(state: AnimationState) {
        controllers.forEach((controller) => {
          controller.setState(state);
        });
      },

      setStates(states: Partial<Record<AnimationGroupType, AnimationState>>) {
        Object.entries(states).forEach(([type, state]) => {
          const controller = controllers.get(type as AnimationGroupType);
          if (controller && state !== undefined) {
            controller.setState(state);
          }
        });
      },

      update(delta: number) {
        controllers.forEach((controller) => {
          controller.mixer.update(delta);
        });
      },

      getAllObjects(): THREE.Group[] {
        const objects: THREE.Group[] = [];
        controllers.forEach((controller) => {
          objects.push(controller.object);
        });
        return objects;
      },

      getAllStates(): Record<AnimationGroupType, AnimationState> {
        const states: Record<AnimationGroupType, AnimationState> = {
          A: "stop",
          B: "stop",
          C: "stop",
          D: "stop",
          X: "stop",
        };
        controllers.forEach((controller, type) => {
          states[type] = controller.getState();
        });
        return states;
      },
    };

    return multiController;
  }

  /**
   * 載入單一動畫組
   */
  private async loadSingleAnimationGroup(
    type: AnimationGroupType,
    pos: THREE.Vector3
  ): Promise<SingleAnimationController> {
    const loader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();
    const baseTexture = textureLoader.load("./model/basetexture.jpg");

    return new Promise((resolve, reject) => {
      loader.load(
        `./model/road/${type}animation.fbx`,
        (object) => {
          // 設定材質
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

          // 設定位置和縮放
          object.position.set(pos.x, pos.y, pos.z);
          const scale = 0.075;
          object.scale.set(scale, scale, scale);
          object.userData.type = type;

          // 建立 mixer
          const mixer = new THREE.AnimationMixer(object);
          const clips = object.animations || [];

          // 處理動畫 clips
          clips.forEach((clip) => {
            let maxTime = 0;
            let minTime = Infinity;

            clip.tracks.forEach((track) => {
              if (track.times.length > 0) {
                minTime = Math.min(minTime, track.times[0]);
                maxTime = Math.max(
                  maxTime,
                  track.times[track.times.length - 1]
                );
              }
            });

            if (minTime > 0 && minTime !== Infinity) {
              clip.tracks.forEach((track) => {
                for (let i = 0; i < track.times.length; i++) {
                  track.times[i] -= minTime;
                }
              });
            }

            clip.duration = 3; // 固定動畫長度
          });

          // 當前狀態和 action
          let currentAction: THREE.AnimationAction | null = null;

          const controller: SingleAnimationController = {
            object,
            mixer,
            clips,
            currentState: "stop" as AnimationState,

            setState(state: AnimationState) {
              // 如果狀態相同則不處理
              if (this.currentState === state) return;

              // 停止當前動畫
              if (currentAction) {
                currentAction.stop();
                currentAction = null;
              }

              this.currentState = state;

              // 根據狀態播放對應動畫
              if (state === "stop") {
                // 不播放任何動畫
                return;
              }

              const clipIndex = state as number; // 0 或 1
              if (clipIndex >= 0 && clipIndex < clips.length) {
                currentAction = mixer.clipAction(clips[clipIndex]);
                currentAction.loop = THREE.LoopRepeat;
                currentAction.reset().play();
              } else {
                console.warn(
                  `Animation clip index ${clipIndex} not found for group "${type}"`
                );
              }
            },

            getState(): AnimationState {
              return this.currentState;
            },
          };

          resolve(controller);
        },
        undefined,
        (error) => {
          console.error(`載入 ${type}animation.fbx 時發生錯誤:`, error);
          reject(error);
        }
      );
    });
  }
}
