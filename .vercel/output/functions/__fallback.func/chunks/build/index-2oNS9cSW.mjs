import { _ as __nuxt_component_1 } from './SectionCard-CotbZH9k.mjs';
import { d as _sfc_main$8, f as _sfc_main$d, e as _sfc_main$b } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, isRef, createTextVNode, toDisplayString, useModel, openBlock, createBlock, Fragment, renderList, createCommentVNode, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { _ as _sfc_main$7, u as useNotifications } from './useNotifications-CEiwSWoL.mjs';
import { _ as __nuxt_component_2, e as useStatusMeta } from './ProgressBar-CoIUm3TO.mjs';
import { a as useTasksData, u as useProjectProgressForTask } from './useProjectProgress-CQIoMO92.mjs';
import { _ as _sfc_main$9 } from './Modal-DrlsEEos.mjs';
import { a as useCurrentUser } from './useCurrentUser-BUDY1vts.mjs';
import { E as v, e as dashboardMetricSchema, l as mockDashboardMetrics, a as agendaItemSchema, m as mockAgenda, y as rankingEntrySchema, q as mockRanking, k as mockCurrentUserRank, x as projectProgressSchema, p as mockProjects, B as teamSummarySchema, t as mockTeams, A as teamDetailsSchema, s as mockTeamDetails } from './index-D-j7ajRT.mjs';
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
import './overlay-CjyBzL1C.mjs';
import './utils-CJXk8l7g.mjs';
import 'aria-hidden';
import './useId-Df0AxZi5.mjs';
import './navigation-CS4vmRJG.mjs';

const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "StatCard",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    icon: {},
    iconClass: {},
    bgClass: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiSectionCard = __nuxt_component_1;
      const _component_UIcon = _sfc_main$d;
      _push(ssrRenderComponent(_component_UiSectionCard, mergeProps({ class: "!p-4" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-4"${_scopeId}><span class="${ssrRenderClass([__props.bgClass, "flex size-14 shrink-0 items-center justify-center rounded-full"])}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: __props.icon,
              class: ["size-6", __props.iconClass]
            }, null, _parent2, _scopeId));
            _push2(`</span><div${_scopeId}><p class="text-sm text-slate-400"${_scopeId}>${ssrInterpolate(__props.label)}</p><p class="text-2xl font-bold text-slate-800 dark:text-slate-100"${_scopeId}>${ssrInterpolate(__props.value)}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-4" }, [
                createVNode("span", {
                  class: ["flex size-14 shrink-0 items-center justify-center rounded-full", __props.bgClass]
                }, [
                  createVNode(_component_UIcon, {
                    name: __props.icon,
                    class: ["size-6", __props.iconClass]
                  }, null, 8, ["name", "class"])
                ], 2),
                createVNode("div", null, [
                  createVNode("p", { class: "text-sm text-slate-400" }, toDisplayString(__props.label), 1),
                  createVNode("p", { class: "text-2xl font-bold text-slate-800 dark:text-slate-100" }, toDisplayString(__props.value), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/inicio/StatCard.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$6, { __name: "InicioStatCard" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "AgendaList",
  __ssrInlineRender: true,
  props: {
    items: {}
  },
  setup(__props) {
    const props = __props;
    function lineClass(index) {
      if (props.items.length <= 1) return "hidden";
      if (index === 0) return "top-1/2 -bottom-4";
      if (index === props.items.length - 1) return "-top-4 bottom-1/2";
      return "-inset-y-4";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$d;
      _push(`<ul${ssrRenderAttrs(mergeProps({ class: "-mx-5 border-t border-slate-100 dark:border-slate-800" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.items, (item, index) => {
        _push(`<li class="grid grid-cols-[56px_28px_minmax(0,1fr)_auto_20px] items-center gap-x-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800"><span class="text-sm font-bold text-slate-800 dark:text-slate-100">${ssrInterpolate(item.time)}</span><span class="relative flex h-full items-center justify-center self-stretch"><span class="${ssrRenderClass([lineClass(index), "absolute left-1/2 w-px -translate-x-1/2 bg-slate-600 dark:bg-slate-500"])}"></span><span class="${ssrRenderClass([item.dotColor, "relative z-10 size-3 rounded-full"])}"></span></span><div class="min-w-0"><p class="truncate text-[15px] font-bold text-slate-800 dark:text-slate-100">${ssrInterpolate(item.title)}</p><p class="truncate text-xs text-slate-400">${ssrInterpolate(item.description)}</p></div><span class="${ssrRenderClass([item.tag.color, "justify-self-end rounded-full px-3.5 py-1.5 text-xs font-semibold"])}">${ssrInterpolate(item.tag.label)}</span>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-chevron-right",
          class: "size-5 justify-self-end text-slate-400"
        }, null, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/inicio/AgendaList.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$5, { __name: "InicioAgendaList" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "RankingList",
  __ssrInlineRender: true,
  props: {
    entries: {},
    me: {}
  },
  setup(__props) {
    const medal = {
      1: "text-amber-400",
      2: "text-slate-400",
      3: "text-orange-400"
    };
    function formatPoints(value) {
      return `${value.toLocaleString("pt-BR")} pontos`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$d;
      const _component_UAvatar = _sfc_main$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full min-h-0 flex-col" }, _attrs))}><ul class="shrink-0 space-y-4"><!--[-->`);
      ssrRenderList(__props.entries, (entry) => {
        _push(`<li class="flex items-center gap-3"><span class="w-5 shrink-0 text-center text-sm font-semibold text-slate-500">`);
        if (entry.position <= 3) {
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-heroicons-trophy-solid",
            class: ["size-4", medal[entry.position]]
          }, null, _parent));
        } else {
          _push(`<!--[-->${ssrInterpolate(entry.position)}º<!--]-->`);
        }
        _push(`</span>`);
        _push(ssrRenderComponent(_component_UAvatar, {
          src: entry.user.avatar,
          alt: entry.user.name,
          size: "sm"
        }, null, _parent));
        _push(`<span class="flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">${ssrInterpolate(entry.user.name)}</span><span class="text-sm font-semibold text-violet-500">${ssrInterpolate(formatPoints(entry.points))}</span></li>`);
      });
      _push(`<!--]--></ul>`);
      if (__props.me) {
        _push(`<div class="mt-auto shrink-0 flex items-center gap-2.5 rounded-xl border border-violet-200 bg-violet-50/70 px-2.5 py-3.5 dark:border-violet-900/50 dark:bg-violet-950/30"><span class="w-5 shrink-0 text-center text-sm font-semibold text-violet-600 dark:text-violet-300">${ssrInterpolate(__props.me.position)}º </span>`);
        _push(ssrRenderComponent(_component_UAvatar, {
          src: __props.me.user.avatar,
          alt: __props.me.user.name,
          size: "sm"
        }, null, _parent));
        _push(`<span class="flex-1 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">${ssrInterpolate(__props.me.user.name)}</span><span class="shrink-0 text-sm font-semibold text-violet-500">${ssrInterpolate(formatPoints(__props.me.points))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/inicio/RankingList.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$4, { __name: "InicioRankingList" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "TasksCard",
  __ssrInlineRender: true,
  props: {
    tasks: {}
  },
  setup(__props) {
    function projectProgress(task) {
      return useProjectProgressForTask(task.project, task.projectProgress);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$d;
      const _component_UiProgressBar = __nuxt_component_2;
      _push(`<ul${ssrRenderAttrs(mergeProps({ class: "space-y-3" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.tasks, (task) => {
        _push(`<li class="flex items-center gap-3"><span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-clipboard-document-list",
          class: "size-5 text-slate-400"
        }, null, _parent));
        _push(`</span><div class="min-w-0 flex-1"><p class="truncate text-sm font-medium text-slate-700 dark:text-slate-200">${ssrInterpolate(task.title)}</p></div><div class="flex shrink-0 items-center gap-2"><div class="w-20">`);
        _push(ssrRenderComponent(_component_UiProgressBar, {
          value: projectProgress(task)
        }, null, _parent));
        _push(`</div><span class="w-9 text-right text-sm font-semibold text-slate-500">${ssrInterpolate(projectProgress(task))}%</span></div></li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/inicio/TasksCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$3, { __name: "InicioTasksCard" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TeamsCard",
  __ssrInlineRender: true,
  props: {
    teams: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<ul${ssrRenderAttrs(mergeProps({ class: "space-y-5" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.teams, (team) => {
        _push(`<li class="flex items-center gap-3"><span class="${ssrRenderClass([team.color, "flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"])}">${ssrInterpolate(team.initial)}</span><div class="min-w-0 flex-1"><p class="text-sm font-semibold text-slate-800 dark:text-slate-100">${ssrInterpolate(team.name)}</p><p class="truncate text-xs text-slate-400">${ssrInterpolate(team.description)}</p></div></li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/inicio/TeamsCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$2, { __name: "InicioTeamsCard" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "TeamsModal",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    teams: {}
  }, {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {}
  }),
  emits: ["update:open"],
  setup(__props) {
    const open = useModel(__props, "open");
    const props = __props;
    const selectedId = ref(props.teams[0]?.id ?? "");
    const selected = computed(() => props.teams.find((t) => t.id === selectedId.value) ?? props.teams[0]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$9;
      const _component_UIcon = _sfc_main$d;
      _push(ssrRenderComponent(_component_UModal, mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event,
        title: "Minhas Equipes",
        description: "Veja as equipes que você pertence.",
        ui: { content: "max-w-4xl", body: "p-0 sm:p-0" }
      }, _attrs), {
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col md:h-[min(560px,75vh)] md:flex-row"${_scopeId}><aside class="w-full shrink-0 border-b border-slate-100 md:w-72 md:border-b-0 md:border-r dark:border-slate-800"${_scopeId}><ul class="max-h-64 overflow-y-auto scroll-thin p-3 md:flex md:max-h-none md:flex-col md:overflow-y-auto md:p-4"${_scopeId}><!--[-->`);
            ssrRenderList(__props.teams, (team) => {
              _push2(`<li${_scopeId}><button type="button" class="${ssrRenderClass([
                unref(selectedId) === team.id ? "border-violet-200 border-l-4 border-l-violet-600 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/30" : "border-slate-100 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50",
                "mb-2 flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors"
              ])}"${_scopeId}><span class="${ssrRenderClass([team.color, "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"])}"${_scopeId}>${ssrInterpolate(team.initial)}</span><div class="min-w-0 flex-1"${_scopeId}><p class="text-sm font-bold text-slate-800 dark:text-slate-100"${_scopeId}>${ssrInterpolate(team.name)}</p><p class="text-xs text-slate-400"${_scopeId}>${ssrInterpolate(team.collaboratorCount)} Colaborador${ssrInterpolate(team.collaboratorCount !== 1 ? "es" : "")} · ${ssrInterpolate(team.taskCount)} Tarefas </p></div>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-chevron-right",
                class: "size-4 shrink-0 text-slate-300"
              }, null, _parent2, _scopeId));
              _push2(`</button></li>`);
            });
            _push2(`<!--]--></ul></aside>`);
            if (unref(selected)) {
              _push2(`<div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"${_scopeId}><div class="min-h-0 flex-1 overflow-y-auto scroll-thin p-5 md:p-6"${_scopeId}><div class="mb-6 flex items-start gap-4"${_scopeId}><span class="${ssrRenderClass([unref(selected).color, "flex size-14 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"])}"${_scopeId}>${ssrInterpolate(unref(selected).initial)}</span><div${_scopeId}><h3 class="text-xl font-bold text-slate-800 dark:text-slate-100"${_scopeId}>${ssrInterpolate(unref(selected).name)}</h3><div class="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500"${_scopeId}><span class="inline-flex items-center gap-1"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-user-group",
                class: "size-4"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(selected).collaboratorCount)} Colaborador${ssrInterpolate(unref(selected).collaboratorCount !== 1 ? "es" : "")}</span><span class="text-slate-300"${_scopeId}>|</span><span class="inline-flex items-center gap-1"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-clipboard-document-check",
                class: "size-4"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(selected).taskCount)} Tarefas </span></div><p class="mt-2 text-sm text-slate-400"${_scopeId}>${ssrInterpolate(unref(selected).longDescription)}</p></div></div><section class="mb-6"${_scopeId}><h4 class="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100"${_scopeId}>Projeto da Equipe</h4><div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-briefcase",
                class: "size-5 text-violet-600"
              }, null, _parent2, _scopeId));
              _push2(`</span><div class="min-w-0 flex-1"${_scopeId}><div class="flex flex-wrap items-center gap-2"${_scopeId}><p class="font-bold text-slate-800 dark:text-slate-100"${_scopeId}>${ssrInterpolate(unref(selected).project.name)}</p><span class="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-600 dark:bg-violet-900/40"${_scopeId}>${ssrInterpolate(unref(selected).project.status)}</span></div><p class="text-sm text-violet-600 dark:text-violet-400"${_scopeId}>${ssrInterpolate(unref(selected).project.description)}</p><div class="mt-3 grid grid-cols-2 gap-4 text-sm"${_scopeId}><div${_scopeId}><p class="text-xs text-slate-400"${_scopeId}>Início</p><p class="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-calendar-days",
                class: "size-4 text-slate-400"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(selected).project.startDate)}</p></div><div${_scopeId}><p class="text-xs text-slate-400"${_scopeId}>Prazo Final</p><p class="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-calendar-days",
                class: "size-4 text-slate-400"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(selected).project.endDate)}</p></div></div></div></div></div></section><section${_scopeId}><div class="mb-3 flex items-center justify-between"${_scopeId}><h4 class="text-sm font-bold text-slate-800 dark:text-slate-100"${_scopeId}>Tarefas Recentes</h4><button type="button" class="text-sm font-semibold text-violet-600 hover:text-violet-700"${_scopeId}> Ver todas </button></div><ul class="min-h-[220px] divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-700"${_scopeId}><!--[-->`);
              ssrRenderList(unref(selected).recentTasks, (task) => {
                _push2(`<li class="flex items-center gap-3 px-4 py-3"${_scopeId}><span class="${ssrRenderClass([("useStatusMeta" in _ctx ? _ctx.useStatusMeta : unref(useStatusMeta))(task.status).dot, "size-2.5 shrink-0 rounded-full"])}"${_scopeId}></span><div class="min-w-0 flex-1"${_scopeId}><p class="truncate text-sm font-semibold text-slate-800 dark:text-slate-100"${_scopeId}>${ssrInterpolate(task.title)}</p><p class="text-xs text-slate-400"${_scopeId}>${ssrInterpolate(task.createdBy)} · ${ssrInterpolate(task.createdAt)}</p></div><span class="${ssrRenderClass([("useStatusMeta" in _ctx ? _ctx.useStatusMeta : unref(useStatusMeta))(task.status).classes, "hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-flex"])}"${_scopeId}>${ssrInterpolate(("useStatusMeta" in _ctx ? _ctx.useStatusMeta : unref(useStatusMeta))(task.status).label)}</span><span class="inline-flex shrink-0 items-center gap-1 text-xs text-slate-400"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-calendar-days",
                  class: "size-3.5"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(task.dueDate)}</span></li>`);
              });
              _push2(`<!--]--></ul></section></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col md:h-[min(560px,75vh)] md:flex-row" }, [
                createVNode("aside", { class: "w-full shrink-0 border-b border-slate-100 md:w-72 md:border-b-0 md:border-r dark:border-slate-800" }, [
                  createVNode("ul", { class: "max-h-64 overflow-y-auto scroll-thin p-3 md:flex md:max-h-none md:flex-col md:overflow-y-auto md:p-4" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.teams, (team) => {
                      return openBlock(), createBlock("li", {
                        key: team.id
                      }, [
                        createVNode("button", {
                          type: "button",
                          class: [
                            "mb-2 flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
                            unref(selectedId) === team.id ? "border-violet-200 border-l-4 border-l-violet-600 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/30" : "border-slate-100 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50"
                          ],
                          onClick: ($event) => selectedId.value = team.id
                        }, [
                          createVNode("span", {
                            class: ["flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white", team.color]
                          }, toDisplayString(team.initial), 3),
                          createVNode("div", { class: "min-w-0 flex-1" }, [
                            createVNode("p", { class: "text-sm font-bold text-slate-800 dark:text-slate-100" }, toDisplayString(team.name), 1),
                            createVNode("p", { class: "text-xs text-slate-400" }, toDisplayString(team.collaboratorCount) + " Colaborador" + toDisplayString(team.collaboratorCount !== 1 ? "es" : "") + " · " + toDisplayString(team.taskCount) + " Tarefas ", 1)
                          ]),
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-chevron-right",
                            class: "size-4 shrink-0 text-slate-300"
                          })
                        ], 10, ["onClick"])
                      ]);
                    }), 128))
                  ])
                ]),
                unref(selected) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
                }, [
                  createVNode("div", { class: "min-h-0 flex-1 overflow-y-auto scroll-thin p-5 md:p-6" }, [
                    createVNode("div", { class: "mb-6 flex items-start gap-4" }, [
                      createVNode("span", {
                        class: ["flex size-14 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white", unref(selected).color]
                      }, toDisplayString(unref(selected).initial), 3),
                      createVNode("div", null, [
                        createVNode("h3", { class: "text-xl font-bold text-slate-800 dark:text-slate-100" }, toDisplayString(unref(selected).name), 1),
                        createVNode("div", { class: "mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500" }, [
                          createVNode("span", { class: "inline-flex items-center gap-1" }, [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-user-group",
                              class: "size-4"
                            }),
                            createTextVNode(" " + toDisplayString(unref(selected).collaboratorCount) + " Colaborador" + toDisplayString(unref(selected).collaboratorCount !== 1 ? "es" : ""), 1)
                          ]),
                          createVNode("span", { class: "text-slate-300" }, "|"),
                          createVNode("span", { class: "inline-flex items-center gap-1" }, [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-clipboard-document-check",
                              class: "size-4"
                            }),
                            createTextVNode(" " + toDisplayString(unref(selected).taskCount) + " Tarefas ", 1)
                          ])
                        ]),
                        createVNode("p", { class: "mt-2 text-sm text-slate-400" }, toDisplayString(unref(selected).longDescription), 1)
                      ])
                    ]),
                    createVNode("section", { class: "mb-6" }, [
                      createVNode("h4", { class: "mb-3 text-sm font-bold text-slate-800 dark:text-slate-100" }, "Projeto da Equipe"),
                      createVNode("div", { class: "rounded-xl border border-slate-200 p-4 dark:border-slate-700" }, [
                        createVNode("div", { class: "flex items-start gap-3" }, [
                          createVNode("span", { class: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40" }, [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-briefcase",
                              class: "size-5 text-violet-600"
                            })
                          ]),
                          createVNode("div", { class: "min-w-0 flex-1" }, [
                            createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                              createVNode("p", { class: "font-bold text-slate-800 dark:text-slate-100" }, toDisplayString(unref(selected).project.name), 1),
                              createVNode("span", { class: "rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-600 dark:bg-violet-900/40" }, toDisplayString(unref(selected).project.status), 1)
                            ]),
                            createVNode("p", { class: "text-sm text-violet-600 dark:text-violet-400" }, toDisplayString(unref(selected).project.description), 1),
                            createVNode("div", { class: "mt-3 grid grid-cols-2 gap-4 text-sm" }, [
                              createVNode("div", null, [
                                createVNode("p", { class: "text-xs text-slate-400" }, "Início"),
                                createVNode("p", { class: "inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200" }, [
                                  createVNode(_component_UIcon, {
                                    name: "i-heroicons-calendar-days",
                                    class: "size-4 text-slate-400"
                                  }),
                                  createTextVNode(" " + toDisplayString(unref(selected).project.startDate), 1)
                                ])
                              ]),
                              createVNode("div", null, [
                                createVNode("p", { class: "text-xs text-slate-400" }, "Prazo Final"),
                                createVNode("p", { class: "inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200" }, [
                                  createVNode(_component_UIcon, {
                                    name: "i-heroicons-calendar-days",
                                    class: "size-4 text-slate-400"
                                  }),
                                  createTextVNode(" " + toDisplayString(unref(selected).project.endDate), 1)
                                ])
                              ])
                            ])
                          ])
                        ])
                      ])
                    ]),
                    createVNode("section", null, [
                      createVNode("div", { class: "mb-3 flex items-center justify-between" }, [
                        createVNode("h4", { class: "text-sm font-bold text-slate-800 dark:text-slate-100" }, "Tarefas Recentes"),
                        createVNode("button", {
                          type: "button",
                          class: "text-sm font-semibold text-violet-600 hover:text-violet-700"
                        }, " Ver todas ")
                      ]),
                      createVNode("ul", { class: "min-h-[220px] divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-700" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(selected).recentTasks, (task) => {
                          return openBlock(), createBlock("li", {
                            key: task.id,
                            class: "flex items-center gap-3 px-4 py-3"
                          }, [
                            createVNode("span", {
                              class: ["size-2.5 shrink-0 rounded-full", ("useStatusMeta" in _ctx ? _ctx.useStatusMeta : unref(useStatusMeta))(task.status).dot]
                            }, null, 2),
                            createVNode("div", { class: "min-w-0 flex-1" }, [
                              createVNode("p", { class: "truncate text-sm font-semibold text-slate-800 dark:text-slate-100" }, toDisplayString(task.title), 1),
                              createVNode("p", { class: "text-xs text-slate-400" }, toDisplayString(task.createdBy) + " · " + toDisplayString(task.createdAt), 1)
                            ]),
                            createVNode("span", {
                              class: ["hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-flex", ("useStatusMeta" in _ctx ? _ctx.useStatusMeta : unref(useStatusMeta))(task.status).classes]
                            }, toDisplayString(("useStatusMeta" in _ctx ? _ctx.useStatusMeta : unref(useStatusMeta))(task.status).label), 3),
                            createVNode("span", { class: "inline-flex shrink-0 items-center gap-1 text-xs text-slate-400" }, [
                              createVNode(_component_UIcon, {
                                name: "i-heroicons-calendar-days",
                                class: "size-3.5"
                              }),
                              createTextVNode(" " + toDisplayString(task.dueDate), 1)
                            ])
                          ]);
                        }), 128))
                      ])
                    ])
                  ])
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/inicio/TeamsModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$1, { __name: "InicioTeamsModal" });
const STAT_PRESENTATION = {
  atribuidas: {
    icon: "i-heroicons-clipboard-document-list",
    iconClass: "text-white",
    bgClass: "bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30"
  },
  andamento: {
    icon: "i-heroicons-play",
    iconClass: "text-white",
    bgClass: "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30"
  },
  atraso: {
    icon: "i-heroicons-exclamation-triangle",
    iconClass: "text-white",
    bgClass: "bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30"
  },
  produtividade: {
    icon: "i-heroicons-chart-bar",
    iconClass: "text-white",
    bgClass: "bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/30"
  }
};
const FALLBACK_PRESENTATION = {
  icon: "i-heroicons-chart-bar",
  iconClass: "text-white",
  bgClass: "bg-gradient-to-br from-slate-400 to-slate-500 shadow-lg shadow-slate-500/30"
};
function toStatCard(metric) {
  return { ...metric, ...STAT_PRESENTATION[metric.id] ?? FALLBACK_PRESENTATION };
}
function useInicioData() {
  const metrics = v.array(dashboardMetricSchema).parse(mockDashboardMetrics, "dashboardMetrics");
  const stats = metrics.map(toStatCard);
  const agenda = v.array(agendaItemSchema).parse(mockAgenda, "agenda");
  const ranking = v.array(rankingEntrySchema).parse(mockRanking, "ranking");
  const currentUserRank = rankingEntrySchema.parse(mockCurrentUserRank, "currentUserRank");
  const projects = v.array(projectProgressSchema).parse(mockProjects, "projects");
  const teams = v.array(teamSummarySchema).parse(mockTeams, "teams");
  const { items: notifications } = useNotifications();
  return { stats, agenda, ranking, currentUserRank, projects, teams, notifications };
}
function useTeamsData() {
  return teamDetailsSchema.parse(mockTeamDetails, "teamDetails");
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const user = useCurrentUser();
    const { stats, agenda, ranking, currentUserRank, teams } = useInicioData();
    const teamDetails = useTeamsData();
    const teamsModalOpen = ref(false);
    const rankingOpen = ref(false);
    const allTasks = useTasksData();
    const myTasks = computed(
      () => allTasks.filter((t) => !t.personal && t.status !== "concluido" && t.status !== "atrasado").slice(0, 4)
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_InicioStatCard = __nuxt_component_0;
      const _component_UiSectionCard = __nuxt_component_1;
      const _component_UIcon = _sfc_main$d;
      const _component_InicioAgendaList = __nuxt_component_3;
      const _component_UButton = _sfc_main$8;
      const _component_USlideover = _sfc_main$7;
      const _component_InicioRankingList = __nuxt_component_6;
      const _component_InicioTasksCard = __nuxt_component_7;
      const _component_InicioTeamsCard = __nuxt_component_8;
      const _component_InicioTeamsModal = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl space-y-5 p-4 sm:p-6" }, _attrs))}><h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100"> Olá, ${ssrInterpolate(unref(user).name.split(" ")[0])}! </h1><div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"><!--[-->`);
      ssrRenderList(unref(stats), (s) => {
        _push(ssrRenderComponent(_component_InicioStatCard, mergeProps({
          key: s.id
        }, { ref_for: true }, s), null, _parent));
      });
      _push(`<!--]--></div><div class="flex gap-4 items-stretch">`);
      _push(ssrRenderComponent(_component_UiSectionCard, { class: "flex-1 min-w-0" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-start gap-2.5"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-calendar",
              class: "mt-0.5 size-5 text-slate-800 dark:text-slate-100"
            }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><h2 class="font-semibold text-slate-800 dark:text-slate-100"${_scopeId}>Suas prioridades hoje</h2></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-start gap-2.5" }, [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-calendar",
                  class: "mt-0.5 size-5 text-slate-800 dark:text-slate-100"
                }),
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-slate-800 dark:text-slate-100" }, "Suas prioridades hoje")
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_InicioAgendaList, { items: unref(agenda) }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/colaborador/calendario",
              variant: "link",
              "trailing-icon": "i-heroicons-arrow-right",
              label: "Ver calendário",
              class: "mt-4 !p-0 font-semibold text-indigo-500"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_InicioAgendaList, { items: unref(agenda) }, null, 8, ["items"]),
              createVNode(_component_UButton, {
                to: "/colaborador/calendario",
                variant: "link",
                "trailing-icon": "i-heroicons-arrow-right",
                label: "Ver calendário",
                class: "mt-4 !p-0 font-semibold text-indigo-500"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="w-12 sm:w-16 shrink-0 flex flex-col items-center justify-between py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-trophy",
        class: "size-6 text-slate-500 dark:text-slate-400"
      }, null, _parent));
      _push(`<span class="font-display font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase select-none [writing-mode:vertical-lr] rotate-180 my-auto py-4 text-xs sm:text-sm"> RANKING </span>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-chevron-left",
        class: "size-5 text-slate-500 dark:text-slate-400"
      }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_USlideover, {
        open: unref(rankingOpen),
        "onUpdate:open": ($event) => isRef(rankingOpen) ? rankingOpen.value = $event : null,
        side: "right",
        ui: { content: "w-80 sm:w-96" }
      }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex h-full flex-col p-5 bg-white dark:bg-slate-900"${_scopeId}><div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4"${_scopeId}><h3 class="font-display text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-trophy",
              class: "size-5 text-orange-500"
            }, null, _parent2, _scopeId));
            _push2(` Ranking de Colaboradores </h3>`);
            _push2(ssrRenderComponent(_component_UButton, {
              size: "sm",
              color: "neutral",
              variant: "ghost",
              class: "size-8 p-0 flex items-center justify-center",
              onClick: ($event) => rankingOpen.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-x-mark",
                    class: "size-5 text-slate-500"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-x-mark",
                      class: "size-5 text-slate-500"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="flex-1 overflow-y-auto min-h-0"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_InicioRankingList, {
              entries: unref(ranking),
              me: unref(currentUserRank)
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              block: "",
              color: "neutral",
              variant: "outline",
              size: "md",
              class: "w-full flex justify-center py-2 text-indigo-500 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900 font-semibold",
              label: "Ver mais"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex h-full flex-col p-5 bg-white dark:bg-slate-900" }, [
                createVNode("div", { class: "flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4" }, [
                  createVNode("h3", { class: "font-display text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-trophy",
                      class: "size-5 text-orange-500"
                    }),
                    createTextVNode(" Ranking de Colaboradores ")
                  ]),
                  createVNode(_component_UButton, {
                    size: "sm",
                    color: "neutral",
                    variant: "ghost",
                    class: "size-8 p-0 flex items-center justify-center",
                    onClick: ($event) => rankingOpen.value = false
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-x-mark",
                        class: "size-5 text-slate-500"
                      })
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ]),
                createVNode("div", { class: "flex-1 overflow-y-auto min-h-0" }, [
                  createVNode(_component_InicioRankingList, {
                    entries: unref(ranking),
                    me: unref(currentUserRank)
                  }, null, 8, ["entries", "me"])
                ]),
                createVNode("div", { class: "mt-4 pt-4 border-t border-slate-200 dark:border-slate-800" }, [
                  createVNode(_component_UButton, {
                    block: "",
                    color: "neutral",
                    variant: "outline",
                    size: "md",
                    class: "w-full flex justify-center py-2 text-indigo-500 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900 font-semibold",
                    label: "Ver mais"
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">`);
      _push(ssrRenderComponent(_component_UiSectionCard, { title: "Minhas Tarefas" }, {
        action: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/colaborador/minhas-tarefas",
              variant: "link",
              "trailing-icon": "i-heroicons-arrow-right",
              label: "Ver Todos",
              class: "!p-0 text-indigo-500"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: "/colaborador/minhas-tarefas",
                variant: "link",
                "trailing-icon": "i-heroicons-arrow-right",
                label: "Ver Todos",
                class: "!p-0 text-indigo-500"
              })
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_InicioTasksCard, { tasks: unref(myTasks) }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_InicioTasksCard, { tasks: unref(myTasks) }, null, 8, ["tasks"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UiSectionCard, { title: "Minhas Equipes" }, {
        action: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "link",
              "trailing-icon": "i-heroicons-arrow-right",
              label: "Ver Todos",
              class: "!p-0 text-indigo-500",
              onClick: ($event) => teamsModalOpen.value = true
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                variant: "link",
                "trailing-icon": "i-heroicons-arrow-right",
                label: "Ver Todos",
                class: "!p-0 text-indigo-500",
                onClick: ($event) => teamsModalOpen.value = true
              }, null, 8, ["onClick"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_InicioTeamsCard, { teams: unref(teams) }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_InicioTeamsCard, { teams: unref(teams) }, null, 8, ["teams"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_InicioTeamsModal, {
        open: unref(teamsModalOpen),
        "onUpdate:open": ($event) => isRef(teamsModalOpen) ? teamsModalOpen.value = $event : null,
        teams: unref(teamDetails)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/colaborador/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-2oNS9cSW.mjs.map
