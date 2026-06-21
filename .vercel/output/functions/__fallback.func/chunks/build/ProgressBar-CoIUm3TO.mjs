import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';

const PRIORITY_META = {
  critica: {
    label: "Crítica",
    classes: "text-red-600 bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
    border: "border-red-400"
  },
  alta: {
    label: "Alta",
    classes: "text-pink-600 bg-pink-50",
    text: "text-pink-600",
    dot: "bg-pink-500",
    border: "border-pink-400"
  },
  media: {
    label: "Média",
    classes: "text-amber-600 bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
    border: "border-amber-400"
  },
  baixa: {
    label: "Baixa",
    classes: "text-emerald-600 bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
    border: "border-emerald-400"
  }
};
const STATUS_META = {
  "planejado": {
    label: "Planejado",
    classes: "text-blue-600 bg-blue-50",
    text: "text-blue-600",
    dot: "bg-blue-500",
    border: "border-blue-400"
  },
  "em-andamento": {
    label: "Em Andamento",
    classes: "text-amber-600 bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
    border: "border-amber-400"
  },
  "em-revisao": {
    label: "Em Revisão",
    classes: "text-violet-600 bg-violet-50",
    text: "text-violet-600",
    dot: "bg-violet-500",
    border: "border-violet-400"
  },
  "bloqueado": {
    label: "Bloqueado",
    classes: "text-red-600 bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
    border: "border-red-400"
  },
  "atrasado": {
    label: "Atrasado",
    classes: "text-rose-600 bg-rose-50",
    text: "text-rose-600",
    dot: "bg-rose-500",
    border: "border-rose-400"
  },
  "concluido": {
    label: "Concluído",
    classes: "text-emerald-600 bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
    border: "border-emerald-400"
  }
};
function usePriorityMeta(key) {
  return PRIORITY_META[key];
}
function useStatusMeta(key) {
  return STATUS_META[key];
}
function useStatusList() {
  return ["planejado", "em-andamento", "em-revisao", "bloqueado", "concluido"];
}
function usePriorityList() {
  return ["critica", "alta", "media", "baixa"];
}
function usePriorityOptions(keys = usePriorityList()) {
  return keys.map((value) => ({ value, label: PRIORITY_META[value].label }));
}
const brandGradient = "bg-gradient-to-r from-brand-from to-brand-to";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProgressBar",
  __ssrInlineRender: true,
  props: {
    value: {},
    color: { default: "bg-pink-500" },
    gradient: { type: Boolean, default: false },
    height: { default: "h-1.5" }
  },
  setup(__props) {
    const props = __props;
    const clamped = computed(() => Math.min(100, Math.max(0, props.value)));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800", __props.height],
        role: "progressbar",
        "aria-valuenow": unref(clamped),
        "aria-valuemin": "0",
        "aria-valuemax": "100"
      }, _attrs))}><div class="${ssrRenderClass([[__props.gradient ? unref(brandGradient) : __props.color], "h-full rounded-full transition-[width] duration-500 w-[var(--progress)]"])}" style="${ssrRenderStyle({ "--progress": `${unref(clamped)}%` })}"></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/ProgressBar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "UiProgressBar" });

export { __nuxt_component_2 as _, usePriorityMeta as a, brandGradient as b, usePriorityOptions as c, useStatusList as d, useStatusMeta as e, usePriorityList as u };
//# sourceMappingURL=ProgressBar-CoIUm3TO.mjs.map
