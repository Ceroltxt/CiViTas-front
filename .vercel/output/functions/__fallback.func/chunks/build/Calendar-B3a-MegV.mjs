import { computed, unref, mergeProps, withCtx, createVNode, renderSlot, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { M as useComponentProps, X as useLocale, J as useAppConfig, S as useForwardProps, I as tv, d as _sfc_main$8 } from './server.mjs';
import { R as RangeCalendar, C as Calendar, g as getWeekNumber } from './index-C8l8nrqu.mjs';
import { reactiveOmit } from '@vueuse/core';

const theme = {
  "slots": {
    "root": "",
    "header": "flex items-center justify-between",
    "body": "flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0",
    "heading": "text-center font-medium truncate mx-auto",
    "grid": "w-full border-collapse select-none space-y-1 focus:outline-none",
    "gridRow": "grid grid-cols-7 place-items-center",
    "gridWeekDaysRow": "mb-1 grid w-full grid-cols-7",
    "gridBody": "grid",
    "headCell": "rounded-md",
    "headCellWeek": "rounded-md text-muted",
    "cell": "relative text-center",
    "cellTrigger": [
      "m-0.5 relative flex items-center justify-center rounded-full whitespace-nowrap focus-visible:ring-2 focus:outline-none data-disabled:text-muted data-unavailable:line-through data-unavailable:text-muted data-unavailable:pointer-events-none data-today:font-semibold data-[outside-view]:text-muted",
      "transition"
    ],
    "cellWeek": "relative text-center text-muted"
  },
  "variants": {
    "color": {
      "primary": {
        "headCell": "text-primary",
        "cellTrigger": "focus-visible:ring-primary"
      },
      "secondary": {
        "headCell": "text-secondary",
        "cellTrigger": "focus-visible:ring-secondary"
      },
      "success": {
        "headCell": "text-success",
        "cellTrigger": "focus-visible:ring-success"
      },
      "info": {
        "headCell": "text-info",
        "cellTrigger": "focus-visible:ring-info"
      },
      "warning": {
        "headCell": "text-warning",
        "cellTrigger": "focus-visible:ring-warning"
      },
      "error": {
        "headCell": "text-error",
        "cellTrigger": "focus-visible:ring-error"
      },
      "neutral": {
        "headCell": "text-highlighted",
        "cellTrigger": "focus-visible:ring-inverted"
      }
    },
    "variant": {
      "solid": "",
      "outline": "",
      "soft": "",
      "subtle": ""
    },
    "size": {
      "xs": {
        "heading": "text-xs",
        "cell": "text-xs",
        "cellWeek": "text-xs",
        "headCell": "text-[10px]",
        "headCellWeek": "text-[10px]",
        "cellTrigger": "size-7",
        "body": "space-y-2 pt-2"
      },
      "sm": {
        "heading": "text-xs",
        "headCell": "text-xs",
        "headCellWeek": "text-xs",
        "cellWeek": "text-xs",
        "cell": "text-xs",
        "cellTrigger": "size-7"
      },
      "md": {
        "heading": "text-sm",
        "headCell": "text-xs",
        "headCellWeek": "text-xs",
        "cellWeek": "text-xs",
        "cell": "text-sm",
        "cellTrigger": "size-8"
      },
      "lg": {
        "heading": "text-md",
        "headCell": "text-md",
        "headCellWeek": "text-md",
        "cellTrigger": "size-9 text-md"
      },
      "xl": {
        "heading": "text-lg",
        "headCell": "text-lg",
        "headCellWeek": "text-lg",
        "cellTrigger": "size-10 text-lg"
      }
    },
    "weekNumbers": {
      "true": {
        "gridRow": "grid-cols-8",
        "gridWeekDaysRow": "grid-cols-8 [&>*:first-child]:col-start-2"
      }
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": "solid",
      "class": {
        "cellTrigger": "data-[selected]:bg-primary data-[selected]:text-inverted data-today:not-data-[selected]:text-primary data-[highlighted]:bg-primary/20 hover:not-data-[selected]:bg-primary/20"
      }
    },
    {
      "color": "secondary",
      "variant": "solid",
      "class": {
        "cellTrigger": "data-[selected]:bg-secondary data-[selected]:text-inverted data-today:not-data-[selected]:text-secondary data-[highlighted]:bg-secondary/20 hover:not-data-[selected]:bg-secondary/20"
      }
    },
    {
      "color": "success",
      "variant": "solid",
      "class": {
        "cellTrigger": "data-[selected]:bg-success data-[selected]:text-inverted data-today:not-data-[selected]:text-success data-[highlighted]:bg-success/20 hover:not-data-[selected]:bg-success/20"
      }
    },
    {
      "color": "info",
      "variant": "solid",
      "class": {
        "cellTrigger": "data-[selected]:bg-info data-[selected]:text-inverted data-today:not-data-[selected]:text-info data-[highlighted]:bg-info/20 hover:not-data-[selected]:bg-info/20"
      }
    },
    {
      "color": "warning",
      "variant": "solid",
      "class": {
        "cellTrigger": "data-[selected]:bg-warning data-[selected]:text-inverted data-today:not-data-[selected]:text-warning data-[highlighted]:bg-warning/20 hover:not-data-[selected]:bg-warning/20"
      }
    },
    {
      "color": "error",
      "variant": "solid",
      "class": {
        "cellTrigger": "data-[selected]:bg-error data-[selected]:text-inverted data-today:not-data-[selected]:text-error data-[highlighted]:bg-error/20 hover:not-data-[selected]:bg-error/20"
      }
    },
    {
      "color": "primary",
      "variant": "outline",
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-primary/50 data-[selected]:text-primary data-today:not-data-[selected]:text-primary data-[highlighted]:bg-primary/10 hover:not-data-[selected]:bg-primary/10"
      }
    },
    {
      "color": "secondary",
      "variant": "outline",
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-secondary/50 data-[selected]:text-secondary data-today:not-data-[selected]:text-secondary data-[highlighted]:bg-secondary/10 hover:not-data-[selected]:bg-secondary/10"
      }
    },
    {
      "color": "success",
      "variant": "outline",
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-success/50 data-[selected]:text-success data-today:not-data-[selected]:text-success data-[highlighted]:bg-success/10 hover:not-data-[selected]:bg-success/10"
      }
    },
    {
      "color": "info",
      "variant": "outline",
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-info/50 data-[selected]:text-info data-today:not-data-[selected]:text-info data-[highlighted]:bg-info/10 hover:not-data-[selected]:bg-info/10"
      }
    },
    {
      "color": "warning",
      "variant": "outline",
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-warning/50 data-[selected]:text-warning data-today:not-data-[selected]:text-warning data-[highlighted]:bg-warning/10 hover:not-data-[selected]:bg-warning/10"
      }
    },
    {
      "color": "error",
      "variant": "outline",
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-error/50 data-[selected]:text-error data-today:not-data-[selected]:text-error data-[highlighted]:bg-error/10 hover:not-data-[selected]:bg-error/10"
      }
    },
    {
      "color": "primary",
      "variant": "soft",
      "class": {
        "cellTrigger": "data-[selected]:bg-primary/10 data-[selected]:text-primary data-today:not-data-[selected]:text-primary data-[highlighted]:bg-primary/20 hover:not-data-[selected]:bg-primary/20"
      }
    },
    {
      "color": "secondary",
      "variant": "soft",
      "class": {
        "cellTrigger": "data-[selected]:bg-secondary/10 data-[selected]:text-secondary data-today:not-data-[selected]:text-secondary data-[highlighted]:bg-secondary/20 hover:not-data-[selected]:bg-secondary/20"
      }
    },
    {
      "color": "success",
      "variant": "soft",
      "class": {
        "cellTrigger": "data-[selected]:bg-success/10 data-[selected]:text-success data-today:not-data-[selected]:text-success data-[highlighted]:bg-success/20 hover:not-data-[selected]:bg-success/20"
      }
    },
    {
      "color": "info",
      "variant": "soft",
      "class": {
        "cellTrigger": "data-[selected]:bg-info/10 data-[selected]:text-info data-today:not-data-[selected]:text-info data-[highlighted]:bg-info/20 hover:not-data-[selected]:bg-info/20"
      }
    },
    {
      "color": "warning",
      "variant": "soft",
      "class": {
        "cellTrigger": "data-[selected]:bg-warning/10 data-[selected]:text-warning data-today:not-data-[selected]:text-warning data-[highlighted]:bg-warning/20 hover:not-data-[selected]:bg-warning/20"
      }
    },
    {
      "color": "error",
      "variant": "soft",
      "class": {
        "cellTrigger": "data-[selected]:bg-error/10 data-[selected]:text-error data-today:not-data-[selected]:text-error data-[highlighted]:bg-error/20 hover:not-data-[selected]:bg-error/20"
      }
    },
    {
      "color": "primary",
      "variant": "subtle",
      "class": {
        "cellTrigger": "data-[selected]:bg-primary/10 data-[selected]:text-primary data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-primary/25 data-today:not-data-[selected]:text-primary data-[highlighted]:bg-primary/20 hover:not-data-[selected]:bg-primary/20"
      }
    },
    {
      "color": "secondary",
      "variant": "subtle",
      "class": {
        "cellTrigger": "data-[selected]:bg-secondary/10 data-[selected]:text-secondary data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-secondary/25 data-today:not-data-[selected]:text-secondary data-[highlighted]:bg-secondary/20 hover:not-data-[selected]:bg-secondary/20"
      }
    },
    {
      "color": "success",
      "variant": "subtle",
      "class": {
        "cellTrigger": "data-[selected]:bg-success/10 data-[selected]:text-success data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-success/25 data-today:not-data-[selected]:text-success data-[highlighted]:bg-success/20 hover:not-data-[selected]:bg-success/20"
      }
    },
    {
      "color": "info",
      "variant": "subtle",
      "class": {
        "cellTrigger": "data-[selected]:bg-info/10 data-[selected]:text-info data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-info/25 data-today:not-data-[selected]:text-info data-[highlighted]:bg-info/20 hover:not-data-[selected]:bg-info/20"
      }
    },
    {
      "color": "warning",
      "variant": "subtle",
      "class": {
        "cellTrigger": "data-[selected]:bg-warning/10 data-[selected]:text-warning data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-warning/25 data-today:not-data-[selected]:text-warning data-[highlighted]:bg-warning/20 hover:not-data-[selected]:bg-warning/20"
      }
    },
    {
      "color": "error",
      "variant": "subtle",
      "class": {
        "cellTrigger": "data-[selected]:bg-error/10 data-[selected]:text-error data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-error/25 data-today:not-data-[selected]:text-error data-[highlighted]:bg-error/20 hover:not-data-[selected]:bg-error/20"
      }
    },
    {
      "color": "neutral",
      "variant": "solid",
      "class": {
        "cellTrigger": "data-[selected]:bg-inverted data-[selected]:text-inverted data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10"
      }
    },
    {
      "color": "neutral",
      "variant": "outline",
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-accented data-[selected]:text-default data-[selected]:bg-default data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/10 hover:not-data-[selected]:bg-inverted/10"
      }
    },
    {
      "color": "neutral",
      "variant": "soft",
      "class": {
        "cellTrigger": "data-[selected]:bg-elevated data-[selected]:text-default data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10"
      }
    },
    {
      "color": "neutral",
      "variant": "subtle",
      "class": {
        "cellTrigger": "data-[selected]:bg-elevated data-[selected]:text-default data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-accented data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10"
      }
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "variant": "solid"
  }
};
const _sfc_main = {
  __name: "UCalendar",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    nextYearIcon: { type: null, required: false },
    nextYear: { type: Object, required: false },
    nextMonthIcon: { type: null, required: false },
    nextMonth: { type: Object, required: false },
    prevYearIcon: { type: null, required: false },
    prevYear: { type: Object, required: false },
    prevMonthIcon: { type: null, required: false },
    prevMonth: { type: Object, required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    range: { type: Boolean, required: false },
    multiple: { type: Boolean, required: false },
    monthControls: { type: Boolean, required: false, default: true },
    yearControls: { type: Boolean, required: false, default: true },
    defaultValue: { type: null, required: false },
    modelValue: { type: null, required: false },
    weekNumbers: { type: Boolean, required: false },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    defaultPlaceholder: { type: Object, required: false },
    placeholder: { type: Object, required: false },
    allowNonContiguousRanges: { type: Boolean, required: false },
    pagedNavigation: { type: Boolean, required: false },
    preventDeselect: { type: Boolean, required: false },
    maximumDays: { type: Number, required: false },
    weekStartsOn: { type: Number, required: false },
    weekdayFormat: { type: String, required: false },
    fixedWeeks: { type: Boolean, required: false, default: true },
    maxValue: { type: Object, required: false },
    minValue: { type: Object, required: false },
    numberOfMonths: { type: Number, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    initialFocus: { type: Boolean, required: false },
    isDateDisabled: { type: Function, required: false },
    isDateUnavailable: { type: Function, required: false },
    isDateHighlightable: { type: Function, required: false },
    nextPage: { type: Function, required: false },
    prevPage: { type: Function, required: false },
    disableDaysOutsideCurrentView: { type: Boolean, required: false },
    fixedDate: { type: String, required: false }
  },
  emits: ["update:modelValue", "update:placeholder", "update:validModelValue", "update:startValue"],
  setup(__props, { emit: __emit }) {
    const _props = __props;
    const emits = __emit;
    const props = useComponentProps("calendar", _props);
    const { dir, t, locale } = useLocale();
    const appConfig = useAppConfig();
    const rootProps = useForwardProps(reactiveOmit(props, "range", "modelValue", "defaultValue", "color", "variant", "size", "monthControls", "yearControls", "class", "ui"), emits);
    const nextYearIcon = computed(() => props.nextYearIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleLeft : appConfig.ui.icons.chevronDoubleRight));
    const nextMonthIcon = computed(() => props.nextMonthIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight));
    const prevYearIcon = computed(() => props.prevYearIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleRight : appConfig.ui.icons.chevronDoubleLeft));
    const prevMonthIcon = computed(() => props.prevMonthIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronRight : appConfig.ui.icons.chevronLeft));
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.calendar || {} })({
      color: props.color,
      size: props.size,
      variant: props.variant,
      weekNumbers: props.weekNumbers
    }));
    function paginateYear(date, sign) {
      if (sign === -1) {
        return date.subtract({ years: 1 });
      }
      return date.add({ years: 1 });
    }
    const Calendar$1 = computed(() => props.range ? RangeCalendar : Calendar);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Calendar$1).Root, mergeProps(unref(rootProps), {
        "model-value": unref(props).modelValue,
        "default-value": unref(props).defaultValue,
        "data-slot": "root",
        class: ui.value.root({ class: [unref(props).ui?.root, unref(props).class] })
      }, _attrs), {
        default: withCtx(({ weekDays, grid }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Calendar$1).Header, {
              "data-slot": "header",
              class: ui.value.header({ class: unref(props).ui?.header })
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(props).yearControls) {
                    _push3(ssrRenderComponent(unref(Calendar$1).Prev, {
                      "prev-page": (date) => paginateYear(date, -1),
                      "aria-label": unref(t)("calendar.prevYear"),
                      "as-child": ""
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$8, mergeProps({
                            icon: prevYearIcon.value,
                            size: unref(props).size,
                            color: "neutral",
                            variant: "ghost"
                          }, unref(props).prevYear), null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$8, mergeProps({
                              icon: prevYearIcon.value,
                              size: unref(props).size,
                              color: "neutral",
                              variant: "ghost"
                            }, unref(props).prevYear), null, 16, ["icon", "size"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(props).monthControls) {
                    _push3(ssrRenderComponent(unref(Calendar$1).Prev, {
                      "aria-label": unref(t)("calendar.prevMonth"),
                      "as-child": ""
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$8, mergeProps({
                            icon: prevMonthIcon.value,
                            size: unref(props).size,
                            color: "neutral",
                            variant: "ghost"
                          }, unref(props).prevMonth), null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$8, mergeProps({
                              icon: prevMonthIcon.value,
                              size: unref(props).size,
                              color: "neutral",
                              variant: "ghost"
                            }, unref(props).prevMonth), null, 16, ["icon", "size"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(Calendar$1).Heading, {
                    "data-slot": "heading",
                    class: ui.value.heading({ class: unref(props).ui?.heading })
                  }, {
                    default: withCtx(({ headingValue }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "heading", { value: headingValue }, () => {
                          _push4(`${ssrInterpolate(headingValue)}`);
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "heading", { value: headingValue }, () => [
                            createTextVNode(toDisplayString(headingValue), 1)
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  if (unref(props).monthControls) {
                    _push3(ssrRenderComponent(unref(Calendar$1).Next, {
                      "aria-label": unref(t)("calendar.nextMonth"),
                      "as-child": ""
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$8, mergeProps({
                            icon: nextMonthIcon.value,
                            size: unref(props).size,
                            color: "neutral",
                            variant: "ghost"
                          }, unref(props).nextMonth), null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$8, mergeProps({
                              icon: nextMonthIcon.value,
                              size: unref(props).size,
                              color: "neutral",
                              variant: "ghost"
                            }, unref(props).nextMonth), null, 16, ["icon", "size"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(props).yearControls) {
                    _push3(ssrRenderComponent(unref(Calendar$1).Next, {
                      "next-page": (date) => paginateYear(date, 1),
                      "aria-label": unref(t)("calendar.nextYear"),
                      "as-child": ""
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$8, mergeProps({
                            icon: nextYearIcon.value,
                            size: unref(props).size,
                            color: "neutral",
                            variant: "ghost"
                          }, unref(props).nextYear), null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$8, mergeProps({
                              icon: nextYearIcon.value,
                              size: unref(props).size,
                              color: "neutral",
                              variant: "ghost"
                            }, unref(props).nextYear), null, 16, ["icon", "size"])
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
                    unref(props).yearControls ? (openBlock(), createBlock(unref(Calendar$1).Prev, {
                      key: 0,
                      "prev-page": (date) => paginateYear(date, -1),
                      "aria-label": unref(t)("calendar.prevYear"),
                      "as-child": ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$8, mergeProps({
                          icon: prevYearIcon.value,
                          size: unref(props).size,
                          color: "neutral",
                          variant: "ghost"
                        }, unref(props).prevYear), null, 16, ["icon", "size"])
                      ]),
                      _: 1
                    }, 8, ["prev-page", "aria-label"])) : createCommentVNode("", true),
                    unref(props).monthControls ? (openBlock(), createBlock(unref(Calendar$1).Prev, {
                      key: 1,
                      "aria-label": unref(t)("calendar.prevMonth"),
                      "as-child": ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$8, mergeProps({
                          icon: prevMonthIcon.value,
                          size: unref(props).size,
                          color: "neutral",
                          variant: "ghost"
                        }, unref(props).prevMonth), null, 16, ["icon", "size"])
                      ]),
                      _: 1
                    }, 8, ["aria-label"])) : createCommentVNode("", true),
                    createVNode(unref(Calendar$1).Heading, {
                      "data-slot": "heading",
                      class: ui.value.heading({ class: unref(props).ui?.heading })
                    }, {
                      default: withCtx(({ headingValue }) => [
                        renderSlot(_ctx.$slots, "heading", { value: headingValue }, () => [
                          createTextVNode(toDisplayString(headingValue), 1)
                        ])
                      ]),
                      _: 3
                    }, 8, ["class"]),
                    unref(props).monthControls ? (openBlock(), createBlock(unref(Calendar$1).Next, {
                      key: 2,
                      "aria-label": unref(t)("calendar.nextMonth"),
                      "as-child": ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$8, mergeProps({
                          icon: nextMonthIcon.value,
                          size: unref(props).size,
                          color: "neutral",
                          variant: "ghost"
                        }, unref(props).nextMonth), null, 16, ["icon", "size"])
                      ]),
                      _: 1
                    }, 8, ["aria-label"])) : createCommentVNode("", true),
                    unref(props).yearControls ? (openBlock(), createBlock(unref(Calendar$1).Next, {
                      key: 3,
                      "next-page": (date) => paginateYear(date, 1),
                      "aria-label": unref(t)("calendar.nextYear"),
                      "as-child": ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$8, mergeProps({
                          icon: nextYearIcon.value,
                          size: unref(props).size,
                          color: "neutral",
                          variant: "ghost"
                        }, unref(props).nextYear), null, 16, ["icon", "size"])
                      ]),
                      _: 1
                    }, 8, ["next-page", "aria-label"])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<div data-slot="body" class="${ssrRenderClass(ui.value.body({ class: unref(props).ui?.body }))}"${_scopeId}><!--[-->`);
            ssrRenderList(grid, (month) => {
              _push2(ssrRenderComponent(unref(Calendar$1).Grid, {
                key: month.value.toString(),
                "data-slot": "grid",
                class: ui.value.grid({ class: unref(props).ui?.grid })
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Calendar$1).GridHead, null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Calendar$1).GridRow, {
                            "data-slot": "gridWeekDaysRow",
                            class: ui.value.gridWeekDaysRow({ class: unref(props).ui?.gridWeekDaysRow })
                          }, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(weekDays, (day) => {
                                  _push5(ssrRenderComponent(unref(Calendar$1).HeadCell, {
                                    key: day,
                                    "data-slot": "headCell",
                                    class: ui.value.headCell({ class: unref(props).ui?.headCell })
                                  }, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        ssrRenderSlot(_ctx.$slots, "week-day", { day }, () => {
                                          _push6(`${ssrInterpolate(day)}`);
                                        }, _push6, _parent6, _scopeId5);
                                      } else {
                                        return [
                                          renderSlot(_ctx.$slots, "week-day", { day }, () => [
                                            createTextVNode(toDisplayString(day), 1)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                    return openBlock(), createBlock(unref(Calendar$1).HeadCell, {
                                      key: day,
                                      "data-slot": "headCell",
                                      class: ui.value.headCell({ class: unref(props).ui?.headCell })
                                    }, {
                                      default: withCtx(() => [
                                        renderSlot(_ctx.$slots, "week-day", { day }, () => [
                                          createTextVNode(toDisplayString(day), 1)
                                        ])
                                      ]),
                                      _: 2
                                    }, 1032, ["class"]);
                                  }), 128))
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(Calendar$1).GridRow, {
                              "data-slot": "gridWeekDaysRow",
                              class: ui.value.gridWeekDaysRow({ class: unref(props).ui?.gridWeekDaysRow })
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                  return openBlock(), createBlock(unref(Calendar$1).HeadCell, {
                                    key: day,
                                    "data-slot": "headCell",
                                    class: ui.value.headCell({ class: unref(props).ui?.headCell })
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "week-day", { day }, () => [
                                        createTextVNode(toDisplayString(day), 1)
                                      ])
                                    ]),
                                    _: 2
                                  }, 1032, ["class"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1032, ["class"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(Calendar$1).GridBody, {
                      "data-slot": "gridBody",
                      class: ui.value.gridBody({ class: unref(props).ui?.gridBody })
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(month.rows, (weekDates, index) => {
                            _push4(ssrRenderComponent(unref(Calendar$1).GridRow, {
                              key: `weekDate-${index}`,
                              "data-slot": "gridRow",
                              class: ui.value.gridRow({ class: unref(props).ui?.gridRow })
                            }, {
                              default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (unref(props).weekNumbers && weekDates[0]) {
                                    _push5(`<td role="gridcell" data-slot="cellWeek" class="${ssrRenderClass(ui.value.cellWeek({ class: unref(props).ui?.cellWeek }))}"${_scopeId4}>${ssrInterpolate(unref(getWeekNumber)(weekDates[0], unref(locale).code))}</td>`);
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                  _push5(`<!--[-->`);
                                  ssrRenderList(weekDates, (weekDate) => {
                                    _push5(ssrRenderComponent(unref(Calendar$1).Cell, {
                                      key: weekDate.toString(),
                                      date: weekDate,
                                      "data-slot": "cell",
                                      class: ui.value.cell({ class: unref(props).ui?.cell })
                                    }, {
                                      default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(ssrRenderComponent(unref(Calendar$1).CellTrigger, {
                                            day: weekDate,
                                            month: month.value,
                                            "data-slot": "cellTrigger",
                                            class: ui.value.cellTrigger({ class: unref(props).ui?.cellTrigger })
                                          }, {
                                            default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                ssrRenderSlot(_ctx.$slots, "day", { day: weekDate }, () => {
                                                  _push7(`${ssrInterpolate(weekDate.day)}`);
                                                }, _push7, _parent7, _scopeId6);
                                              } else {
                                                return [
                                                  renderSlot(_ctx.$slots, "day", { day: weekDate }, () => [
                                                    createTextVNode(toDisplayString(weekDate.day), 1)
                                                  ])
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                        } else {
                                          return [
                                            createVNode(unref(Calendar$1).CellTrigger, {
                                              day: weekDate,
                                              month: month.value,
                                              "data-slot": "cellTrigger",
                                              class: ui.value.cellTrigger({ class: unref(props).ui?.cellTrigger })
                                            }, {
                                              default: withCtx(() => [
                                                renderSlot(_ctx.$slots, "day", { day: weekDate }, () => [
                                                  createTextVNode(toDisplayString(weekDate.day), 1)
                                                ])
                                              ]),
                                              _: 2
                                            }, 1032, ["day", "month", "class"])
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  });
                                  _push5(`<!--]-->`);
                                } else {
                                  return [
                                    unref(props).weekNumbers && weekDates[0] ? (openBlock(), createBlock("td", {
                                      key: 0,
                                      role: "gridcell",
                                      "data-slot": "cellWeek",
                                      class: ui.value.cellWeek({ class: unref(props).ui?.cellWeek })
                                    }, toDisplayString(unref(getWeekNumber)(weekDates[0], unref(locale).code)), 3)) : createCommentVNode("", true),
                                    (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                      return openBlock(), createBlock(unref(Calendar$1).Cell, {
                                        key: weekDate.toString(),
                                        date: weekDate,
                                        "data-slot": "cell",
                                        class: ui.value.cell({ class: unref(props).ui?.cell })
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Calendar$1).CellTrigger, {
                                            day: weekDate,
                                            month: month.value,
                                            "data-slot": "cellTrigger",
                                            class: ui.value.cellTrigger({ class: unref(props).ui?.cellTrigger })
                                          }, {
                                            default: withCtx(() => [
                                              renderSlot(_ctx.$slots, "day", { day: weekDate }, () => [
                                                createTextVNode(toDisplayString(weekDate.day), 1)
                                              ])
                                            ]),
                                            _: 2
                                          }, 1032, ["day", "month", "class"])
                                        ]),
                                        _: 2
                                      }, 1032, ["date", "class"]);
                                    }), 128))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index) => {
                              return openBlock(), createBlock(unref(Calendar$1).GridRow, {
                                key: `weekDate-${index}`,
                                "data-slot": "gridRow",
                                class: ui.value.gridRow({ class: unref(props).ui?.gridRow })
                              }, {
                                default: withCtx(() => [
                                  unref(props).weekNumbers && weekDates[0] ? (openBlock(), createBlock("td", {
                                    key: 0,
                                    role: "gridcell",
                                    "data-slot": "cellWeek",
                                    class: ui.value.cellWeek({ class: unref(props).ui?.cellWeek })
                                  }, toDisplayString(unref(getWeekNumber)(weekDates[0], unref(locale).code)), 3)) : createCommentVNode("", true),
                                  (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                    return openBlock(), createBlock(unref(Calendar$1).Cell, {
                                      key: weekDate.toString(),
                                      date: weekDate,
                                      "data-slot": "cell",
                                      class: ui.value.cell({ class: unref(props).ui?.cell })
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Calendar$1).CellTrigger, {
                                          day: weekDate,
                                          month: month.value,
                                          "data-slot": "cellTrigger",
                                          class: ui.value.cellTrigger({ class: unref(props).ui?.cellTrigger })
                                        }, {
                                          default: withCtx(() => [
                                            renderSlot(_ctx.$slots, "day", { day: weekDate }, () => [
                                              createTextVNode(toDisplayString(weekDate.day), 1)
                                            ])
                                          ]),
                                          _: 2
                                        }, 1032, ["day", "month", "class"])
                                      ]),
                                      _: 2
                                    }, 1032, ["date", "class"]);
                                  }), 128))
                                ]),
                                _: 2
                              }, 1032, ["class"]);
                            }), 128))
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(Calendar$1).GridHead, null, {
                        default: withCtx(() => [
                          createVNode(unref(Calendar$1).GridRow, {
                            "data-slot": "gridWeekDaysRow",
                            class: ui.value.gridWeekDaysRow({ class: unref(props).ui?.gridWeekDaysRow })
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                return openBlock(), createBlock(unref(Calendar$1).HeadCell, {
                                  key: day,
                                  "data-slot": "headCell",
                                  class: ui.value.headCell({ class: unref(props).ui?.headCell })
                                }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "week-day", { day }, () => [
                                      createTextVNode(toDisplayString(day), 1)
                                    ])
                                  ]),
                                  _: 2
                                }, 1032, ["class"]);
                              }), 128))
                            ]),
                            _: 2
                          }, 1032, ["class"])
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(unref(Calendar$1).GridBody, {
                        "data-slot": "gridBody",
                        class: ui.value.gridBody({ class: unref(props).ui?.gridBody })
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index) => {
                            return openBlock(), createBlock(unref(Calendar$1).GridRow, {
                              key: `weekDate-${index}`,
                              "data-slot": "gridRow",
                              class: ui.value.gridRow({ class: unref(props).ui?.gridRow })
                            }, {
                              default: withCtx(() => [
                                unref(props).weekNumbers && weekDates[0] ? (openBlock(), createBlock("td", {
                                  key: 0,
                                  role: "gridcell",
                                  "data-slot": "cellWeek",
                                  class: ui.value.cellWeek({ class: unref(props).ui?.cellWeek })
                                }, toDisplayString(unref(getWeekNumber)(weekDates[0], unref(locale).code)), 3)) : createCommentVNode("", true),
                                (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                  return openBlock(), createBlock(unref(Calendar$1).Cell, {
                                    key: weekDate.toString(),
                                    date: weekDate,
                                    "data-slot": "cell",
                                    class: ui.value.cell({ class: unref(props).ui?.cell })
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Calendar$1).CellTrigger, {
                                        day: weekDate,
                                        month: month.value,
                                        "data-slot": "cellTrigger",
                                        class: ui.value.cellTrigger({ class: unref(props).ui?.cellTrigger })
                                      }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "day", { day: weekDate }, () => [
                                            createTextVNode(toDisplayString(weekDate.day), 1)
                                          ])
                                        ]),
                                        _: 2
                                      }, 1032, ["day", "month", "class"])
                                    ]),
                                    _: 2
                                  }, 1032, ["date", "class"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1032, ["class"]);
                          }), 128))
                        ]),
                        _: 2
                      }, 1032, ["class"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode(unref(Calendar$1).Header, {
                "data-slot": "header",
                class: ui.value.header({ class: unref(props).ui?.header })
              }, {
                default: withCtx(() => [
                  unref(props).yearControls ? (openBlock(), createBlock(unref(Calendar$1).Prev, {
                    key: 0,
                    "prev-page": (date) => paginateYear(date, -1),
                    "aria-label": unref(t)("calendar.prevYear"),
                    "as-child": ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$8, mergeProps({
                        icon: prevYearIcon.value,
                        size: unref(props).size,
                        color: "neutral",
                        variant: "ghost"
                      }, unref(props).prevYear), null, 16, ["icon", "size"])
                    ]),
                    _: 1
                  }, 8, ["prev-page", "aria-label"])) : createCommentVNode("", true),
                  unref(props).monthControls ? (openBlock(), createBlock(unref(Calendar$1).Prev, {
                    key: 1,
                    "aria-label": unref(t)("calendar.prevMonth"),
                    "as-child": ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$8, mergeProps({
                        icon: prevMonthIcon.value,
                        size: unref(props).size,
                        color: "neutral",
                        variant: "ghost"
                      }, unref(props).prevMonth), null, 16, ["icon", "size"])
                    ]),
                    _: 1
                  }, 8, ["aria-label"])) : createCommentVNode("", true),
                  createVNode(unref(Calendar$1).Heading, {
                    "data-slot": "heading",
                    class: ui.value.heading({ class: unref(props).ui?.heading })
                  }, {
                    default: withCtx(({ headingValue }) => [
                      renderSlot(_ctx.$slots, "heading", { value: headingValue }, () => [
                        createTextVNode(toDisplayString(headingValue), 1)
                      ])
                    ]),
                    _: 3
                  }, 8, ["class"]),
                  unref(props).monthControls ? (openBlock(), createBlock(unref(Calendar$1).Next, {
                    key: 2,
                    "aria-label": unref(t)("calendar.nextMonth"),
                    "as-child": ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$8, mergeProps({
                        icon: nextMonthIcon.value,
                        size: unref(props).size,
                        color: "neutral",
                        variant: "ghost"
                      }, unref(props).nextMonth), null, 16, ["icon", "size"])
                    ]),
                    _: 1
                  }, 8, ["aria-label"])) : createCommentVNode("", true),
                  unref(props).yearControls ? (openBlock(), createBlock(unref(Calendar$1).Next, {
                    key: 3,
                    "next-page": (date) => paginateYear(date, 1),
                    "aria-label": unref(t)("calendar.nextYear"),
                    "as-child": ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$8, mergeProps({
                        icon: nextYearIcon.value,
                        size: unref(props).size,
                        color: "neutral",
                        variant: "ghost"
                      }, unref(props).nextYear), null, 16, ["icon", "size"])
                    ]),
                    _: 1
                  }, 8, ["next-page", "aria-label"])) : createCommentVNode("", true)
                ]),
                _: 3
              }, 8, ["class"]),
              createVNode("div", {
                "data-slot": "body",
                class: ui.value.body({ class: unref(props).ui?.body })
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(grid, (month) => {
                  return openBlock(), createBlock(unref(Calendar$1).Grid, {
                    key: month.value.toString(),
                    "data-slot": "grid",
                    class: ui.value.grid({ class: unref(props).ui?.grid })
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Calendar$1).GridHead, null, {
                        default: withCtx(() => [
                          createVNode(unref(Calendar$1).GridRow, {
                            "data-slot": "gridWeekDaysRow",
                            class: ui.value.gridWeekDaysRow({ class: unref(props).ui?.gridWeekDaysRow })
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                return openBlock(), createBlock(unref(Calendar$1).HeadCell, {
                                  key: day,
                                  "data-slot": "headCell",
                                  class: ui.value.headCell({ class: unref(props).ui?.headCell })
                                }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "week-day", { day }, () => [
                                      createTextVNode(toDisplayString(day), 1)
                                    ])
                                  ]),
                                  _: 2
                                }, 1032, ["class"]);
                              }), 128))
                            ]),
                            _: 2
                          }, 1032, ["class"])
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(unref(Calendar$1).GridBody, {
                        "data-slot": "gridBody",
                        class: ui.value.gridBody({ class: unref(props).ui?.gridBody })
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index) => {
                            return openBlock(), createBlock(unref(Calendar$1).GridRow, {
                              key: `weekDate-${index}`,
                              "data-slot": "gridRow",
                              class: ui.value.gridRow({ class: unref(props).ui?.gridRow })
                            }, {
                              default: withCtx(() => [
                                unref(props).weekNumbers && weekDates[0] ? (openBlock(), createBlock("td", {
                                  key: 0,
                                  role: "gridcell",
                                  "data-slot": "cellWeek",
                                  class: ui.value.cellWeek({ class: unref(props).ui?.cellWeek })
                                }, toDisplayString(unref(getWeekNumber)(weekDates[0], unref(locale).code)), 3)) : createCommentVNode("", true),
                                (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                  return openBlock(), createBlock(unref(Calendar$1).Cell, {
                                    key: weekDate.toString(),
                                    date: weekDate,
                                    "data-slot": "cell",
                                    class: ui.value.cell({ class: unref(props).ui?.cell })
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Calendar$1).CellTrigger, {
                                        day: weekDate,
                                        month: month.value,
                                        "data-slot": "cellTrigger",
                                        class: ui.value.cellTrigger({ class: unref(props).ui?.cellTrigger })
                                      }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "day", { day: weekDate }, () => [
                                            createTextVNode(toDisplayString(weekDate.day), 1)
                                          ])
                                        ]),
                                        _: 2
                                      }, 1032, ["day", "month", "class"])
                                    ]),
                                    _: 2
                                  }, 1032, ["date", "class"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1032, ["class"]);
                          }), 128))
                        ]),
                        _: 2
                      }, 1032, ["class"])
                    ]),
                    _: 2
                  }, 1032, ["class"]);
                }), 128))
              ], 2)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Calendar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Calendar-B3a-MegV.mjs.map
