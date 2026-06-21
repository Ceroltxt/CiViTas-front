import { f as _sfc_main$d } from './server.mjs';
import { _ as _sfc_main$1 } from './Select-c22fz1qb.mjs';
import { _ as __nuxt_component_1 } from './SectionCard-CotbZH9k.mjs';
import { u as useAuditLogs, _ as __nuxt_component_3 } from './useAuditLogs-DWFEQd-_.mjs';
import { _ as _sfc_main$2 } from './Pagination-Bt2NzeyZ.mjs';
import { defineComponent, ref, mergeProps, isRef, unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
import './useDirection-B3h_OC89.mjs';
import './useFormControl-9B1GcqCr.mjs';
import './PopperArrow-C07et48U.mjs';
import '@floating-ui/vue';
import './utils-CJXk8l7g.mjs';
import 'aria-hidden';
import './useId-Df0AxZi5.mjs';
import './index-D-j7ajRT.mjs';
import './navigation-CS4vmRJG.mjs';

const total = 100;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "relatorios",
  __ssrInlineRender: true,
  setup(__props) {
    const logs = useAuditLogs(10);
    const perPage = ref(10);
    const page = ref(1);
    const view = ref("list");
    const filters = [
      { key: "projetos", label: "Projetos" },
      { key: "equipes", label: "Equipes" },
      { key: "gestores", label: "Gestores" },
      { key: "tarefas", label: "Tarefas" },
      { key: "periodo", label: "Período" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$d;
      const _component_USelect = _sfc_main$1;
      const _component_UiSectionCard = __nuxt_component_1;
      const _component_RelatoriosLogTable = __nuxt_component_3;
      const _component_UPagination = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5 p-4 sm:p-6" }, _attrs))}><div class="flex flex-wrap items-center justify-between gap-3"><h1 class="flex items-center gap-2 font-display text-2xl font-bold text-slate-800 dark:text-slate-100"> Logs Gerais `);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-user-group",
        class: "size-6 text-violet-500"
      }, null, _parent));
      _push(`</h1><div class="flex items-center gap-3"><span class="text-sm text-slate-500">Itens Por Página</span>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(perPage),
        "onUpdate:modelValue": ($event) => isRef(perPage) ? perPage.value = $event : null,
        items: [10, 25, 50],
        class: "w-20"
      }, null, _parent));
      _push(`<div class="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"><button type="button" class="${ssrRenderClass([unref(view) === "list" ? "bg-orange-500 text-white" : "text-slate-400", "px-2.5 py-2"])}" aria-label="Visualização em lista">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-bars-3",
        class: "size-4"
      }, null, _parent));
      _push(`</button><button type="button" class="${ssrRenderClass([unref(view) === "grid" ? "bg-orange-500 text-white" : "text-slate-400", "px-2.5 py-2"])}" aria-label="Visualização em grade">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-squares-2x2",
        class: "size-4"
      }, null, _parent));
      _push(`</button></div></div></div>`);
      _push(ssrRenderComponent(_component_UiSectionCard, { class: "!p-0" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-2 gap-4 p-5 md:grid-cols-3 lg:grid-cols-5"${_scopeId}><!--[-->`);
            ssrRenderList(filters, (filter) => {
              _push2(`<div${_scopeId}><label class="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300"${_scopeId}>${ssrInterpolate(filter.label)}</label>`);
              _push2(ssrRenderComponent(_component_USelect, {
                items: ["Digite Para Buscar..."],
                "model-value": "Digite Para Buscar...",
                "trailing-icon": "i-heroicons-chevron-down",
                class: "w-full"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]--></div>`);
            _push2(ssrRenderComponent(_component_RelatoriosLogTable, { logs: unref(logs) }, null, _parent2, _scopeId));
            _push2(`<div class="flex justify-end px-5 py-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UPagination, {
              page: unref(page),
              "onUpdate:page": ($event) => isRef(page) ? page.value = $event : null,
              total,
              "items-per-page": unref(perPage)
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-2 gap-4 p-5 md:grid-cols-3 lg:grid-cols-5" }, [
                (openBlock(), createBlock(Fragment, null, renderList(filters, (filter) => {
                  return createVNode("div", {
                    key: filter.key
                  }, [
                    createVNode("label", { class: "mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300" }, toDisplayString(filter.label), 1),
                    createVNode(_component_USelect, {
                      items: ["Digite Para Buscar..."],
                      "model-value": "Digite Para Buscar...",
                      "trailing-icon": "i-heroicons-chevron-down",
                      class: "w-full"
                    })
                  ]);
                }), 64))
              ]),
              createVNode(_component_RelatoriosLogTable, { logs: unref(logs) }, null, 8, ["logs"]),
              createVNode("div", { class: "flex justify-end px-5 py-4" }, [
                createVNode(_component_UPagination, {
                  page: unref(page),
                  "onUpdate:page": ($event) => isRef(page) ? page.value = $event : null,
                  total,
                  "items-per-page": unref(perPage)
                }, null, 8, ["page", "onUpdate:page", "items-per-page"])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/gestor/relatorios.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=relatorios-BHMxuVTN.mjs.map
