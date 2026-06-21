import { _ as _sfc_main$1 } from './Card-Bu3IYA97.mjs';
import { _ as _sfc_main$2 } from './Input-BsVJ6KLu.mjs';
import { d as _sfc_main$8, f as _sfc_main$d, e as _sfc_main$b, l as defineLocale, m as en } from './server.mjs';
import { _ as _sfc_main$3 } from './Badge-BWf412jE.mjs';
import { defineComponent, ref, computed, watch, mergeProps, withCtx, createTextVNode, unref, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import '@vueuse/core';
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

defineLocale({
  name: "English (United Kingdom)",
  code: "en-GB",
  messages: en.messages
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "equipes",
  __ssrInlineRender: true,
  setup(__props) {
    const teams = [
      {
        id: "frontend",
        name: "Front-End",
        members: "5",
        leader: "Biah Milani",
        projects: 3,
        createdAt: "12/03/2025",
        tasks: [
          {
            name: "Página Administrador",
            category: "Front-End",
            priority: "Urgente",
            members: ["Carolzinha Ramiro", "Costa Neves", "Dimi Jow"],
            status: "Em andamento",
            deadline: "25/06/2026"
          },
          {
            name: "Dashboard Gestor",
            category: "Front-End",
            priority: "Média",
            members: ["Bea Ribeiro", "Dimi Jow", "Danizin Macena", "Carolzinha Ramiro"],
            status: "Concluída",
            deadline: "18/06/2026"
          },
          {
            name: "Tela de Login",
            category: "Front-End",
            priority: "Baixa",
            members: ["Bea Ribeiro", "Costa Neves", "Danizin Macena"],
            status: "Em andamento",
            deadline: "30/06/2026"
          }
        ],
        integrantes: [
          { name: "Costa Neves", role: "Desenvolvedor" },
          { name: "Danizin Macena", role: "Design" },
          { name: "Carolzinha Ramiro", role: "Desenvolvedor" },
          { name: "Dimi Jow", role: "Design" },
          { name: "Bea Ribeiro", role: "Desenvolvedor" }
        ]
      },
      {
        id: "backend",
        name: "Back-End",
        members: "4",
        leader: "Ana Carol",
        projects: 2,
        createdAt: "12/03/2025",
        tasks: [
          {
            name: "API de Usuários",
            category: "Back-End",
            priority: "Urgente",
            members: ["Bea Ribeiro", "Costa Neves"],
            status: "Em andamento",
            deadline: "22/06/2026"
          },
          {
            name: "Sistema de Login",
            category: "Back-End",
            priority: "Média",
            members: ["Dimi Jow", "Carolzinha Ramiro"],
            status: "Concluída",
            deadline: "15/06/2026"
          }
        ],
        integrantes: [
          { name: "Costa Neves", role: "Desenvolvedor" },
          { name: "Carolzinha Ramiro", role: "Desenvolvedor" },
          { name: "Dimi Jow", role: "Desenvolvedor" },
          { name: "Bea Ribeiro", role: "Desenvolvedor" }
        ]
      },
      {
        id: "nuvem",
        name: "Nuvem",
        members: "3",
        leader: "Ceci Hub Pai",
        projects: 1,
        createdAt: "12/03/2025",
        tasks: [
          {
            name: "Configuração AWS",
            category: "Cloud",
            priority: "Urgente",
            members: ["Bea Ribeiro", "Costa Neves", "Carolzinha Ramiro"],
            status: "Em andamento",
            deadline: "20/06/2026"
          },
          {
            name: "Deploy Produção",
            category: "Cloud",
            priority: "Média",
            members: ["Bea Ribeiro", "Costa Neves", "Carolzinha Ramiro"],
            status: "Atrasada",
            deadline: "10/06/2026"
          }
        ],
        integrantes: [
          { name: "Costa Neves", role: "Desenvolvedor" },
          { name: "Carolzinha Ramiro", role: "Desenvolvedor" },
          { name: "Bea Ribeiro", role: "Desenvolvedor" }
        ]
      }
    ];
    const selectedTeamId = ref("frontend");
    const activeTab = ref("colaboradores");
    const selectedMember = ref("Costa Neves");
    const selectedTask = ref("Página Administrador");
    const selectedTeam = computed(
      () => teams.find((team) => team.id === selectedTeamId.value)
    );
    const memberTasks = computed(() => {
      if (!selectedTeam.value) return [];
      return selectedTeam.value.tasks.filter(
        (task) => task.members.includes(selectedMember.value)
      );
    });
    const taskMembers = computed(() => {
      if (!selectedTeam.value) return [];
      const task = selectedTeam.value.tasks.find(
        (task2) => task2.name === selectedTask.value
      );
      if (!task) return [];
      return selectedTeam.value.integrantes.filter(
        (member) => task.members.includes(member.name)
      );
    });
    watch(selectedTeam, (team) => {
      if (!team) return;
      selectedMember.value = team.integrantes[0]?.name ?? "";
      selectedTask.value = team.tasks[0]?.name ?? "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_UButton = _sfc_main$8;
      const _component_UIcon = _sfc_main$d;
      const _component_UAvatar = _sfc_main$b;
      const _component_UBadge = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl space-y-5 p-4 sm:p-6" }, _attrs))}><div><h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100"> Equipes </h1><p class="text-sm text-slate-400"> Gestão de equipes </p></div><div class="grid grid-cols-1 lg:grid-cols-12 gap-4">`);
      _push(ssrRenderComponent(_component_UCard, { class: "h-full lg:col-span-4" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 class="text-lg font-semibold"${_scopeId}> Minhas Equipes </h2>`);
          } else {
            return [
              createVNode("h2", { class: "text-lg font-semibold" }, " Minhas Equipes ")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-4 flex gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              icon: "i-lucide-search",
              placeholder: "Buscar equipe...",
              class: "flex-1",
              ui: { base: "h-9" }
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-plus",
              class: "h-9 bg-violet-500 text-white hover:bg-violet-600"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Equipe `);
                } else {
                  return [
                    createTextVNode(" Equipe ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(teams, (team) => {
              _push2(`<div class="${ssrRenderClass([
                unref(selectedTeamId) === team.id ? "bg-[#ECEAFF]" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                "cursor-pointer rounded-lg p-3 transition"
              ])}"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><h3 class="font-medium"${_scopeId}>${ssrInterpolate(team.name)}</h3><p class="text-sm text-slate-500"${_scopeId}>${ssrInterpolate(team.members)} membros </p></div></div>`);
            });
            _push2(`<!--]--></div><button type="button" class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-violet-500 p-3 text-sm font-medium text-violet-600 transition hover:bg-violet-50 dark:hover:bg-violet-950/20"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-plus",
              class: "sie-4"
            }, null, _parent2, _scopeId));
            _push2(` Adicionar equipe </button>`);
          } else {
            return [
              createVNode("div", { class: "mb-4 flex gap-2" }, [
                createVNode(_component_UInput, {
                  icon: "i-lucide-search",
                  placeholder: "Buscar equipe...",
                  class: "flex-1",
                  ui: { base: "h-9" }
                }),
                createVNode(_component_UButton, {
                  icon: "i-heroicons-plus",
                  class: "h-9 bg-violet-500 text-white hover:bg-violet-600"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Equipe ")
                  ]),
                  _: 1
                })
              ]),
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(), createBlock(Fragment, null, renderList(teams, (team) => {
                  return createVNode("div", {
                    key: team.id,
                    class: [
                      "cursor-pointer rounded-lg p-3 transition",
                      unref(selectedTeamId) === team.id ? "bg-[#ECEAFF]" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    ],
                    onClick: ($event) => selectedTeamId.value = team.id
                  }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("h3", { class: "font-medium" }, toDisplayString(team.name), 1),
                      createVNode("p", { class: "text-sm text-slate-500" }, toDisplayString(team.members) + " membros ", 1)
                    ])
                  ], 10, ["onClick"]);
                }), 64))
              ]),
              createVNode("button", {
                type: "button",
                class: "mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-violet-500 p-3 text-sm font-medium text-violet-600 transition hover:bg-violet-50 dark:hover:bg-violet-950/20"
              }, [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-plus",
                  class: "sie-4"
                }),
                createTextVNode(" Adicionar equipe ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, { class: "h-full lg:col-span-8" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><h2 class="flex items-center gap-2 text-lg font-semibold"${_scopeId}>${ssrInterpolate(unref(selectedTeam)?.name)} `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-pencil-square",
              class: "size-5 text-violet-500"
            }, null, _parent2, _scopeId));
            _push2(`</h2><div class="flex gap-2"${_scopeId}><button type="button" class="flex items-center gap-2 rounded-lg border border-dashed border-[#1D1D1D] px-3 py-2 text-sm font-medium text-[1D1D1D] transition hover:bg-slate-50"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-pencil-square",
              class: "size-4"
            }, null, _parent2, _scopeId));
            _push2(` Editar Equipe </button><button type="button" class="flex items-center gap-2 rounded-lg border border-dashed border-red-500 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-trash",
              class: "size-4"
            }, null, _parent2, _scopeId));
            _push2(` Excluir Equipe </button></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("h2", { class: "flex items-center gap-2 text-lg font-semibold" }, [
                  createTextVNode(toDisplayString(unref(selectedTeam)?.name) + " ", 1),
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-pencil-square",
                    class: "size-5 text-violet-500"
                  })
                ]),
                createVNode("div", { class: "flex gap-2" }, [
                  createVNode("button", {
                    type: "button",
                    class: "flex items-center gap-2 rounded-lg border border-dashed border-[#1D1D1D] px-3 py-2 text-sm font-medium text-[1D1D1D] transition hover:bg-slate-50"
                  }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-pencil-square",
                      class: "size-4"
                    }),
                    createTextVNode(" Editar Equipe ")
                  ]),
                  createVNode("button", {
                    type: "button",
                    class: "flex items-center gap-2 rounded-lg border border-dashed border-red-500 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                  }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-trash",
                      class: "size-4"
                    }),
                    createTextVNode(" Excluir Equipe ")
                  ])
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="-mt-3.6 flex gap-6 border-b border-slate-200 dark:border-slate-800"${_scopeId}><button type="button" class="${ssrRenderClass([
              unref(activeTab) === "colaboradores" ? "border-violet-500 text-violet-600" : "border-transparent text-slate-400 hover:text-slate-600",
              "-mb-px flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors"
            ])}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-users",
              class: "size-4"
            }, null, _parent2, _scopeId));
            _push2(` Colaboradores </button><button type="button" class="${ssrRenderClass([
              unref(activeTab) === "tarefas" ? "border-violet-500 text-violet-600" : "border-transparent text-slate-400 hover:text-slate-600",
              "-mb-px flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors"
            ])}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-clipboard-document-list",
              class: "size-4"
            }, null, _parent2, _scopeId));
            _push2(` Tarefas </button></div><div class="mt-6 grid grid-cols-12 gap-6"${_scopeId}><div class="col-span-5 border-r border-slate-200 pr-6 dark:border-slate-700"${_scopeId}><h3 class="mb-4 font-semibold"${_scopeId}>${ssrInterpolate(unref(activeTab) === "colaboradores" ? "Colaboradores" : "Tarefas")}</h3><div class="space-y-2"${_scopeId}>`);
            if (unref(activeTab) === "colaboradores") {
              _push2(`<!--[-->`);
              ssrRenderList(unref(selectedTeam)?.integrantes, (member) => {
                _push2(`<div class="${ssrRenderClass([unref(selectedMember) === member.name ? "bg-[#ECEAFF]" : "", "cursor-pointer rounded-lg p-3 transition"])}"${_scopeId}><div class="flex items-center gap-3"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UAvatar, {
                  src: member.photo,
                  alt: member.name,
                  size: "md"
                }, null, _parent2, _scopeId));
                _push2(`<div${_scopeId}><p class="font-medium"${_scopeId}>${ssrInterpolate(member.name)}</p><p class="text-sm text-slate-500"${_scopeId}>${ssrInterpolate(member.role)}</p></div></div></div>`);
              });
              _push2(`<!--]-->`);
            } else {
              _push2(`<!--[-->`);
              ssrRenderList(unref(selectedTeam)?.tasks, (task) => {
                _push2(`<div class="${ssrRenderClass([unref(selectedTask) === task.name ? "bg-[#ECEAFF]" : "", "cursor-pointer rounded-lg p-3 transition"])}"${_scopeId}><p class="font-medium"${_scopeId}>${ssrInterpolate(task.name)}</p><p class="text-sm text-slate-500"${_scopeId}>${ssrInterpolate(task.members.slice(0, 2).join(", "))} `);
                if (task.members.length > 2) {
                  _push2(`<span${_scopeId}> +${ssrInterpolate(task.members.length - 2)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</p></div>`);
              });
              _push2(`<!--]-->`);
            }
            _push2(`</div></div><div class="col-span-7"${_scopeId}>`);
            if (unref(activeTab) === "colaboradores") {
              _push2(`<!--[--><h3 class="mb-4 font-semibold"${_scopeId}> Tarefas de ${ssrInterpolate(unref(selectedMember))}</h3><div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(unref(memberTasks), (task) => {
                _push2(`<div class="flex items-center gap-6 overflow-hidden rounded-lg border border-slate-200 p-4 dark:border-slate-700"${_scopeId}><div class="flex min-w-0 flex-1 items-center gap-3"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UAvatar, { size: "md" }, null, _parent2, _scopeId));
                _push2(`<div class="min-w-0"${_scopeId}><p class="truncate font-medium"${_scopeId}>${ssrInterpolate(task.name)}</p><p class="text-xs text-slate-500"${_scopeId}> Prioridade: ${ssrInterpolate(task.priority)}</p></div></div>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  class: "shrink-0",
                  color: task.status === "Concluída" ? "success" : task.status === "Atrasada" ? "error" : "primary",
                  variant: "soft"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(task.status)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(task.status), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<div class="w-24 shrink-0 text-sm text-slate-500"${_scopeId}>${ssrInterpolate(task.deadline)}</div></div>`);
              });
              _push2(`<!--]--></div><!--]-->`);
            } else {
              _push2(`<!--[--><h3 class="mb-4 font-semibold"${_scopeId}> Colaboradores da tarefa </h3><div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(unref(taskMembers), (member) => {
                _push2(`<div class="rounded-lg border border-slate-200 p-4 dark:border-slate-700"${_scopeId}><p class="font-medium"${_scopeId}>${ssrInterpolate(member.name)}</p><p class="text-sm text-slate-500"${_scopeId}>${ssrInterpolate(member.role)}</p></div>`);
              });
              _push2(`<!--]--></div><!--]-->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "-mt-3.6 flex gap-6 border-b border-slate-200 dark:border-slate-800" }, [
                createVNode("button", {
                  type: "button",
                  class: [
                    "-mb-px flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors",
                    unref(activeTab) === "colaboradores" ? "border-violet-500 text-violet-600" : "border-transparent text-slate-400 hover:text-slate-600"
                  ],
                  onClick: ($event) => activeTab.value = "colaboradores"
                }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-users",
                    class: "size-4"
                  }),
                  createTextVNode(" Colaboradores ")
                ], 10, ["onClick"]),
                createVNode("button", {
                  type: "button",
                  class: [
                    "-mb-px flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors",
                    unref(activeTab) === "tarefas" ? "border-violet-500 text-violet-600" : "border-transparent text-slate-400 hover:text-slate-600"
                  ],
                  onClick: ($event) => activeTab.value = "tarefas"
                }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-clipboard-document-list",
                    class: "size-4"
                  }),
                  createTextVNode(" Tarefas ")
                ], 10, ["onClick"])
              ]),
              createVNode("div", { class: "mt-6 grid grid-cols-12 gap-6" }, [
                createVNode("div", { class: "col-span-5 border-r border-slate-200 pr-6 dark:border-slate-700" }, [
                  createVNode("h3", { class: "mb-4 font-semibold" }, toDisplayString(unref(activeTab) === "colaboradores" ? "Colaboradores" : "Tarefas"), 1),
                  createVNode("div", { class: "space-y-2" }, [
                    unref(activeTab) === "colaboradores" ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(unref(selectedTeam)?.integrantes, (member) => {
                      return openBlock(), createBlock("div", {
                        key: member.name,
                        class: ["cursor-pointer rounded-lg p-3 transition", unref(selectedMember) === member.name ? "bg-[#ECEAFF]" : ""],
                        onClick: ($event) => selectedMember.value = member.name
                      }, [
                        createVNode("div", { class: "flex items-center gap-3" }, [
                          createVNode(_component_UAvatar, {
                            src: member.photo,
                            alt: member.name,
                            size: "md"
                          }, null, 8, ["src", "alt"]),
                          createVNode("div", null, [
                            createVNode("p", { class: "font-medium" }, toDisplayString(member.name), 1),
                            createVNode("p", { class: "text-sm text-slate-500" }, toDisplayString(member.role), 1)
                          ])
                        ])
                      ], 10, ["onClick"]);
                    }), 128)) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(unref(selectedTeam)?.tasks, (task) => {
                      return openBlock(), createBlock("div", {
                        key: task.name,
                        class: ["cursor-pointer rounded-lg p-3 transition", unref(selectedTask) === task.name ? "bg-[#ECEAFF]" : ""],
                        onClick: ($event) => selectedTask.value = task.name
                      }, [
                        createVNode("p", { class: "font-medium" }, toDisplayString(task.name), 1),
                        createVNode("p", { class: "text-sm text-slate-500" }, [
                          createTextVNode(toDisplayString(task.members.slice(0, 2).join(", ")) + " ", 1),
                          task.members.length > 2 ? (openBlock(), createBlock("span", { key: 0 }, " +" + toDisplayString(task.members.length - 2), 1)) : createCommentVNode("", true)
                        ])
                      ], 10, ["onClick"]);
                    }), 128))
                  ])
                ]),
                createVNode("div", { class: "col-span-7" }, [
                  unref(activeTab) === "colaboradores" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createVNode("h3", { class: "mb-4 font-semibold" }, " Tarefas de " + toDisplayString(unref(selectedMember)), 1),
                    createVNode("div", { class: "space-y-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(memberTasks), (task) => {
                        return openBlock(), createBlock("div", {
                          key: task.name,
                          class: "flex items-center gap-6 overflow-hidden rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                        }, [
                          createVNode("div", { class: "flex min-w-0 flex-1 items-center gap-3" }, [
                            createVNode(_component_UAvatar, { size: "md" }),
                            createVNode("div", { class: "min-w-0" }, [
                              createVNode("p", { class: "truncate font-medium" }, toDisplayString(task.name), 1),
                              createVNode("p", { class: "text-xs text-slate-500" }, " Prioridade: " + toDisplayString(task.priority), 1)
                            ])
                          ]),
                          createVNode(_component_UBadge, {
                            class: "shrink-0",
                            color: task.status === "Concluída" ? "success" : task.status === "Atrasada" ? "error" : "primary",
                            variant: "soft"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(task.status), 1)
                            ]),
                            _: 2
                          }, 1032, ["color"]),
                          createVNode("div", { class: "w-24 shrink-0 text-sm text-slate-500" }, toDisplayString(task.deadline), 1)
                        ]);
                      }), 128))
                    ])
                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                    createVNode("h3", { class: "mb-4 font-semibold" }, " Colaboradores da tarefa "),
                    createVNode("div", { class: "space-y-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(taskMembers), (member) => {
                        return openBlock(), createBlock("div", {
                          key: member.name,
                          class: "rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                        }, [
                          createVNode("p", { class: "font-medium" }, toDisplayString(member.name), 1),
                          createVNode("p", { class: "text-sm text-slate-500" }, toDisplayString(member.role), 1)
                        ]);
                      }), 128))
                    ])
                  ], 64))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/gestor/equipes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=equipes-BoClxRZv.mjs.map
