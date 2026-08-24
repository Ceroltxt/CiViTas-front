const sidebarCollapsed = ref(false)

export function useSidebarState() {
  function toggle() { sidebarCollapsed.value = !sidebarCollapsed.value }
  return { collapsed: sidebarCollapsed, toggle }
}
