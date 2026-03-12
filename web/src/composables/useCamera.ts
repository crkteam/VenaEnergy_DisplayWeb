import { ref } from "vue";
import type { Ref } from "vue";
import type BottomLayer from "@/component/bottom-layer/BottomLayer.vue";

export function useCamera(
  bottomLayerRef: Ref<InstanceType<typeof BottomLayer> | null>
) {
  const cameraLockedType = ref("");

  const handleLockCamera = (areaType: string) => {
    cameraLockedType.value = areaType;
    bottomLayerRef.value?.lockCameraToArea(areaType);
  };

  const handleUnlockCamera = () => {
    cameraLockedType.value = "";
    bottomLayerRef.value?.unlockCamera();
  };

  return { cameraLockedType, handleLockCamera, handleUnlockCamera };
}
