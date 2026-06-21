import { _ as __nuxt_component_1 } from './SectionCard-CotbZH9k.mjs';
import { e as _sfc_main$b, d as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$1 } from './Switch-BvCOLRUI.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, createVNode, toDisplayString, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { a as useCurrentUser } from './useCurrentUser-BUDY1vts.mjs';
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
import './Label-Bz9RXRS1.mjs';
import './useFormControl-9B1GcqCr.mjs';
import './VisuallyHiddenInput-_jZmJXfe.mjs';
import './index-D-j7ajRT.mjs';
import './navigation-CS4vmRJG.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "configuracoes",
  __ssrInlineRender: true,
  setup(__props) {
    const user = useCurrentUser();
    const notifications = ref(true);
    const weeklyDigest = ref(false);
    const colorMode = useColorMode();
    const isDark = computed({
      get: () => colorMode.value === "dark",
      set: (value) => colorMode.preference = value ? "dark" : "light"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiSectionCard = __nuxt_component_1;
      const _component_UAvatar = _sfc_main$b;
      const _component_UButton = _sfc_main$8;
      const _component_USwitch = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5 p-4 sm:p-4 dark:bg-slate-900 h-full" }, _attrs))}><div><h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Configurações</h1><p class="text-sm text-slate-400">Gerencie sua conta e preferências</p></div>`);
      _push(ssrRenderComponent(_component_UiSectionCard, { title: "Perfil" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UAvatar, {
              src: unref(user).avatar,
              alt: unref(user).name,
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><p class="font-semibold text-slate-800 dark:text-slate-100"${_scopeId}>${ssrInterpolate(unref(user).name)}</p><p class="text-sm text-slate-400"${_scopeId}>${ssrInterpolate(unref(user).role)}</p></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              label: "Editar perfil",
              class: "ml-auto"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-4" }, [
                createVNode(_component_UAvatar, {
                  src: unref(user).avatar,
                  alt: unref(user).name,
                  size: "xl"
                }, null, 8, ["src", "alt"]),
                createVNode("div", null, [
                  createVNode("p", { class: "font-semibold text-slate-800 dark:text-slate-100" }, toDisplayString(unref(user).name), 1),
                  createVNode("p", { class: "text-sm text-slate-400" }, toDisplayString(unref(user).role), 1)
                ]),
                createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
                  label: "Editar perfil",
                  class: "ml-auto"
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UiSectionCard, { title: "Preferências" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="divide-y divide-slate-100 dark:divide-slate-800"${_scopeId}><div class="flex items-center justify-between py-3"${_scopeId}><div${_scopeId}><p class="text-sm font-medium text-slate-700 dark:text-slate-200"${_scopeId}>Modo escuro</p><p class="text-xs text-slate-400"${_scopeId}>Alterna o tema da interface</p></div>`);
            _push2(ssrRenderComponent(_component_USwitch, {
              modelValue: unref(isDark),
              "onUpdate:modelValue": ($event) => isRef(isDark) ? isDark.value = $event : null
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center justify-between py-3"${_scopeId}><div${_scopeId}><p class="text-sm font-medium text-slate-700 dark:text-slate-200"${_scopeId}>Notificações</p><p class="text-xs text-slate-400"${_scopeId}>Receber alertas de tarefas e prazos</p></div>`);
            _push2(ssrRenderComponent(_component_USwitch, {
              modelValue: unref(notifications),
              "onUpdate:modelValue": ($event) => isRef(notifications) ? notifications.value = $event : null
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center justify-between py-3"${_scopeId}><div${_scopeId}><p class="text-sm font-medium text-slate-700 dark:text-slate-200"${_scopeId}>Resumo semanal</p><p class="text-xs text-slate-400"${_scopeId}>Enviar um e-mail com o resumo da semana</p></div>`);
            _push2(ssrRenderComponent(_component_USwitch, {
              modelValue: unref(weeklyDigest),
              "onUpdate:modelValue": ($event) => isRef(weeklyDigest) ? weeklyDigest.value = $event : null
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "divide-y divide-slate-100 dark:divide-slate-800" }, [
                createVNode("div", { class: "flex items-center justify-between py-3" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-medium text-slate-700 dark:text-slate-200" }, "Modo escuro"),
                    createVNode("p", { class: "text-xs text-slate-400" }, "Alterna o tema da interface")
                  ]),
                  createVNode(_component_USwitch, {
                    modelValue: unref(isDark),
                    "onUpdate:modelValue": ($event) => isRef(isDark) ? isDark.value = $event : null
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "flex items-center justify-between py-3" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-medium text-slate-700 dark:text-slate-200" }, "Notificações"),
                    createVNode("p", { class: "text-xs text-slate-400" }, "Receber alertas de tarefas e prazos")
                  ]),
                  createVNode(_component_USwitch, {
                    modelValue: unref(notifications),
                    "onUpdate:modelValue": ($event) => isRef(notifications) ? notifications.value = $event : null
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "flex items-center justify-between py-3" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-medium text-slate-700 dark:text-slate-200" }, "Resumo semanal"),
                    createVNode("p", { class: "text-xs text-slate-400" }, "Enviar um e-mail com o resumo da semana")
                  ]),
                  createVNode(_component_USwitch, {
                    modelValue: unref(weeklyDigest),
                    "onUpdate:modelValue": ($event) => isRef(weeklyDigest) ? weeklyDigest.value = $event : null
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/configuracoes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=configuracoes-BP5hVvi8.mjs.map
