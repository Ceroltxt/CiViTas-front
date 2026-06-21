import { _ as _sfc_main$1 } from './Popover-Dn1k2Q3g.mjs';
import { d as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$2 } from './Calendar-B3a-MegV.mjs';
import { _ as _sfc_main$3 } from './Modal-DrlsEEos.mjs';
import { _ as _sfc_main$4 } from './FileUpload-C6MmzP9v.mjs';
import { _ as _sfc_main$5 } from './Card-Bu3IYA97.mjs';
import { defineComponent, shallowRef, resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { DateFormatter, CalendarDate, getLocalTimeZone } from '@internationalized/date';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const df = new DateFormatter("en-US", {
      dateStyle: "medium"
    });
    const modelValue = shallowRef(new CalendarDate(2026, 6, 16));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UPopover = _sfc_main$1;
      const _component_UButton = _sfc_main$8;
      const _component_UCalendar = _sfc_main$2;
      const _component_UModal = _sfc_main$3;
      const _component_Placeholder = resolveComponent("Placeholder");
      const _component_UFileUpload = _sfc_main$4;
      const _component_UCard = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl space-y-5 p-4 sm:p-6 dark:bg-slate-900 h-full" }, _attrs))}><div><h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100"> Olá, Carlos! </h1><p class="text-sm text-slate-400"> Acompanhe o progresso das equipes e projetos. </p></div><div class="flex flex-wrap items-center justify-end gap-2">`);
      _push(ssrRenderComponent(_component_UPopover, null, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCalendar, {
              modelValue: unref(modelValue),
              "onUpdate:modelValue": ($event) => isRef(modelValue) ? modelValue.value = $event : null,
              class: "p-2",
              color: "secondary"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCalendar, {
                modelValue: unref(modelValue),
                "onUpdate:modelValue": ($event) => isRef(modelValue) ? modelValue.value = $event : null,
                class: "p-2",
                color: "secondary"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              icon: "i-heroicons-calendar-days",
              "trailing-icon": "i-heroicons-chevron-down",
              size: "md"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(modelValue) ? unref(df).format(unref(modelValue).toDate(unref(getLocalTimeZone)())) : "Select a date")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(modelValue) ? unref(df).format(unref(modelValue).toDate(unref(getLocalTimeZone)())) : "Select a date"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                color: "neutral",
                variant: "outline",
                icon: "i-heroicons-calendar-days",
                "trailing-icon": "i-heroicons-chevron-down",
                size: "md"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(modelValue) ? unref(df).format(unref(modelValue).toDate(unref(getLocalTimeZone)())) : "Select a date"), 1)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        modal: false,
        title: "Exportar relatório"
      }, {
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Placeholder, { class: "h-48" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFileUpload, {
              color: "neutral",
              highlight: "",
              label: "Arraste e solte um arquivo ou clique para selecionar",
              description: "SVG, PNG, JPG or GIF (max. 2MB)",
              class: "w-96 min-h-48"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Placeholder, { class: "h-48" }),
              createVNode(_component_UFileUpload, {
                color: "neutral",
                highlight: "",
                label: "Arraste e solte um arquivo ou clique para selecionar",
                description: "SVG, PNG, JPG or GIF (max. 2MB)",
                class: "w-96 min-h-48"
              })
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              label: "Exportar relatório",
              color: "neutral",
              variant: "outline",
              icon: "i-heroicons-document-arrow-down"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                label: "Exportar relatório",
                color: "neutral",
                variant: "outline",
                icon: "i-heroicons-document-arrow-down"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">`);
      _push(ssrRenderComponent(_component_UCard, {
        title: "Desempenho das equipes",
        class: "w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Placeholder, { class: "h-24" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Placeholder, { class: "h-24" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, {
        title: "Colaboradores",
        class: "w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Placeholder, { class: "h-24" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Placeholder, { class: "h-24" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, {
        title: "Ranking das equipes",
        class: "w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Placeholder, { class: "h-24" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Placeholder, { class: "h-24" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-4 flex flex-col gap-4 md:flex-col lg:flex-row">`);
      _push(ssrRenderComponent(_component_UCard, {
        title: "Desempenho de entregas",
        class: "w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Placeholder, { class: "h-32" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Placeholder, { class: "h-32" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<ul class="mt-4 flex flex-col gap-4 md:flex-col lg:flex-col md:w-20% lg:w-1/3"><li><div class="rounded-lg bg-yellow-200 p-4 flex flex-row items-center gap-4"><h2 class="font-display font-bold text-orange-500 text-3xl">85</h2><p class="text-xl text-orange-500 font-bold"> Tarefas em andamento. </p></div></li><li><div class="rounded-lg bg-rose-200 p-4 flex flex-row items-center gap-4"><h2 class="font-display font-bold text-red-600 text-3xl">10</h2><p class="text-xl text-red-600 font-bold">Tarefas atrasadas.</p></div></li><li><div class="rounded-lg bg-emerald-200 p-4 flex flex-row items-center gap-4"><h2 class="font-display font-bold text-green-600 text-3xl">194</h2><p class="text-xl text-green-600 font-bold">Tarefas concluídas.</p></div></li></ul>`);
      _push(ssrRenderComponent(_component_UCard, {
        title: "Notificações",
        class: "md:w-20% lg:w-1/3 p-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Placeholder, { class: "h-32" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Placeholder, { class: "h-32" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, {
        title: "Desempenho de entregas",
        class: "w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Placeholder, { class: "h-32" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Placeholder, { class: "h-32" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/gestor/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-mNtQox78.mjs.map
