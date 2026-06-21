import { d as _sfc_main$8, D as navigateTo, f as _sfc_main$d } from './server.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public-Bfljrhac.mjs';
import { u as useColorMode } from './composables-DNpMA8Ck.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:fs';
import 'node:path';
import 'pinia';
import 'vue-router';
import '@vue/shared';
import '@iconify/vue';
import 'tailwindcss/colors';
import '@vueuse/core';
import '@vueuse/shared';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ponte",
  __ssrInlineRender: true,
  setup(__props) {
    const colorMode = useColorMode();
    function toggleTheme() {
      colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
    }
    const projects = [
      {
        role: "admin",
        roleLabel: "Admin",
        name: "Painel Administrativo",
        roleDesc: "Acesso total ao sistema",
        icon: "i-lucide-folder-open",
        iconBg: "bg-red-100 dark:bg-red-950",
        iconColor: "text-red-500 dark:text-red-400",
        badgeIcon: "i-lucide-crown",
        badgeClass: "text-red-500 dark:text-red-400",
        borderClass: "border-slate-200 dark:border-slate-700",
        roleDescClass: "text-red-500 dark:text-red-400",
        btnClass: "bg-red-600 hover:bg-red-700 text-white border-transparent",
        route: "/admin",
        perms: [
          { icon: "i-lucide-users", label: "Gerenciar usuários e permissões" },
          { icon: "i-lucide-layout", label: "Configurar projetos e fluxos" },
          { icon: "i-lucide-bar-chart-2", label: "Relatórios e métricas globais" }
        ]
      },
      {
        role: "gestor",
        roleLabel: "Gestor",
        name: "Projeto Website",
        roleDesc: "Gestor",
        icon: "i-lucide-monitor",
        iconBg: "bg-purple-100 dark:bg-purple-950",
        iconColor: "text-purple-500 dark:text-purple-400",
        badgeIcon: "i-lucide-user-check",
        badgeClass: "text-purple-500 dark:text-purple-400",
        borderClass: "border-slate-200 dark:border-slate-700",
        roleDescClass: "text-purple-500 dark:text-purple-400",
        btnClass: "bg-transparent hover:bg-purple-50 dark:hover:bg-purple-950 text-purple-600 dark:text-purple-400 border-purple-500 dark:border-purple-400",
        route: "/gestor",
        desc: "Gerencia tarefas, prazos e equipe deste projeto.",
        perms: null
      },
      {
        role: "colaborador",
        roleLabel: "Colaborador",
        name: "Projeto App Mobile",
        roleDesc: "Colaborador",
        icon: "i-lucide-smartphone",
        iconBg: "bg-amber-100 dark:bg-amber-950",
        iconColor: "text-amber-500 dark:text-amber-400",
        badgeIcon: "i-lucide-user",
        badgeClass: "text-amber-500 dark:text-amber-400",
        borderClass: "border-slate-200 dark:border-slate-700",
        roleDescClass: "text-amber-500 dark:text-amber-400",
        btnClass: "bg-transparent hover:bg-amber-50 dark:hover:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-500 dark:border-amber-400",
        route: "/colaborador",
        desc: "Acompanhe e execute suas tarefas neste projeto.",
        perms: null
      },
      {
        role: "visualizador",
        roleLabel: "Visualizador",
        name: "Projeto Marketing",
        roleDesc: "Acesso total ao sistema",
        icon: "i-lucide-megaphone",
        iconBg: "bg-blue-100 dark:bg-blue-950",
        iconColor: "text-blue-500 dark:text-blue-400",
        badgeIcon: "i-lucide-eye",
        badgeClass: "text-blue-500 dark:text-blue-400",
        borderClass: "border-slate-200 dark:border-slate-700",
        roleDescClass: "text-blue-500 dark:text-blue-400",
        btnClass: "bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-500 dark:border-blue-400",
        route: "/visualizador",
        desc: "Visualize o andamento das tarefas e acompanhe o progresso.",
        perms: null
      }
    ];
    const lastAccess = [
      {
        project: "Projeto Website",
        role: "Gestor",
        icon: "i-lucide-monitor",
        iconClass: "text-purple-500 dark:text-purple-400",
        badgeClass: "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300",
        date: "Hoje, 08:45"
      },
      {
        project: "Projeto App Mobile",
        role: "Colaborador",
        icon: "i-lucide-smartphone",
        iconClass: "text-amber-500 dark:text-amber-400",
        badgeClass: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
        date: "Ontem, 16:20"
      },
      {
        project: "Projeto Marketing",
        role: "Visualizador",
        icon: "i-lucide-megaphone",
        iconClass: "text-blue-500 dark:text-blue-400",
        badgeClass: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
        date: "12/04/2026"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UIcon = _sfc_main$d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative min-h-screen flex flex-col items-center pb-10 overflow-hidden bg-gray-50 dark:bg-slate-900" }, _attrs))}><div class="fixed w-46 h-46 rounded-full bg-purple-300 opacity-40 dark:opacity-15 top-25 -left-16 pointer-events-none z-0"></div><div class="fixed w-58 h-58 rounded-full bg-orange-200 opacity-50 dark:opacity-15 -top-14 -right-14 pointer-events-none z-0"></div><header class="relative z-10 w-full max-w-5xl flex items-center justify-between px-6 py-4"><div class="flex gap-1 w-20">`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "ghost",
        color: "neutral",
        icon: "i-lucide-sun-moon",
        square: "",
        size: "sm",
        onClick: toggleTheme
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "ghost",
        color: "neutral",
        icon: "i-lucide-log-out",
        square: "",
        size: "sm",
        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/login")
      }, null, _parent));
      _push(`</div><img${ssrRenderAttr("src", _imports_0)} alt="Logo Civitas" class="w-32 mx-auto"><div class="w-20"></div></header><section class="relative z-10 text-center px-6 pt-2 pb-8 max-w-2xl"><h1 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2"> Bem vindo(a), usuário! 👋 </h1><p class="text-base text-slate-500 dark:text-slate-400 leading-relaxed"> Você tem acesso a diferentes trabalhos. Escolha o projeto e o seu papel para continuar. </p></section><section class="relative z-10 w-full max-w-5xl px-4 mb-4"><div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"><div class="flex items-center gap-2 mb-5">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-briefcase",
        class: "text-red-500 text-lg"
      }, null, _parent));
      _push(`<span class="font-bold text-slate-800 dark:text-slate-100 text-sm">Escolha onde você quer atuar</span></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><!--[-->`);
      ssrRenderList(projects, (project) => {
        _push(`<div class="relative flex flex-col gap-2 border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-800/50"><div class="${ssrRenderClass([project.badgeClass, "absolute top-3 right-3 flex items-center gap-1 text-xs font-bold tracking-wide"])}">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: project.badgeIcon,
          class: "text-sm"
        }, null, _parent));
        _push(`<span>${ssrInterpolate(project.role.toUpperCase())}</span></div><div class="${ssrRenderClass([project.iconBg, "w-14 h-14 rounded-xl flex items-center justify-center mb-1"])}">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: project.icon,
          class: ["text-2xl", project.iconColor]
        }, null, _parent));
        _push(`</div><h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 pr-16">${ssrInterpolate(project.name)}</h3><p class="${ssrRenderClass([project.roleDescClass, "text-xs font-semibold"])}">${ssrInterpolate(project.roleDesc)}</p>`);
        if (project.desc) {
          _push(`<p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${ssrInterpolate(project.desc)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (project.perms) {
          _push(`<ul class="flex flex-col gap-2 mt-1"><!--[-->`);
          ssrRenderList(project.perms, (perm) => {
            _push(`<li class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: perm.icon,
              class: ["text-sm flex-shrink-0", project.iconColor]
            }, null, _parent));
            _push(` ${ssrInterpolate(perm.label)}</li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex-1"></div><button class="${ssrRenderClass([project.btnClass, "mt-3 w-full py-2 px-4 rounded-lg border text-sm font-semibold transition-colors cursor-pointer"])}"> Entrar como ${ssrInterpolate(project.roleLabel)} → </button></div>`);
      });
      _push(`<!--]--></div></div></section><section class="relative z-10 w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"><div class="flex items-center gap-2 mb-4">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-clock",
        class: "text-red-500 text-lg"
      }, null, _parent));
      _push(`<span class="font-bold text-slate-800 dark:text-slate-100 text-sm">Últimos acessos</span></div><div class="flex flex-col gap-3"><!--[-->`);
      ssrRenderList(lastAccess, (entry) => {
        _push(`<div class="grid grid-cols-[1fr_auto_auto] items-center gap-3"><div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: entry.icon,
          class: ["text-base flex-shrink-0", entry.iconClass]
        }, null, _parent));
        _push(` ${ssrInterpolate(entry.project)}</div><span class="${ssrRenderClass([entry.badgeClass, "text-xs font-bold px-2.5 py-0.5 rounded-full uppercase"])}">${ssrInterpolate(entry.role)}</span><span class="text-xs text-slate-400 whitespace-nowrap">${ssrInterpolate(entry.date)}</span></div>`);
      });
      _push(`<!--]--></div></div><div class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"><div class="flex items-center gap-2 mb-3">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-lightbulb",
        class: "text-purple-500 text-lg"
      }, null, _parent));
      _push(`<span class="font-bold text-slate-800 dark:text-slate-100 text-sm">Dica</span></div><p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed"> Você pode alternar entre seus acessos a qualquer momento. Basta voltar a esta tela e escolher outra opção. </p></div></section><footer class="relative z-10 mt-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "ghost",
        color: "error",
        icon: "i-lucide-log-out",
        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/login")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Sair da conta `);
          } else {
            return [
              createTextVNode(" Sair da conta ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ponte.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ponte-DNB_oLiz.mjs.map
