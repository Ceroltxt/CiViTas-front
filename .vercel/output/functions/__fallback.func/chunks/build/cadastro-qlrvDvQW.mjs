import { _ as _sfc_main$1 } from './FormField-DHBPFucc.mjs';
import { _ as _sfc_main$2 } from './Input-BsVJ6KLu.mjs';
import { _ as _sfc_main$3 } from './Checkbox-cJMXpeOL.mjs';
import { _ as __nuxt_component_0$1, d as _sfc_main$8, D as navigateTo } from './server.mjs';
import { defineComponent, ref, mergeProps, withCtx, isRef, unref, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _imports_0, a as _imports_1 } from './virtual_public-DqNJkZN1.mjs';
import { _ as _imports_0$1 } from './virtual_public-Bfljrhac.mjs';
import './Label-Bz9RXRS1.mjs';
import '@vueuse/core';
import './useFormControl-9B1GcqCr.mjs';
import './VisuallyHiddenInput-_jZmJXfe.mjs';
import './useId-Df0AxZi5.mjs';
import './RovingFocusGroup-Dpm1zhJB.mjs';
import './useDirection-B3h_OC89.mjs';
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
import '@vueuse/shared';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cadastro",
  __ssrInlineRender: true,
  setup(__props) {
    const nome = ref("");
    const email = ref("");
    const senha = ref("");
    const departamento = ref("");
    const telefone = ref("");
    const aceitaTermos = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UFormField = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_UCheckbox = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_UButton = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen bg-gradient-to-r from-purple-500 via-red-400 to-amber-400" }, _attrs))}><div class="hidden md:flex flex-1 items-center justify-center p-8 lg:p-16"><img${ssrRenderAttr("src", _imports_0)} class="absolute w-2/3 max-w-md opacity-36 pointer-events-none select-none bottom-0"><img${ssrRenderAttr("src", _imports_1)} alt="Ilustração de equipe" class="relative z-10 w-full max-w-xs lg:max-w-sm xl:max-w-md h-auto object-contain"></div><div class="flex flex-1 items-center justify-center p-4 md:p-8"><div class="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 md:p-10 space-y-6"><img${ssrRenderAttr("src", _imports_0$1)} alt="Logo Civitas" class="w-32 mx-auto"><form class="space-y-4">`);
      _push(ssrRenderComponent(_component_UFormField, {
        label: "Nome completo",
        name: "nome"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(nome),
              "onUpdate:modelValue": ($event) => isRef(nome) ? nome.value = $event : null,
              type: "text",
              required: "",
              placeholder: "Seu nome completo",
              class: "w-full"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(nome),
                "onUpdate:modelValue": ($event) => isRef(nome) ? nome.value = $event : null,
                type: "text",
                required: "",
                placeholder: "Seu nome completo",
                class: "w-full"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormField, {
        label: "E-mail",
        name: "email"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(email),
              "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
              type: "email",
              required: "",
              placeholder: "seuemail@email.com",
              class: "w-full"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(email),
                "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                type: "email",
                required: "",
                placeholder: "seuemail@email.com",
                class: "w-full"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormField, {
        label: "Senha",
        name: "senha"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(senha),
              "onUpdate:modelValue": ($event) => isRef(senha) ? senha.value = $event : null,
              type: "password",
              required: "",
              placeholder: "Crie uma senha",
              class: "w-full"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(senha),
                "onUpdate:modelValue": ($event) => isRef(senha) ? senha.value = $event : null,
                type: "password",
                required: "",
                placeholder: "Crie uma senha",
                class: "w-full"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormField, {
        label: "Departamento",
        name: "departamento"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(departamento),
              "onUpdate:modelValue": ($event) => isRef(departamento) ? departamento.value = $event : null,
              type: "text",
              required: "",
              placeholder: "Ex: TI, RH, Financeiro...",
              class: "w-full"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(departamento),
                "onUpdate:modelValue": ($event) => isRef(departamento) ? departamento.value = $event : null,
                type: "text",
                required: "",
                placeholder: "Ex: TI, RH, Financeiro...",
                class: "w-full"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormField, {
        label: "Telefone",
        name: "telefone"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(telefone),
              "onUpdate:modelValue": ($event) => isRef(telefone) ? telefone.value = $event : null,
              type: "tel",
              required: "",
              placeholder: "(11) 99999-9999",
              class: "w-full"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(telefone),
                "onUpdate:modelValue": ($event) => isRef(telefone) ? telefone.value = $event : null,
                type: "tel",
                required: "",
                placeholder: "(11) 99999-9999",
                class: "w-full"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-start gap-3 pt-1">`);
      _push(ssrRenderComponent(_component_UCheckbox, {
        modelValue: unref(aceitaTermos),
        "onUpdate:modelValue": ($event) => isRef(aceitaTermos) ? aceitaTermos.value = $event : null,
        name: "termos",
        required: ""
      }, null, _parent));
      _push(`<span class="text-sm text-slate-600 dark:text-slate-300 leading-snug"> Li e concordo com os `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/termos",
        class: "text-blue-500 hover:underline font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` termos e condições `);
          } else {
            return [
              createTextVNode(" termos e condições ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</span></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        color: "primary",
        block: "",
        class: "mt-2",
        disabled: !unref(aceitaTermos),
        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/ponte")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Criar conta `);
          } else {
            return [
              createTextVNode(" Criar conta ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form><hr class="border-slate-200 dark:border-slate-600"><span class="text-sm text-slate-600 dark:text-slate-300 text-center block"> Já tem uma conta? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "text-blue-500 hover:underline font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Faça seu login `);
          } else {
            return [
              createTextVNode(" Faça seu login ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</span></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cadastro.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cadastro-qlrvDvQW.mjs.map
