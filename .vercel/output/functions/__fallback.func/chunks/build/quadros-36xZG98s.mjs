import { _ as _sfc_main$1 } from './Popover-Dn1k2Q3g.mjs';
import { f as _sfc_main$d } from './server.mjs';
import { u as useUserProjects, _ as __nuxt_component_2 } from './useUserProjects-B_3XcnzE.mjs';
import { _ as _sfc_main$2 } from './Input-BsVJ6KLu.mjs';
import { _ as __nuxt_component_4, a as __nuxt_component_5 } from './GanttChart-C2YdtgUy.mjs';
import { defineComponent, ref, computed, mergeProps, isRef, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useCurrentProject } from './useCurrentUser-BUDY1vts.mjs';
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
import './index-C8l8nrqu.mjs';
import '@internationalized/date';
import './useDirection-B3h_OC89.mjs';
import '@vueuse/core';
import './PopperArrow-C07et48U.mjs';
import '@vueuse/shared';
import '@floating-ui/vue';
import './utils-CJXk8l7g.mjs';
import 'aria-hidden';
import './RovingFocusGroup-Dpm1zhJB.mjs';
import './useId-Df0AxZi5.mjs';
import './overlay-CjyBzL1C.mjs';
import 'pinia';
import 'vue-router';
import '@vue/shared';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import './Select-c22fz1qb.mjs';
import './useFormControl-9B1GcqCr.mjs';
import './index-D-j7ajRT.mjs';
import './navigation-CS4vmRJG.mjs';
import './ProgressBar-CoIUm3TO.mjs';
import './SectionCard-CotbZH9k.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "quadros",
  __ssrInlineRender: true,
  setup(__props) {
    const projects = useUserProjects();
    const current = useCurrentProject();
    const selectedProjectId = ref(
      projects.find((p) => p.name === current.name)?.id ?? projects[0]?.id ?? ""
    );
    const selectedProject = computed(
      () => projects.find((p) => p.id === selectedProjectId.value) ?? projects[0]
    );
    const tabs = [
      { key: "kanban", label: "Kanban", icon: "i-heroicons-squares-2x2" },
      { key: "timeline", label: "Timeline (Gantt)", icon: "i-heroicons-bars-3-bottom-left" }
    ];
    const activeTab = ref("kanban");
    const teamFilter = ref("Todas");
    const responsibleFilter = ref("Todos");
    const priorityFilter = ref("Todas");
    const search = ref("");
    const projectOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UPopover = _sfc_main$1;
      const _component_UIcon = _sfc_main$d;
      const _component_UiLabeledSelect = __nuxt_component_2;
      const _component_UInput = _sfc_main$2;
      const _component_QuadrosKanbanBoard = __nuxt_component_4;
      const _component_QuadrosGanttChart = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5 p-4 sm:p-6 dark:bg-slate-900 h-full" }, _attrs))}><div class="flex flex-wrap items-start justify-between gap-3"><div><h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Quadros</h1><p class="text-sm text-slate-400">Acompanhe o andamento das tarefas e do projeto</p></div>`);
      _push(ssrRenderComponent(_component_UPopover, {
        open: unref(projectOpen),
        "onUpdate:open": ($event) => isRef(projectOpen) ? projectOpen.value = $event : null
      }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<ul class="max-h-64 w-72 overflow-y-auto scroll-thin py-1"${_scopeId}><!--[-->`);
            ssrRenderList(unref(projects), (p) => {
              _push2(`<li${_scopeId}><button type="button" class="${ssrRenderClass([unref(selectedProjectId) === p.id ? "bg-violet-50 font-semibold text-violet-700 dark:bg-violet-950/30" : "text-slate-700 dark:text-slate-200", "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/30"])}"${_scopeId}><span class="${ssrRenderClass([p.color, "size-2.5 shrink-0 rounded-full"])}"${_scopeId}></span><span class="min-w-0 flex-1 truncate"${_scopeId}>${ssrInterpolate(p.name)}</span>`);
              if (unref(selectedProjectId) === p.id) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-check",
                  class: "size-4 shrink-0 text-violet-600"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</button></li>`);
            });
            _push2(`<!--]--></ul>`);
          } else {
            return [
              createVNode("ul", { class: "max-h-64 w-72 overflow-y-auto scroll-thin py-1" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(projects), (p) => {
                  return openBlock(), createBlock("li", {
                    key: p.id
                  }, [
                    createVNode("button", {
                      type: "button",
                      class: ["flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/30", unref(selectedProjectId) === p.id ? "bg-violet-50 font-semibold text-violet-700 dark:bg-violet-950/30" : "text-slate-700 dark:text-slate-200"],
                      onClick: ($event) => {
                        selectedProjectId.value = p.id;
                        projectOpen.value = false;
                      }
                    }, [
                      createVNode("span", {
                        class: ["size-2.5 shrink-0 rounded-full", p.color]
                      }, null, 2),
                      createVNode("span", { class: "min-w-0 flex-1 truncate" }, toDisplayString(p.name), 1),
                      unref(selectedProjectId) === p.id ? (openBlock(), createBlock(_component_UIcon, {
                        key: 0,
                        name: "i-heroicons-check",
                        class: "size-4 shrink-0 text-violet-600"
                      })) : createCommentVNode("", true)
                    ], 10, ["onClick"])
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button type="button" class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition-colors hover:border-violet-300 hover:bg-violet-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-800"${_scopeId}><span class="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-900/40"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-briefcase",
              class: "size-5"
            }, null, _parent2, _scopeId));
            _push2(`</span><span class="text-left leading-tight"${_scopeId}><span class="block text-xs text-slate-400"${_scopeId}>Projeto</span><span class="block max-w-[12rem] truncate text-sm font-semibold text-slate-800 dark:text-slate-100"${_scopeId}>${ssrInterpolate(unref(selectedProject)?.name)}</span></span>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-chevron-down",
              class: "size-4 shrink-0 text-slate-400"
            }, null, _parent2, _scopeId));
            _push2(`</button>`);
          } else {
            return [
              createVNode("button", {
                type: "button",
                class: "flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition-colors hover:border-violet-300 hover:bg-violet-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-800"
              }, [
                createVNode("span", { class: "flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-900/40" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-briefcase",
                    class: "size-5"
                  })
                ]),
                createVNode("span", { class: "text-left leading-tight" }, [
                  createVNode("span", { class: "block text-xs text-slate-400" }, "Projeto"),
                  createVNode("span", { class: "block max-w-[12rem] truncate text-sm font-semibold text-slate-800 dark:text-slate-100" }, toDisplayString(unref(selectedProject)?.name), 1)
                ]),
                createVNode(_component_UIcon, {
                  name: "i-heroicons-chevron-down",
                  class: "size-4 shrink-0 text-slate-400"
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex gap-6 border-b border-slate-200 dark:border-slate-800"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button type="button" class="${ssrRenderClass([
          unref(activeTab) === tab.key ? "border-violet-500 text-violet-600" : "border-transparent text-slate-400 hover:text-slate-600",
          "-mb-px flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors"
        ])}">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: tab.icon,
          class: "size-4"
        }, null, _parent));
        _push(` ${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div><div class="flex flex-wrap items-center gap-3">`);
      _push(ssrRenderComponent(_component_UiLabeledSelect, {
        modelValue: unref(teamFilter),
        "onUpdate:modelValue": ($event) => isRef(teamFilter) ? teamFilter.value = $event : null,
        label: "Equipe:",
        items: ["Todas"],
        class: "w-40"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiLabeledSelect, {
        modelValue: unref(responsibleFilter),
        "onUpdate:modelValue": ($event) => isRef(responsibleFilter) ? responsibleFilter.value = $event : null,
        label: "Responsável:",
        items: ["Todos"],
        class: "w-44"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiLabeledSelect, {
        modelValue: unref(priorityFilter),
        "onUpdate:modelValue": ($event) => isRef(priorityFilter) ? priorityFilter.value = $event : null,
        label: "Prioridade:",
        items: ["Todas"],
        class: "w-40"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(search),
        "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
        icon: "i-heroicons-magnifying-glass",
        placeholder: "Buscar Tarefa",
        class: "w-full sm:w-56"
      }, null, _parent));
      _push(`</div>`);
      if (unref(activeTab) === "kanban") {
        _push(ssrRenderComponent(_component_QuadrosKanbanBoard, null, null, _parent));
      } else if (unref(activeTab) === "timeline") {
        _push(ssrRenderComponent(_component_QuadrosGanttChart, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/quadros.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=quadros-36xZG98s.mjs.map
