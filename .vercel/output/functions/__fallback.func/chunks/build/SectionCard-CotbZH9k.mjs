import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SectionCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    subtitle: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900" }, _attrs))}>`);
      if (__props.title || _ctx.$slots.action || _ctx.$slots.header) {
        _push(`<header class="mb-4 shrink-0 flex items-start justify-between gap-3">`);
        ssrRenderSlot(_ctx.$slots, "header", {}, () => {
          _push(`<div><h2 class="font-semibold text-slate-800 dark:text-slate-100">${ssrInterpolate(__props.title)}</h2>`);
          if (__props.subtitle) {
            _push(`<p class="text-xs text-slate-400">${ssrInterpolate(__props.subtitle)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }, _push, _parent);
        ssrRenderSlot(_ctx.$slots, "action", {}, null, _push, _parent);
        _push(`</header>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/SectionCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "UiSectionCard" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=SectionCard-CotbZH9k.mjs.map
