import { d as _sfc_main$8, e as _sfc_main$b } from './server.mjs';
import { _ as __nuxt_component_1 } from './SectionCard-CotbZH9k.mjs';
import { _ as _sfc_main$1 } from './Input-BsVJ6KLu.mjs';
import { _ as _sfc_main$2 } from './Switch-BvCOLRUI.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, isRef, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
    const name = ref("Costa Neves");
    const email = ref("colaborador@civitas.com");
    const role = ref("Colaborador");
    const notifications = ref(true);
    const weeklyDigest = ref(false);
    const colorMode = useColorMode();
    const isDark = computed({
      get: () => colorMode.value === "dark",
      set: (value) => colorMode.preference = value ? "dark" : "light"
    });
    function saveChanges() {
      alert("Alterações salvas com sucesso!");
    }
    function changePassword() {
      alert("Funcionalidade de alterar senha em breve!");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UiSectionCard = __nuxt_component_1;
      const _component_UAvatar = _sfc_main$b;
      const _component_UInput = _sfc_main$1;
      const _component_USwitch = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl space-y-5 p-4 sm:p-6" }, _attrs))}><div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4"><div><h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Configurações e Perfil</h1><p class="text-sm text-slate-400">Gerencie sua conta e preferências do sistema</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-heroicons-check",
        label: "Salvar Alterações",
        class: "bg-violet-600 hover:bg-violet-700 text-white font-semibold flex items-center gap-1.5 px-4 py-2 rounded-lg",
        onClick: saveChanges
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UiSectionCard, { title: "Dados do Perfil" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex items-center gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UAvatar, {
              src: unref(user).avatar,
              alt: unref(name),
              size: "xl",
              class: "size-16"
            }, null, _parent2, _scopeId));
            _push2(`<div class="space-y-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              icon: "i-heroicons-camera",
              label: "Alterar foto",
              class: "bg-white text-slate-700 border-slate-200"
            }, null, _parent2, _scopeId));
            _push2(`<p class="text-xs text-slate-400"${_scopeId}>JPG, GIF ou PNG. Máximo de 2MB.</p></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(name),
              "onUpdate:modelValue": ($event) => isRef(name) ? name.value = $event : null,
              icon: "i-heroicons-user",
              class: "w-full bg-white dark:bg-slate-900"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(role),
              "onUpdate:modelValue": ($event) => isRef(role) ? role.value = $event : null,
              icon: "i-heroicons-briefcase",
              class: "w-full bg-white dark:bg-slate-900",
              disabled: ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(email),
              "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
              icon: "i-heroicons-envelope",
              class: "w-full bg-white dark:bg-slate-900"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "flex items-center gap-4" }, [
                  createVNode(_component_UAvatar, {
                    src: unref(user).avatar,
                    alt: unref(name),
                    size: "xl",
                    class: "size-16"
                  }, null, 8, ["src", "alt"]),
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode(_component_UButton, {
                      color: "neutral",
                      variant: "outline",
                      icon: "i-heroicons-camera",
                      label: "Alterar foto",
                      class: "bg-white text-slate-700 border-slate-200"
                    }),
                    createVNode("p", { class: "text-xs text-slate-400" }, "JPG, GIF ou PNG. Máximo de 2MB.")
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode(_component_UInput, {
                      modelValue: unref(name),
                      "onUpdate:modelValue": ($event) => isRef(name) ? name.value = $event : null,
                      icon: "i-heroicons-user",
                      class: "w-full bg-white dark:bg-slate-900"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UInput, {
                      modelValue: unref(role),
                      "onUpdate:modelValue": ($event) => isRef(role) ? role.value = $event : null,
                      icon: "i-heroicons-briefcase",
                      class: "w-full bg-white dark:bg-slate-900",
                      disabled: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode(_component_UInput, {
                      modelValue: unref(email),
                      "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                      icon: "i-heroicons-envelope",
                      class: "w-full bg-white dark:bg-slate-900"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UiSectionCard, { title: "Preferências" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="divide-y divide-slate-100 dark:divide-slate-800"${_scopeId}><div class="flex items-center justify-between py-4"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold text-slate-800 dark:text-slate-100"${_scopeId}>Modo escuro</p><p class="text-xs text-slate-400"${_scopeId}>Alterna o tema da interface para cores escuras</p></div>`);
            _push2(ssrRenderComponent(_component_USwitch, {
              modelValue: unref(isDark),
              "onUpdate:modelValue": ($event) => isRef(isDark) ? isDark.value = $event : null
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center justify-between py-4"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold text-slate-800 dark:text-slate-100"${_scopeId}>Notificações</p><p class="text-xs text-slate-400"${_scopeId}>Receber alertas de tarefas, mensagens e prazos no sistema</p></div>`);
            _push2(ssrRenderComponent(_component_USwitch, {
              modelValue: unref(notifications),
              "onUpdate:modelValue": ($event) => isRef(notifications) ? notifications.value = $event : null
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center justify-between py-4"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold text-slate-800 dark:text-slate-100"${_scopeId}>Resumo semanal por e-mail</p><p class="text-xs text-slate-400"${_scopeId}>Receba um relatório com as atividades e progresso da sua equipe toda sexta-feira</p></div>`);
            _push2(ssrRenderComponent(_component_USwitch, {
              modelValue: unref(weeklyDigest),
              "onUpdate:modelValue": ($event) => isRef(weeklyDigest) ? weeklyDigest.value = $event : null
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "divide-y divide-slate-100 dark:divide-slate-800" }, [
                createVNode("div", { class: "flex items-center justify-between py-4" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-semibold text-slate-800 dark:text-slate-100" }, "Modo escuro"),
                    createVNode("p", { class: "text-xs text-slate-400" }, "Alterna o tema da interface para cores escuras")
                  ]),
                  createVNode(_component_USwitch, {
                    modelValue: unref(isDark),
                    "onUpdate:modelValue": ($event) => isRef(isDark) ? isDark.value = $event : null
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "flex items-center justify-between py-4" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-semibold text-slate-800 dark:text-slate-100" }, "Notificações"),
                    createVNode("p", { class: "text-xs text-slate-400" }, "Receber alertas de tarefas, mensagens e prazos no sistema")
                  ]),
                  createVNode(_component_USwitch, {
                    modelValue: unref(notifications),
                    "onUpdate:modelValue": ($event) => isRef(notifications) ? notifications.value = $event : null
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "flex items-center justify-between py-4" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-semibold text-slate-800 dark:text-slate-100" }, "Resumo semanal por e-mail"),
                    createVNode("p", { class: "text-xs text-slate-400" }, "Receba um relatório com as atividades e progresso da sua equipe toda sexta-feira")
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
      _push(ssrRenderComponent(_component_UiSectionCard, { title: "Segurança" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between py-2"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold text-slate-800 dark:text-slate-100"${_scopeId}>Senha de Acesso</p><p class="text-xs text-slate-400"${_scopeId}>A última alteração foi feita há 3 meses</p></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              icon: "i-heroicons-key",
              label: "Alterar Senha",
              class: "bg-white hover:bg-slate-50 text-slate-700 border-slate-200",
              onClick: changePassword
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between py-2" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "text-sm font-semibold text-slate-800 dark:text-slate-100" }, "Senha de Acesso"),
                  createVNode("p", { class: "text-xs text-slate-400" }, "A última alteração foi feita há 3 meses")
                ]),
                createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
                  icon: "i-heroicons-key",
                  label: "Alterar Senha",
                  class: "bg-white hover:bg-slate-50 text-slate-700 border-slate-200",
                  onClick: changePassword
                })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/colaborador/configuracoes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=configuracoes-zhgeWzoJ.mjs.map
