import { ref, reactive } from "vue";
import type { Ref } from "vue";
import type BottomLayer from "@/component/bottom-layer/BottomLayer.vue";
import {
  AnimationGroupType,
  AnimationState,
} from "@/component/bottom-layer/object-creator";

export function useAnimation(
  bottomLayerRef: Ref<InstanceType<typeof BottomLayer> | null>,
  initialStates?: Partial<Record<AnimationGroupType, AnimationState>>
) {
  const keyToGroup: Record<string, AnimationGroupType> = {
    "0": "A",
    "1": "B",
    "2": "C",
    "3": "D",
    "4": "X",
  };

  const animationStates = reactive<Record<AnimationGroupType, AnimationState>>({
    A: initialStates?.A ?? 0,
    B: initialStates?.B ?? 0,
    C: initialStates?.C ?? 0,
    D: initialStates?.D ?? 0,
    X: initialStates?.X ?? 0,
  });

  const isPaused = ref(false);

  const toggleAnimationState = (group: AnimationGroupType) => {
    if (isPaused.value) return;
    const next: AnimationState = animationStates[group] === 0 ? 1 : 0;
    animationStates[group] = next;
    bottomLayerRef.value?.setAnimationState(group, next);
  };

  const pauseAllAnimations = () => {
    isPaused.value = true;
    bottomLayerRef.value?.setAllAnimationStates("stop");
  };

  const resumeAllAnimations = () => {
    isPaused.value = false;
    bottomLayerRef.value?.resumeAllAnimations();
  };

  const togglePause = () =>
    isPaused.value ? resumeAllAnimations() : pauseAllAnimations();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === "s") return togglePause();
    if (event.key in keyToGroup) toggleAnimationState(keyToGroup[event.key]);
  };

  return { handleKeyDown };
}
