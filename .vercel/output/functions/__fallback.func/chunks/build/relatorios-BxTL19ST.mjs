import { f as _sfc_main$d, d as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$1 } from './Select-c22fz1qb.mjs';
import { _ as __nuxt_component_1 } from './SectionCard-CotbZH9k.mjs';
import { defineComponent, ref, computed, mergeProps, isRef, unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createTextVNode, useSSRContext } from 'vue';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "relatorios",
  __ssrInlineRender: true,
  setup(__props) {
    const perPage = ref(10);
    const view = ref("list");
    const selectedProjeto = ref("Todos");
    const selectedEquipe = ref("Todas");
    const selectedGestor = ref("Todos");
    const selectedTarefa = ref("Todas");
    const selectedPeriodo = ref("Todos");
    const projetoItems = ["Todos", "Plataforma E-commerce", "Civitas Mobile", "Sistema de Logística", "Plataforma MEI", "Portal do Cliente"];
    const equipeItems = ["Todas", "FrontEnd", "BackEnd", "DataBase", "Criptografia"];
    const gestorItems = ["Todos", "Beatriz Milani", "Pedro Nascimento"];
    const tarefaItems = ["Todas", "Dashboard Admin", "Ajuste na API", "Definição de Métricas", "diagrama.png", "Levantamento"];
    const periodoItems = ["Todos", "Últimos 7 dias", "Últimos 30 dias"];
    const baseLogs = [
      {
        date: "05/06/2026",
        user: "Costa Neves",
        action: "Status Atualizado",
        actionColor: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        details: 'Moveu a tarefa "Dashboard Admin" para Concluídas',
        project: "Plataforma E-commerce",
        team: "FrontEnd",
        manager: "Beatriz Milani",
        status: "Concluídas",
        statusColor: "text-emerald-600 dark:text-emerald-400"
      },
      {
        date: "02/06/2026",
        user: "Costa Neves",
        action: "Comentário Adicionado",
        actionColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        details: 'Comentou na tarefa "Ajuste na API"',
        project: "Civitas Mobile",
        team: "BackEnd",
        manager: "Pedro Nascimento",
        status: "Pendentes",
        statusColor: "text-amber-600 dark:text-amber-400"
      },
      {
        date: "30/05/2026",
        user: "Costa Neves",
        action: "Nova Tarefa",
        actionColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        details: 'Criou a tarefa "Definição de Métricas"',
        project: "Sistema de Logística",
        team: "DataBase",
        manager: "Pedro Nascimento",
        status: "Pendentes",
        statusColor: "text-amber-600 dark:text-amber-400"
      },
      {
        date: "27/05/2026",
        user: "Costa Neves",
        action: "Arquivo Anexado",
        actionColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        details: 'Adicionou o arquivo "diagrama.png" ao projeto',
        project: "Plataforma MEI",
        team: "FrontEnd",
        manager: "Beatriz Milani",
        status: "Pendentes",
        statusColor: "text-amber-600 dark:text-amber-400"
      },
      {
        date: "24/05/2026",
        user: "Costa Neves",
        action: "Prazo Alterado",
        actionColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        details: 'Alterou o vencimento da tarefa "Levantamento" para 20/06',
        project: "Portal do Cliente",
        team: "Criptografia",
        manager: "Pedro Nascimento",
        status: "Atrasadas",
        statusColor: "text-rose-600 dark:text-rose-400"
      }
    ];
    const logs = [
      ...baseLogs,
      ...baseLogs.map((l) => ({ ...l, date: "21/05/2026", details: l.details + " (histórico)" })),
      ...baseLogs.map((l) => ({ ...l, date: "15/05/2026", details: l.details + " (anterior)" }))
    ];
    const filteredLogs = computed(() => {
      return logs.filter((l) => {
        if (selectedProjeto.value !== "Todos" && l.project !== selectedProjeto.value) return false;
        if (selectedEquipe.value !== "Todas" && l.team !== selectedEquipe.value) return false;
        if (selectedGestor.value !== "Todos" && l.manager !== selectedGestor.value) return false;
        if (selectedTarefa.value !== "Todas" && !l.details.toLowerCase().includes(selectedTarefa.value.toLowerCase())) return false;
        return true;
      });
    });
    const paginatedLogs = computed(() => {
      return filteredLogs.value.slice(0, Number(perPage.value));
    });
    function exportLogs() {
      alert("Logs exportados com sucesso!");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$d;
      const _component_UButton = _sfc_main$8;
      const _component_USelect = _sfc_main$1;
      const _component_UiSectionCard = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5 p-4 sm:p-6" }, _attrs))}><div class="flex flex-wrap items-center justify-between gap-3"><h1 class="flex items-center gap-2 font-display text-2xl font-bold text-slate-800 dark:text-slate-100"> Relatórios `);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-document-chart-bar",
        class: "size-6 text-violet-500"
      }, null, _parent));
      _push(`</h1><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "neutral",
        variant: "outline",
        icon: "i-heroicons-arrow-down-tray",
        label: "Exportar Logs",
        class: "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-semibold",
        onClick: exportLogs
      }, null, _parent));
      _push(`<div class="h-6 w-px bg-slate-200 dark:bg-slate-800"></div><span class="text-sm text-slate-500 font-medium">Itens:</span>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(perPage),
        "onUpdate:modelValue": ($event) => isRef(perPage) ? perPage.value = $event : null,
        items: [5, 10, 15, 20],
        class: "w-18 bg-white"
      }, null, _parent));
      _push(`<div class="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"><button type="button" class="${ssrRenderClass([unref(view) === "list" ? "bg-orange-500 text-white" : "text-slate-400 bg-white dark:bg-slate-900", "px-2.5 py-1.5"])}" aria-label="Visualização em lista">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-bars-3",
        class: "size-4"
      }, null, _parent));
      _push(`</button><button type="button" class="${ssrRenderClass([unref(view) === "grid" ? "bg-orange-500 text-white" : "text-slate-400 bg-white dark:bg-slate-900", "px-2.5 py-1.5"])}" aria-label="Visualização em grade">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-squares-2x2",
        class: "size-4"
      }, null, _parent));
      _push(`</button></div></div></div>`);
      _push(ssrRenderComponent(_component_UiSectionCard, { class: "!p-0" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-2 gap-4 p-5 md:grid-cols-3 lg:grid-cols-5 border-b border-slate-100 dark:border-slate-800"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400"${_scopeId}>Projetos</label>`);
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(selectedProjeto),
              "onUpdate:modelValue": ($event) => isRef(selectedProjeto) ? selectedProjeto.value = $event : null,
              items: projetoItems,
              "trailing-icon": "i-heroicons-chevron-down",
              class: "w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400"${_scopeId}>Equipes</label>`);
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(selectedEquipe),
              "onUpdate:modelValue": ($event) => isRef(selectedEquipe) ? selectedEquipe.value = $event : null,
              items: equipeItems,
              "trailing-icon": "i-heroicons-chevron-down",
              class: "w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400"${_scopeId}>Gestores</label>`);
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(selectedGestor),
              "onUpdate:modelValue": ($event) => isRef(selectedGestor) ? selectedGestor.value = $event : null,
              items: gestorItems,
              "trailing-icon": "i-heroicons-chevron-down",
              class: "w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400"${_scopeId}>Tarefas</label>`);
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(selectedTarefa),
              "onUpdate:modelValue": ($event) => isRef(selectedTarefa) ? selectedTarefa.value = $event : null,
              items: tarefaItems,
              "trailing-icon": "i-heroicons-chevron-down",
              class: "w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400"${_scopeId}>Período</label>`);
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(selectedPeriodo),
              "onUpdate:modelValue": ($event) => isRef(selectedPeriodo) ? selectedPeriodo.value = $event : null,
              items: periodoItems,
              "trailing-icon": "i-heroicons-chevron-down",
              class: "w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
            if (unref(view) === "list") {
              _push2(`<div class="overflow-x-auto"${_scopeId}><table class="w-full border-collapse text-sm"${_scopeId}><thead${_scopeId}><tr class="text-left text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800"${_scopeId}><th class="px-6 py-4"${_scopeId}>Data</th><th class="px-6 py-4"${_scopeId}>Usuário</th><th class="px-6 py-4"${_scopeId}>Ação</th><th class="px-6 py-4"${_scopeId}>Detalhes</th><th class="px-6 py-4"${_scopeId}>Contexto</th><th class="px-6 py-4"${_scopeId}>Gestão</th><th class="px-6 py-4"${_scopeId}><span class="sr-only"${_scopeId}>Ações</span></th></tr></thead><tbody${_scopeId}><!--[-->`);
              ssrRenderList(unref(paginatedLogs), (log, index) => {
                _push2(`<tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"${_scopeId}><td class="px-6 py-5 text-slate-600 dark:text-slate-300 font-medium"${_scopeId}>${ssrInterpolate(log.date)}</td><td class="px-6 py-5 text-slate-600 dark:text-slate-300"${_scopeId}>${ssrInterpolate(log.user)}</td><td class="px-6 py-5"${_scopeId}><span class="${ssrRenderClass([log.actionColor, "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"])}"${_scopeId}>${ssrInterpolate(log.action)}</span></td><td class="px-6 py-5 text-slate-600 dark:text-slate-300 max-w-xs font-medium"${_scopeId}>${ssrInterpolate(log.details)}</td><td class="px-6 py-5 text-slate-500 dark:text-slate-400 space-y-1 text-xs font-semibold"${_scopeId}><div class="flex items-center gap-1.5"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-briefcase",
                  class: "size-4 shrink-0 text-slate-400"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>${ssrInterpolate(log.project)}</span></div><div class="flex items-center gap-1.5"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-user-group",
                  class: "size-4 shrink-0 text-slate-400"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>${ssrInterpolate(log.team)}</span></div></td><td class="px-6 py-5 text-slate-500 dark:text-slate-400 space-y-1 text-xs font-semibold"${_scopeId}><div class="flex items-center gap-1.5"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-user",
                  class: "size-4 shrink-0 text-slate-400"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>${ssrInterpolate(log.manager)}</span></div><div class="flex items-center gap-1.5"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-tag",
                  class: ["size-4 shrink-0", log.statusColor]
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>${ssrInterpolate(log.status)}</span></div></td><td class="px-6 py-5 text-right"${_scopeId}><button type="button" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-arrow-down-tray",
                  class: "size-4"
                }, null, _parent2, _scopeId));
                _push2(` Exportar </button></td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
            } else {
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5"${_scopeId}><!--[-->`);
              ssrRenderList(unref(paginatedLogs), (log, index) => {
                _push2(`<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all"${_scopeId}><div class="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2"${_scopeId}><span class="text-xs font-bold text-slate-400"${_scopeId}>${ssrInterpolate(log.date)}</span><span class="text-xs font-bold text-slate-500"${_scopeId}>${ssrInterpolate(log.user)}</span></div><div class="mb-3"${_scopeId}><span class="${ssrRenderClass([log.actionColor, "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"])}"${_scopeId}>${ssrInterpolate(log.action)}</span></div><p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4"${_scopeId}>${ssrInterpolate(log.details)}</p><div class="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><span class="text-slate-400"${_scopeId}>Projeto:</span><span${_scopeId}>${ssrInterpolate(log.project)}</span></div><div class="flex items-center justify-between"${_scopeId}><span class="text-slate-400"${_scopeId}>Equipe:</span><span${_scopeId}>${ssrInterpolate(log.team)}</span></div><div class="flex items-center justify-between"${_scopeId}><span class="text-slate-400"${_scopeId}>Gestor:</span><span${_scopeId}>${ssrInterpolate(log.manager)}</span></div><div class="flex items-center justify-between pb-2"${_scopeId}><span class="text-slate-400"${_scopeId}>Status:</span><span class="${ssrRenderClass(log.statusColor)}"${_scopeId}>${ssrInterpolate(log.status)}</span></div>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
                  size: "xs",
                  block: "",
                  icon: "i-heroicons-arrow-down-tray",
                  label: "Exportar",
                  onClick: exportLogs
                }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              });
              _push2(`<!--]--></div>`);
            }
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-2 gap-4 p-5 md:grid-cols-3 lg:grid-cols-5 border-b border-slate-100 dark:border-slate-800" }, [
                createVNode("div", null, [
                  createVNode("label", { class: "mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400" }, "Projetos"),
                  createVNode(_component_USelect, {
                    modelValue: unref(selectedProjeto),
                    "onUpdate:modelValue": ($event) => isRef(selectedProjeto) ? selectedProjeto.value = $event : null,
                    items: projetoItems,
                    "trailing-icon": "i-heroicons-chevron-down",
                    class: "w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400" }, "Equipes"),
                  createVNode(_component_USelect, {
                    modelValue: unref(selectedEquipe),
                    "onUpdate:modelValue": ($event) => isRef(selectedEquipe) ? selectedEquipe.value = $event : null,
                    items: equipeItems,
                    "trailing-icon": "i-heroicons-chevron-down",
                    class: "w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400" }, "Gestores"),
                  createVNode(_component_USelect, {
                    modelValue: unref(selectedGestor),
                    "onUpdate:modelValue": ($event) => isRef(selectedGestor) ? selectedGestor.value = $event : null,
                    items: gestorItems,
                    "trailing-icon": "i-heroicons-chevron-down",
                    class: "w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400" }, "Tarefas"),
                  createVNode(_component_USelect, {
                    modelValue: unref(selectedTarefa),
                    "onUpdate:modelValue": ($event) => isRef(selectedTarefa) ? selectedTarefa.value = $event : null,
                    items: tarefaItems,
                    "trailing-icon": "i-heroicons-chevron-down",
                    class: "w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400" }, "Período"),
                  createVNode(_component_USelect, {
                    modelValue: unref(selectedPeriodo),
                    "onUpdate:modelValue": ($event) => isRef(selectedPeriodo) ? selectedPeriodo.value = $event : null,
                    items: periodoItems,
                    "trailing-icon": "i-heroicons-chevron-down",
                    class: "w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ]),
              unref(view) === "list" ? (openBlock(), createBlock("div", {
                key: 0,
                class: "overflow-x-auto"
              }, [
                createVNode("table", { class: "w-full border-collapse text-sm" }, [
                  createVNode("thead", null, [
                    createVNode("tr", { class: "text-left text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800" }, [
                      createVNode("th", { class: "px-6 py-4" }, "Data"),
                      createVNode("th", { class: "px-6 py-4" }, "Usuário"),
                      createVNode("th", { class: "px-6 py-4" }, "Ação"),
                      createVNode("th", { class: "px-6 py-4" }, "Detalhes"),
                      createVNode("th", { class: "px-6 py-4" }, "Contexto"),
                      createVNode("th", { class: "px-6 py-4" }, "Gestão"),
                      createVNode("th", { class: "px-6 py-4" }, [
                        createVNode("span", { class: "sr-only" }, "Ações")
                      ])
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(paginatedLogs), (log, index) => {
                      return openBlock(), createBlock("tr", {
                        key: index,
                        class: "border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                      }, [
                        createVNode("td", { class: "px-6 py-5 text-slate-600 dark:text-slate-300 font-medium" }, toDisplayString(log.date), 1),
                        createVNode("td", { class: "px-6 py-5 text-slate-600 dark:text-slate-300" }, toDisplayString(log.user), 1),
                        createVNode("td", { class: "px-6 py-5" }, [
                          createVNode("span", {
                            class: ["inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", log.actionColor]
                          }, toDisplayString(log.action), 3)
                        ]),
                        createVNode("td", { class: "px-6 py-5 text-slate-600 dark:text-slate-300 max-w-xs font-medium" }, toDisplayString(log.details), 1),
                        createVNode("td", { class: "px-6 py-5 text-slate-500 dark:text-slate-400 space-y-1 text-xs font-semibold" }, [
                          createVNode("div", { class: "flex items-center gap-1.5" }, [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-briefcase",
                              class: "size-4 shrink-0 text-slate-400"
                            }),
                            createVNode("span", null, toDisplayString(log.project), 1)
                          ]),
                          createVNode("div", { class: "flex items-center gap-1.5" }, [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-user-group",
                              class: "size-4 shrink-0 text-slate-400"
                            }),
                            createVNode("span", null, toDisplayString(log.team), 1)
                          ])
                        ]),
                        createVNode("td", { class: "px-6 py-5 text-slate-500 dark:text-slate-400 space-y-1 text-xs font-semibold" }, [
                          createVNode("div", { class: "flex items-center gap-1.5" }, [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-user",
                              class: "size-4 shrink-0 text-slate-400"
                            }),
                            createVNode("span", null, toDisplayString(log.manager), 1)
                          ]),
                          createVNode("div", { class: "flex items-center gap-1.5" }, [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-tag",
                              class: ["size-4 shrink-0", log.statusColor]
                            }, null, 8, ["class"]),
                            createVNode("span", null, toDisplayString(log.status), 1)
                          ])
                        ]),
                        createVNode("td", { class: "px-6 py-5 text-right" }, [
                          createVNode("button", {
                            type: "button",
                            class: "inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors",
                            onClick: exportLogs
                          }, [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-arrow-down-tray",
                              class: "size-4"
                            }),
                            createTextVNode(" Exportar ")
                          ])
                        ])
                      ]);
                    }), 128))
                  ])
                ])
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(paginatedLogs), (log, index) => {
                  return openBlock(), createBlock("div", {
                    key: index,
                    class: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
                  }, [
                    createVNode("div", { class: "flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2" }, [
                      createVNode("span", { class: "text-xs font-bold text-slate-400" }, toDisplayString(log.date), 1),
                      createVNode("span", { class: "text-xs font-bold text-slate-500" }, toDisplayString(log.user), 1)
                    ]),
                    createVNode("div", { class: "mb-3" }, [
                      createVNode("span", {
                        class: ["inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", log.actionColor]
                      }, toDisplayString(log.action), 3)
                    ]),
                    createVNode("p", { class: "text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4" }, toDisplayString(log.details), 1),
                    createVNode("div", { class: "border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400" }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("span", { class: "text-slate-400" }, "Projeto:"),
                        createVNode("span", null, toDisplayString(log.project), 1)
                      ]),
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("span", { class: "text-slate-400" }, "Equipe:"),
                        createVNode("span", null, toDisplayString(log.team), 1)
                      ]),
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("span", { class: "text-slate-400" }, "Gestor:"),
                        createVNode("span", null, toDisplayString(log.manager), 1)
                      ]),
                      createVNode("div", { class: "flex items-center justify-between pb-2" }, [
                        createVNode("span", { class: "text-slate-400" }, "Status:"),
                        createVNode("span", {
                          class: log.statusColor
                        }, toDisplayString(log.status), 3)
                      ]),
                      createVNode(_component_UButton, {
                        color: "neutral",
                        variant: "outline",
                        size: "xs",
                        block: "",
                        icon: "i-heroicons-arrow-down-tray",
                        label: "Exportar",
                        onClick: exportLogs
                      })
                    ])
                  ]);
                }), 128))
              ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/colaborador/relatorios.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=relatorios-BxTL19ST.mjs.map
