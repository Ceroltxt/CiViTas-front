import { d as _sfc_main$8, f as _sfc_main$d, e as _sfc_main$b$1, M as useComponentProps, J as useAppConfig, I as tv, j as avatarGroupInjectionKey, b as Primitive } from './server.mjs';
import { _ as _sfc_main$6 } from './Input-BsVJ6KLu.mjs';
import { _ as __nuxt_component_2, u as useUserProjects } from './useUserProjects-B_3XcnzE.mjs';
import { _ as _sfc_main$b } from './Checkbox-cJMXpeOL.mjs';
import { c as usePriorityOptions, u as usePriorityList, a as usePriorityMeta, b as brandGradient, _ as __nuxt_component_2$1 } from './ProgressBar-CoIUm3TO.mjs';
import { defineComponent, ref, computed, mergeProps, unref, isRef, useModel, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSlots, provide, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderVNode } from 'vue/server-renderer';
import { _ as _sfc_main$c } from './DropdownMenu-CRLH50FN.mjs';
import { a as useTasksData, u as useProjectProgressForTask, g as groupTasksByPriority, b as useTeamTagClass } from './useProjectProgress-CQIoMO92.mjs';
import { _ as _sfc_main$7 } from './Modal-DrlsEEos.mjs';
import { _ as _sfc_main$9 } from './Textarea-0o-hq-NV.mjs';
import { _ as _sfc_main$a } from './Select-c22fz1qb.mjs';
import { d as dueDateOrder } from './date-BjMsJr0b.mjs';
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
import './index-D-j7ajRT.mjs';
import './navigation-CS4vmRJG.mjs';
import './useFormControl-9B1GcqCr.mjs';
import './VisuallyHiddenInput-_jZmJXfe.mjs';
import './useId-Df0AxZi5.mjs';
import './RovingFocusGroup-Dpm1zhJB.mjs';
import './useDirection-B3h_OC89.mjs';
import './Label-Bz9RXRS1.mjs';
import './index-C8l8nrqu.mjs';
import '@internationalized/date';
import './PopperArrow-C07et48U.mjs';
import '@floating-ui/vue';
import './utils-CJXk8l7g.mjs';
import 'aria-hidden';
import './overlay-CjyBzL1C.mjs';

const theme = {
  "slots": {
    "root": "inline-flex flex-row-reverse justify-end",
    "base": "relative rounded-full ring-bg first:me-0"
  },
  "variants": {
    "size": {
      "3xs": {
        "base": "ring -me-0.5"
      },
      "2xs": {
        "base": "ring -me-0.5"
      },
      "xs": {
        "base": "ring -me-0.5"
      },
      "sm": {
        "base": "ring-2 -me-1.5"
      },
      "md": {
        "base": "ring-2 -me-1.5"
      },
      "lg": {
        "base": "ring-2 -me-1.5"
      },
      "xl": {
        "base": "ring-3 -me-2"
      },
      "2xl": {
        "base": "ring-3 -me-2"
      },
      "3xl": {
        "base": "ring-3 -me-2"
      }
    },
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    }
  },
  "defaultVariants": {
    "size": "md",
    "color": "neutral"
  }
};
const _sfc_main$5 = {
  __name: "UAvatarGroup",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    size: { type: null, required: false },
    color: { type: null, required: false },
    max: { type: [Number, String], required: false },
    class: { type: null, required: false },
    ui: { type: Object, required: false }
  },
  setup(__props) {
    const _props = __props;
    const slots = useSlots();
    const props = useComponentProps("avatarGroup", _props);
    const appConfig = useAppConfig();
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.avatarGroup || {} })({
      size: props.size,
      color: props.color
    }));
    const max = computed(() => typeof props.max === "string" ? Number.parseInt(props.max, 10) : props.max);
    const children = computed(() => {
      let children2 = slots.default?.();
      if (children2?.length) {
        children2 = children2.flatMap((child) => {
          if (typeof child.type === "symbol") {
            if (typeof child.children === "string") {
              return;
            }
            return child.children;
          }
          return child;
        }).filter(Boolean);
      }
      return children2 || [];
    });
    const visibleAvatars = computed(() => {
      if (!children.value.length) {
        return [];
      }
      if (!max.value || max.value <= 0) {
        return [...children.value].reverse();
      }
      return [...children.value].slice(0, max.value).reverse();
    });
    const hiddenCount = computed(() => {
      if (!children.value.length) {
        return 0;
      }
      return children.value.length - visibleAvatars.value.length;
    });
    provide(avatarGroupInjectionKey, computed(() => ({
      size: props.size,
      color: props.color
    })));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: unref(props).as,
        "data-slot": "root",
        class: ui.value.root({ class: [unref(props).ui?.root, unref(props).class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (hiddenCount.value > 0) {
              _push2(ssrRenderComponent(_sfc_main$b$1, {
                text: `+${hiddenCount.value}`,
                "data-slot": "base",
                class: ui.value.base({ class: unref(props).ui?.base })
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(visibleAvatars.value, (avatar, count) => {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(avatar), {
                key: count,
                "data-slot": "base",
                class: ui.value.base({ class: unref(props).ui?.base })
              }, null), _parent2, _scopeId);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              hiddenCount.value > 0 ? (openBlock(), createBlock(_sfc_main$b$1, {
                key: 0,
                text: `+${hiddenCount.value}`,
                "data-slot": "base",
                class: ui.value.base({ class: unref(props).ui?.base })
              }, null, 8, ["text", "class"])) : createCommentVNode("", true),
              (openBlock(true), createBlock(Fragment, null, renderList(visibleAvatars.value, (avatar, count) => {
                return openBlock(), createBlock(resolveDynamicComponent(avatar), {
                  key: count,
                  "data-slot": "base",
                  class: ui.value.base({ class: unref(props).ui?.base })
                }, null, 8, ["class"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/AvatarGroup.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AvatarStack",
  __ssrInlineRender: true,
  props: {
    users: {},
    max: { default: 3 },
    size: { default: "xs" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAvatarGroup = _sfc_main$5;
      const _component_UAvatar = _sfc_main$b$1;
      _push(ssrRenderComponent(_component_UAvatarGroup, mergeProps({
        max: __props.max,
        size: __props.size
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(__props.users, (u) => {
              _push2(ssrRenderComponent(_component_UAvatar, {
                key: u.id,
                src: u.avatar,
                alt: u.name
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(__props.users, (u) => {
                return openBlock(), createBlock(_component_UAvatar, {
                  key: u.id,
                  src: u.avatar,
                  alt: u.name
                }, null, 8, ["src", "alt"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/AvatarStack.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$4, { __name: "UiAvatarStack" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "TaskListRow",
  __ssrInlineRender: true,
  props: {
    task: {},
    showAccent: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const showAccent = computed(() => props.showAccent !== false);
    const isDone = computed(() => props.task.status === "concluido");
    const isLate = computed(() => props.task.status === "atrasado");
    const isPersonal = computed(() => props.task.personal === true);
    const isNotStarted = computed(() => props.task.notStarted === true && !isDone.value && !isLate.value);
    const done = computed({
      get: () => isDone.value,
      set: (val) => {
        props.task.status = val ? "concluido" : "em-andamento";
      }
    });
    const teamClass = computed(() => useTeamTagClass(props.task.team));
    const projectProgress = computed(
      () => useProjectProgressForTask(props.task.project, props.task.projectProgress)
    );
    const accentBarClass = computed(() => {
      if (isDone.value) return "bg-emerald-200";
      if (isLate.value) return "bg-rose-200";
      const soft = {
        critica: "bg-red-200",
        alta: "bg-pink-200",
        media: "bg-amber-200",
        baixa: "bg-emerald-200"
      };
      return soft[props.task.priority] ?? "bg-slate-200";
    });
    const containerClass = computed(() => {
      if (!showAccent.value)
        return "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";
      if (isDone.value)
        return "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20";
      if (isLate.value)
        return "border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20";
      if (isNotStarted.value)
        return "border-dashed border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-900/40";
      return "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";
    });
    const rowMenu = [
      [
        { label: "Editar", icon: "i-heroicons-pencil-square" },
        { label: "Duplicar", icon: "i-heroicons-document-duplicate" }
      ],
      [{ label: "Excluir", icon: "i-heroicons-trash", color: "error" }]
    ];
    const lateNote = computed(
      () => props.task.note?.replace(/^Atrasada\s+/i, "") ?? ""
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCheckbox = _sfc_main$b;
      const _component_UIcon = _sfc_main$d;
      const _component_UiProgressBar = __nuxt_component_2$1;
      const _component_UiAvatarStack = __nuxt_component_3;
      const _component_UDropdownMenu = _sfc_main$c;
      const _component_UButton = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["flex overflow-hidden rounded-xl border transition-colors", unref(containerClass)]
      }, _attrs))}>`);
      if (unref(showAccent)) {
        _push(`<div class="${ssrRenderClass([unref(accentBarClass), "w-1 shrink-0"])}" aria-hidden="true"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([unref(isPersonal) ? "flex-nowrap" : "flex-wrap md:flex-nowrap", "flex min-h-[3.25rem] min-w-0 flex-1 items-center gap-x-4 gap-y-2 px-4 py-3 md:gap-6"])}"><div class="${ssrRenderClass([unref(isPersonal) ? "min-w-0 flex-1" : "min-w-0 flex-[1.6] md:shrink", "flex min-w-0 items-center gap-3"])}">`);
      _push(ssrRenderComponent(_component_UCheckbox, {
        modelValue: unref(done),
        "onUpdate:modelValue": ($event) => isRef(done) ? done.value = $event : null,
        "aria-label": `Concluir ${__props.task.title}`,
        ui: { base: "rounded-full" }
      }, null, _parent));
      _push(`<div class="flex min-w-0 flex-1 flex-col justify-center gap-0.5"><div class="${ssrRenderClass([!unref(isPersonal) ? "gap-3" : "", "flex min-w-0 items-center gap-2"])}"><p${ssrRenderAttr("title", __props.task.title)} class="${ssrRenderClass([
        unref(isDone) ? "text-slate-500 dark:text-slate-400" : unref(isNotStarted) ? "text-slate-500 dark:text-slate-400" : "text-slate-800 dark:text-slate-100",
        "min-w-0 flex-1 truncate text-sm font-semibold"
      ])}">${ssrInterpolate(__props.task.title)}</p>`);
      if (!unref(isPersonal)) {
        _push(`<div class="flex shrink-0 items-center gap-1.5">`);
        if (unref(isDone)) {
          _push(`<span class="hidden rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 sm:inline-flex dark:bg-emerald-900/40 dark:text-emerald-300"> Concluída </span>`);
        } else if (unref(isLate)) {
          _push(`<span class="hidden rounded-md bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700 sm:inline-flex dark:bg-rose-900/40 dark:text-rose-300"> Atrasada </span>`);
        } else if (unref(isNotStarted)) {
          _push(`<span class="hidden rounded-md border border-dashed border-slate-300 bg-white px-2 py-0.5 text-xs font-medium text-slate-400 sm:inline-flex dark:border-slate-600 dark:bg-slate-900"> A iniciar </span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(isLate) && unref(lateNote)) {
          _push(`<span class="hidden text-xs whitespace-nowrap text-rose-500 md:inline"> · ${ssrInterpolate(unref(lateNote))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!--[-->`);
        if (unref(isDone)) {
          _push(`<span class="hidden shrink-0 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 sm:inline-flex dark:bg-emerald-900/40 dark:text-emerald-300"> Concluída </span>`);
        } else if (unref(isNotStarted)) {
          _push(`<span class="hidden shrink-0 rounded-md border border-dashed border-slate-300 bg-white px-2 py-0.5 text-xs font-medium text-slate-400 sm:inline-flex dark:border-slate-600 dark:bg-slate-900"> A iniciar </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      if (__props.task.dueDate && !unref(isPersonal)) {
        _push(`<div class="flex shrink-0 items-center gap-1 text-sm text-slate-400">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-calendar-days",
          class: "size-3.5 shrink-0"
        }, null, _parent));
        _push(`<span class="whitespace-nowrap">${ssrInterpolate(__props.task.dueDate)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(isPersonal)) {
        _push(`<p class="text-xs text-slate-400 md:hidden">Tarefa pessoal</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isLate) && unref(lateNote)) {
        _push(`<p class="text-xs text-rose-500 sm:hidden">· ${ssrInterpolate(unref(lateNote))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (!unref(isPersonal)) {
        _push(`<div class="hidden min-w-0 shrink-0 md:block md:w-[18%]"><p class="truncate text-sm font-medium text-slate-700 dark:text-slate-200">${ssrInterpolate(__props.task.project)}</p>`);
        if (__props.task.team) {
          _push(`<span class="${ssrRenderClass([unref(teamClass), "mt-0.5 inline-block rounded px-1.5 py-0.5 text-xs font-medium"])}">${ssrInterpolate(__props.task.team)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isPersonal)) {
        _push(`<div class="hidden min-w-0 max-w-[11rem] flex-1 items-center gap-2 md:flex lg:max-w-xs"><span class="w-8 shrink-0 text-right text-sm font-medium text-slate-600 dark:text-slate-300">${ssrInterpolate(unref(projectProgress))}% </span>`);
        _push(ssrRenderComponent(_component_UiProgressBar, {
          value: unref(projectProgress),
          color: unref(isDone) ? "bg-emerald-500" : unref(isLate) ? "bg-rose-500" : unref(isNotStarted) ? "bg-slate-200" : "bg-violet-500",
          class: "min-w-0 flex-1"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isPersonal)) {
        _push(`<div class="hidden md:block">`);
        _push(ssrRenderComponent(_component_UiAvatarStack, {
          users: __props.task.assignees,
          max: 3
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isPersonal)) {
        _push(`<div class="ml-auto flex shrink-0 items-center gap-4">`);
        if (__props.task.dueDate) {
          _push(`<div class="flex items-center gap-1 text-sm text-slate-400">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-heroicons-calendar-days",
            class: "size-3.5 shrink-0"
          }, null, _parent));
          _push(`<span class="whitespace-nowrap">${ssrInterpolate(__props.task.dueDate)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_UDropdownMenu, { items: rowMenu }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                color: "neutral",
                variant: "ghost",
                size: "xs",
                icon: "i-heroicons-ellipsis-vertical",
                class: "!p-1",
                "aria-label": "Ações da tarefa"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "ghost",
                  size: "xs",
                  icon: "i-heroicons-ellipsis-vertical",
                  class: "!p-1",
                  "aria-label": "Ações da tarefa"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="ml-auto flex w-8 shrink-0 justify-center md:ml-0">`);
        _push(ssrRenderComponent(_component_UDropdownMenu, { items: rowMenu }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                color: "neutral",
                variant: "ghost",
                size: "xs",
                icon: "i-heroicons-ellipsis-vertical",
                class: "!p-1",
                "aria-label": "Ações da tarefa"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "ghost",
                  size: "xs",
                  icon: "i-heroicons-ellipsis-vertical",
                  class: "!p-1",
                  "aria-label": "Ações da tarefa"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tarefas/TaskListRow.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$3, { __name: "TarefasTaskListRow" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TaskGroup",
  __ssrInlineRender: true,
  props: {
    priority: {},
    tasks: {},
    showAccent: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const open = ref(true);
    const meta = computed(() => usePriorityMeta(props.priority));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$d;
      const _component_TarefasTaskListRow = __nuxt_component_1;
      _push(`<section${ssrRenderAttrs(_attrs)}><button type="button" class="${ssrRenderClass([unref(meta).text, "mb-3 flex items-center gap-2 text-sm font-semibold"])}"${ssrRenderAttr("aria-expanded", unref(open))}>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-chevron-down",
        class: ["size-4 transition-transform", { "-rotate-90": !unref(open) }]
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(meta).label)} prioridade (${ssrInterpolate(__props.tasks.length)}) </button><div class="space-y-2" style="${ssrRenderStyle(unref(open) ? null : { display: "none" })}"><!--[-->`);
      ssrRenderList(__props.tasks, (task) => {
        _push(ssrRenderComponent(_component_TarefasTaskListRow, {
          key: task.id,
          task,
          "show-accent": __props.showAccent
        }, null, _parent));
      });
      _push(`<!--]--></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tarefas/TaskGroup.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$2, { __name: "TarefasTaskGroup" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "NewTaskModal",
  __ssrInlineRender: true,
  props: {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {}
  },
  emits: ["update:open"],
  setup(__props) {
    const open = useModel(__props, "open");
    const PERSONAL_PRIORITIES = ["alta", "media", "baixa"];
    const projectItems = computed(() => [
      { label: "Nenhum", value: "" },
      ...useUserProjects().map((p) => ({ label: p.name, value: p.name }))
    ]);
    const priorityOptions = usePriorityOptions(PERSONAL_PRIORITIES);
    const priorityPills = computed(
      () => PERSONAL_PRIORITIES.map((value) => ({ value, ...usePriorityMeta(value) }))
    );
    const title = ref("");
    const description = ref("");
    const project = ref("");
    const priority = ref();
    const startDate = ref("");
    const deadline = ref("");
    const tags = ref([]);
    const tagInput = ref("");
    const notifyUpdates = ref(true);
    const allowComments = ref(true);
    const privateTask = ref(false);
    function addTag() {
      const value = tagInput.value.trim();
      if (value && !tags.value.includes(value)) {
        tags.value.push(value);
      }
      tagInput.value = "";
    }
    function onTagKeydown(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag();
      }
    }
    function removeTag(tag) {
      tags.value = tags.value.filter((t) => t !== tag);
    }
    function resetForm() {
      title.value = "";
      description.value = "";
      project.value = "";
      priority.value = void 0;
      startDate.value = "";
      deadline.value = "";
      tags.value = [];
      tagInput.value = "";
      notifyUpdates.value = true;
      allowComments.value = true;
      privateTask.value = false;
    }
    function closeModal() {
      open.value = false;
      resetForm();
    }
    function createTask() {
      closeModal();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$7;
      const _component_UButton = _sfc_main$8;
      const _component_UIcon = _sfc_main$d;
      const _component_UInput = _sfc_main$6;
      const _component_UTextarea = _sfc_main$9;
      const _component_USelect = _sfc_main$a;
      const _component_UCheckbox = _sfc_main$b;
      _push(ssrRenderComponent(_component_UModal, mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event,
        title: "Nova Tarefa",
        scrollable: "",
        ui: { content: "max-w-2xl" }
      }, _attrs), {
        close: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              type: "button",
              color: "neutral",
              variant: "ghost",
              icon: "i-heroicons-x-mark",
              "aria-label": "Fechar",
              onClick: closeModal
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                type: "button",
                color: "neutral",
                variant: "ghost",
                icon: "i-heroicons-x-mark",
                "aria-label": "Fechar",
                onClick: closeModal
              })
            ];
          }
        }),
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-5 flex gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-900 dark:bg-violet-950/30"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-lock-closed",
              class: "mt-0.5 size-5 shrink-0 text-violet-600"
            }, null, _parent2, _scopeId));
            _push2(`<p class="text-sm text-violet-800 dark:text-violet-200"${_scopeId}> Esta tarefa pessoal ficará visível <strong${_scopeId}>apenas para você</strong>. Nenhum membro da equipe ou gestor poderá visualizá-la. </p></div><section class="space-y-4"${_scopeId}><h3 class="text-sm font-bold text-slate-800 dark:text-slate-100"${_scopeId}>Informações Gerais</h3><div${_scopeId}><label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200"${_scopeId}> Título da Tarefa <span class="text-rose-500"${_scopeId}>*</span></label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(title),
              "onUpdate:modelValue": ($event) => isRef(title) ? title.value = $event : null,
              placeholder: "Ex: Criar protótipo da dashboard",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200"${_scopeId}> Descrição <span class="text-rose-500"${_scopeId}>*</span></label><div class="relative"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UTextarea, {
              modelValue: unref(description),
              "onUpdate:modelValue": ($event) => isRef(description) ? description.value = $event : null,
              rows: 4,
              placeholder: "Descreva o que precisa ser feito, objetivos e detalhes importantes...",
              class: "w-full",
              maxlength: 1e3
            }, null, _parent2, _scopeId));
            _push2(`<span class="absolute bottom-2 right-3 text-xs text-slate-400"${_scopeId}>${ssrInterpolate(unref(description).length)}/1000 </span></div></div><div class="grid gap-4 sm:grid-cols-2"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200"${_scopeId}> Projeto <span class="font-normal text-slate-400"${_scopeId}>(opcional)</span></label>`);
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(project),
              "onUpdate:modelValue": ($event) => isRef(project) ? project.value = $event : null,
              items: unref(projectItems),
              placeholder: "Selecione o projeto",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200"${_scopeId}> Prioridade <span class="text-rose-500"${_scopeId}>*</span></label>`);
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(priority),
              "onUpdate:modelValue": ($event) => isRef(priority) ? priority.value = $event : null,
              items: unref(priorityOptions),
              placeholder: "Selecione a prioridade",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`<div class="mt-2 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(unref(priorityPills), (p) => {
              _push2(`<span class="${ssrRenderClass([p.classes, "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"])}"${_scopeId}><span class="${ssrRenderClass([p.dot, "size-2 rounded-full"])}"${_scopeId}></span> ${ssrInterpolate(p.label)}</span>`);
            });
            _push2(`<!--]--></div></div></div><div class="grid gap-4 sm:grid-cols-2"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200"${_scopeId}> Data de Início <span class="text-rose-500"${_scopeId}>*</span></label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(startDate),
              "onUpdate:modelValue": ($event) => isRef(startDate) ? startDate.value = $event : null,
              type: "date",
              icon: "i-heroicons-calendar-days",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200"${_scopeId}> Prazo Final <span class="text-rose-500"${_scopeId}>*</span></label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(deadline),
              "onUpdate:modelValue": ($event) => isRef(deadline) ? deadline.value = $event : null,
              type: "date",
              icon: "i-heroicons-calendar-days",
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></section><hr class="my-6 border-slate-100 dark:border-slate-800"${_scopeId}><section class="space-y-4"${_scopeId}><h3 class="text-sm font-bold text-slate-800 dark:text-slate-100"${_scopeId}>Detalhes Adicionais</h3><div${_scopeId}><label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200"${_scopeId}> Tags (Opcional) </label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(tagInput),
              "onUpdate:modelValue": ($event) => isRef(tagInput) ? tagInput.value = $event : null,
              icon: "i-heroicons-tag",
              placeholder: "Digite para adicionar tags",
              class: "w-full",
              onKeydown: onTagKeydown
            }, null, _parent2, _scopeId));
            _push2(`<p class="mt-1 text-xs text-slate-400"${_scopeId}>Pressione Enter para adicionar</p>`);
            if (unref(tags).length) {
              _push2(`<div class="mt-2 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(unref(tags), (tag) => {
                _push2(`<span class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600"${_scopeId}>${ssrInterpolate(tag)} <button type="button" class="text-violet-400 hover:text-violet-700"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-x-mark",
                  class: "size-3"
                }, null, _parent2, _scopeId));
                _push2(`</button></span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200"${_scopeId}> Anexos (Opcional) </label><div class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-4 py-8 text-center transition-colors hover:border-violet-300 hover:bg-violet-50/30 dark:border-slate-700"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-paper-clip",
              class: "mb-2 size-6 text-slate-400"
            }, null, _parent2, _scopeId));
            _push2(`<p class="text-sm font-medium text-slate-600 dark:text-slate-300"${_scopeId}> Arraste arquivos aqui ou clique para selecionar </p><p class="mt-1 text-xs text-slate-400"${_scopeId}>Tamanho máximo: 10MB por arquivo</p></div></div></section><hr class="my-6 border-slate-100 dark:border-slate-800"${_scopeId}><section class="space-y-3"${_scopeId}><h3 class="text-sm font-bold text-slate-800 dark:text-slate-100"${_scopeId}>Notificações e Permissões</h3><label class="flex cursor-pointer items-center gap-3 rounded-lg py-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(notifyUpdates),
              "onUpdate:modelValue": ($event) => isRef(notifyUpdates) ? notifyUpdates.value = $event : null,
              color: "primary"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-bell",
              class: "size-5 text-slate-400"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm text-slate-700 dark:text-slate-200"${_scopeId}>Notificar responsável sobre atualizações</span></label><label class="flex cursor-pointer items-center gap-3 rounded-lg py-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(allowComments),
              "onUpdate:modelValue": ($event) => isRef(allowComments) ? allowComments.value = $event : null,
              color: "primary"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-user-group",
              class: "size-5 text-slate-400"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm text-slate-700 dark:text-slate-200"${_scopeId}>Permitir comentários da equipe</span></label><label class="flex cursor-pointer items-center gap-3 rounded-lg py-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(privateTask),
              "onUpdate:modelValue": ($event) => isRef(privateTask) ? privateTask.value = $event : null,
              color: "primary"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-lock-closed",
              class: "size-5 text-slate-400"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm text-slate-700 dark:text-slate-200"${_scopeId}>Tarefa visível apenas para responsáveis</span></label></section>`);
          } else {
            return [
              createVNode("div", { class: "mb-5 flex gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-900 dark:bg-violet-950/30" }, [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-lock-closed",
                  class: "mt-0.5 size-5 shrink-0 text-violet-600"
                }),
                createVNode("p", { class: "text-sm text-violet-800 dark:text-violet-200" }, [
                  createTextVNode(" Esta tarefa pessoal ficará visível "),
                  createVNode("strong", null, "apenas para você"),
                  createTextVNode(". Nenhum membro da equipe ou gestor poderá visualizá-la. ")
                ])
              ]),
              createVNode("section", { class: "space-y-4" }, [
                createVNode("h3", { class: "text-sm font-bold text-slate-800 dark:text-slate-100" }, "Informações Gerais"),
                createVNode("div", null, [
                  createVNode("label", { class: "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200" }, [
                    createTextVNode(" Título da Tarefa "),
                    createVNode("span", { class: "text-rose-500" }, "*")
                  ]),
                  createVNode(_component_UInput, {
                    modelValue: unref(title),
                    "onUpdate:modelValue": ($event) => isRef(title) ? title.value = $event : null,
                    placeholder: "Ex: Criar protótipo da dashboard",
                    class: "w-full"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200" }, [
                    createTextVNode(" Descrição "),
                    createVNode("span", { class: "text-rose-500" }, "*")
                  ]),
                  createVNode("div", { class: "relative" }, [
                    createVNode(_component_UTextarea, {
                      modelValue: unref(description),
                      "onUpdate:modelValue": ($event) => isRef(description) ? description.value = $event : null,
                      rows: 4,
                      placeholder: "Descreva o que precisa ser feito, objetivos e detalhes importantes...",
                      class: "w-full",
                      maxlength: 1e3
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("span", { class: "absolute bottom-2 right-3 text-xs text-slate-400" }, toDisplayString(unref(description).length) + "/1000 ", 1)
                  ])
                ]),
                createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200" }, [
                      createTextVNode(" Projeto "),
                      createVNode("span", { class: "font-normal text-slate-400" }, "(opcional)")
                    ]),
                    createVNode(_component_USelect, {
                      modelValue: unref(project),
                      "onUpdate:modelValue": ($event) => isRef(project) ? project.value = $event : null,
                      items: unref(projectItems),
                      placeholder: "Selecione o projeto",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200" }, [
                      createTextVNode(" Prioridade "),
                      createVNode("span", { class: "text-rose-500" }, "*")
                    ]),
                    createVNode(_component_USelect, {
                      modelValue: unref(priority),
                      "onUpdate:modelValue": ($event) => isRef(priority) ? priority.value = $event : null,
                      items: unref(priorityOptions),
                      placeholder: "Selecione a prioridade",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                    createVNode("div", { class: "mt-2 flex flex-wrap gap-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(priorityPills), (p) => {
                        return openBlock(), createBlock("span", {
                          key: p.value,
                          class: ["inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", p.classes]
                        }, [
                          createVNode("span", {
                            class: ["size-2 rounded-full", p.dot]
                          }, null, 2),
                          createTextVNode(" " + toDisplayString(p.label), 1)
                        ], 2);
                      }), 128))
                    ])
                  ])
                ]),
                createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200" }, [
                      createTextVNode(" Data de Início "),
                      createVNode("span", { class: "text-rose-500" }, "*")
                    ]),
                    createVNode(_component_UInput, {
                      modelValue: unref(startDate),
                      "onUpdate:modelValue": ($event) => isRef(startDate) ? startDate.value = $event : null,
                      type: "date",
                      icon: "i-heroicons-calendar-days",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200" }, [
                      createTextVNode(" Prazo Final "),
                      createVNode("span", { class: "text-rose-500" }, "*")
                    ]),
                    createVNode(_component_UInput, {
                      modelValue: unref(deadline),
                      "onUpdate:modelValue": ($event) => isRef(deadline) ? deadline.value = $event : null,
                      type: "date",
                      icon: "i-heroicons-calendar-days",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ]),
              createVNode("hr", { class: "my-6 border-slate-100 dark:border-slate-800" }),
              createVNode("section", { class: "space-y-4" }, [
                createVNode("h3", { class: "text-sm font-bold text-slate-800 dark:text-slate-100" }, "Detalhes Adicionais"),
                createVNode("div", null, [
                  createVNode("label", { class: "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200" }, " Tags (Opcional) "),
                  createVNode(_component_UInput, {
                    modelValue: unref(tagInput),
                    "onUpdate:modelValue": ($event) => isRef(tagInput) ? tagInput.value = $event : null,
                    icon: "i-heroicons-tag",
                    placeholder: "Digite para adicionar tags",
                    class: "w-full",
                    onKeydown: onTagKeydown
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("p", { class: "mt-1 text-xs text-slate-400" }, "Pressione Enter para adicionar"),
                  unref(tags).length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-2 flex flex-wrap gap-2"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(tags), (tag) => {
                      return openBlock(), createBlock("span", {
                        key: tag,
                        class: "inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600"
                      }, [
                        createTextVNode(toDisplayString(tag) + " ", 1),
                        createVNode("button", {
                          type: "button",
                          class: "text-violet-400 hover:text-violet-700",
                          onClick: ($event) => removeTag(tag)
                        }, [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-x-mark",
                            class: "size-3"
                          })
                        ], 8, ["onClick"])
                      ]);
                    }), 128))
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200" }, " Anexos (Opcional) "),
                  createVNode("div", { class: "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-4 py-8 text-center transition-colors hover:border-violet-300 hover:bg-violet-50/30 dark:border-slate-700" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-paper-clip",
                      class: "mb-2 size-6 text-slate-400"
                    }),
                    createVNode("p", { class: "text-sm font-medium text-slate-600 dark:text-slate-300" }, " Arraste arquivos aqui ou clique para selecionar "),
                    createVNode("p", { class: "mt-1 text-xs text-slate-400" }, "Tamanho máximo: 10MB por arquivo")
                  ])
                ])
              ]),
              createVNode("hr", { class: "my-6 border-slate-100 dark:border-slate-800" }),
              createVNode("section", { class: "space-y-3" }, [
                createVNode("h3", { class: "text-sm font-bold text-slate-800 dark:text-slate-100" }, "Notificações e Permissões"),
                createVNode("label", { class: "flex cursor-pointer items-center gap-3 rounded-lg py-1" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(notifyUpdates),
                    "onUpdate:modelValue": ($event) => isRef(notifyUpdates) ? notifyUpdates.value = $event : null,
                    color: "primary"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-bell",
                    class: "size-5 text-slate-400"
                  }),
                  createVNode("span", { class: "text-sm text-slate-700 dark:text-slate-200" }, "Notificar responsável sobre atualizações")
                ]),
                createVNode("label", { class: "flex cursor-pointer items-center gap-3 rounded-lg py-1" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(allowComments),
                    "onUpdate:modelValue": ($event) => isRef(allowComments) ? allowComments.value = $event : null,
                    color: "primary"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-user-group",
                    class: "size-5 text-slate-400"
                  }),
                  createVNode("span", { class: "text-sm text-slate-700 dark:text-slate-200" }, "Permitir comentários da equipe")
                ]),
                createVNode("label", { class: "flex cursor-pointer items-center gap-3 rounded-lg py-1" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(privateTask),
                    "onUpdate:modelValue": ($event) => isRef(privateTask) ? privateTask.value = $event : null,
                    color: "primary"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-lock-closed",
                    class: "size-5 text-slate-400"
                  }),
                  createVNode("span", { class: "text-sm text-slate-700 dark:text-slate-200" }, "Tarefa visível apenas para responsáveis")
                ])
              ])
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex w-full gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              type: "button",
              color: "neutral",
              variant: "outline",
              block: "",
              class: "flex-1",
              label: "Cancelar",
              onClick: closeModal
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "button",
              block: "",
              class: ["flex-1 font-bold text-white", unref(brandGradient)],
              label: "Criar Tarefa",
              onClick: createTask
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex w-full gap-3" }, [
                createVNode(_component_UButton, {
                  type: "button",
                  color: "neutral",
                  variant: "outline",
                  block: "",
                  class: "flex-1",
                  label: "Cancelar",
                  onClick: closeModal
                }),
                createVNode(_component_UButton, {
                  type: "button",
                  block: "",
                  class: ["flex-1 font-bold text-white", unref(brandGradient)],
                  label: "Criar Tarefa",
                  onClick: createTask
                }, null, 8, ["class"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tarefas/NewTaskModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "TarefasNewTaskModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "minhas-tarefas",
  __ssrInlineRender: true,
  setup(__props) {
    const tasks = useTasksData();
    const mainTabs = [
      { id: "trabalho", icon: "i-heroicons-briefcase", tooltip: "Tarefas de Trabalho" },
      { id: "pessoais", icon: "i-heroicons-user", tooltip: "Tarefas Pessoais" }
    ];
    const subTabs = ["Atribuídas", "Pendentes", "Concluídas"];
    const sortOptions = ["Prazo", "Prioridade", "Progresso"];
    const activeMainTab = ref("trabalho");
    const activeSubTab = ref("Atribuídas");
    const search = ref("");
    const projectFilter = ref("Todos");
    const priorityFilter = ref("Todos");
    const sortBy = ref("Prazo");
    const newTaskOpen = ref(false);
    const priorityOptions = usePriorityOptions();
    const priorityFilterItems = ["Todos", ...priorityOptions.map((o) => o.label)];
    const priorityByLabel = new Map(
      priorityOptions.map((o) => [o.label, o.value])
    );
    const priorityRank = new Map(
      usePriorityList().map((key, i) => [key, i])
    );
    const projectFilterItems = computed(() => [
      "Todos",
      ...new Set(tasks.flatMap((t) => t.project ? [t.project] : []))
    ]);
    const filtered = computed(() => {
      const term = search.value.trim().toLowerCase();
      const priorityKey = priorityByLabel.get(priorityFilter.value);
      let list = tasks.filter((t) => {
        const isPersonalTask = !!t.personal;
        if (activeMainTab.value === "pessoais" !== isPersonalTask) return false;
        if (activeSubTab.value === "Atribuídas" && (t.status === "concluido" || t.status === "atrasado")) return false;
        if (activeSubTab.value === "Pendentes" && t.status !== "atrasado") return false;
        if (activeSubTab.value === "Concluídas" && t.status !== "concluido") return false;
        if (term && !`${t.title} ${t.project ?? ""} ${t.team ?? ""}`.toLowerCase().includes(term)) return false;
        if (projectFilter.value !== "Todos" && t.project !== projectFilter.value) return false;
        if (priorityKey && t.priority !== priorityKey) return false;
        return true;
      });
      if (sortBy.value === "Progresso") {
        list = [...list].sort(
          (a, b) => useProjectProgressForTask(b.project, b.projectProgress) - useProjectProgressForTask(a.project, a.projectProgress)
        );
      } else if (sortBy.value === "Prioridade") {
        list = [...list].sort(
          (a, b) => (priorityRank.get(a.priority) ?? 99) - (priorityRank.get(b.priority) ?? 99)
        );
      } else if (sortBy.value === "Prazo") {
        list = [...list].sort((a, b) => dueDateOrder(a.dueDate) - dueDateOrder(b.dueDate));
      }
      if (activeMainTab.value === "pessoais") {
        list = [...list].sort((a, b) => {
          const aDone = a.status === "concluido" ? 1 : 0;
          const bDone = b.status === "concluido" ? 1 : 0;
          if (aDone !== bDone) return aDone - bDone;
          return dueDateOrder(a.dueDate) - dueDateOrder(b.dueDate);
        });
      }
      return list;
    });
    const showAccent = computed(
      () => activeSubTab.value === "Atribuídas" || activeMainTab.value === "pessoais"
    );
    const groups = computed(() => groupTasksByPriority(filtered.value));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UIcon = _sfc_main$d;
      const _component_UInput = _sfc_main$6;
      const _component_UiLabeledSelect = __nuxt_component_2;
      const _component_TarefasTaskGroup = __nuxt_component_4;
      const _component_TarefasNewTaskModal = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-6xl space-y-6 p-4 sm:p-6" }, _attrs))}><div class="flex flex-wrap items-start justify-between gap-3"><div><h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Minhas Tarefas</h1><p class="text-sm text-slate-400">Acompanhe e gerencie todas as suas tarefas atribuídas</p></div><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "neutral",
        variant: "outline",
        icon: "i-heroicons-arrow-down-tray",
        label: "Exportar"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-heroicons-plus",
        label: "Nova tarefa pessoal",
        class: "bg-violet-600 hover:bg-violet-700",
        onClick: ($event) => newTaskOpen.value = true
      }, null, _parent));
      _push(`</div></div><div class="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit"><!--[-->`);
      ssrRenderList(mainTabs, (tab) => {
        _push(`<button type="button" class="${ssrRenderClass([
          unref(activeMainTab) === tab.id ? "bg-white dark:bg-slate-900 text-violet-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400",
          "p-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center"
        ])}"${ssrRenderAttr("title", tab.tooltip)}>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: tab.icon,
          class: "size-5"
        }, null, _parent));
        _push(`</button>`);
      });
      _push(`<!--]--></div><div class="flex gap-6 border-b border-slate-200 dark:border-slate-800"><!--[-->`);
      ssrRenderList(subTabs, (subTab) => {
        _push(`<button type="button" class="${ssrRenderClass([
          unref(activeSubTab) === subTab ? "border-violet-500 text-violet-600" : "border-transparent text-slate-400 hover:text-slate-600",
          "-mb-px border-b-2 pb-3 text-sm font-medium transition-colors"
        ])}">${ssrInterpolate(subTab)}</button>`);
      });
      _push(`<!--]--></div><div class="flex flex-wrap items-center gap-3">`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(search),
        "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
        icon: "i-heroicons-magnifying-glass",
        placeholder: "Buscar Tarefa",
        class: "w-full sm:w-56"
      }, null, _parent));
      if (unref(activeMainTab) !== "pessoais") {
        _push(ssrRenderComponent(_component_UiLabeledSelect, {
          modelValue: unref(projectFilter),
          "onUpdate:modelValue": ($event) => isRef(projectFilter) ? projectFilter.value = $event : null,
          label: "Projeto:",
          items: unref(projectFilterItems),
          class: "w-40"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UiLabeledSelect, {
        modelValue: unref(priorityFilter),
        "onUpdate:modelValue": ($event) => isRef(priorityFilter) ? priorityFilter.value = $event : null,
        label: "Prioridade:",
        items: priorityFilterItems,
        class: "w-44"
      }, null, _parent));
      if (unref(activeMainTab) !== "pessoais") {
        _push(ssrRenderComponent(_component_UiLabeledSelect, {
          modelValue: unref(sortBy),
          "onUpdate:modelValue": ($event) => isRef(sortBy) ? sortBy.value = $event : null,
          label: "Ordenar:",
          items: sortOptions,
          class: "w-40"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-6"><!--[-->`);
      ssrRenderList(unref(groups), (group) => {
        _push(ssrRenderComponent(_component_TarefasTaskGroup, {
          key: group.key,
          priority: group.key,
          tasks: group.tasks,
          "show-accent": unref(showAccent)
        }, null, _parent));
      });
      _push(`<!--]-->`);
      if (unref(groups).length === 0) {
        _push(`<div class="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400 dark:border-slate-700"> Nenhuma tarefa encontrada para os filtros selecionados. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_TarefasNewTaskModal, {
        open: unref(newTaskOpen),
        "onUpdate:open": ($event) => isRef(newTaskOpen) ? newTaskOpen.value = $event : null
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/colaborador/minhas-tarefas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=minhas-tarefas-CCHdhcFh.mjs.map
