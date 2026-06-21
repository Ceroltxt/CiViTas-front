import { d as _sfc_main$8 } from './server.mjs';
import { u as useCalendarEvents, _ as __nuxt_component_1 } from './CalendarMonth-BzbTHpDV.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { f as formatMonthLabel } from './date-BjMsJr0b.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "calendario",
  __ssrInlineRender: true,
  setup(__props) {
    const events = useCalendarEvents();
    const current = ref({ year: 2026, month: 4 });
    const label = computed(() => formatMonthLabel(current.value.year, current.value.month));
    function shift(delta) {
      const date = new Date(current.value.year, current.value.month + delta, 1);
      current.value = { year: date.getFullYear(), month: date.getMonth() };
    }
    function goToday() {
      const now = /* @__PURE__ */ new Date();
      current.value = { year: now.getFullYear(), month: now.getMonth() };
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_CalendarioCalendarMonth = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4 p-4 sm:p-6" }, _attrs))}><div class="flex items-center justify-between"><h1 class="font-display text-lg font-semibold text-slate-700 dark:text-slate-200">${ssrInterpolate(unref(label))}</h1><div class="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "neutral",
        variant: "ghost",
        size: "sm",
        icon: "i-heroicons-chevron-left",
        "aria-label": "Mês anterior",
        onClick: ($event) => shift(-1)
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "ghost",
        size: "sm",
        label: "Hoje",
        class: "font-semibold text-violet-600",
        onClick: goToday
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        color: "neutral",
        variant: "ghost",
        size: "sm",
        icon: "i-heroicons-chevron-right",
        "aria-label": "Próximo mês",
        onClick: ($event) => shift(1)
      }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_CalendarioCalendarMonth, {
        year: unref(current).year,
        month: unref(current).month,
        events: unref(events)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/colaborador/calendario.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=calendario-DcQCHY0f.mjs.map
