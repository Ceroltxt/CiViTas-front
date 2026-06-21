import { useSlots, toRef, computed, unref, mergeProps, withCtx, renderSlot, toHandlers, openBlock, createBlock, createCommentVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { f as defu } from '../_/nitro.mjs';
import { M as useComponentProps, J as useAppConfig, S as useForwardProps, Y as usePortal, I as tv, F as FieldGroupReset } from './server.mjs';
import { H as HoverCard, P as Popover } from './index-C8l8nrqu.mjs';
import { reactivePick } from '@vueuse/core';
import { p as pointerDownOutside } from './overlay-CjyBzL1C.mjs';

const theme = {
  "slots": {
    "content": "bg-default shadow-lg rounded-md ring ring-default data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-popover-content-transform-origin) focus:outline-none pointer-events-auto",
    "arrow": "fill-bg stroke-default"
  }
};
const _sfc_main = {
  __name: "UPopover",
  __ssrInlineRender: true,
  props: {
    mode: { type: null, required: false, default: "click" },
    content: { type: Object, required: false },
    arrow: { type: [Boolean, Object], required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    reference: { type: null, required: false },
    dismissible: { type: Boolean, required: false, default: true },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    defaultOpen: { type: Boolean, required: false },
    open: { type: Boolean, required: false },
    modal: { type: Boolean, required: false },
    openDelay: { type: Number, required: false, default: 0 },
    closeDelay: { type: Number, required: false, default: 0 }
  },
  emits: ["close:prevent", "update:open"],
  setup(__props, { emit: __emit }) {
    const _props = __props;
    const emits = __emit;
    const slots = useSlots();
    const props = useComponentProps("popover", _props);
    const appConfig = useAppConfig();
    const pick = props.mode === "hover" ? reactivePick(props, "defaultOpen", "open", "openDelay", "closeDelay") : reactivePick(props, "defaultOpen", "open", "modal");
    const rootProps = useForwardProps(pick, emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8 }));
    const contentEvents = computed(() => {
      if (!props.dismissible) {
        const events = ["interactOutside", "escapeKeyDown"];
        return events.reduce((acc, curr) => {
          acc[curr] = (e) => {
            e.preventDefault();
            emits("close:prevent");
          };
          return acc;
        }, {});
      }
      return {
        pointerDownOutside
      };
    });
    const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.popover || {} })({
      side: contentProps.value.side
    }));
    const Component = computed(() => props.mode === "hover" ? HoverCard : Popover);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Component).Root, mergeProps(unref(rootProps), _attrs), {
        default: withCtx(({ open, close }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.default || !!unref(props).reference) {
              _push2(ssrRenderComponent(unref(Component).Trigger, {
                "as-child": "",
                reference: unref(props).reference,
                class: unref(props).class
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", { open }, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", { open })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if ("Anchor" in Component.value && !!slots.anchor) {
              _push2(ssrRenderComponent(unref(Component).Anchor, { "as-child": "" }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "anchor", close ? { close } : {}, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "anchor", close ? { close } : {})
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(Component).Portal, unref(portalProps), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(FieldGroupReset), null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Component).Content, mergeProps(contentProps.value, {
                          "data-slot": "content",
                          class: ui.value.content({ class: [!slots.default && unref(props).class, unref(props).ui?.content] })
                        }, toHandlers(contentEvents.value)), {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              ssrRenderSlot(_ctx.$slots, "content", close ? { close } : {}, null, _push5, _parent5, _scopeId4);
                              if (!!unref(props).arrow) {
                                _push5(ssrRenderComponent(unref(Component).Arrow, mergeProps(arrowProps.value, {
                                  "data-slot": "arrow",
                                  class: ui.value.arrow({ class: unref(props).ui?.arrow })
                                }), null, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                renderSlot(_ctx.$slots, "content", close ? { close } : {}),
                                !!unref(props).arrow ? (openBlock(), createBlock(unref(Component).Arrow, mergeProps({ key: 0 }, arrowProps.value, {
                                  "data-slot": "arrow",
                                  class: ui.value.arrow({ class: unref(props).ui?.arrow })
                                }), null, 16, ["class"])) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Component).Content, mergeProps(contentProps.value, {
                            "data-slot": "content",
                            class: ui.value.content({ class: [!slots.default && unref(props).class, unref(props).ui?.content] })
                          }, toHandlers(contentEvents.value)), {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "content", close ? { close } : {}),
                              !!unref(props).arrow ? (openBlock(), createBlock(unref(Component).Arrow, mergeProps({ key: 0 }, arrowProps.value, {
                                "data-slot": "arrow",
                                class: ui.value.arrow({ class: unref(props).ui?.arrow })
                              }), null, 16, ["class"])) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1040, ["class"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(FieldGroupReset), null, {
                      default: withCtx(() => [
                        createVNode(unref(Component).Content, mergeProps(contentProps.value, {
                          "data-slot": "content",
                          class: ui.value.content({ class: [!slots.default && unref(props).class, unref(props).ui?.content] })
                        }, toHandlers(contentEvents.value)), {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, "content", close ? { close } : {}),
                            !!unref(props).arrow ? (openBlock(), createBlock(unref(Component).Arrow, mergeProps({ key: 0 }, arrowProps.value, {
                              "data-slot": "arrow",
                              class: ui.value.arrow({ class: unref(props).ui?.arrow })
                            }), null, 16, ["class"])) : createCommentVNode("", true)
                          ]),
                          _: 2
                        }, 1040, ["class"])
                      ]),
                      _: 2
                    }, 1024)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              !!slots.default || !!unref(props).reference ? (openBlock(), createBlock(unref(Component).Trigger, {
                key: 0,
                "as-child": "",
                reference: unref(props).reference,
                class: unref(props).class
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", { open })
                ]),
                _: 2
              }, 1032, ["reference", "class"])) : createCommentVNode("", true),
              "Anchor" in Component.value && !!slots.anchor ? (openBlock(), createBlock(unref(Component).Anchor, {
                key: 1,
                "as-child": ""
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "anchor", close ? { close } : {})
                ]),
                _: 2
              }, 1024)) : createCommentVNode("", true),
              createVNode(unref(Component).Portal, unref(portalProps), {
                default: withCtx(() => [
                  createVNode(unref(FieldGroupReset), null, {
                    default: withCtx(() => [
                      createVNode(unref(Component).Content, mergeProps(contentProps.value, {
                        "data-slot": "content",
                        class: ui.value.content({ class: [!slots.default && unref(props).class, unref(props).ui?.content] })
                      }, toHandlers(contentEvents.value)), {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "content", close ? { close } : {}),
                          !!unref(props).arrow ? (openBlock(), createBlock(unref(Component).Arrow, mergeProps({ key: 0 }, arrowProps.value, {
                            "data-slot": "arrow",
                            class: ui.value.arrow({ class: unref(props).ui?.arrow })
                          }), null, 16, ["class"])) : createCommentVNode("", true)
                        ]),
                        _: 2
                      }, 1040, ["class"])
                    ]),
                    _: 2
                  }, 1024)
                ]),
                _: 2
              }, 1040)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Popover.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Popover-Dn1k2Q3g.mjs.map
