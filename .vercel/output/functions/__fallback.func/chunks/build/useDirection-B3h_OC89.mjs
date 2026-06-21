import { x as injectConfigProviderContext } from './server.mjs';
import { ref, computed } from 'vue';

function useDirection(dir) {
  const context = injectConfigProviderContext({ dir: ref("ltr") });
  return computed(() => dir?.value || context.dir?.value || "ltr");
}

export { useDirection as u };
//# sourceMappingURL=useDirection-B3h_OC89.mjs.map
