import { f as _sfc_main$d, e as _sfc_main$b } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, ref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createTextVNode, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { d as useStatusList, e as useStatusMeta, _ as __nuxt_component_2, a as usePriorityMeta } from './ProgressBar-CoIUm3TO.mjs';
import { _ as __nuxt_component_1$1 } from './SectionCard-CotbZH9k.mjs';
import { z as tasksSchema, g as mockBoardTasks, C as timelineGroupsSchema, u as mockTimeline } from './index-D-j7ajRT.mjs';

const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "PriorityBadge",
  __ssrInlineRender: true,
  props: {
    priority: {}
  },
  setup(__props) {
    const props = __props;
    const meta = computed(() => usePriorityMeta(props.priority));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold", unref(meta).classes]
      }, _attrs))}>${ssrInterpolate(unref(meta).label)}</span>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/PriorityBadge.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$4, { __name: "UiPriorityBadge" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "TaskCard",
  __ssrInlineRender: true,
  props: {
    task: {},
    done: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$d;
      const _component_UiPriorityBadge = __nuxt_component_1;
      const _component_UiProgressBar = __nuxt_component_2;
      const _component_UAvatar = _sfc_main$b;
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900" }, _attrs))}><div class="flex items-start justify-between gap-2"><h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100">${ssrInterpolate(__props.task.title)}</h3>`);
      if (__props.done) {
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-check-circle-solid",
          class: "size-5 shrink-0 text-emerald-500"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-2">`);
      _push(ssrRenderComponent(_component_UiPriorityBadge, {
        priority: __props.task.priority
      }, null, _parent));
      _push(`</div>`);
      if (__props.task.note) {
        _push(`<p class="mt-2 text-xs text-slate-400">${ssrInterpolate(__props.task.note)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.task.progress != null) {
        _push(`<div class="mt-3">`);
        _push(ssrRenderComponent(_component_UiProgressBar, {
          value: __props.task.progress,
          gradient: ""
        }, null, _parent));
        _push(`<p class="mt-1 text-right text-xs font-medium text-slate-500">${ssrInterpolate(__props.task.progress)}%</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-3 flex items-center justify-between">`);
      _push(ssrRenderComponent(_component_UAvatar, {
        src: __props.task.assignees[0]?.avatar,
        alt: __props.task.assignees[0]?.name,
        size: "2xs"
      }, null, _parent));
      _push(`<span class="flex items-center gap-1 text-xs text-slate-400">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-calendar-days",
        class: "size-3.5"
      }, null, _parent));
      _push(` ${ssrInterpolate(__props.task.dueDate)}</span></div></article>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quadros/TaskCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$3, { __name: "QuadrosTaskCard" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "KanbanColumn",
  __ssrInlineRender: true,
  props: {
    status: {},
    tasks: {}
  },
  setup(__props) {
    const props = __props;
    const meta = computed(() => useStatusMeta(props.status));
    const COLUMN_TRACK = {
      planejado: "bg-blue-100/70 dark:bg-blue-950/25",
      "em-andamento": "bg-amber-100/70 dark:bg-amber-950/25",
      "em-revisao": "bg-violet-100/70 dark:bg-violet-950/25",
      bloqueado: "bg-red-100/60 dark:bg-red-950/25",
      atrasado: "bg-rose-100/60 dark:bg-rose-950/25",
      concluido: "bg-emerald-100/70 dark:bg-emerald-950/25"
    };
    const trackClass = computed(() => COLUMN_TRACK[props.status]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_QuadrosTaskCard = __nuxt_component_0$1;
      const _component_UIcon = _sfc_main$d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex w-72 shrink-0 flex-col" }, _attrs))}><div class="${ssrRenderClass([unref(meta).border, "mb-3 flex items-center justify-between rounded-lg border-t-2 bg-white px-3 py-2.5 shadow-sm dark:bg-slate-900"])}"><span class="flex min-w-0 items-center gap-2"><span class="${ssrRenderClass([unref(meta).dot, "size-2 shrink-0 rounded-full"])}"></span><span class="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">${ssrInterpolate(unref(meta).label)}</span></span><span class="shrink-0 text-sm text-slate-400">${ssrInterpolate(__props.tasks.length)}</span></div><div class="${ssrRenderClass([unref(trackClass), "min-h-[12rem] flex-1 space-y-3 rounded-xl p-3"])}"><!--[-->`);
      ssrRenderList(__props.tasks, (task) => {
        _push(ssrRenderComponent(_component_QuadrosTaskCard, {
          key: task.id,
          task,
          done: __props.status === "concluido"
        }, null, _parent));
      });
      _push(`<!--]-->`);
      if (__props.tasks.length === 0) {
        _push(`<p class="rounded-lg border border-dashed border-white/60 py-8 text-center text-xs text-slate-500 dark:border-slate-700"> Nenhuma tarefa nesta coluna </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="button" class="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:border-violet-300 hover:text-violet-600 dark:border-slate-700">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-plus",
        class: "size-4"
      }, null, _parent));
      _push(` Adicionar tarefa </button></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quadros/KanbanColumn.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "QuadrosKanbanColumn" });
function useBoardData() {
  return tasksSchema.parse(mockBoardTasks, "boardTasks");
}
function groupByStatus(tasks) {
  return tasks.reduce(
    (acc, task) => {
      (acc[task.status] ||= []).push(task);
      return acc;
    },
    {}
  );
}
function useTimelineRuler() {
  const months = [
    { label: "Mai 2026", days: range(21, 31) },
    { label: "Jun 2026", days: range(1, 19) }
  ];
  const totalDays = months.reduce((n, m) => n + m.days.length, 0);
  return { months, totalDays };
}
function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
function useTimelineData() {
  return { groups: timelineGroupsSchema.parse(mockTimeline, "timeline") };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "KanbanBoard",
  __ssrInlineRender: true,
  setup(__props) {
    const tasks = useBoardData();
    const columns = useStatusList();
    const grouped = computed(() => groupByStatus(tasks));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_QuadrosKanbanColumn = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "scroll-thin -mx-1 flex gap-5 overflow-x-auto px-1 pb-2" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(columns), (status) => {
        _push(ssrRenderComponent(_component_QuadrosKanbanColumn, {
          key: status,
          status,
          tasks: unref(grouped)[status] ?? []
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quadros/KanbanBoard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$1, { __name: "QuadrosKanbanBoard" });
const DAY_WIDTH = 30;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "GanttChart",
  __ssrInlineRender: true,
  setup(__props) {
    const { months, totalDays } = useTimelineRuler();
    const { groups } = useTimelineData();
    const zoom = ref("Semana");
    const barColor = {
      neutral: "bg-slate-400",
      amber: "bg-amber-400",
      blue: "bg-blue-400",
      violet: "bg-violet-500",
      pink: "bg-pink-400"
    };
    const gridStyle = computed(() => ({
      gridTemplateColumns: `repeat(${totalDays}, ${DAY_WIDTH}px)`
    }));
    const timelineWidth = computed(() => ({ width: `${totalDays * DAY_WIDTH}px` }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiSectionCard = __nuxt_component_1$1;
      const _component_UIcon = _sfc_main$d;
      const _component_UAvatar = _sfc_main$b;
      _push(ssrRenderComponent(_component_UiSectionCard, _attrs, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-bars-3-bottom-left",
              class: "size-5 text-slate-500"
            }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><h2 class="font-semibold text-slate-800 dark:text-slate-100"${_scopeId}>Timeline (Gantt)</h2><p class="text-xs text-slate-400"${_scopeId}>Visão geral do cronograma do projeto</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-2" }, [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-bars-3-bottom-left",
                  class: "size-5 text-slate-500"
                }),
                createVNode("div", null, [
                  createVNode("h2", { class: "font-semibold text-slate-800 dark:text-slate-100" }, "Timeline (Gantt)"),
                  createVNode("p", { class: "text-xs text-slate-400" }, "Visão geral do cronograma do projeto")
                ])
              ])
            ];
          }
        }),
        action: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-2 text-sm text-slate-400"${_scopeId}><span${_scopeId}>Zoom:</span><div class="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"${_scopeId}><!--[-->`);
            ssrRenderList(["Dias", "Semana", "Meses"], (option) => {
              _push2(`<button type="button" class="${ssrRenderClass([unref(zoom) === option ? "bg-violet-50 text-violet-600" : "text-slate-500 hover:bg-slate-50", "px-3 py-1 text-sm font-medium transition-colors"])}"${_scopeId}>${ssrInterpolate(option)}</button>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-2 text-sm text-slate-400" }, [
                createVNode("span", null, "Zoom:"),
                createVNode("div", { class: "flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(["Dias", "Semana", "Meses"], (option) => {
                    return createVNode("button", {
                      key: option,
                      type: "button",
                      class: ["px-3 py-1 text-sm font-medium transition-colors", unref(zoom) === option ? "bg-violet-50 text-violet-600" : "text-slate-500 hover:bg-slate-50"],
                      onClick: ($event) => zoom.value = option
                    }, toDisplayString(option), 11, ["onClick"]);
                  }), 64))
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="scroll-thin overflow-x-auto"${_scopeId}><div class="min-w-max"${_scopeId}><div class="flex border-b border-slate-200 dark:border-slate-800"${_scopeId}><div class="grid w-[290px] shrink-0 grid-cols-2 pb-2"${_scopeId}><span class="text-xs font-semibold uppercase tracking-wide text-slate-400"${_scopeId}>Tarefa</span><span class="text-xs font-semibold uppercase tracking-wide text-slate-400"${_scopeId}>Responsável</span></div><div style="${ssrRenderStyle(unref(timelineWidth))}"${_scopeId}><div class="flex"${_scopeId}><!--[-->`);
            ssrRenderList(unref(months), (month) => {
              _push2(`<div class="border-l border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 dark:border-slate-800" style="${ssrRenderStyle({ width: `${month.days.length * DAY_WIDTH}px` })}"${_scopeId}>${ssrInterpolate(month.label)}</div>`);
            });
            _push2(`<!--]--></div><div class="grid" style="${ssrRenderStyle(unref(gridStyle))}"${_scopeId}><!--[-->`);
            ssrRenderList(unref(months), (month) => {
              _push2(`<span class="contents"${_scopeId}><!--[-->`);
              ssrRenderList(month.days, (day) => {
                _push2(`<span class="border-l border-slate-100 py-1 text-center text-[11px] text-slate-400 dark:border-slate-800"${_scopeId}>${ssrInterpolate(day)}</span>`);
              });
              _push2(`<!--]--></span>`);
            });
            _push2(`<!--]--></div></div></div><!--[-->`);
            ssrRenderList(unref(groups), (group, gi) => {
              _push2(`<!--[-->`);
              if (group.title) {
                _push2(`<div class="flex items-center gap-1 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-chevron-down",
                  class: "size-4"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(group.title)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(group.tasks, (task) => {
                _push2(`<div class="flex items-center"${_scopeId}><div class="grid w-[290px] shrink-0 grid-cols-2 items-center py-2.5 pr-3"${_scopeId}><span class="truncate text-sm text-slate-600 dark:text-slate-300"${_scopeId}>${ssrInterpolate(task.title)}</span><span class="flex items-center gap-2"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UAvatar, {
                  src: task.assignee.avatar,
                  alt: task.assignee.name,
                  size: "2xs"
                }, null, _parent2, _scopeId));
                _push2(`<span class="truncate text-sm text-slate-500"${_scopeId}>${ssrInterpolate(task.assignee.name)}</span></span></div><div class="grid items-center border-l border-slate-100 dark:border-slate-800" style="${ssrRenderStyle([unref(gridStyle), unref(timelineWidth)])}"${_scopeId}>`);
                if (task.span > 0) {
                  _push2(`<div class="${ssrRenderClass([barColor[task.color], "h-5 rounded-full"])}" style="${ssrRenderStyle({ gridColumn: `${task.startIndex + 1} / span ${task.span}` })}"${_scopeId}></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
              });
              _push2(`<!--]--><!--]-->`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            return [
              createVNode("div", { class: "scroll-thin overflow-x-auto" }, [
                createVNode("div", { class: "min-w-max" }, [
                  createVNode("div", { class: "flex border-b border-slate-200 dark:border-slate-800" }, [
                    createVNode("div", { class: "grid w-[290px] shrink-0 grid-cols-2 pb-2" }, [
                      createVNode("span", { class: "text-xs font-semibold uppercase tracking-wide text-slate-400" }, "Tarefa"),
                      createVNode("span", { class: "text-xs font-semibold uppercase tracking-wide text-slate-400" }, "Responsável")
                    ]),
                    createVNode("div", { style: unref(timelineWidth) }, [
                      createVNode("div", { class: "flex" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(months), (month) => {
                          return openBlock(), createBlock("div", {
                            key: month.label,
                            class: "border-l border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 dark:border-slate-800",
                            style: { width: `${month.days.length * DAY_WIDTH}px` }
                          }, toDisplayString(month.label), 5);
                        }), 128))
                      ]),
                      createVNode("div", {
                        class: "grid",
                        style: unref(gridStyle)
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(months), (month) => {
                          return openBlock(), createBlock("span", {
                            key: `days-${month.label}`,
                            class: "contents"
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(month.days, (day) => {
                              return openBlock(), createBlock("span", {
                                key: `${month.label}-${day}`,
                                class: "border-l border-slate-100 py-1 text-center text-[11px] text-slate-400 dark:border-slate-800"
                              }, toDisplayString(day), 1);
                            }), 128))
                          ]);
                        }), 128))
                      ], 4)
                    ], 4)
                  ]),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(groups), (group, gi) => {
                    return openBlock(), createBlock(Fragment, { key: gi }, [
                      group.title ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex items-center gap-1 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
                      }, [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-chevron-down",
                          class: "size-4"
                        }),
                        createTextVNode(" " + toDisplayString(group.title), 1)
                      ])) : createCommentVNode("", true),
                      (openBlock(true), createBlock(Fragment, null, renderList(group.tasks, (task) => {
                        return openBlock(), createBlock("div", {
                          key: task.id,
                          class: "flex items-center"
                        }, [
                          createVNode("div", { class: "grid w-[290px] shrink-0 grid-cols-2 items-center py-2.5 pr-3" }, [
                            createVNode("span", { class: "truncate text-sm text-slate-600 dark:text-slate-300" }, toDisplayString(task.title), 1),
                            createVNode("span", { class: "flex items-center gap-2" }, [
                              createVNode(_component_UAvatar, {
                                src: task.assignee.avatar,
                                alt: task.assignee.name,
                                size: "2xs"
                              }, null, 8, ["src", "alt"]),
                              createVNode("span", { class: "truncate text-sm text-slate-500" }, toDisplayString(task.assignee.name), 1)
                            ])
                          ]),
                          createVNode("div", {
                            class: "grid items-center border-l border-slate-100 dark:border-slate-800",
                            style: [unref(gridStyle), unref(timelineWidth)]
                          }, [
                            task.span > 0 ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: ["h-5 rounded-full", barColor[task.color]],
                              style: { gridColumn: `${task.startIndex + 1} / span ${task.span}` }
                            }, null, 6)) : createCommentVNode("", true)
                          ], 4)
                        ]);
                      }), 128))
                    ], 64);
                  }), 128))
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quadros/GanttChart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main, { __name: "QuadrosGanttChart" });

export { __nuxt_component_4 as _, __nuxt_component_5 as a };
//# sourceMappingURL=GanttChart-C2YdtgUy.mjs.map
