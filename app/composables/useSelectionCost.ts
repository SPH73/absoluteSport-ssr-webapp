// app/composables/useSelectionCost.ts
import { type Ref, type ComputedRef } from "vue";

/**
 * Generic helper for computing the total cost of selected items.
 *
 * T must at least have a termCost:number field (camps, clubs, etc.).
 */
export function useSelectionCost<T extends { termCost: number }>(
  selectedRefs: Ref<string[]> | ComputedRef<string[]>,
  options: Ref<T[]>,
  match: (option: T, ref: string) => boolean,
) {
  const cost = ref(0);

  const recalculate = () => {
    const refs = selectedRefs.value;
    cost.value = refs.reduce((total, refVal) => {
      const option = options.value.find(o => match(o, refVal));
      return option ? total + option.termCost : total;
    }, 0);
  };

  // Recalculate when selection changes
  watch(
    () => selectedRefs.value,
    () => {
      recalculate();
    },
    { deep: true, immediate: true },
  );

  // Recalculate when the underlying options change (e.g. filter changes)
  watch(
    options,
    () => {
      recalculate();
    },
    { deep: true },
  );

  return {
    cost,
    recalculate,
  };
}
