import { useSlots, useId, useAttrs, computed, unref, mergeProps, withCtx, openBlock, createBlock, Fragment, createCommentVNode, createVNode, renderSlot, createTextVNode, toDisplayString, defineComponent, toRefs, withKeys, withModifiers, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { M as useComponentProps, J as useAppConfig, S as useForwardProps, Q as useFormField, I as tv, b as Primitive, f as _sfc_main$d, R as useForwardExpose, k as createContext } from './server.mjs';
import { L as Label_default } from './Label-Bz9RXRS1.mjs';
import { u as useFormControl } from './useFormControl-9B1GcqCr.mjs';
import { V as VisuallyHiddenInput_default } from './VisuallyHiddenInput-_jZmJXfe.mjs';
import { reactivePick, useVModel } from '@vueuse/core';

const [injectSwitchRootContext, provideSwitchRootContext] = /* @__PURE__ */ createContext("SwitchRoot");
var SwitchRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "SwitchRoot",
  props: {
    defaultValue: {
      type: null,
      required: false
    },
    modelValue: {
      type: null,
      required: false,
      default: void 0
    },
    disabled: {
      type: Boolean,
      required: false
    },
    id: {
      type: String,
      required: false
    },
    value: {
      type: String,
      required: false,
      default: "on"
    },
    trueValue: {
      type: null,
      required: false,
      default: () => true
    },
    falseValue: {
      type: null,
      required: false,
      default: () => false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    },
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { disabled } = toRefs(props);
    const modelValue = useVModel(props, "modelValue", emit, {
      defaultValue: props.defaultValue ?? props.falseValue,
      passive: props.modelValue === void 0
    });
    const checked = computed(() => modelValue.value === props.trueValue);
    function toggleCheck() {
      if (disabled.value) return;
      modelValue.value = checked.value ? props.falseValue : props.trueValue;
    }
    const { forwardRef, currentElement } = useForwardExpose();
    const isFormControl = useFormControl(currentElement);
    const ariaLabel = computed(() => props.id && currentElement.value ? (void 0).querySelector(`[for="${props.id}"]`)?.innerText : void 0);
    provideSwitchRootContext({
      checked,
      toggleCheck,
      disabled
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(_ctx.$attrs, {
        id: _ctx.id,
        ref: unref(forwardRef),
        role: "switch",
        type: _ctx.as === "button" ? "button" : void 0,
        value: _ctx.value,
        "aria-label": _ctx.$attrs["aria-label"] || ariaLabel.value,
        "aria-checked": checked.value,
        "aria-required": _ctx.required,
        "data-state": checked.value ? "checked" : "unchecked",
        "data-disabled": unref(disabled) ? "" : void 0,
        "as-child": _ctx.asChild,
        as: _ctx.as,
        disabled: unref(disabled),
        onClick: toggleCheck,
        onKeydown: withKeys(withModifiers(toggleCheck, ["prevent"]), ["enter"])
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
          modelValue: unref(modelValue),
          checked: checked.value
        }), unref(isFormControl) && _ctx.name ? (openBlock(), createBlock(unref(VisuallyHiddenInput_default), {
          key: 0,
          type: "checkbox",
          name: _ctx.name,
          disabled: unref(disabled),
          required: _ctx.required,
          value: _ctx.value,
          checked: checked.value
        }, null, 8, [
          "name",
          "disabled",
          "required",
          "value",
          "checked"
        ])) : createCommentVNode("v-if", true)]),
        _: 3
      }, 16, [
        "id",
        "type",
        "value",
        "aria-label",
        "aria-checked",
        "aria-required",
        "data-state",
        "data-disabled",
        "as-child",
        "as",
        "disabled",
        "onKeydown"
      ]);
    };
  }
});
var SwitchRoot_default = SwitchRoot_vue_vue_type_script_setup_true_lang_default;
var SwitchThumb_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "SwitchThumb",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "span"
    }
  },
  setup(__props) {
    const rootContext = injectSwitchRootContext();
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        "data-state": unref(rootContext).checked.value ? "checked" : "unchecked",
        "data-disabled": unref(rootContext).disabled.value ? "" : void 0,
        "as-child": _ctx.asChild,
        as: _ctx.as
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "data-state",
        "data-disabled",
        "as-child",
        "as"
      ]);
    };
  }
});
var SwitchThumb_default = SwitchThumb_vue_vue_type_script_setup_true_lang_default;
const theme = {
  "slots": {
    "root": "relative flex items-start",
    "base": [
      "inline-flex items-center shrink-0 rounded-full border-2 border-transparent focus-visible:outline-2 focus-visible:outline-offset-2 data-[state=unchecked]:bg-accented",
      "transition-[background] duration-200"
    ],
    "container": "flex items-center",
    "thumb": "group pointer-events-none rounded-full bg-default shadow-lg ring-0 transition-transform duration-200 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:rtl:-translate-x-0 flex items-center justify-center",
    "icon": [
      "absolute shrink-0 group-data-[state=unchecked]:text-dimmed opacity-0 size-10/12",
      "transition-[color,opacity] duration-200"
    ],
    "wrapper": "ms-2",
    "label": "block font-medium text-default",
    "description": "text-muted"
  },
  "variants": {
    "color": {
      "primary": {
        "base": "data-[state=checked]:bg-primary focus-visible:outline-primary",
        "icon": "group-data-[state=checked]:text-primary"
      },
      "secondary": {
        "base": "data-[state=checked]:bg-secondary focus-visible:outline-secondary",
        "icon": "group-data-[state=checked]:text-secondary"
      },
      "success": {
        "base": "data-[state=checked]:bg-success focus-visible:outline-success",
        "icon": "group-data-[state=checked]:text-success"
      },
      "info": {
        "base": "data-[state=checked]:bg-info focus-visible:outline-info",
        "icon": "group-data-[state=checked]:text-info"
      },
      "warning": {
        "base": "data-[state=checked]:bg-warning focus-visible:outline-warning",
        "icon": "group-data-[state=checked]:text-warning"
      },
      "error": {
        "base": "data-[state=checked]:bg-error focus-visible:outline-error",
        "icon": "group-data-[state=checked]:text-error"
      },
      "neutral": {
        "base": "data-[state=checked]:bg-inverted focus-visible:outline-inverted",
        "icon": "group-data-[state=checked]:text-highlighted"
      }
    },
    "size": {
      "xs": {
        "base": "w-7",
        "container": "h-4",
        "thumb": "size-3 data-[state=checked]:translate-x-3 data-[state=checked]:rtl:-translate-x-3",
        "wrapper": "text-xs"
      },
      "sm": {
        "base": "w-8",
        "container": "h-4",
        "thumb": "size-3.5 data-[state=checked]:translate-x-3.5 data-[state=checked]:rtl:-translate-x-3.5",
        "wrapper": "text-xs"
      },
      "md": {
        "base": "w-9",
        "container": "h-5",
        "thumb": "size-4 data-[state=checked]:translate-x-4 data-[state=checked]:rtl:-translate-x-4",
        "wrapper": "text-sm"
      },
      "lg": {
        "base": "w-10",
        "container": "h-5",
        "thumb": "size-4.5 data-[state=checked]:translate-x-4.5 data-[state=checked]:rtl:-translate-x-4.5",
        "wrapper": "text-sm"
      },
      "xl": {
        "base": "w-11",
        "container": "h-6",
        "thumb": "size-5 data-[state=checked]:translate-x-5 data-[state=checked]:rtl:-translate-x-5",
        "wrapper": "text-base"
      }
    },
    "checked": {
      "true": {
        "icon": "group-data-[state=checked]:opacity-100"
      }
    },
    "unchecked": {
      "true": {
        "icon": "group-data-[state=unchecked]:opacity-100"
      }
    },
    "loading": {
      "true": {
        "icon": "animate-spin"
      }
    },
    "highlight": {
      "true": ""
    },
    "required": {
      "true": {
        "label": "after:content-['*'] after:ms-0.5 after:text-error"
      }
    },
    "disabled": {
      "true": {
        "root": "opacity-75",
        "base": "cursor-not-allowed",
        "label": "cursor-not-allowed",
        "description": "cursor-not-allowed"
      }
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "highlight": true,
      "class": {
        "base": "ring ring-primary"
      }
    },
    {
      "color": "secondary",
      "highlight": true,
      "class": {
        "base": "ring ring-secondary"
      }
    },
    {
      "color": "success",
      "highlight": true,
      "class": {
        "base": "ring ring-success"
      }
    },
    {
      "color": "info",
      "highlight": true,
      "class": {
        "base": "ring ring-info"
      }
    },
    {
      "color": "warning",
      "highlight": true,
      "class": {
        "base": "ring ring-warning"
      }
    },
    {
      "color": "error",
      "highlight": true,
      "class": {
        "base": "ring ring-error"
      }
    },
    {
      "color": "neutral",
      "highlight": true,
      "class": {
        "base": "ring ring-inverted"
      }
    }
  ],
  "defaultVariants": {
    "color": "primary",
    "size": "md"
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "USwitch",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    color: { type: null, required: false },
    size: { type: null, required: false },
    highlight: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false },
    checkedIcon: { type: null, required: false },
    uncheckedIcon: { type: null, required: false },
    label: { type: String, required: false },
    description: { type: String, required: false },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    disabled: { type: Boolean, required: false },
    id: { type: String, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
    value: { type: String, required: false },
    defaultValue: { type: null, required: false },
    modelValue: { type: null, required: false },
    trueValue: { type: null, required: false },
    falseValue: { type: null, required: false }
  },
  emits: ["change", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    const _props = __props;
    const slots = useSlots();
    const emits = __emit;
    const props = useComponentProps("switch", _props);
    const appConfig = useAppConfig();
    const rootProps = useForwardProps(reactivePick(props, "required", "value", "defaultValue", "modelValue", "trueValue", "falseValue"), emits);
    const { id: _id, emitFormChange, emitFormInput, size, color, highlight, name, disabled, ariaAttrs } = useFormField(_props);
    const id = _id.value ?? useId();
    const attrs = useAttrs();
    const forwardedAttrs = computed(() => {
      const { "data-state": _, ...rest } = attrs;
      return rest;
    });
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.switch || {} })({
      size: size.value ?? props.size,
      color: color.value ?? props.color,
      highlight: highlight.value ?? props.highlight,
      required: props.required,
      loading: props.loading,
      disabled: disabled.value || props.loading
    }));
    function onUpdate(value) {
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
      emitFormInput();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: unref(props).as,
        "data-slot": "root",
        class: ui.value.root({ class: [unref(props).ui?.root, unref(props).class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-slot="container" class="${ssrRenderClass(ui.value.container({ class: unref(props).ui?.container }))}"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(SwitchRoot_default), mergeProps({ id: unref(id) }, { ...unref(rootProps), ...forwardedAttrs.value, ...unref(ariaAttrs) }, {
              name: unref(name),
              disabled: unref(disabled) || unref(props).loading,
              "data-slot": "base",
              class: ui.value.base({ class: unref(props).ui?.base }),
              "onUpdate:modelValue": onUpdate
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(SwitchThumb_default), {
                    "data-slot": "thumb",
                    class: ui.value.thumb({ class: unref(props).ui?.thumb })
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (unref(props).loading) {
                          _push4(ssrRenderComponent(_sfc_main$d, {
                            name: unref(props).loadingIcon || unref(appConfig).ui.icons.loading,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: unref(props).ui?.icon, checked: true, unchecked: true })
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!--[-->`);
                          if (unref(props).checkedIcon) {
                            _push4(ssrRenderComponent(_sfc_main$d, {
                              name: unref(props).checkedIcon,
                              "data-slot": "icon",
                              class: ui.value.icon({ class: unref(props).ui?.icon, checked: true })
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          if (unref(props).uncheckedIcon) {
                            _push4(ssrRenderComponent(_sfc_main$d, {
                              name: unref(props).uncheckedIcon,
                              "data-slot": "icon",
                              class: ui.value.icon({ class: unref(props).ui?.icon, unchecked: true })
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`<!--]-->`);
                        }
                      } else {
                        return [
                          unref(props).loading ? (openBlock(), createBlock(_sfc_main$d, {
                            key: 0,
                            name: unref(props).loadingIcon || unref(appConfig).ui.icons.loading,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: unref(props).ui?.icon, checked: true, unchecked: true })
                          }, null, 8, ["name", "class"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                            unref(props).checkedIcon ? (openBlock(), createBlock(_sfc_main$d, {
                              key: 0,
                              name: unref(props).checkedIcon,
                              "data-slot": "icon",
                              class: ui.value.icon({ class: unref(props).ui?.icon, checked: true })
                            }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                            unref(props).uncheckedIcon ? (openBlock(), createBlock(_sfc_main$d, {
                              key: 1,
                              name: unref(props).uncheckedIcon,
                              "data-slot": "icon",
                              class: ui.value.icon({ class: unref(props).ui?.icon, unchecked: true })
                            }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                          ], 64))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(SwitchThumb_default), {
                      "data-slot": "thumb",
                      class: ui.value.thumb({ class: unref(props).ui?.thumb })
                    }, {
                      default: withCtx(() => [
                        unref(props).loading ? (openBlock(), createBlock(_sfc_main$d, {
                          key: 0,
                          name: unref(props).loadingIcon || unref(appConfig).ui.icons.loading,
                          "data-slot": "icon",
                          class: ui.value.icon({ class: unref(props).ui?.icon, checked: true, unchecked: true })
                        }, null, 8, ["name", "class"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                          unref(props).checkedIcon ? (openBlock(), createBlock(_sfc_main$d, {
                            key: 0,
                            name: unref(props).checkedIcon,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: unref(props).ui?.icon, checked: true })
                          }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                          unref(props).uncheckedIcon ? (openBlock(), createBlock(_sfc_main$d, {
                            key: 1,
                            name: unref(props).uncheckedIcon,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: unref(props).ui?.icon, unchecked: true })
                          }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                        ], 64))
                      ]),
                      _: 1
                    }, 8, ["class"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (unref(props).label || !!slots.label || (unref(props).description || !!slots.description)) {
              _push2(`<div data-slot="wrapper" class="${ssrRenderClass(ui.value.wrapper({ class: unref(props).ui?.wrapper }))}"${_scopeId}>`);
              if (unref(props).label || !!slots.label) {
                _push2(ssrRenderComponent(unref(Label_default), {
                  for: unref(id),
                  "data-slot": "label",
                  class: ui.value.label({ class: unref(props).ui?.label })
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      ssrRenderSlot(_ctx.$slots, "label", {
                        label: unref(props).label
                      }, () => {
                        _push3(`${ssrInterpolate(unref(props).label)}`);
                      }, _push3, _parent3, _scopeId2);
                    } else {
                      return [
                        renderSlot(_ctx.$slots, "label", {
                          label: unref(props).label
                        }, () => [
                          createTextVNode(toDisplayString(unref(props).label), 1)
                        ])
                      ];
                    }
                  }),
                  _: 3
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (unref(props).description || !!slots.description) {
                _push2(`<p data-slot="description" class="${ssrRenderClass(ui.value.description({ class: unref(props).ui?.description }))}"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, "description", {
                  description: unref(props).description
                }, () => {
                  _push2(`${ssrInterpolate(unref(props).description)}`);
                }, _push2, _parent2, _scopeId);
                _push2(`</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", {
                "data-slot": "container",
                class: ui.value.container({ class: unref(props).ui?.container })
              }, [
                createVNode(unref(SwitchRoot_default), mergeProps({ id: unref(id) }, { ...unref(rootProps), ...forwardedAttrs.value, ...unref(ariaAttrs) }, {
                  name: unref(name),
                  disabled: unref(disabled) || unref(props).loading,
                  "data-slot": "base",
                  class: ui.value.base({ class: unref(props).ui?.base }),
                  "onUpdate:modelValue": onUpdate
                }), {
                  default: withCtx(() => [
                    createVNode(unref(SwitchThumb_default), {
                      "data-slot": "thumb",
                      class: ui.value.thumb({ class: unref(props).ui?.thumb })
                    }, {
                      default: withCtx(() => [
                        unref(props).loading ? (openBlock(), createBlock(_sfc_main$d, {
                          key: 0,
                          name: unref(props).loadingIcon || unref(appConfig).ui.icons.loading,
                          "data-slot": "icon",
                          class: ui.value.icon({ class: unref(props).ui?.icon, checked: true, unchecked: true })
                        }, null, 8, ["name", "class"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                          unref(props).checkedIcon ? (openBlock(), createBlock(_sfc_main$d, {
                            key: 0,
                            name: unref(props).checkedIcon,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: unref(props).ui?.icon, checked: true })
                          }, null, 8, ["name", "class"])) : createCommentVNode("", true),
                          unref(props).uncheckedIcon ? (openBlock(), createBlock(_sfc_main$d, {
                            key: 1,
                            name: unref(props).uncheckedIcon,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: unref(props).ui?.icon, unchecked: true })
                          }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                        ], 64))
                      ]),
                      _: 1
                    }, 8, ["class"])
                  ]),
                  _: 1
                }, 16, ["id", "name", "disabled", "class"])
              ], 2),
              unref(props).label || !!slots.label || (unref(props).description || !!slots.description) ? (openBlock(), createBlock("div", {
                key: 0,
                "data-slot": "wrapper",
                class: ui.value.wrapper({ class: unref(props).ui?.wrapper })
              }, [
                unref(props).label || !!slots.label ? (openBlock(), createBlock(unref(Label_default), {
                  key: 0,
                  for: unref(id),
                  "data-slot": "label",
                  class: ui.value.label({ class: unref(props).ui?.label })
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "label", {
                      label: unref(props).label
                    }, () => [
                      createTextVNode(toDisplayString(unref(props).label), 1)
                    ])
                  ]),
                  _: 3
                }, 8, ["for", "class"])) : createCommentVNode("", true),
                unref(props).description || !!slots.description ? (openBlock(), createBlock("p", {
                  key: 1,
                  "data-slot": "description",
                  class: ui.value.description({ class: unref(props).ui?.description })
                }, [
                  renderSlot(_ctx.$slots, "description", {
                    description: unref(props).description
                  }, () => [
                    createTextVNode(toDisplayString(unref(props).description), 1)
                  ])
                ], 2)) : createCommentVNode("", true)
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Switch.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Switch-BvCOLRUI.mjs.map
