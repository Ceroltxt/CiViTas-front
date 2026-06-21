import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { b as auditLogsSchema, f as mockAuditLogs } from './index-D-j7ajRT.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LogTable",
  __ssrInlineRender: true,
  props: {
    logs: {}
  },
  emits: ["export"],
  setup(__props) {
    const columns = ["Data", "Usuário", "Ação", "Detalhes", "Linguagem"];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-x-auto" }, _attrs))}><table class="w-full border-collapse text-sm"><thead><tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-400"><!--[-->`);
      ssrRenderList(columns, (col) => {
        _push(`<th class="px-5 py-3">${ssrInterpolate(col)}</th>`);
      });
      _push(`<!--]--><th class="px-5 py-3 text-right"><span class="sr-only">Ações</span></th></tr></thead><tbody><!--[-->`);
      ssrRenderList(__props.logs, (log, index) => {
        _push(`<tr class="${ssrRenderClass([index % 2 === 1 ? "bg-slate-50/70 dark:bg-slate-800/40" : "", "border-t border-slate-100 dark:border-slate-800"])}"><td class="px-5 py-4 text-slate-600 dark:text-slate-300">${ssrInterpolate(log.date)}</td><td class="px-5 py-4 text-slate-600 dark:text-slate-300">${ssrInterpolate(log.user)}</td><td class="px-5 py-4 text-slate-600 dark:text-slate-300">${ssrInterpolate(log.action)}</td><td class="px-5 py-4 text-slate-600 dark:text-slate-300">${ssrInterpolate(log.details)}</td><td class="px-5 py-4 text-slate-400">${ssrInterpolate(log.language)}</td><td class="px-5 py-4 text-right"><button type="button" class="text-sm font-medium text-slate-600 hover:text-violet-600 dark:text-slate-300"> Exportar </button></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/relatorios/LogTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "RelatoriosLogTable" });
function useAuditLogs(count = 10) {
  return auditLogsSchema.parse(mockAuditLogs(count), "auditLogs");
}

export { __nuxt_component_3 as _, useAuditLogs as u };
//# sourceMappingURL=useAuditLogs-DWFEQd-_.mjs.map
