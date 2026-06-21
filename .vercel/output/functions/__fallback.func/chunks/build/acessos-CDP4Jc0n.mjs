import { _ as _sfc_main$1 } from './Modal-DrlsEEos.mjs';
import { a1 as useToast, d as _sfc_main$8, e as _sfc_main$b } from './server.mjs';
import { _ as _sfc_main$2 } from './FormField-DHBPFucc.mjs';
import { _ as _sfc_main$3 } from './Input-BsVJ6KLu.mjs';
import { _ as _sfc_main$4 } from './DropdownMenu-CRLH50FN.mjs';
import { _ as _sfc_main$5 } from './Table-CV2h7AlW.mjs';
import { defineComponent, ref, resolveComponent, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { useClipboard } from '@vueuse/core';
import './utils-CJXk8l7g.mjs';
import '@vueuse/shared';
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
import 'aria-hidden';
import './useId-Df0AxZi5.mjs';
import './overlay-CjyBzL1C.mjs';
import 'pinia';
import 'vue-router';
import '@vue/shared';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import './Label-Bz9RXRS1.mjs';
import './index-C8l8nrqu.mjs';
import '@internationalized/date';
import './useDirection-B3h_OC89.mjs';
import './PopperArrow-C07et48U.mjs';
import '@floating-ui/vue';
import './RovingFocusGroup-Dpm1zhJB.mjs';
import '@tanstack/vue-table';
import '@tanstack/vue-virtual';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "acessos",
  __ssrInlineRender: true,
  setup(__props) {
    const toast = useToast();
    const { copy } = useClipboard();
    const data = ref([
      {
        id: 1,
        name: "Lindsay Walton",
        position: "Front-end Developer",
        email: "lindsay.walton@example.com",
        role: "Colaborador"
      },
      {
        id: 2,
        name: "Courtney Henry",
        position: "Designer",
        email: "courtney.henry@example.com",
        role: "Colaborador"
      },
      {
        id: 3,
        name: "Tom Cook",
        position: "Diretor de produção",
        email: "tom.cook@example.com",
        role: "Colaborador"
      },
      {
        id: 4,
        name: "Whitney Francis",
        position: "Copywriter",
        email: "whitney.francis@example.com",
        role: "Colaborador"
      },
      {
        id: 5,
        name: "Leonard Krasner",
        position: "Senior Designer",
        email: "leonard.krasner@example.com",
        role: "Administrador"
      },
      {
        id: 6,
        name: "Floyd Miles",
        position: "Principal Designer",
        email: "floyd.miles@example.com",
        role: "Gestor"
      }
    ]);
    const columns = [
      {
        accessorKey: "id",
        header: "ID"
      },
      {
        accessorKey: "name",
        header: "Name"
      },
      {
        accessorKey: "email",
        header: "Email"
      },
      {
        accessorKey: "role",
        header: "Role"
      },
      {
        id: "action"
      }
    ];
    function getDropdownActions(user) {
      return [
        [
          {
            label: "Copy user Id",
            icon: "i-heroicons-document-duplicate",
            onSelect: () => {
              copy(user.id.toString());
              toast.add({
                title: "User ID copied to clipboard!",
                color: "success",
                icon: "i-heroicons-circle-check"
              });
            }
          }
        ],
        [
          {
            label: "Edit",
            icon: "i-heroicons-pencil"
          },
          {
            label: "Delete",
            icon: "i-heroicons-trash",
            color: "error"
          }
        ]
      ];
    }
    const items = [
      [
        {
          label: "View",
          icon: "i-heroicons-eye"
        },
        {
          label: "Copy",
          icon: "i-heroicons-document-duplicate"
        },
        {
          label: "Edit",
          icon: "i-heroicons-pencil"
        }
      ],
      [
        {
          label: "Delete",
          color: "error",
          icon: "i-heroicons-trash"
        }
      ]
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$1;
      const _component_UButton = _sfc_main$8;
      const _component_Placeholder = resolveComponent("Placeholder");
      const _component_UFormField = _sfc_main$2;
      const _component_UInput = _sfc_main$3;
      const _component_UDropdownMenu = _sfc_main$4;
      const _component_UTable = _sfc_main$5;
      const _component_UAvatar = _sfc_main$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl space-y-5 p-4 sm:p-6 dark:bg-slate-900 h-full" }, _attrs))}><div class="flex items-center justify-between md:flex-col lg:flex-row gap-4"><h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Acessos</h1><div class="flex items-center justify-end gap-2">`);
      _push(ssrRenderComponent(_component_UModal, { title: "Convidar novo colaborador" }, {
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Placeholder, { class: "h-48" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Email" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, { placeholder: "Enter your email" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, { placeholder: "Enter your email" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Placeholder, { class: "h-48" }),
              createVNode(_component_UFormField, { label: "Email" }, {
                default: withCtx(() => [
                  createVNode(_component_UInput, { placeholder: "Enter your email" })
                ]),
                _: 1
              })
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              label: "Convidar novo colaborador",
              "trailing-icon": "i-heroicons-plus",
              size: "md",
              color: "secondary",
              variant: "subtle"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                label: "Convidar novo colaborador",
                "trailing-icon": "i-heroicons-plus",
                size: "md",
                color: "secondary",
                variant: "subtle"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UDropdownMenu, {
        items,
        ui: { content: "w-(--reka-dropdown-menu-trigger-width)" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              class: "w-16 border-2 border-slate-200 dark:border-slate-700",
              color: "neutral",
              variant: "soft",
              block: "",
              "trailing-icon": "i-heroicons-chevron-down",
              avatar: {
                src: "https://github.com/nuxt.png",
                loading: "lazy"
              },
              size: "md"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                class: "w-16 border-2 border-slate-200 dark:border-slate-700",
                color: "neutral",
                variant: "soft",
                block: "",
                "trailing-icon": "i-heroicons-chevron-down",
                avatar: {
                  src: "https://github.com/nuxt.png",
                  loading: "lazy"
                },
                size: "md"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="flex flex-col gap-4"><ul class="flex items-center gap-2"><li>`);
      _push(ssrRenderComponent(_component_UButton, {
        size: "md",
        color: "secondary",
        variant: "solid"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Todos`);
          } else {
            return [
              createTextVNode("Todos")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_UButton, {
        size: "md",
        color: "secondary",
        variant: "subtle"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Administradores`);
          } else {
            return [
              createTextVNode("Administradores")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_UButton, {
        size: "md",
        color: "secondary",
        variant: "subtle"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Gestores`);
          } else {
            return [
              createTextVNode("Gestores")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_UButton, {
        size: "md",
        color: "secondary",
        variant: "subtle"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Colaboradores`);
          } else {
            return [
              createTextVNode("Colaboradores")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul>`);
      _push(ssrRenderComponent(_component_UTable, {
        data: unref(data),
        columns,
        class: "flex-1"
      }, {
        "name-cell": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UAvatar, {
              src: `https://i.pravatar.cc/120?img=${row.original.id}`,
              size: "lg",
              loading: "lazy",
              alt: `${row.original.name} avatar`
            }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><p class="font-medium text-highlighted"${_scopeId}>${ssrInterpolate(row.original.name)}</p><p${_scopeId}>${ssrInterpolate(row.original.position)}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-3" }, [
                createVNode(_component_UAvatar, {
                  src: `https://i.pravatar.cc/120?img=${row.original.id}`,
                  size: "lg",
                  loading: "lazy",
                  alt: `${row.original.name} avatar`
                }, null, 8, ["src", "alt"]),
                createVNode("div", null, [
                  createVNode("p", { class: "font-medium text-highlighted" }, toDisplayString(row.original.name), 1),
                  createVNode("p", null, toDisplayString(row.original.position), 1)
                ])
              ])
            ];
          }
        }),
        "action-cell": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UDropdownMenu, {
              items: getDropdownActions(row.original)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UButton, {
                    icon: "i-heroicons-ellipsis-vertical",
                    color: "neutral",
                    variant: "ghost",
                    "aria-label": "Actions"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UButton, {
                      icon: "i-heroicons-ellipsis-vertical",
                      color: "neutral",
                      variant: "ghost",
                      "aria-label": "Actions"
                    })
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UDropdownMenu, {
                items: getDropdownActions(row.original)
              }, {
                default: withCtx(() => [
                  createVNode(_component_UButton, {
                    icon: "i-heroicons-ellipsis-vertical",
                    color: "neutral",
                    variant: "ghost",
                    "aria-label": "Actions"
                  })
                ]),
                _: 1
              }, 8, ["items"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/acessos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=acessos-CDP4Jc0n.mjs.map
