import { useSlots, computed, unref, mergeProps, withCtx, renderSlot, createVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, defineComponent, toRefs, normalizeProps, guardReactiveProps, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderList } from 'vue/server-renderer';
import { M as useComponentProps, X as useLocale, J as useAppConfig, S as useForwardProps, I as tv, d as _sfc_main$8, R as useForwardExpose, b as Primitive, k as createContext } from './server.mjs';
import { reactivePick, useVModel } from '@vueuse/core';

var PaginationEllipsis_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationEllipsis",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { "data-type": "ellipsis" }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[0] || (_cache[0] = createTextVNode("…"))])]),
        _: 3
      }, 16);
    };
  }
});
var PaginationEllipsis_default = PaginationEllipsis_vue_vue_type_script_setup_true_lang_default;
const [injectPaginationRootContext, providePaginationRootContext] = /* @__PURE__ */ createContext("PaginationRoot");
var PaginationRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationRoot",
  props: {
    page: {
      type: Number,
      required: false
    },
    defaultPage: {
      type: Number,
      required: false,
      default: 1
    },
    itemsPerPage: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: false,
      default: 0
    },
    siblingCount: {
      type: Number,
      required: false,
      default: 2
    },
    disabled: {
      type: Boolean,
      required: false
    },
    showEdges: {
      type: Boolean,
      required: false,
      default: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "nav"
    }
  },
  emits: ["update:page"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { siblingCount, disabled, showEdges } = toRefs(props);
    useForwardExpose();
    const page = useVModel(props, "page", emits, {
      defaultValue: props.defaultPage,
      passive: props.page === void 0
    });
    const pageCount = computed(() => Math.max(1, Math.ceil(props.total / (props.itemsPerPage || 1))));
    providePaginationRootContext({
      page,
      onPageChange(value) {
        page.value = value;
      },
      pageCount,
      siblingCount,
      disabled,
      showEdges
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        as: _ctx.as,
        "as-child": _ctx.asChild
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
          page: unref(page),
          pageCount: pageCount.value
        })]),
        _: 3
      }, 8, ["as", "as-child"]);
    };
  }
});
var PaginationRoot_default = PaginationRoot_vue_vue_type_script_setup_true_lang_default;
var PaginationFirst_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationFirst",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectPaginationRootContext();
    useForwardExpose();
    const disabled = computed(() => rootContext.page.value === 1 || rootContext.disabled.value);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        "aria-label": "First Page",
        type: _ctx.as === "button" ? "button" : void 0,
        disabled: disabled.value,
        onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(1))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[1] || (_cache[1] = createTextVNode("First page"))])]),
        _: 3
      }, 16, ["type", "disabled"]);
    };
  }
});
var PaginationFirst_default = PaginationFirst_vue_vue_type_script_setup_true_lang_default;
var PaginationLast_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationLast",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectPaginationRootContext();
    useForwardExpose();
    const disabled = computed(() => rootContext.page.value === rootContext.pageCount.value || rootContext.disabled.value);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        "aria-label": "Last Page",
        type: _ctx.as === "button" ? "button" : void 0,
        disabled: disabled.value,
        onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(unref(rootContext).pageCount.value))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[1] || (_cache[1] = createTextVNode("Last page"))])]),
        _: 3
      }, 16, ["type", "disabled"]);
    };
  }
});
var PaginationLast_default = PaginationLast_vue_vue_type_script_setup_true_lang_default;
function range(start, end) {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
}
function transform(items) {
  return items.map((value) => {
    if (typeof value === "number") return {
      type: "page",
      value
    };
    return { type: "ellipsis" };
  });
}
const ELLIPSIS = "ellipsis";
function getRange(currentPage, pageCount, siblingCount, showEdges) {
  const firstPageIndex = 1;
  const lastPageIndex = pageCount;
  const leftSiblingIndex = Math.max(currentPage - siblingCount, firstPageIndex);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, lastPageIndex);
  if (showEdges) {
    const totalPageNumbers = Math.min(2 * siblingCount + 5, pageCount);
    const itemCount = totalPageNumbers - 2;
    const showLeftEllipsis = leftSiblingIndex > firstPageIndex + 2 && Math.abs(lastPageIndex - itemCount - firstPageIndex + 1) > 2 && Math.abs(leftSiblingIndex - firstPageIndex) > 2;
    const showRightEllipsis = rightSiblingIndex < lastPageIndex - 2 && Math.abs(lastPageIndex - itemCount) > 2 && Math.abs(lastPageIndex - rightSiblingIndex) > 2;
    if (!showLeftEllipsis && showRightEllipsis) {
      const leftRange = range(1, itemCount);
      return [
        ...leftRange,
        ELLIPSIS,
        lastPageIndex
      ];
    }
    if (showLeftEllipsis && !showRightEllipsis) {
      const rightRange = range(lastPageIndex - itemCount + 1, lastPageIndex);
      return [
        firstPageIndex,
        ELLIPSIS,
        ...rightRange
      ];
    }
    if (showLeftEllipsis && showRightEllipsis) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [
        firstPageIndex,
        ELLIPSIS,
        ...middleRange,
        ELLIPSIS,
        lastPageIndex
      ];
    }
    const fullRange = range(firstPageIndex, lastPageIndex);
    return fullRange;
  } else {
    const itemCount = siblingCount * 2 + 1;
    if (pageCount < itemCount) return range(1, lastPageIndex);
    else if (currentPage <= siblingCount + 1) return range(firstPageIndex, itemCount);
    else if (pageCount - currentPage <= siblingCount) return range(pageCount - itemCount + 1, lastPageIndex);
    else return range(leftSiblingIndex, rightSiblingIndex);
  }
}
var PaginationList_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationList",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const rootContext = injectPaginationRootContext();
    const transformedRange = computed(() => {
      return transform(getRange(rootContext.page.value, rootContext.pageCount.value, rootContext.siblingCount.value, rootContext.showEdges.value));
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { items: transformedRange.value })]),
        _: 3
      }, 16);
    };
  }
});
var PaginationList_default = PaginationList_vue_vue_type_script_setup_true_lang_default;
var PaginationListItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationListItem",
  props: {
    value: {
      type: Number,
      required: true
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const rootContext = injectPaginationRootContext();
    const isSelected = computed(() => rootContext.page.value === props.value);
    const disabled = computed(() => rootContext.disabled.value);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        "data-type": "page",
        "aria-label": `Page ${_ctx.value}`,
        "aria-current": isSelected.value ? "page" : void 0,
        "data-selected": isSelected.value ? "true" : void 0,
        disabled: disabled.value,
        type: _ctx.as === "button" ? "button" : void 0,
        onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(_ctx.value))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(_ctx.value), 1)])]),
        _: 3
      }, 16, [
        "aria-label",
        "aria-current",
        "data-selected",
        "disabled",
        "type"
      ]);
    };
  }
});
var PaginationListItem_default = PaginationListItem_vue_vue_type_script_setup_true_lang_default;
var PaginationNext_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationNext",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const rootContext = injectPaginationRootContext();
    const disabled = computed(() => rootContext.page.value === rootContext.pageCount.value || rootContext.disabled.value);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        "aria-label": "Next Page",
        type: _ctx.as === "button" ? "button" : void 0,
        disabled: disabled.value,
        onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(unref(rootContext).page.value + 1))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[1] || (_cache[1] = createTextVNode("Next page"))])]),
        _: 3
      }, 16, ["type", "disabled"]);
    };
  }
});
var PaginationNext_default = PaginationNext_vue_vue_type_script_setup_true_lang_default;
var PaginationPrev_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PaginationPrev",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const rootContext = injectPaginationRootContext();
    const disabled = computed(() => rootContext.page.value === 1 || rootContext.disabled.value);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        "aria-label": "Previous Page",
        type: _ctx.as === "button" ? "button" : void 0,
        disabled: disabled.value,
        onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(unref(rootContext).page.value - 1))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[1] || (_cache[1] = createTextVNode("Prev page"))])]),
        _: 3
      }, 16, ["type", "disabled"]);
    };
  }
});
var PaginationPrev_default = PaginationPrev_vue_vue_type_script_setup_true_lang_default;
const theme = {
  "slots": {
    "root": "",
    "list": "flex items-center gap-1",
    "ellipsis": "pointer-events-none",
    "label": "min-w-5 text-center",
    "first": "",
    "prev": "",
    "item": "",
    "next": "",
    "last": ""
  }
};
const _sfc_main = {
  __name: "UPagination",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    firstIcon: { type: null, required: false },
    prevIcon: { type: null, required: false },
    nextIcon: { type: null, required: false },
    lastIcon: { type: null, required: false },
    ellipsisIcon: { type: null, required: false },
    color: { type: null, required: false, default: "neutral" },
    variant: { type: null, required: false, default: "outline" },
    activeColor: { type: null, required: false, default: "primary" },
    activeVariant: { type: null, required: false, default: "solid" },
    showControls: { type: Boolean, required: false, default: true },
    size: { type: null, required: false },
    to: { type: Function, required: false },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    defaultPage: { type: Number, required: false },
    disabled: { type: Boolean, required: false },
    itemsPerPage: { type: Number, required: false, default: 10 },
    page: { type: Number, required: false },
    showEdges: { type: Boolean, required: false, default: false },
    siblingCount: { type: Number, required: false, default: 2 },
    total: { type: Number, required: false, default: 0 }
  },
  emits: ["update:page"],
  setup(__props, { emit: __emit }) {
    const _props = __props;
    const emits = __emit;
    const slots = useSlots();
    const props = useComponentProps("pagination", _props);
    const { dir } = useLocale();
    const appConfig = useAppConfig();
    const rootProps = useForwardProps(reactivePick(props, "as", "defaultPage", "disabled", "itemsPerPage", "page", "showEdges", "siblingCount", "total"), emits);
    const firstIcon = computed(() => props.firstIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleRight : appConfig.ui.icons.chevronDoubleLeft));
    const prevIcon = computed(() => props.prevIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronRight : appConfig.ui.icons.chevronLeft));
    const nextIcon = computed(() => props.nextIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight));
    const lastIcon = computed(() => props.lastIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleLeft : appConfig.ui.icons.chevronDoubleRight));
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pagination || {} })());
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(PaginationRoot_default), mergeProps(unref(rootProps), {
        "data-slot": "root",
        class: ui.value.root({ class: [unref(props).ui?.root, unref(props).class] })
      }, _attrs), {
        default: withCtx(({ page, pageCount }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(PaginationList_default), {
              "data-slot": "list",
              class: ui.value.list({ class: unref(props).ui?.list })
            }, {
              default: withCtx(({ items }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(props).showControls || !!slots.first) {
                    _push3(ssrRenderComponent(unref(PaginationFirst_default), {
                      "as-child": "",
                      "data-slot": "first",
                      class: ui.value.first({ class: unref(props).ui?.first })
                    }, {
                      default: withCtx((_, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderSlot(_ctx.$slots, "first", {}, () => {
                            _push4(ssrRenderComponent(_sfc_main$8, {
                              color: unref(props).color,
                              variant: unref(props).variant,
                              size: unref(props).size,
                              icon: firstIcon.value,
                              to: unref(props).to?.(1)
                            }, null, _parent4, _scopeId3));
                          }, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "first", {}, () => [
                              createVNode(_sfc_main$8, {
                                color: unref(props).color,
                                variant: unref(props).variant,
                                size: unref(props).size,
                                icon: firstIcon.value,
                                to: unref(props).to?.(1)
                              }, null, 8, ["color", "variant", "size", "icon", "to"])
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(props).showControls || !!slots.prev) {
                    _push3(ssrRenderComponent(unref(PaginationPrev_default), {
                      "as-child": "",
                      "data-slot": "prev",
                      class: ui.value.prev({ class: unref(props).ui?.prev })
                    }, {
                      default: withCtx((_, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderSlot(_ctx.$slots, "prev", {}, () => {
                            _push4(ssrRenderComponent(_sfc_main$8, {
                              color: unref(props).color,
                              variant: unref(props).variant,
                              size: unref(props).size,
                              icon: prevIcon.value,
                              to: page > 1 ? unref(props).to?.(page - 1) : void 0
                            }, null, _parent4, _scopeId3));
                          }, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "prev", {}, () => [
                              createVNode(_sfc_main$8, {
                                color: unref(props).color,
                                variant: unref(props).variant,
                                size: unref(props).size,
                                icon: prevIcon.value,
                                to: page > 1 ? unref(props).to?.(page - 1) : void 0
                              }, null, 8, ["color", "variant", "size", "icon", "to"])
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<!--[-->`);
                  ssrRenderList(items, (item, index) => {
                    _push3(`<!--[-->`);
                    if (item.type === "page") {
                      _push3(ssrRenderComponent(unref(PaginationListItem_default), {
                        "as-child": "",
                        value: item.value,
                        "data-slot": "item",
                        class: ui.value.item({ class: unref(props).ui?.item })
                      }, {
                        default: withCtx((_, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            ssrRenderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, { item, index, page, pageCount }), () => {
                              _push4(ssrRenderComponent(_sfc_main$8, {
                                color: page === item.value ? unref(props).activeColor : unref(props).color,
                                variant: page === item.value ? unref(props).activeVariant : unref(props).variant,
                                size: unref(props).size,
                                label: String(item.value),
                                ui: { label: ui.value.label() },
                                to: unref(props).to?.(item.value),
                                square: ""
                              }, null, _parent4, _scopeId3));
                            }, _push4, _parent4, _scopeId3);
                          } else {
                            return [
                              renderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, { item, index, page, pageCount }), () => [
                                createVNode(_sfc_main$8, {
                                  color: page === item.value ? unref(props).activeColor : unref(props).color,
                                  variant: page === item.value ? unref(props).activeVariant : unref(props).variant,
                                  size: unref(props).size,
                                  label: String(item.value),
                                  ui: { label: ui.value.label() },
                                  to: unref(props).to?.(item.value),
                                  square: ""
                                }, null, 8, ["color", "variant", "size", "label", "ui", "to"])
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(ssrRenderComponent(unref(PaginationEllipsis_default), {
                        "as-child": "",
                        "data-slot": "ellipsis",
                        class: ui.value.ellipsis({ class: unref(props).ui?.ellipsis })
                      }, {
                        default: withCtx((_, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            ssrRenderSlot(_ctx.$slots, "ellipsis", { ui: ui.value }, () => {
                              _push4(ssrRenderComponent(_sfc_main$8, {
                                as: "div",
                                color: unref(props).color,
                                variant: unref(props).variant,
                                size: unref(props).size,
                                icon: unref(props).ellipsisIcon || unref(appConfig).ui.icons.ellipsis
                              }, null, _parent4, _scopeId3));
                            }, _push4, _parent4, _scopeId3);
                          } else {
                            return [
                              renderSlot(_ctx.$slots, "ellipsis", { ui: ui.value }, () => [
                                createVNode(_sfc_main$8, {
                                  as: "div",
                                  color: unref(props).color,
                                  variant: unref(props).variant,
                                  size: unref(props).size,
                                  icon: unref(props).ellipsisIcon || unref(appConfig).ui.icons.ellipsis
                                }, null, 8, ["color", "variant", "size", "icon"])
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    }
                    _push3(`<!--]-->`);
                  });
                  _push3(`<!--]-->`);
                  if (unref(props).showControls || !!slots.next) {
                    _push3(ssrRenderComponent(unref(PaginationNext_default), {
                      "as-child": "",
                      "data-slot": "next",
                      class: ui.value.next({ class: unref(props).ui?.next })
                    }, {
                      default: withCtx((_, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderSlot(_ctx.$slots, "next", {}, () => {
                            _push4(ssrRenderComponent(_sfc_main$8, {
                              color: unref(props).color,
                              variant: unref(props).variant,
                              size: unref(props).size,
                              icon: nextIcon.value,
                              to: page < pageCount ? unref(props).to?.(page + 1) : void 0
                            }, null, _parent4, _scopeId3));
                          }, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "next", {}, () => [
                              createVNode(_sfc_main$8, {
                                color: unref(props).color,
                                variant: unref(props).variant,
                                size: unref(props).size,
                                icon: nextIcon.value,
                                to: page < pageCount ? unref(props).to?.(page + 1) : void 0
                              }, null, 8, ["color", "variant", "size", "icon", "to"])
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(props).showControls || !!slots.last) {
                    _push3(ssrRenderComponent(unref(PaginationLast_default), {
                      "as-child": "",
                      "data-slot": "last",
                      class: ui.value.last({ class: unref(props).ui?.last })
                    }, {
                      default: withCtx((_, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderSlot(_ctx.$slots, "last", {}, () => {
                            _push4(ssrRenderComponent(_sfc_main$8, {
                              color: unref(props).color,
                              variant: unref(props).variant,
                              size: unref(props).size,
                              icon: lastIcon.value,
                              to: unref(props).to?.(pageCount)
                            }, null, _parent4, _scopeId3));
                          }, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "last", {}, () => [
                              createVNode(_sfc_main$8, {
                                color: unref(props).color,
                                variant: unref(props).variant,
                                size: unref(props).size,
                                icon: lastIcon.value,
                                to: unref(props).to?.(pageCount)
                              }, null, 8, ["color", "variant", "size", "icon", "to"])
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    unref(props).showControls || !!slots.first ? (openBlock(), createBlock(unref(PaginationFirst_default), {
                      key: 0,
                      "as-child": "",
                      "data-slot": "first",
                      class: ui.value.first({ class: unref(props).ui?.first })
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "first", {}, () => [
                          createVNode(_sfc_main$8, {
                            color: unref(props).color,
                            variant: unref(props).variant,
                            size: unref(props).size,
                            icon: firstIcon.value,
                            to: unref(props).to?.(1)
                          }, null, 8, ["color", "variant", "size", "icon", "to"])
                        ])
                      ]),
                      _: 3
                    }, 8, ["class"])) : createCommentVNode("", true),
                    unref(props).showControls || !!slots.prev ? (openBlock(), createBlock(unref(PaginationPrev_default), {
                      key: 1,
                      "as-child": "",
                      "data-slot": "prev",
                      class: ui.value.prev({ class: unref(props).ui?.prev })
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "prev", {}, () => [
                          createVNode(_sfc_main$8, {
                            color: unref(props).color,
                            variant: unref(props).variant,
                            size: unref(props).size,
                            icon: prevIcon.value,
                            to: page > 1 ? unref(props).to?.(page - 1) : void 0
                          }, null, 8, ["color", "variant", "size", "icon", "to"])
                        ])
                      ]),
                      _: 2
                    }, 1032, ["class"])) : createCommentVNode("", true),
                    (openBlock(true), createBlock(Fragment, null, renderList(items, (item, index) => {
                      return openBlock(), createBlock(Fragment, { key: index }, [
                        item.type === "page" ? (openBlock(), createBlock(unref(PaginationListItem_default), {
                          key: 0,
                          "as-child": "",
                          value: item.value,
                          "data-slot": "item",
                          class: ui.value.item({ class: unref(props).ui?.item })
                        }, {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, { item, index, page, pageCount }), () => [
                              createVNode(_sfc_main$8, {
                                color: page === item.value ? unref(props).activeColor : unref(props).color,
                                variant: page === item.value ? unref(props).activeVariant : unref(props).variant,
                                size: unref(props).size,
                                label: String(item.value),
                                ui: { label: ui.value.label() },
                                to: unref(props).to?.(item.value),
                                square: ""
                              }, null, 8, ["color", "variant", "size", "label", "ui", "to"])
                            ])
                          ]),
                          _: 2
                        }, 1032, ["value", "class"])) : (openBlock(), createBlock(unref(PaginationEllipsis_default), {
                          key: 1,
                          "as-child": "",
                          "data-slot": "ellipsis",
                          class: ui.value.ellipsis({ class: unref(props).ui?.ellipsis })
                        }, {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, "ellipsis", { ui: ui.value }, () => [
                              createVNode(_sfc_main$8, {
                                as: "div",
                                color: unref(props).color,
                                variant: unref(props).variant,
                                size: unref(props).size,
                                icon: unref(props).ellipsisIcon || unref(appConfig).ui.icons.ellipsis
                              }, null, 8, ["color", "variant", "size", "icon"])
                            ])
                          ]),
                          _: 3
                        }, 8, ["class"]))
                      ], 64);
                    }), 128)),
                    unref(props).showControls || !!slots.next ? (openBlock(), createBlock(unref(PaginationNext_default), {
                      key: 2,
                      "as-child": "",
                      "data-slot": "next",
                      class: ui.value.next({ class: unref(props).ui?.next })
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "next", {}, () => [
                          createVNode(_sfc_main$8, {
                            color: unref(props).color,
                            variant: unref(props).variant,
                            size: unref(props).size,
                            icon: nextIcon.value,
                            to: page < pageCount ? unref(props).to?.(page + 1) : void 0
                          }, null, 8, ["color", "variant", "size", "icon", "to"])
                        ])
                      ]),
                      _: 2
                    }, 1032, ["class"])) : createCommentVNode("", true),
                    unref(props).showControls || !!slots.last ? (openBlock(), createBlock(unref(PaginationLast_default), {
                      key: 3,
                      "as-child": "",
                      "data-slot": "last",
                      class: ui.value.last({ class: unref(props).ui?.last })
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "last", {}, () => [
                          createVNode(_sfc_main$8, {
                            color: unref(props).color,
                            variant: unref(props).variant,
                            size: unref(props).size,
                            icon: lastIcon.value,
                            to: unref(props).to?.(pageCount)
                          }, null, 8, ["color", "variant", "size", "icon", "to"])
                        ])
                      ]),
                      _: 2
                    }, 1032, ["class"])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(PaginationList_default), {
                "data-slot": "list",
                class: ui.value.list({ class: unref(props).ui?.list })
              }, {
                default: withCtx(({ items }) => [
                  unref(props).showControls || !!slots.first ? (openBlock(), createBlock(unref(PaginationFirst_default), {
                    key: 0,
                    "as-child": "",
                    "data-slot": "first",
                    class: ui.value.first({ class: unref(props).ui?.first })
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "first", {}, () => [
                        createVNode(_sfc_main$8, {
                          color: unref(props).color,
                          variant: unref(props).variant,
                          size: unref(props).size,
                          icon: firstIcon.value,
                          to: unref(props).to?.(1)
                        }, null, 8, ["color", "variant", "size", "icon", "to"])
                      ])
                    ]),
                    _: 3
                  }, 8, ["class"])) : createCommentVNode("", true),
                  unref(props).showControls || !!slots.prev ? (openBlock(), createBlock(unref(PaginationPrev_default), {
                    key: 1,
                    "as-child": "",
                    "data-slot": "prev",
                    class: ui.value.prev({ class: unref(props).ui?.prev })
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "prev", {}, () => [
                        createVNode(_sfc_main$8, {
                          color: unref(props).color,
                          variant: unref(props).variant,
                          size: unref(props).size,
                          icon: prevIcon.value,
                          to: page > 1 ? unref(props).to?.(page - 1) : void 0
                        }, null, 8, ["color", "variant", "size", "icon", "to"])
                      ])
                    ]),
                    _: 2
                  }, 1032, ["class"])) : createCommentVNode("", true),
                  (openBlock(true), createBlock(Fragment, null, renderList(items, (item, index) => {
                    return openBlock(), createBlock(Fragment, { key: index }, [
                      item.type === "page" ? (openBlock(), createBlock(unref(PaginationListItem_default), {
                        key: 0,
                        "as-child": "",
                        value: item.value,
                        "data-slot": "item",
                        class: ui.value.item({ class: unref(props).ui?.item })
                      }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, { item, index, page, pageCount }), () => [
                            createVNode(_sfc_main$8, {
                              color: page === item.value ? unref(props).activeColor : unref(props).color,
                              variant: page === item.value ? unref(props).activeVariant : unref(props).variant,
                              size: unref(props).size,
                              label: String(item.value),
                              ui: { label: ui.value.label() },
                              to: unref(props).to?.(item.value),
                              square: ""
                            }, null, 8, ["color", "variant", "size", "label", "ui", "to"])
                          ])
                        ]),
                        _: 2
                      }, 1032, ["value", "class"])) : (openBlock(), createBlock(unref(PaginationEllipsis_default), {
                        key: 1,
                        "as-child": "",
                        "data-slot": "ellipsis",
                        class: ui.value.ellipsis({ class: unref(props).ui?.ellipsis })
                      }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "ellipsis", { ui: ui.value }, () => [
                            createVNode(_sfc_main$8, {
                              as: "div",
                              color: unref(props).color,
                              variant: unref(props).variant,
                              size: unref(props).size,
                              icon: unref(props).ellipsisIcon || unref(appConfig).ui.icons.ellipsis
                            }, null, 8, ["color", "variant", "size", "icon"])
                          ])
                        ]),
                        _: 3
                      }, 8, ["class"]))
                    ], 64);
                  }), 128)),
                  unref(props).showControls || !!slots.next ? (openBlock(), createBlock(unref(PaginationNext_default), {
                    key: 2,
                    "as-child": "",
                    "data-slot": "next",
                    class: ui.value.next({ class: unref(props).ui?.next })
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "next", {}, () => [
                        createVNode(_sfc_main$8, {
                          color: unref(props).color,
                          variant: unref(props).variant,
                          size: unref(props).size,
                          icon: nextIcon.value,
                          to: page < pageCount ? unref(props).to?.(page + 1) : void 0
                        }, null, 8, ["color", "variant", "size", "icon", "to"])
                      ])
                    ]),
                    _: 2
                  }, 1032, ["class"])) : createCommentVNode("", true),
                  unref(props).showControls || !!slots.last ? (openBlock(), createBlock(unref(PaginationLast_default), {
                    key: 3,
                    "as-child": "",
                    "data-slot": "last",
                    class: ui.value.last({ class: unref(props).ui?.last })
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "last", {}, () => [
                        createVNode(_sfc_main$8, {
                          color: unref(props).color,
                          variant: unref(props).variant,
                          size: unref(props).size,
                          icon: lastIcon.value,
                          to: unref(props).to?.(pageCount)
                        }, null, 8, ["color", "variant", "size", "icon", "to"])
                      ])
                    ]),
                    _: 2
                  }, 1032, ["class"])) : createCommentVNode("", true)
                ]),
                _: 2
              }, 1032, ["class"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Pagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Pagination-Bt2NzeyZ.mjs.map
