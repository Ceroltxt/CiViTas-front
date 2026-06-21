import { computed, toValue } from 'vue';
import { unrefElement } from '@vueuse/core';

function useFormControl(el) {
  return computed(() => toValue(el) ? Boolean(unrefElement(el)?.closest("form")) : true);
}

export { useFormControl as u };
//# sourceMappingURL=useFormControl-9B1GcqCr.mjs.map
