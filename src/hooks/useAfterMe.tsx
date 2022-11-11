import { onMounted } from "vue";
import { useMeStroe } from "../stores/useMeStore";
export const useAfterMe = (fn: () => void) => {
  const meStore = useMeStroe();
  onMounted(async () => {
    await meStore.mePromise;
    fn();
  });
};
