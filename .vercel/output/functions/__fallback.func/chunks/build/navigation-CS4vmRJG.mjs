const NAV_BY_ROLE = {
  colaborador: [
    { label: "Início", icon: "i-heroicons-home", to: "/colaborador" },
    { label: "Minhas Tarefas", icon: "i-heroicons-clipboard-document-list", to: "/colaborador/minhas-tarefas" },
    { label: "Quadros", icon: "i-heroicons-squares-2x2", to: "/colaborador/quadros" },
    { label: "Calendário", icon: "i-heroicons-calendar-days", to: "/colaborador/calendario" },
    { label: "Relatórios", icon: "i-heroicons-document-chart-bar", to: "/colaborador/relatorios" },
    { label: "Configurações", icon: "i-heroicons-cog-6-tooth", to: "/colaborador/configuracoes" }
  ],
  gestor: [
    { label: "Início", icon: "i-heroicons-home", to: "/gestor" },
    { label: "Quadros", icon: "i-heroicons-squares-2x2", to: "/gestor/quadros" },
    { label: "Calendário", icon: "i-heroicons-calendar-days", to: "/gestor/calendario" },
    { label: "Equipes", icon: "i-heroicons-user-group", to: "/gestor/equipes" },
    { label: "Relatórios", icon: "i-heroicons-document-chart-bar", to: "/gestor/relatorios" },
    { label: "Configurações", icon: "i-heroicons-cog-6-tooth", to: "/gestor/configuracoes" }
  ],
  admin: [
    { label: "Início", icon: "i-heroicons-home", to: "/admin" },
    { label: "Quadros", icon: "i-heroicons-squares-2x2", to: "/admin/quadros" },
    { label: "Projetos", icon: "i-heroicons-folder", to: "/admin/projetos" },
    { label: "Acessos", icon: "i-heroicons-key", to: "/admin/acessos" },
    { label: "Relatorios", icon: "i-heroicons-shield-check", to: "/admin/relatorios" },
    { label: "Configurações", icon: "i-heroicons-cog-6-tooth", to: "/admin/configuracoes" }
  ]
};
function resolveAppRole(role) {
  const normalized = role?.toLowerCase().trim() ?? "";
  if (normalized.includes("admin")) return "admin";
  if (normalized.includes("gestor")) return "gestor";
  return "colaborador";
}
function getHomePath(appRole) {
  return NAV_BY_ROLE[appRole][0].to;
}
function getNavigationForRole(appRole) {
  return NAV_BY_ROLE[appRole];
}

export { getNavigationForRole as a, getHomePath as g, resolveAppRole as r };
//# sourceMappingURL=navigation-CS4vmRJG.mjs.map
