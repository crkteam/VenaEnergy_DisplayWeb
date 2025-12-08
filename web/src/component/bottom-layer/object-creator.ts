import { Camera } from "three/src/cameras/Camera";
import * as THREE from "three";
import { Vector2, Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

// 動畫組類型
export type AnimationGroupType = "A" | "B" | "C" | "D" | "X";

// 動畫狀態
export type AnimationState = 0 | 1 | "stop";

// 單一動畫組的配置
export interface AnimationGroupConfig {
  count: number; // 該組要生成幾份
  delay: number; // 每份之間的延遲（秒）
}

// 單一實例控制器（內部使用）
interface SingleInstanceController {
  object: THREE.Group;
  mixer: THREE.AnimationMixer;
  clips: THREE.AnimationClip[];
  currentAction: THREE.AnimationAction | null;
}

// 單一動畫組控制器（包含多個實例）
export interface SingleAnimationController {
  instances: SingleInstanceController[];
  currentState: AnimationState;
  config: AnimationGroupConfig;

  setState: (state: AnimationState) => void;
  getState: () => AnimationState;
  getAllObjects: () => THREE.Group[];
  resume: () => void; // 從暫停恢復播放
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

  // 從暫停恢復所有動畫
  resumeAll: () => void;
}

// 建立 MultiAnimationGroup 的配置
export type MultiAnimationGroupConfig = Partial<
  Record<AnimationGroupType, AnimationGroupConfig>
>;

// 預設配置
const DEFAULT_CONFIG: AnimationGroupConfig = {
  count: 1,
  delay: 0,
};

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
   * 每組可配置實例數量和延遲
   *
   * @param pos 基礎位置
   * @param config 各組的配置，例如 { A: { count: 5, delay: 1 }, B: { count: 3, delay: 0.5 } }
   */
  async createMultiAnimationGroup(
    pos: THREE.Vector3,
    config?: MultiAnimationGroupConfig
  ): Promise<MultiAnimationController> {
    const animationTypes: AnimationGroupType[] = ["A", "B", "C", "D", "X"];
    const controllers = new Map<
      AnimationGroupType,
      SingleAnimationController
    >();

    // 載入每一組動畫
    for (const type of animationTypes) {
      const groupConfig = config?.[type] ?? DEFAULT_CONFIG;
      const controller = await this.loadSingleAnimationGroup(
        type,
        pos,
        groupConfig
      );
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
          controller.instances.forEach((instance) => {
            instance.mixer.update(delta);
          });
        });
      },

      getAllObjects(): THREE.Group[] {
        const objects: THREE.Group[] = [];
        controllers.forEach((controller) => {
          controller.instances.forEach((instance) => {
            objects.push(instance.object);
          });
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

      resumeAll() {
        controllers.forEach((controller) => {
          controller.resume();
        });
      },
    };

    return multiController;
  }

  /**
   * 載入單一動畫組（可包含多個實例）
   */
  private async loadSingleAnimationGroup(
    type: AnimationGroupType,
    pos: THREE.Vector3,
    config: AnimationGroupConfig
  ): Promise<SingleAnimationController> {
    const loader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();
    const baseTexture = textureLoader.load("./model/basetexture.jpg");

    const instances: SingleInstanceController[] = [];

    // 載入指定數量的實例
    for (let i = 0; i < config.count; i++) {
      const instance = await this.loadSingleInstance(
        type,
        pos,
        loader,
        baseTexture
      );
      instances.push(instance);
    }

    // 追蹤延遲 timeouts
    let staggerTimeouts: number[] = [];

    const controller: SingleAnimationController = {
      instances,
      currentState: "stop" as AnimationState,
      config,

      setState(state: AnimationState) {
        // 如果狀態相同則不處理
        if (this.currentState === state) return;

        // 清除之前的延遲
        staggerTimeouts.forEach((t) => clearTimeout(t));
        staggerTimeouts = [];

        // 如果是暫停狀態，凍結所有動畫在當前畫面
        if (state === "stop") {
          instances.forEach((instance) => {
            if (instance.currentAction) {
              instance.currentAction.paused = true;
            }
          });
          this.currentState = state;
          return;
        }

        const clipIndex = state as number; // 0 或 1
        const previousState = this.currentState;
        this.currentState = state;

        // 依序播放每個實例的動畫（帶延遲）
        instances.forEach((instance, index) => {
          const delayMs = index * config.delay * 1000; // 轉換為毫秒

          const timeoutId = window.setTimeout(() => {
            if (clipIndex >= 0 && clipIndex < instance.clips.length) {
              // 如果之前是暫停狀態，且要播放同一個動畫，則恢復播放
              if (
                previousState === "stop" &&
                instance.currentAction &&
                instance.currentAction.getClip() === instance.clips[clipIndex]
              ) {
                instance.currentAction.paused = false;
              } else {
                // 停止舊動畫
                if (instance.currentAction) {
                  instance.currentAction.stop();
                }

                // 播放新動畫
                const action = instance.mixer.clipAction(
                  instance.clips[clipIndex]
                );
                action.loop = THREE.LoopRepeat;
                action.reset().play();
                instance.currentAction = action;
              }
            } else {
              console.warn(
                `Animation clip index ${clipIndex} not found for group "${type}"`
              );
            }
          }, delayMs);

          staggerTimeouts.push(timeoutId);
        });
      },

      getState(): AnimationState {
        return this.currentState;
      },

      getAllObjects(): THREE.Group[] {
        return instances.map((instance) => instance.object);
      },

      resume() {
        // 只有在暫停狀態才執行恢復
        if (this.currentState !== "stop") return;

        // 恢復所有實例的動畫
        instances.forEach((instance) => {
          if (instance.currentAction) {
            instance.currentAction.paused = false;
          }
        });

        // 找出之前播放的是哪個動畫（從 currentAction 判斷）
        const firstInstance = instances[0];
        if (firstInstance?.currentAction) {
          const clip = firstInstance.currentAction.getClip();
          const clipIndex = firstInstance.clips.indexOf(clip);
          if (clipIndex !== -1) {
            this.currentState = clipIndex as AnimationState;
          }
        }
      },
    };

    return controller;
  }

  /**
   * 載入單一實例
   */
  private loadSingleInstance(
    type: AnimationGroupType,
    pos: THREE.Vector3,
    loader: FBXLoader,
    baseTexture: THREE.Texture
  ): Promise<SingleInstanceController> {
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

              clip.duration = maxTime - minTime;
            }
          });

          resolve({
            object,
            mixer,
            clips,
            currentAction: null,
          });
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
