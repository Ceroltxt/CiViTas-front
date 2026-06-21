import { g as getHomePath, a as getNavigationForRole } from './navigation-CS4vmRJG.mjs';
import { $ as useRoute } from './server.mjs';
import { computed } from 'vue';

function useAppNavigation() {
  const route = useRoute();
  const appRole = computed(() => {
    if (route.path.startsWith("/gestor")) return "gestor";
    if (route.path.startsWith("/admin")) return "admin";
    return "colaborador";
  });
  const homePath = computed(() => getHomePath(appRole.value));
  const items = computed(() => getNavigationForRole(appRole.value));
  return { appRole, homePath, items };
}

export { useAppNavigation as u };
//# sourceMappingURL=useAppNavigation-BTBZfLac.mjs.map
