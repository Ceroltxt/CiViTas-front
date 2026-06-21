import { _ as _sfc_main$1 } from './Select-c22fz1qb.mjs';
import { defineComponent, useModel, mergeProps, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { E as v, x as projectProgressSchema, p as mockProjects } from './index-D-j7ajRT.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LabeledSelect",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    label: {},
    items: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelect = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-1.5 rounded-md border border-slate-200 bg-white pl-2.5 dark:border-slate-700 dark:bg-slate-900" }, _attrs))}><span class="shrink-0 text-xs text-slate-400">${ssrInterpolate(__props.label)}</span>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        items: __props.items,
        variant: "none",
        class: "min-w-0 flex-1",
        ui: { base: "pl-0 pr-1" }
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/LabeledSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "UiLabeledSelect" });
function useUserProjects() {
  return v.array(projectProgressSchema).parse(mockProjects, "userProjects");
}

export { __nuxt_component_2 as _, useUserProjects as u };
//# sourceMappingURL=useUserProjects-B_3XcnzE.mjs.map
