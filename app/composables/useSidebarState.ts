export function useSidebarState() {
  const sidebarCollapsed = useCookie('civitas_sidebar_collapsed', { default: () => false })
  function toggle() { sidebarCollapsed.value = !sidebarCollapsed.value }
  return { collapsed: sidebarCollapsed, toggle }
}
