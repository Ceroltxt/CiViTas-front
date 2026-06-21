import { $ as useRoute, _ as __nuxt_component_0$1$1, f as _sfc_main$d, d as _sfc_main$8$1, e as _sfc_main$b$1 } from './server.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, isRef, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useModel, createTextVNode, Fragment, renderList, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { b as brandGradient, _ as __nuxt_component_2$1, a as usePriorityMeta } from './ProgressBar-CoIUm3TO.mjs';
import { _ as _sfc_main$f } from './Modal-DrlsEEos.mjs';
import { a as useCurrentUser, b as useProjectDetail } from './useCurrentUser-BUDY1vts.mjs';
import { u as useAppNavigation } from './useAppNavigation-BTBZfLac.mjs';
import { _ as _sfc_main$a, u as useNotifications } from './useNotifications-CEiwSWoL.mjs';
import { _ as _sfc_main$b } from './Input-BsVJ6KLu.mjs';
import { _ as _sfc_main$c } from './Popover-Dn1k2Q3g.mjs';
import { _ as _sfc_main$e } from './DropdownMenu-CRLH50FN.mjs';
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
import './utils-CJXk8l7g.mjs';
import 'aria-hidden';
import './useId-Df0AxZi5.mjs';
import './overlay-CjyBzL1C.mjs';
import './index-D-j7ajRT.mjs';
import './navigation-CS4vmRJG.mjs';
import './index-C8l8nrqu.mjs';
import '@internationalized/date';
import './useDirection-B3h_OC89.mjs';
import './PopperArrow-C07et48U.mjs';
import '@floating-ui/vue';
import './RovingFocusGroup-Dpm1zhJB.mjs';

const logoSrc = "/civitas-logo-transparent.png";
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "AppLogo",
  __ssrInlineRender: true,
  props: {
    showWordmark: { type: Boolean, default: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({ class: "inline-flex select-none items-center" }, _attrs))}><img${ssrRenderAttr("src", logoSrc)} alt="Civitas" class="h-9 w-auto shrink-0 object-contain" draggable="false"></span>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/AppLogo.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$9, { __name: "AppLogo" });
const chartWidth = 320;
const chartHeight = 120;
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "ProjectDetailModal",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    project: {}
  }, {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {}
  }),
  emits: ["update:open"],
  setup(__props) {
    const open = useModel(__props, "open");
    const props = __props;
    const chartPad = { top: 8, right: 8, bottom: 24, left: 32 };
    function chartPoints(timeline) {
      const innerW = chartWidth - chartPad.left - chartPad.right;
      const innerH = chartHeight - chartPad.top - chartPad.bottom;
      const step = timeline.length > 1 ? innerW / (timeline.length - 1) : 0;
      return timeline.map((p, i) => ({
        x: chartPad.left + i * step,
        y: chartPad.top + innerH - p.value / 100 * innerH,
        label: p.month,
        value: p.value
      }));
    }
    function linePath(points) {
      return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    }
    const priorityMeta = computed(() => usePriorityMeta(props.project.priority));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$f;
      const _component_UIcon = _sfc_main$d;
      const _component_UiProgressBar = __nuxt_component_2$1;
      _push(ssrRenderComponent(_component_UModal, mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event,
        title: __props.project.name,
        description: __props.project.description,
        ui: { content: "max-w-3xl" }
      }, _attrs), {
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-5"${_scopeId}><div class="grid grid-cols-2 gap-3 lg:grid-cols-4"${_scopeId}><div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700"${_scopeId}><div class="mb-2 flex size-8 items-center justify-center rounded-full bg-violet-100"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-calendar-days",
              class: "size-4 text-violet-600"
            }, null, _parent2, _scopeId));
            _push2(`</div><p class="text-xs text-slate-400"${_scopeId}>Prazo final</p><p class="text-sm font-bold text-violet-700 dark:text-violet-400"${_scopeId}>${ssrInterpolate(__props.project.deadline)}</p><p class="mt-0.5 text-xs text-slate-400"${_scopeId}>${ssrInterpolate(__props.project.daysRemaining)} dias restantes</p></div><div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700"${_scopeId}><p class="text-xs text-slate-400"${_scopeId}>Progresso geral</p><p class="text-lg font-bold text-violet-700 dark:text-violet-400"${_scopeId}>${ssrInterpolate(__props.project.progress)}%</p>`);
            _push2(ssrRenderComponent(_component_UiProgressBar, {
              value: __props.project.progress,
              class: "mt-2",
              gradient: ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700"${_scopeId}><div class="mb-2 flex size-8 items-center justify-center rounded-full bg-violet-100"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-clipboard-document-list",
              class: "size-4 text-violet-600"
            }, null, _parent2, _scopeId));
            _push2(`</div><p class="text-xs text-slate-400"${_scopeId}>Total de tarefas</p><p class="text-lg font-bold text-slate-800 dark:text-slate-100"${_scopeId}>${ssrInterpolate(__props.project.totalTasks)}</p><p class="text-xs text-slate-400"${_scopeId}>tarefas</p></div><div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700"${_scopeId}><div class="mb-2 flex size-8 items-center justify-center rounded-full bg-violet-100"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-flag",
              class: "size-4 text-violet-600"
            }, null, _parent2, _scopeId));
            _push2(`</div><p class="text-xs text-slate-400"${_scopeId}>Prioridade</p><span class="${ssrRenderClass([unref(priorityMeta).classes, "mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"])}"${_scopeId}>${ssrInterpolate(unref(priorityMeta).label)}</span></div></div><div class="grid gap-4 lg:grid-cols-2"${_scopeId}><div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700"${_scopeId}><h3 class="mb-4 text-sm font-bold text-slate-800 dark:text-slate-100"${_scopeId}>Status das tarefas</h3><div class="grid grid-cols-3 gap-3 text-center"${_scopeId}><div${_scopeId}><span class="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-emerald-100"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-check",
              class: "size-4 text-emerald-600"
            }, null, _parent2, _scopeId));
            _push2(`</span><p class="text-2xl font-bold text-slate-800 dark:text-slate-100"${_scopeId}>${ssrInterpolate(__props.project.taskStatus.completed)}</p><div class="mx-auto mt-1 h-1 w-10 rounded-full bg-emerald-500"${_scopeId}></div><p class="mt-1 text-xs font-medium text-emerald-600"${_scopeId}>${ssrInterpolate(Math.round(__props.project.taskStatus.completed / __props.project.totalTasks * 100))}% </p><p class="text-xs text-slate-400"${_scopeId}>Concluídas</p></div><div${_scopeId}><span class="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-amber-100"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-clock",
              class: "size-4 text-amber-600"
            }, null, _parent2, _scopeId));
            _push2(`</span><p class="text-2xl font-bold text-slate-800 dark:text-slate-100"${_scopeId}>${ssrInterpolate(__props.project.taskStatus.inProgress)}</p><div class="mx-auto mt-1 h-1 w-10 rounded-full bg-amber-500"${_scopeId}></div><p class="mt-1 text-xs font-medium text-amber-600"${_scopeId}>${ssrInterpolate(Math.round(__props.project.taskStatus.inProgress / __props.project.totalTasks * 100))}% </p><p class="text-xs text-slate-400"${_scopeId}>Em andamento</p></div><div${_scopeId}><span class="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-slate-100"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-queue-list",
              class: "size-4 text-slate-500"
            }, null, _parent2, _scopeId));
            _push2(`</span><p class="text-2xl font-bold text-slate-800 dark:text-slate-100"${_scopeId}>${ssrInterpolate(__props.project.taskStatus.pending)}</p><div class="mx-auto mt-1 h-1 w-10 rounded-full bg-slate-300"${_scopeId}></div><p class="mt-1 text-xs font-medium text-slate-500"${_scopeId}>${ssrInterpolate(Math.round(__props.project.taskStatus.pending / __props.project.totalTasks * 100))}% </p><p class="text-xs text-slate-400"${_scopeId}>Pendentes</p></div></div></div><div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700"${_scopeId}><h3 class="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100"${_scopeId}>Progresso ao longo do tempo</h3><svg${ssrRenderAttr("width", chartWidth)}${ssrRenderAttr("height", chartHeight)} class="w-full max-w-full"${_scopeId}><!--[-->`);
            ssrRenderList([0, 25, 50, 75, 100], (tick) => {
              _push2(`<text${ssrRenderAttr("x", chartPad.left - 6)}${ssrRenderAttr("y", chartPad.top + (chartHeight - chartPad.top - chartPad.bottom) * (1 - tick / 100) + 4)} text-anchor="end" class="fill-slate-400 text-[10px]"${_scopeId}>${ssrInterpolate(tick)}% </text>`);
            });
            _push2(`<!--]--><path${ssrRenderAttr("d", linePath(chartPoints(__props.project.progressTimeline)))} fill="none" stroke="currentColor" stroke-width="2" class="text-violet-500"${_scopeId}></path><!--[-->`);
            ssrRenderList(chartPoints(__props.project.progressTimeline), (pt, i) => {
              _push2(`<circle${ssrRenderAttr("cx", pt.x)}${ssrRenderAttr("cy", pt.y)} r="3" class="fill-violet-500"${_scopeId}></circle>`);
            });
            _push2(`<!--]--><!--[-->`);
            ssrRenderList(chartPoints(__props.project.progressTimeline), (pt, i) => {
              _push2(`<text${ssrRenderAttr("x", pt.x)}${ssrRenderAttr("y", chartHeight - 4)} text-anchor="middle" class="fill-slate-400 text-[10px]"${_scopeId}>${ssrInterpolate(pt.label)}</text>`);
            });
            _push2(`<!--]--></svg></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-5" }, [
                createVNode("div", { class: "grid grid-cols-2 gap-3 lg:grid-cols-4" }, [
                  createVNode("div", { class: "rounded-xl border border-slate-200 p-4 dark:border-slate-700" }, [
                    createVNode("div", { class: "mb-2 flex size-8 items-center justify-center rounded-full bg-violet-100" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-calendar-days",
                        class: "size-4 text-violet-600"
                      })
                    ]),
                    createVNode("p", { class: "text-xs text-slate-400" }, "Prazo final"),
                    createVNode("p", { class: "text-sm font-bold text-violet-700 dark:text-violet-400" }, toDisplayString(__props.project.deadline), 1),
                    createVNode("p", { class: "mt-0.5 text-xs text-slate-400" }, toDisplayString(__props.project.daysRemaining) + " dias restantes", 1)
                  ]),
                  createVNode("div", { class: "rounded-xl border border-slate-200 p-4 dark:border-slate-700" }, [
                    createVNode("p", { class: "text-xs text-slate-400" }, "Progresso geral"),
                    createVNode("p", { class: "text-lg font-bold text-violet-700 dark:text-violet-400" }, toDisplayString(__props.project.progress) + "%", 1),
                    createVNode(_component_UiProgressBar, {
                      value: __props.project.progress,
                      class: "mt-2",
                      gradient: ""
                    }, null, 8, ["value"])
                  ]),
                  createVNode("div", { class: "rounded-xl border border-slate-200 p-4 dark:border-slate-700" }, [
                    createVNode("div", { class: "mb-2 flex size-8 items-center justify-center rounded-full bg-violet-100" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-clipboard-document-list",
                        class: "size-4 text-violet-600"
                      })
                    ]),
                    createVNode("p", { class: "text-xs text-slate-400" }, "Total de tarefas"),
                    createVNode("p", { class: "text-lg font-bold text-slate-800 dark:text-slate-100" }, toDisplayString(__props.project.totalTasks), 1),
                    createVNode("p", { class: "text-xs text-slate-400" }, "tarefas")
                  ]),
                  createVNode("div", { class: "rounded-xl border border-slate-200 p-4 dark:border-slate-700" }, [
                    createVNode("div", { class: "mb-2 flex size-8 items-center justify-center rounded-full bg-violet-100" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-flag",
                        class: "size-4 text-violet-600"
                      })
                    ]),
                    createVNode("p", { class: "text-xs text-slate-400" }, "Prioridade"),
                    createVNode("span", {
                      class: ["mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", unref(priorityMeta).classes]
                    }, toDisplayString(unref(priorityMeta).label), 3)
                  ])
                ]),
                createVNode("div", { class: "grid gap-4 lg:grid-cols-2" }, [
                  createVNode("div", { class: "rounded-xl border border-slate-200 p-4 dark:border-slate-700" }, [
                    createVNode("h3", { class: "mb-4 text-sm font-bold text-slate-800 dark:text-slate-100" }, "Status das tarefas"),
                    createVNode("div", { class: "grid grid-cols-3 gap-3 text-center" }, [
                      createVNode("div", null, [
                        createVNode("span", { class: "mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-emerald-100" }, [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-check",
                            class: "size-4 text-emerald-600"
                          })
                        ]),
                        createVNode("p", { class: "text-2xl font-bold text-slate-800 dark:text-slate-100" }, toDisplayString(__props.project.taskStatus.completed), 1),
                        createVNode("div", { class: "mx-auto mt-1 h-1 w-10 rounded-full bg-emerald-500" }),
                        createVNode("p", { class: "mt-1 text-xs font-medium text-emerald-600" }, toDisplayString(Math.round(__props.project.taskStatus.completed / __props.project.totalTasks * 100)) + "% ", 1),
                        createVNode("p", { class: "text-xs text-slate-400" }, "Concluídas")
                      ]),
                      createVNode("div", null, [
                        createVNode("span", { class: "mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-amber-100" }, [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-clock",
                            class: "size-4 text-amber-600"
                          })
                        ]),
                        createVNode("p", { class: "text-2xl font-bold text-slate-800 dark:text-slate-100" }, toDisplayString(__props.project.taskStatus.inProgress), 1),
                        createVNode("div", { class: "mx-auto mt-1 h-1 w-10 rounded-full bg-amber-500" }),
                        createVNode("p", { class: "mt-1 text-xs font-medium text-amber-600" }, toDisplayString(Math.round(__props.project.taskStatus.inProgress / __props.project.totalTasks * 100)) + "% ", 1),
                        createVNode("p", { class: "text-xs text-slate-400" }, "Em andamento")
                      ]),
                      createVNode("div", null, [
                        createVNode("span", { class: "mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-slate-100" }, [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-queue-list",
                            class: "size-4 text-slate-500"
                          })
                        ]),
                        createVNode("p", { class: "text-2xl font-bold text-slate-800 dark:text-slate-100" }, toDisplayString(__props.project.taskStatus.pending), 1),
                        createVNode("div", { class: "mx-auto mt-1 h-1 w-10 rounded-full bg-slate-300" }),
                        createVNode("p", { class: "mt-1 text-xs font-medium text-slate-500" }, toDisplayString(Math.round(__props.project.taskStatus.pending / __props.project.totalTasks * 100)) + "% ", 1),
                        createVNode("p", { class: "text-xs text-slate-400" }, "Pendentes")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "rounded-xl border border-slate-200 p-4 dark:border-slate-700" }, [
                    createVNode("h3", { class: "mb-3 text-sm font-bold text-slate-800 dark:text-slate-100" }, "Progresso ao longo do tempo"),
                    (openBlock(), createBlock("svg", {
                      width: chartWidth,
                      height: chartHeight,
                      class: "w-full max-w-full"
                    }, [
                      (openBlock(), createBlock(Fragment, null, renderList([0, 25, 50, 75, 100], (tick) => {
                        return createVNode("text", {
                          key: tick,
                          x: chartPad.left - 6,
                          y: chartPad.top + (chartHeight - chartPad.top - chartPad.bottom) * (1 - tick / 100) + 4,
                          "text-anchor": "end",
                          class: "fill-slate-400 text-[10px]"
                        }, toDisplayString(tick) + "% ", 9, ["x", "y"]);
                      }), 64)),
                      createVNode("path", {
                        d: linePath(chartPoints(__props.project.progressTimeline)),
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        class: "text-violet-500"
                      }, null, 8, ["d"]),
                      (openBlock(true), createBlock(Fragment, null, renderList(chartPoints(__props.project.progressTimeline), (pt, i) => {
                        return openBlock(), createBlock("circle", {
                          key: i,
                          cx: pt.x,
                          cy: pt.y,
                          r: "3",
                          class: "fill-violet-500"
                        }, null, 8, ["cx", "cy"]);
                      }), 128)),
                      (openBlock(true), createBlock(Fragment, null, renderList(chartPoints(__props.project.progressTimeline), (pt, i) => {
                        return openBlock(), createBlock("text", {
                          key: `l-${i}`,
                          x: pt.x,
                          y: chartHeight - 4,
                          "text-anchor": "middle",
                          class: "fill-slate-400 text-[10px]"
                        }, toDisplayString(pt.label), 9, ["x", "y"]);
                      }), 128))
                    ]))
                  ])
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
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/ProjectDetailModal.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_3$2 = Object.assign(_sfc_main$8, { __name: "AppProjectDetailModal" });
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "AppProjectCard",
  __ssrInlineRender: true,
  setup(__props) {
    const projectDetail = useProjectDetail();
    const detailOpen = ref(false);
    const projects = [
      {
        name: "Plataforma E-commerce",
        deadline: "25 de Dez. 2026",
        progress: 90,
        detail: projectDetail
      },
      {
        name: "Civitas Mobile",
        deadline: "15 de Set. 2026",
        progress: 77,
        detail: {
          name: "Civitas Mobile",
          deadline: "15 de Set. 2026",
          progress: 77,
          description: "Aplicativo mobile para colaboradores em campo.",
          daysRemaining: 86,
          totalTasks: 32,
          priority: "media",
          taskStatus: { completed: 25, inProgress: 5, pending: 2 },
          progressTimeline: [
            { month: "Mar", value: 15 },
            { month: "Mai", value: 40 },
            { month: "Jul", value: 65 },
            { month: "Set", value: 77 }
          ]
        }
      },
      {
        name: "Plataforma MEI",
        deadline: "30 de Out. 2026",
        progress: 45,
        detail: {
          name: "Plataforma MEI",
          deadline: "30 de Out. 2026",
          progress: 45,
          description: "Plataforma de gestão simplificada para microempreendedores individuais.",
          daysRemaining: 131,
          totalTasks: 20,
          priority: "media",
          taskStatus: { completed: 9, inProgress: 8, pending: 3 },
          progressTimeline: [
            { month: "Jun", value: 10 },
            { month: "Ago", value: 30 },
            { month: "Out", value: 45 }
          ]
        }
      }
    ];
    const currentIndex = ref(0);
    const currentProj = computed(() => projects[currentIndex.value]);
    function nextProject() {
      currentIndex.value = (currentIndex.value + 1) % projects.length;
    }
    function prevProject() {
      currentIndex.value = (currentIndex.value - 1 + projects.length) % projects.length;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8$1;
      const _component_UIcon = _sfc_main$d;
      const _component_UiProgressBar = __nuxt_component_2$1;
      const _component_AppProjectDetailModal = __nuxt_component_3$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" }, _attrs))}><div class="flex items-center justify-between"><p class="text-xs text-slate-400">Projeto atual</p><div class="flex items-center gap-1">`);
      _push(ssrRenderComponent(_component_UButton, {
        size: "xs",
        color: "neutral",
        variant: "ghost",
        class: "size-6 p-0 flex items-center justify-center",
        onClick: prevProject
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-chevron-left",
              class: "size-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-heroicons-chevron-left",
                class: "size-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="text-[10px] text-slate-400 font-mono">${ssrInterpolate(unref(currentIndex) + 1)}/${ssrInterpolate(projects.length)}</span>`);
      _push(ssrRenderComponent(_component_UButton, {
        size: "xs",
        color: "neutral",
        variant: "ghost",
        class: "size-6 p-0 flex items-center justify-center",
        onClick: nextProject
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-chevron-right",
              class: "size-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-heroicons-chevron-right",
                class: "size-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><p class="mt-0.5 font-semibold text-slate-800 dark:text-slate-100">${ssrInterpolate(unref(currentProj).name)}</p><p class="mt-4 text-xs text-slate-400">Prazo</p><p class="text-sm font-semibold text-slate-600 dark:text-slate-300">${ssrInterpolate(unref(currentProj).deadline)}</p><div class="mt-4 flex items-center justify-between text-xs text-slate-400"><span>Progresso geral</span><span class="font-semibold text-slate-600 dark:text-slate-300">${ssrInterpolate(unref(currentProj).progress)}%</span></div>`);
      _push(ssrRenderComponent(_component_UiProgressBar, {
        value: unref(currentProj).progress,
        class: "mt-1.5",
        gradient: ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        block: "",
        color: "neutral",
        variant: "outline",
        size: "sm",
        class: "mt-4",
        label: "Ver com mais detalhes",
        onClick: ($event) => detailOpen.value = true
      }, null, _parent));
      _push(ssrRenderComponent(_component_AppProjectDetailModal, {
        open: unref(detailOpen),
        "onUpdate:open": ($event) => isRef(detailOpen) ? detailOpen.value = $event : null,
        project: unref(currentProj).detail
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/AppProjectCard.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_3$1 = Object.assign(_sfc_main$7, { __name: "AppProjectCard" });
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "ProgressRing",
  __ssrInlineRender: true,
  props: {
    value: {},
    size: { default: 120 },
    stroke: { default: 10 },
    colorClass: { default: "text-violet-500" },
    trackClass: { default: "text-slate-200 dark:text-slate-700" }
  },
  setup(__props) {
    const props = __props;
    const clamped = computed(() => Math.min(100, Math.max(0, props.value)));
    const radius = computed(() => props.size / 2 - props.stroke / 2);
    const circumference = computed(() => 2 * Math.PI * radius.value);
    const offset = computed(() => circumference.value * (1 - clamped.value / 100));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative inline-flex items-center justify-center",
        style: { width: `${__props.size}px`, height: `${__props.size}px` },
        role: "progressbar",
        "aria-valuenow": unref(clamped),
        "aria-valuemin": "0",
        "aria-valuemax": "100"
      }, _attrs))}><svg${ssrRenderAttr("width", __props.size)}${ssrRenderAttr("height", __props.size)} class="-rotate-90"><circle${ssrRenderAttr("cx", __props.size / 2)}${ssrRenderAttr("cy", __props.size / 2)}${ssrRenderAttr("r", unref(radius))} stroke="currentColor"${ssrRenderAttr("stroke-width", __props.stroke)} fill="none" class="${ssrRenderClass(__props.trackClass)}"></circle><circle${ssrRenderAttr("cx", __props.size / 2)}${ssrRenderAttr("cy", __props.size / 2)}${ssrRenderAttr("r", unref(radius))} stroke="currentColor"${ssrRenderAttr("stroke-width", __props.stroke)} fill="none" stroke-linecap="round"${ssrRenderAttr("stroke-dasharray", unref(circumference))}${ssrRenderAttr("stroke-dashoffset", unref(offset))} class="${ssrRenderClass([__props.colorClass, "transition-[stroke-dashoffset] duration-700"])}"></circle></svg><span class="${ssrRenderClass([__props.colorClass, "absolute text-2xl font-bold"])}">${ssrInterpolate(unref(clamped))}%</span></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/ProgressRing.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$6, { __name: "UiProgressRing" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "AppGoalCard",
  __ssrInlineRender: true,
  props: {
    value: { default: 85 },
    title: { default: "Meta da equipe" },
    caption: { default: "85% das metas foram concluídas" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiProgressRing = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" }, _attrs))}><p class="text-sm font-semibold text-slate-700 dark:text-slate-200">${ssrInterpolate(__props.title)}</p><p class="mt-0.5 text-xs text-slate-400">${ssrInterpolate(__props.caption)}</p><div class="mt-4 flex justify-center">`);
      _push(ssrRenderComponent(_component_UiProgressRing, {
        value: __props.value,
        size: 120
      }, null, _parent));
      _push(`</div><p class="mt-4 text-center text-xs font-medium text-slate-500"> 🏆 Meta alcançada! </p></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/AppGoalCard.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$5, { __name: "AppGoalCard" });
const navLinkClass = "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800";
const navLinkActiveClass = "!bg-orange-50 !text-orange-600 dark:!bg-orange-500/10 dark:!text-orange-400";
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AppSidebar",
  __ssrInlineRender: true,
  props: {
    widget: {}
  },
  emits: ["navigate"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const route = useRoute();
    const { homePath, items: nav } = useAppNavigation();
    function isNavActive(to) {
      return route.path === to;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1$1;
      const _component_AppLogo = __nuxt_component_1;
      const _component_UIcon = _sfc_main$d;
      const _component_AppProjectCard = __nuxt_component_3$1;
      const _component_AppGoalCard = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full flex-col bg-white dark:bg-slate-900" }, _attrs))}><div class="flex h-16 items-center px-5">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(homePath),
        "aria-label": "CiViTas — início",
        onClick: ($event) => emit("navigate")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_AppLogo, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_AppLogo)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><nav class="flex-1 space-y-1 px-3 py-2" aria-label="Navegação principal"><!--[-->`);
      ssrRenderList(unref(nav), (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: item.to,
          class: [navLinkClass, isNavActive(item.to) && navLinkActiveClass],
          onClick: ($event) => emit("navigate")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: item.icon,
                class: "size-5 shrink-0"
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>${ssrInterpolate(item.label)}</span>`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: item.icon,
                  class: "size-5 shrink-0"
                }, null, 8, ["name"]),
                createVNode("span", null, toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav>`);
      if (__props.widget && __props.widget !== "none") {
        _push(`<div class="p-3">`);
        if (__props.widget === "project") {
          _push(ssrRenderComponent(_component_AppProjectCard, null, null, _parent));
        } else if (__props.widget === "goal") {
          _push(ssrRenderComponent(_component_AppGoalCard, null, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/AppSidebar.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$4, { __name: "AppSidebar" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "NotificationsCard",
  __ssrInlineRender: true,
  props: {
    items: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$d;
      _push(`<ul${ssrRenderAttrs(mergeProps({ class: "space-y-1" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.items, (item) => {
        _push(`<li class="${ssrRenderClass([{ "bg-indigo-50/60 dark:bg-indigo-950/30": item.unread }, "flex gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"])}"><span class="${ssrRenderClass([item.iconColor, "flex size-9 shrink-0 items-center justify-center rounded-lg"])}">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: item.icon,
          class: "size-5"
        }, null, _parent));
        _push(`</span><div class="min-w-0 flex-1"><p class="text-sm font-semibold text-slate-800 dark:text-slate-100">${ssrInterpolate(item.title)}</p><p class="text-xs text-slate-500">${ssrInterpolate(item.description)}</p><p class="mt-0.5 text-xs text-slate-400">${ssrInterpolate(item.time)}</p></div>`);
        if (item.unread) {
          _push(`<span class="mt-1 size-2 shrink-0 rounded-full bg-rose-500" aria-label="Não lida"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/inicio/NotificationsCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$3, { __name: "InicioNotificationsCard" });
const SUPPORT_EMAIL = "suporte@civitas.com";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "HelpModal",
  __ssrInlineRender: true,
  props: {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {}
  },
  emits: ["update:open"],
  setup(__props) {
    const open = useModel(__props, "open");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$f;
      _push(ssrRenderComponent(_component_UModal, mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event,
        title: "Central de Ajuda",
        ui: { content: "max-w-md" }
      }, _attrs), {
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3 text-sm text-slate-600 dark:text-slate-300"${_scopeId}><p${_scopeId}>Precisa de suporte? Aqui estão algumas opções rápidas:</p><ul class="list-inside list-disc space-y-1 text-slate-500"${_scopeId}><li${_scopeId}>Consulte a documentação do CiViTas</li><li${_scopeId}>Entre em contato com o suporte: <strong${_scopeId}>${ssrInterpolate(SUPPORT_EMAIL)}</strong></li><li${_scopeId}>Fale com seu gestor direto sobre dúvidas de projeto</li></ul></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3 text-sm text-slate-600 dark:text-slate-300" }, [
                createVNode("p", null, "Precisa de suporte? Aqui estão algumas opções rápidas:"),
                createVNode("ul", { class: "list-inside list-disc space-y-1 text-slate-500" }, [
                  createVNode("li", null, "Consulte a documentação do CiViTas"),
                  createVNode("li", null, [
                    createTextVNode("Entre em contato com o suporte: "),
                    createVNode("strong", null, toDisplayString(SUPPORT_EMAIL))
                  ]),
                  createVNode("li", null, "Fale com seu gestor direto sobre dúvidas de projeto")
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/HelpModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$2, { __name: "AppHelpModal" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  emits: ["openMenu"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const user = useCurrentUser();
    const { appRole } = useAppNavigation();
    const colorMode = useColorMode();
    const search = ref("");
    const { items: notifications, unreadCount } = useNotifications();
    const helpOpen = ref(false);
    function toggleTheme() {
      colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
    }
    const userMenu = computed(() => {
      const primary = [{ label: "Meu perfil", icon: "i-heroicons-user" }];
      if (appRole.value === "colaborador") {
        primary.push({
          label: "Configurações",
          icon: "i-heroicons-cog-6-tooth",
          to: "/colaborador/configuracoes"
        });
      }
      return [primary, [{ label: "Sair", icon: "i-heroicons-arrow-right-on-rectangle", to: "/ponte" }]];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8$1;
      const _component_UInput = _sfc_main$b;
      const _component_UPopover = _sfc_main$c;
      const _component_InicioNotificationsCard = __nuxt_component_3;
      const _component_UDropdownMenu = _sfc_main$e;
      const _component_UAvatar = _sfc_main$b$1;
      const _component_UIcon = _sfc_main$d;
      const _component_AppHelpModal = __nuxt_component_7;
      _push(`<!--[--><header class="flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6">`);
      _push(ssrRenderComponent(_component_UButton, {
        class: "lg:hidden",
        color: "neutral",
        variant: "ghost",
        icon: "i-heroicons-bars-3",
        "aria-label": "Abrir menu",
        onClick: ($event) => emit("openMenu")
      }, null, _parent));
      _push(`<div class="flex w-full max-w-xl items-center">`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(search),
        "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
        icon: "i-heroicons-magnifying-glass",
        placeholder: "Pesquisar",
        size: "lg",
        ui: { root: "flex-1", base: "rounded-l-full rounded-r-none bg-slate-50 ring-slate-200" },
        "aria-label": "Pesquisar"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        label: "Criar",
        size: "lg",
        class: [unref(brandGradient), "rounded-l-none rounded-r-full px-5 font-semibold text-white hover:opacity-95"]
      }, null, _parent));
      _push(`</div><div class="ml-auto flex items-center gap-1 sm:gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-heroicons-moon",
        "aria-label": "Alternar tema",
        onClick: toggleTheme
      }, null, _parent));
      _push(ssrRenderComponent(_component_UPopover, { ui: { content: "w-[22rem] max-w-[calc(100vw-2rem)]" } }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex max-h-[26rem] flex-col"${_scopeId}><header class="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800"${_scopeId}><h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100"${_scopeId}>Notificações</h3>`);
            if (unref(unreadCount) > 0) {
              _push2(`<span class="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600"${_scopeId}>${ssrInterpolate(unref(unreadCount))} ${ssrInterpolate(unref(unreadCount) === 1 ? "nova" : "novas")}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</header><div class="scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_InicioNotificationsCard, { items: unref(notifications) }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex max-h-[26rem] flex-col" }, [
                createVNode("header", { class: "flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800" }, [
                  createVNode("h3", { class: "text-sm font-semibold text-slate-800 dark:text-slate-100" }, "Notificações"),
                  unref(unreadCount) > 0 ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600"
                  }, toDisplayString(unref(unreadCount)) + " " + toDisplayString(unref(unreadCount) === 1 ? "nova" : "novas"), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-3" }, [
                  createVNode(_component_InicioNotificationsCard, { items: unref(notifications) }, null, 8, ["items"])
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "ghost",
              icon: "i-heroicons-bell",
              "aria-label": "Notificações"
            }, null, _parent2, _scopeId));
            if (unref(unreadCount) > 0) {
              _push2(`<span class="pointer-events-none absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold leading-none text-white ring-2 ring-white dark:ring-slate-900"${_scopeId}>${ssrInterpolate(unref(unreadCount))}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "relative" }, [
                createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "ghost",
                  icon: "i-heroicons-bell",
                  "aria-label": "Notificações"
                }),
                unref(unreadCount) > 0 ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "pointer-events-none absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold leading-none text-white ring-2 ring-white dark:ring-slate-900"
                }, toDisplayString(unref(unreadCount)), 1)) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-heroicons-question-mark-circle",
        "aria-label": "Ajuda",
        onClick: ($event) => helpOpen.value = true
      }, null, _parent));
      _push(ssrRenderComponent(_component_UDropdownMenu, {
        items: unref(userMenu),
        ui: { content: "w-48" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button type="button" class="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UAvatar, {
              src: unref(user).avatar,
              alt: unref(user).name,
              size: "md"
            }, null, _parent2, _scopeId));
            _push2(`<span class="hidden text-left leading-tight sm:block"${_scopeId}><span class="block text-sm font-semibold text-slate-800 dark:text-slate-100"${_scopeId}>${ssrInterpolate(unref(user).name)}</span><span class="block text-xs text-slate-400"${_scopeId}>${ssrInterpolate(unref(user).role)}</span></span>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-chevron-down",
              class: "size-4 text-slate-400"
            }, null, _parent2, _scopeId));
            _push2(`</button>`);
          } else {
            return [
              createVNode("button", {
                type: "button",
                class: "flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              }, [
                createVNode(_component_UAvatar, {
                  src: unref(user).avatar,
                  alt: unref(user).name,
                  size: "md"
                }, null, 8, ["src", "alt"]),
                createVNode("span", { class: "hidden text-left leading-tight sm:block" }, [
                  createVNode("span", { class: "block text-sm font-semibold text-slate-800 dark:text-slate-100" }, toDisplayString(unref(user).name), 1),
                  createVNode("span", { class: "block text-xs text-slate-400" }, toDisplayString(unref(user).role), 1)
                ]),
                createVNode(_component_UIcon, {
                  name: "i-heroicons-chevron-down",
                  class: "size-4 text-slate-400"
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></header>`);
      _push(ssrRenderComponent(_component_AppHelpModal, {
        open: unref(helpOpen),
        "onUpdate:open": ($event) => isRef(helpOpen) ? helpOpen.value = $event : null
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/AppHeader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$1, { __name: "AppHeader" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const mobileOpen = ref(false);
    const main = ref(null);
    const widget = computed(
      () => route.meta.sidebarWidget ?? "none"
    );
    watch(() => route.fullPath, () => {
      mobileOpen.value = false;
      main.value?.scrollTo({ top: 0 });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppSidebar = __nuxt_component_0;
      const _component_USlideover = _sfc_main$a;
      const _component_AppHeader = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-screen overflow-hidden bg-app" }, _attrs))}><aside class="hidden w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 lg:block">`);
      _push(ssrRenderComponent(_component_AppSidebar, { widget: unref(widget) }, null, _parent));
      _push(`</aside>`);
      _push(ssrRenderComponent(_component_USlideover, {
        open: unref(mobileOpen),
        "onUpdate:open": ($event) => isRef(mobileOpen) ? mobileOpen.value = $event : null,
        side: "left",
        ui: { content: "w-72" }
      }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_AppSidebar, {
              widget: unref(widget),
              onNavigate: ($event) => mobileOpen.value = false
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_AppSidebar, {
                widget: unref(widget),
                onNavigate: ($event) => mobileOpen.value = false
              }, null, 8, ["widget", "onNavigate"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex min-w-0 flex-1 flex-col">`);
      _push(ssrRenderComponent(_component_AppHeader, {
        onOpenMenu: ($event) => mobileOpen.value = true
      }, null, _parent));
      _push(`<main class="scroll-thin flex-1 overflow-y-auto">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-BCXp_5DG.mjs.map
