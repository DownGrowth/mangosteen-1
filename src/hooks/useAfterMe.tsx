import { onMounted } from "vue";
import { useMeStroe } from "../stores/useMeStore";
export const useAfterMe = (fn: () => void) => {
  const meStore = useMeStroe();
  onMounted(() => {
    meStore.mePromise!.then(fn, () => undefined);
  });
};
