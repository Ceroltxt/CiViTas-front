import { _ as _sfc_main$2 } from './Modal-DrlsEEos.mjs';
import { d as _sfc_main$8, f as _sfc_main$d, M as useComponentProps, J as useAppConfig, S as useForwardProps, Q as useFormField, O as useFieldGroup, L as useComponentIcons, I as tv, e as _sfc_main$b$1, R as useForwardExpose, K as useCollection, b as Primitive, k as createContext } from './server.mjs';
import { _ as _sfc_main$3 } from './FormField-DHBPFucc.mjs';
import { _ as _sfc_main$4 } from './Input-BsVJ6KLu.mjs';
import { _ as _sfc_main$5 } from './Textarea-0o-hq-NV.mjs';
import { defineComponent, shallowRef, computed, useTemplateRef, ref, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, isRef, openBlock, createBlock, Fragment, renderList, useSlots, toRef, renderSlot, createCommentVNode, toRefs, toRaw, withKeys, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderSlot, ssrRenderClass } from 'vue/server-renderer';
import { u as useArrowNavigation } from './index-C8l8nrqu.mjs';
import { u as useDirection } from './useDirection-B3h_OC89.mjs';
import { u as useFormControl } from './useFormControl-9B1GcqCr.mjs';
import { V as VisuallyHiddenInput_default } from './VisuallyHiddenInput-_jZmJXfe.mjs';
import { useBreakpoints, breakpointsTailwind, reactivePick, useVModel, useFocusWithin } from '@vueuse/core';
import { u as useId } from './useId-Df0AxZi5.mjs';
import { _ as _sfc_main$6 } from './Badge-BWf412jE.mjs';
import { _ as _sfc_main$7 } from './Popover-Dn1k2Q3g.mjs';
import { _ as _sfc_main$9 } from './Calendar-B3a-MegV.mjs';
import { _ as _sfc_main$a } from './Table-CV2h7AlW.mjs';
import { _ as _sfc_main$b } from './Pagination-Bt2NzeyZ.mjs';
import { getPaginationRowModel } from '@tanstack/vue-table';
import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date';
import { s as isEqual } from '../_/nitro.mjs';
import './utils-CJXk8l7g.mjs';
import '@vueuse/shared';
import 'aria-hidden';
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
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:fs';
import 'node:path';
import './Label-Bz9RXRS1.mjs';
import './PopperArrow-C07et48U.mjs';
import '@floating-ui/vue';
import './RovingFocusGroup-Dpm1zhJB.mjs';
import '@tanstack/vue-virtual';

const [injectTagsInputRootContext, provideTagsInputRootContext] = /* @__PURE__ */ createContext("TagsInputRoot");
var TagsInputRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "TagsInputRoot",
  props: {
    modelValue: {
      type: [Array, null],
      required: false
    },
    defaultValue: {
      type: Array,
      required: false,
      default: () => []
    },
    addOnPaste: {
      type: Boolean,
      required: false
    },
    addOnTab: {
      type: Boolean,
      required: false
    },
    addOnBlur: {
      type: Boolean,
      required: false
    },
    duplicate: {
      type: Boolean,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    delimiter: {
      type: null,
      required: false,
      default: ","
    },
    dir: {
      type: String,
      required: false
    },
    max: {
      type: Number,
      required: false,
      default: 0
    },
    id: {
      type: String,
      required: false
    },
    convertValue: {
      type: Function,
      required: false
    },
    displayValue: {
      type: Function,
      required: false,
      default: (value) => value.toString()
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
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
  emits: [
    "update:modelValue",
    "invalid",
    "addTag",
    "removeTag"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { addOnPaste, disabled, delimiter, max, id, dir: propDir, addOnBlur, addOnTab } = toRefs(props);
    const dir = useDirection(propDir);
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: props.defaultValue,
      passive: true,
      deep: true
    });
    const { forwardRef, currentElement } = useForwardExpose();
    const { focused } = useFocusWithin(currentElement);
    const isFormControl = useFormControl(currentElement);
    const { getItems, CollectionSlot } = useCollection({ isProvider: true });
    const selectedElement = ref();
    const isInvalidInput = ref(false);
    const currentModelValue = computed(() => Array.isArray(modelValue.value) ? [...modelValue.value] : []);
    function handleRemoveTag(index) {
      if (index !== -1) {
        const collection = getItems().filter((i) => i.ref.dataset.disabled !== "");
        modelValue.value = modelValue.value.filter((_, i) => i !== index);
        emits("removeTag", collection[index].value);
      }
    }
    provideTagsInputRootContext({
      modelValue,
      onAddValue: (_payload) => {
        const array = [...currentModelValue.value];
        const modelValueIsObject = array.length > 0 && typeof array[0] === "object";
        const defaultValueIsObject = array.length > 0 && typeof props.defaultValue[0] === "object";
        if ((modelValueIsObject || defaultValueIsObject) && typeof props.convertValue !== "function") throw new Error("You must provide a `convertValue` function when using objects as values.");
        const payload = props.convertValue ? props.convertValue(_payload) : _payload;
        if (array.length >= max.value && !!max.value) {
          emits("invalid", payload);
          return false;
        }
        if (props.duplicate) {
          modelValue.value = [...array, payload];
          emits("addTag", payload);
          return true;
        } else {
          const exist = array.includes(payload);
          if (!exist) {
            modelValue.value = [...array, payload];
            emits("addTag", payload);
            return true;
          } else isInvalidInput.value = true;
        }
        emits("invalid", payload);
        return false;
      },
      onRemoveValue: handleRemoveTag,
      onInputKeydown: (event) => {
        const target = event.target;
        const collection = getItems().map((i) => i.ref).filter((i) => i.dataset.disabled !== "");
        if (!collection.length) return;
        const lastTag = collection.at(-1);
        switch (event.key) {
          case "Delete":
          case "Backspace": {
            if (target.selectionStart !== 0 || target.selectionEnd !== 0) break;
            if (selectedElement.value) {
              const index = collection.findIndex((i) => i === selectedElement.value);
              handleRemoveTag(index);
              selectedElement.value = selectedElement.value === lastTag ? collection.at(index - 1) : collection.at(index + 1);
              event.preventDefault();
            } else if (event.key === "Backspace") {
              selectedElement.value = lastTag;
              event.preventDefault();
            }
            break;
          }
          case "Home":
          case "End":
          case "ArrowRight":
          case "ArrowLeft": {
            const isArrowRight = event.key === "ArrowRight" && dir.value === "ltr" || event.key === "ArrowLeft" && dir.value === "rtl";
            const isArrowLeft = !isArrowRight;
            if (target.selectionStart !== 0 || target.selectionEnd !== 0) break;
            if (isArrowLeft && !selectedElement.value) {
              selectedElement.value = lastTag;
              event.preventDefault();
            } else if (isArrowRight && lastTag && selectedElement.value === lastTag) {
              selectedElement.value = void 0;
              event.preventDefault();
            } else if (selectedElement.value) {
              const el = useArrowNavigation(event, selectedElement.value, void 0, {
                itemsArray: collection,
                loop: false,
                dir: dir.value
              });
              if (el) selectedElement.value = el;
              event.preventDefault();
            }
            break;
          }
          case "ArrowUp":
          case "ArrowDown": {
            if (selectedElement.value) event.preventDefault();
            break;
          }
          default:
            selectedElement.value = void 0;
        }
      },
      selectedElement,
      isInvalidInput,
      addOnPaste,
      addOnBlur,
      addOnTab,
      dir,
      disabled,
      delimiter,
      max,
      id,
      displayValue: props.displayValue
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollectionSlot), null, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          ref: unref(forwardRef),
          dir: unref(dir),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "data-invalid": isInvalidInput.value ? "" : void 0,
          "data-disabled": unref(disabled) ? "" : void 0,
          "data-focused": unref(focused) ? "" : void 0
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default", { modelValue: unref(modelValue) }), unref(isFormControl) && _ctx.name ? (openBlock(), createBlock(unref(VisuallyHiddenInput_default), {
            key: 0,
            name: _ctx.name,
            value: unref(modelValue),
            required: _ctx.required,
            disabled: unref(disabled)
          }, null, 8, [
            "name",
            "value",
            "required",
            "disabled"
          ])) : createCommentVNode("v-if", true)]),
          _: 3
        }, 8, [
          "dir",
          "as",
          "as-child",
          "data-invalid",
          "data-disabled",
          "data-focused"
        ])]),
        _: 3
      });
    };
  }
});
var TagsInputRoot_default = TagsInputRoot_vue_vue_type_script_setup_true_lang_default;
var TagsInputInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "TagsInputInput",
  props: {
    placeholder: {
      type: String,
      required: false
    },
    autoFocus: {
      type: Boolean,
      required: false
    },
    maxLength: {
      type: Number,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "input"
    }
  },
  setup(__props) {
    const context = injectTagsInputRootContext();
    const { forwardRef } = useForwardExpose();
    function handleBlur(event) {
      context.selectedElement.value = void 0;
      if (!context.addOnBlur.value) return;
      const target = event.target;
      const relatedTarget = event.relatedTarget;
      const controlledId = target.getAttribute("aria-controls");
      if (controlledId && relatedTarget?.closest(`#${CSS.escape(controlledId)}`)) return;
      if (!target.value) return;
      const isAdded = context.onAddValue(target.value);
      if (isAdded) target.value = "";
    }
    function handleTab(event) {
      if (!context.addOnTab.value) return;
      handleCustomKeydown(event);
    }
    const isComposing = ref(false);
    function onCompositionStart() {
      isComposing.value = true;
    }
    function onCompositionEnd() {
      nextTick(() => {
        isComposing.value = false;
      });
    }
    async function handleCustomKeydown(event) {
      if (isComposing.value) return;
      await nextTick();
      if (event.defaultPrevented) return;
      const target = event.target;
      if (!target.value) return;
      const isAdded = context.onAddValue(target.value);
      if (isAdded) target.value = "";
      event.preventDefault();
    }
    function handleInput(event) {
      context.isInvalidInput.value = false;
      if (event.data === null) return;
      const delimiter = context.delimiter.value;
      const matchesDelimiter = delimiter === event.data || delimiter instanceof RegExp && delimiter.test(event.data);
      if (matchesDelimiter) {
        const target = event.target;
        target.value = target.value.replace(delimiter, "");
        if (target.value.trim() === "") {
          target.value = "";
          return;
        }
        const isAdded = context.onAddValue(target.value);
        if (isAdded) target.value = "";
      }
    }
    function handlePaste(event) {
      if (context.addOnPaste.value) {
        event.preventDefault();
        const clipboardData = event.clipboardData;
        if (!clipboardData) return;
        const value = clipboardData.getData("text");
        if (context.delimiter.value) {
          const splitValue = value.split(context.delimiter.value);
          splitValue.forEach((v) => {
            context.onAddValue(v);
          });
        } else context.onAddValue(value);
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        id: unref(context).id?.value,
        ref: unref(forwardRef),
        type: "text",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        as: _ctx.as,
        "as-child": _ctx.asChild,
        maxlength: _ctx.maxLength,
        placeholder: _ctx.placeholder,
        disabled: unref(context).disabled.value,
        "data-invalid": unref(context).isInvalidInput.value ? "" : void 0,
        onInput: handleInput,
        onKeydown: [
          withKeys(handleCustomKeydown, ["enter"]),
          withKeys(handleTab, ["tab"]),
          unref(context).onInputKeydown
        ],
        onBlur: handleBlur,
        onCompositionstart: onCompositionStart,
        onCompositionend: onCompositionEnd,
        onPaste: handlePaste
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "id",
        "as",
        "as-child",
        "maxlength",
        "placeholder",
        "disabled",
        "data-invalid",
        "onKeydown"
      ]);
    };
  }
});
var TagsInputInput_default = TagsInputInput_vue_vue_type_script_setup_true_lang_default;
const [injectTagsInputItemContext, provideTagsInputItemContext] = /* @__PURE__ */ createContext("TagsInputItem");
var TagsInputItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "TagsInputItem",
  props: {
    value: {
      type: null,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    },
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
    const { value } = toRefs(props);
    const context = injectTagsInputRootContext();
    const { forwardRef, currentElement } = useForwardExpose();
    const { CollectionItem } = useCollection();
    const isSelected = computed(() => context.selectedElement.value === currentElement.value);
    const disabled = computed(() => props.disabled || context.disabled.value);
    const itemContext = provideTagsInputItemContext({
      value,
      isSelected,
      disabled,
      textId: "",
      displayValue: computed(() => context.displayValue(value.value))
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollectionItem), { value: unref(value) }, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          ref: unref(forwardRef),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "aria-labelledby": unref(itemContext).textId,
          "aria-current": isSelected.value,
          "data-disabled": disabled.value ? "" : void 0,
          "data-state": isSelected.value ? "active" : "inactive"
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "as",
          "as-child",
          "aria-labelledby",
          "aria-current",
          "data-disabled",
          "data-state"
        ])]),
        _: 3
      }, 8, ["value"]);
    };
  }
});
var TagsInputItem_default = TagsInputItem_vue_vue_type_script_setup_true_lang_default;
var TagsInputItemDelete_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "TagsInputItemDelete",
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
    const context = injectTagsInputRootContext();
    const itemContext = injectTagsInputItemContext();
    const disabled = computed(() => itemContext.disabled?.value || context.disabled.value);
    function handleDelete() {
      if (disabled.value) return;
      const index = context.modelValue.value.findIndex((i) => isEqual(i, itemContext.value.value));
      context.onRemoveValue(index);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps({ tabindex: "-1" }, props, {
        "aria-labelledby": unref(itemContext).textId,
        "aria-current": unref(itemContext).isSelected.value,
        "data-state": unref(itemContext).isSelected.value ? "active" : "inactive",
        "data-disabled": disabled.value ? "" : void 0,
        type: _ctx.as === "button" ? "button" : void 0,
        onClick: handleDelete
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "aria-labelledby",
        "aria-current",
        "data-state",
        "data-disabled",
        "type"
      ]);
    };
  }
});
var TagsInputItemDelete_default = TagsInputItemDelete_vue_vue_type_script_setup_true_lang_default;
var TagsInputItemText_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "TagsInputItemText",
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
    const props = __props;
    const itemContext = injectTagsInputItemContext();
    useForwardExpose();
    itemContext.textId ||= useId(void 0, "reka-tags-input-item-text");
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { id: unref(itemContext).textId }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(unref(itemContext).displayValue.value), 1)])]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var TagsInputItemText_default = TagsInputItemText_vue_vue_type_script_setup_true_lang_default;
const theme = {
  "slots": {
    "root": [
      "relative inline-flex items-center",
      "flex-wrap"
    ],
    "base": [
      "rounded-md",
      "transition-colors"
    ],
    "leading": "absolute inset-y-0 start-0 flex items-center",
    "leadingIcon": "shrink-0 text-dimmed",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailing": "absolute inset-y-0 end-0 flex items-center",
    "trailingIcon": "shrink-0 text-dimmed",
    "item": 'px-1.5 py-0.5 rounded-sm font-medium inline-flex items-center gap-0.5 ring ring-inset ring-accented bg-elevated text-default data-disabled:cursor-not-allowed data-disabled:opacity-75 wrap-anywhere data-[state="active"]:bg-accented',
    "itemText": "",
    "itemDelete": [
      "inline-flex items-center rounded-xs text-dimmed hover:text-default hover:bg-accented/75 disabled:pointer-events-none",
      "transition-colors"
    ],
    "itemDeleteIcon": "shrink-0",
    "input": "flex-1 border-0 bg-transparent placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
      "vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
    },
    "size": {
      "xs": {
        "base": "px-2 py-1 text-sm/4 gap-1",
        "leading": "ps-2",
        "trailing": "pe-2",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4",
        "item": "text-[10px]/3",
        "itemDeleteIcon": "size-3"
      },
      "sm": {
        "base": "px-2.5 py-1.5 text-sm/4 gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4",
        "item": "text-[10px]/3",
        "itemDeleteIcon": "size-3"
      },
      "md": {
        "base": "px-2.5 py-1.5 text-base/5 gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5",
        "item": "text-xs",
        "itemDeleteIcon": "size-3.5"
      },
      "lg": {
        "base": "px-3 py-2 text-base/5 gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5",
        "item": "text-xs",
        "itemDeleteIcon": "size-3.5"
      },
      "xl": {
        "base": "px-3 py-2 text-base gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "xs",
        "trailingIcon": "size-6",
        "item": "text-sm",
        "itemDeleteIcon": "size-4"
      }
    },
    "variant": {
      "outline": "text-highlighted bg-default ring ring-inset ring-accented",
      "soft": "text-highlighted bg-elevated/50 hover:bg-elevated has-focus:bg-elevated disabled:bg-elevated/50",
      "subtle": "text-highlighted bg-elevated ring ring-inset ring-accented",
      "ghost": "text-highlighted bg-transparent hover:bg-elevated has-focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
      "none": "text-highlighted bg-transparent"
    },
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "leading": {
      "true": ""
    },
    "trailing": {
      "true": ""
    },
    "loading": {
      "true": ""
    },
    "highlight": {
      "true": ""
    },
    "fixed": {
      "false": ""
    },
    "type": {
      "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none"
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-error"
    },
    {
      "color": "primary",
      "highlight": true,
      "class": "ring ring-inset ring-primary"
    },
    {
      "color": "secondary",
      "highlight": true,
      "class": "ring ring-inset ring-secondary"
    },
    {
      "color": "success",
      "highlight": true,
      "class": "ring ring-inset ring-success"
    },
    {
      "color": "info",
      "highlight": true,
      "class": "ring ring-inset ring-info"
    },
    {
      "color": "warning",
      "highlight": true,
      "class": "ring ring-inset ring-warning"
    },
    {
      "color": "error",
      "highlight": true,
      "class": "ring ring-inset ring-error"
    },
    {
      "color": "neutral",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-inverted"
    },
    {
      "color": "neutral",
      "highlight": true,
      "class": "ring ring-inset ring-inverted"
    },
    {
      "leading": true,
      "size": "xs",
      "class": "ps-7"
    },
    {
      "leading": true,
      "size": "sm",
      "class": "ps-8"
    },
    {
      "leading": true,
      "size": "md",
      "class": "ps-9"
    },
    {
      "leading": true,
      "size": "lg",
      "class": "ps-10"
    },
    {
      "leading": true,
      "size": "xl",
      "class": "ps-11"
    },
    {
      "trailing": true,
      "size": "xs",
      "class": "pe-7"
    },
    {
      "trailing": true,
      "size": "sm",
      "class": "pe-8"
    },
    {
      "trailing": true,
      "size": "md",
      "class": "pe-9"
    },
    {
      "trailing": true,
      "size": "lg",
      "class": "pe-10"
    },
    {
      "trailing": true,
      "size": "xl",
      "class": "pe-11"
    },
    {
      "loading": true,
      "leading": true,
      "class": {
        "leadingIcon": "animate-spin"
      }
    },
    {
      "loading": true,
      "leading": false,
      "trailing": true,
      "class": {
        "trailingIcon": "animate-spin"
      }
    },
    {
      "fixed": false,
      "size": "xs",
      "class": "md:text-xs"
    },
    {
      "fixed": false,
      "size": "sm",
      "class": "md:text-xs"
    },
    {
      "fixed": false,
      "size": "md",
      "class": "md:text-sm"
    },
    {
      "fixed": false,
      "size": "lg",
      "class": "md:text-sm"
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "variant": "outline"
  }
};
const _sfc_main$1 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UInputTags",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    placeholder: { type: String, required: false },
    maxLength: { type: Number, required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    autofocus: { type: Boolean, required: false },
    autofocusDelay: { type: Number, required: false, default: 0 },
    deleteIcon: { type: null, required: false },
    highlight: { type: Boolean, required: false },
    fixed: { type: Boolean, required: false },
    class: { type: null, required: false },
    ui: { type: Object, required: false },
    modelValue: { type: [Array, null], required: false },
    defaultValue: { type: Array, required: false },
    addOnPaste: { type: Boolean, required: false },
    addOnTab: { type: Boolean, required: false },
    addOnBlur: { type: Boolean, required: false },
    duplicate: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    delimiter: { type: null, required: false },
    max: { type: Number, required: false },
    id: { type: String, required: false },
    convertValue: { type: Function, required: false },
    displayValue: { type: Function, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
    icon: { type: null, required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: null, required: false },
    trailing: { type: Boolean, required: false },
    trailingIcon: { type: null, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false }
  },
  emits: ["change", "blur", "focus", "update:modelValue", "invalid", "addTag", "removeTag"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const _props = __props;
    const emits = __emit;
    const slots = useSlots();
    const props = useComponentProps("inputTags", _props);
    const appConfig = useAppConfig();
    const rootProps = useForwardProps(reactivePick(props, "as", "addOnPaste", "addOnTab", "addOnBlur", "duplicate", "delimiter", "max", "convertValue", "displayValue", "required"), emits);
    const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, size: formFieldSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField(_props);
    const { orientation, size: fieldGroupSize } = useFieldGroup(_props);
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
    const inputSize = computed(() => fieldGroupSize.value || formFieldSize.value);
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.inputTags || {} })({
      color: color.value ?? props.color,
      variant: props.variant,
      size: inputSize?.value ?? props.size,
      loading: props.loading,
      highlight: highlight.value ?? props.highlight,
      fixed: props.fixed,
      leading: isLeading.value || !!props.avatar || !!slots.leading,
      trailing: isTrailing.value || !!slots.trailing,
      fieldGroup: orientation.value
    }));
    const inputRef = useTemplateRef("inputRef");
    function onUpdate(value) {
      if (toRaw(props.modelValue) === value) {
        return;
      }
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
      emitFormInput();
    }
    function onBlur(event) {
      emits("blur", event);
      emitFormBlur();
    }
    function onFocus(event) {
      emits("focus", event);
      emitFormFocus();
    }
    __expose({
      inputRef: toRef(() => inputRef.value?.$el)
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TagsInputRoot_default), mergeProps({
        id: unref(id),
        "model-value": unref(props).modelValue,
        "default-value": unref(props).defaultValue,
        "data-slot": "root",
        class: ui.value.root({ class: [ui.value.base({ class: unref(props).ui?.base }), unref(props).ui?.root, unref(props).class] })
      }, unref(rootProps), {
        name: unref(name),
        disabled: unref(disabled),
        "onUpdate:modelValue": onUpdate
      }, _attrs), {
        default: withCtx(({ modelValue: tags }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(tags, (item, index) => {
              _push2(ssrRenderComponent(unref(TagsInputItem_default), {
                key: index,
                value: item,
                "data-slot": "item",
                class: ui.value.item({ class: [unref(props).ui?.item] })
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(TagsInputItemText_default), {
                      "data-slot": "itemText",
                      class: ui.value.itemText({ class: [unref(props).ui?.itemText] })
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (!!slots["item-text"]) {
                            ssrRenderSlot(_ctx.$slots, "item-text", {
                              item,
                              index,
                              ui: ui.value
                            }, null, _push4, _parent4, _scopeId3);
                          } else {
                            _push4(`<!---->`);
                          }
                        } else {
                          return [
                            !!slots["item-text"] ? renderSlot(_ctx.$slots, "item-text", {
                              key: 0,
                              item,
                              index,
                              ui: ui.value
                            }) : createCommentVNode("", true)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(TagsInputItemDelete_default), {
                      "data-slot": "itemDelete",
                      class: ui.value.itemDelete({ class: [unref(props).ui?.itemDelete] }),
                      disabled: unref(disabled)
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderSlot(_ctx.$slots, "item-delete", {
                            item,
                            index,
                            ui: ui.value
                          }, () => {
                            _push4(ssrRenderComponent(_sfc_main$d, {
                              name: unref(props).deleteIcon || unref(appConfig).ui.icons.close,
                              "data-slot": "itemDeleteIcon",
                              class: ui.value.itemDeleteIcon({ class: [unref(props).ui?.itemDeleteIcon] })
                            }, null, _parent4, _scopeId3));
                          }, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "item-delete", {
                              item,
                              index,
                              ui: ui.value
                            }, () => [
                              createVNode(_sfc_main$d, {
                                name: unref(props).deleteIcon || unref(appConfig).ui.icons.close,
                                "data-slot": "itemDeleteIcon",
                                class: ui.value.itemDeleteIcon({ class: [unref(props).ui?.itemDeleteIcon] })
                              }, null, 8, ["name", "class"])
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(TagsInputItemText_default), {
                        "data-slot": "itemText",
                        class: ui.value.itemText({ class: [unref(props).ui?.itemText] })
                      }, {
                        default: withCtx(() => [
                          !!slots["item-text"] ? renderSlot(_ctx.$slots, "item-text", {
                            key: 0,
                            item,
                            index,
                            ui: ui.value
                          }) : createCommentVNode("", true)
                        ]),
                        _: 2
                      }, 1032, ["class"]),
                      createVNode(unref(TagsInputItemDelete_default), {
                        "data-slot": "itemDelete",
                        class: ui.value.itemDelete({ class: [unref(props).ui?.itemDelete] }),
                        disabled: unref(disabled)
                      }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "item-delete", {
                            item,
                            index,
                            ui: ui.value
                          }, () => [
                            createVNode(_sfc_main$d, {
                              name: unref(props).deleteIcon || unref(appConfig).ui.icons.close,
                              "data-slot": "itemDeleteIcon",
                              class: ui.value.itemDeleteIcon({ class: [unref(props).ui?.itemDeleteIcon] })
                            }, null, 8, ["name", "class"])
                          ])
                        ]),
                        _: 2
                      }, 1032, ["class", "disabled"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(unref(TagsInputInput_default), mergeProps({
              ref_key: "inputRef",
              ref: inputRef
            }, { ..._ctx.$attrs, ...unref(ariaAttrs) }, {
              placeholder: unref(props).placeholder,
              "max-length": unref(props).maxLength,
              "data-slot": "input",
              class: ui.value.input({ class: unref(props).ui?.input }),
              onBlur,
              onFocus
            }), null, _parent2, _scopeId));
            ssrRenderSlot(_ctx.$slots, "default", { ui: ui.value }, null, _push2, _parent2, _scopeId);
            if (unref(isLeading) || !!unref(props).avatar || !!slots.leading) {
              _push2(`<span data-slot="leading" class="${ssrRenderClass(ui.value.leading({ class: unref(props).ui?.leading }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
                if (unref(isLeading) && unref(leadingIconName)) {
                  _push2(ssrRenderComponent(_sfc_main$d, {
                    name: unref(leadingIconName),
                    "data-slot": "leadingIcon",
                    class: ui.value.leadingIcon({ class: unref(props).ui?.leadingIcon })
                  }, null, _parent2, _scopeId));
                } else if (!!unref(props).avatar) {
                  _push2(ssrRenderComponent(_sfc_main$b$1, mergeProps({
                    size: unref(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
                  }, unref(props).avatar, {
                    "data-slot": "leadingAvatar",
                    class: ui.value.leadingAvatar({ class: unref(props).ui?.leadingAvatar })
                  }), null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              }, _push2, _parent2, _scopeId);
              _push2(`</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(isTrailing) || !!slots.trailing) {
              _push2(`<span data-slot="trailing" class="${ssrRenderClass(ui.value.trailing({ class: unref(props).ui?.trailing }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => {
                if (unref(trailingIconName)) {
                  _push2(ssrRenderComponent(_sfc_main$d, {
                    name: unref(trailingIconName),
                    "data-slot": "trailingIcon",
                    class: ui.value.trailingIcon({ class: unref(props).ui?.trailingIcon })
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              }, _push2, _parent2, _scopeId);
              _push2(`</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(tags, (item, index) => {
                return openBlock(), createBlock(unref(TagsInputItem_default), {
                  key: index,
                  value: item,
                  "data-slot": "item",
                  class: ui.value.item({ class: [unref(props).ui?.item] })
                }, {
                  default: withCtx(() => [
                    createVNode(unref(TagsInputItemText_default), {
                      "data-slot": "itemText",
                      class: ui.value.itemText({ class: [unref(props).ui?.itemText] })
                    }, {
                      default: withCtx(() => [
                        !!slots["item-text"] ? renderSlot(_ctx.$slots, "item-text", {
                          key: 0,
                          item,
                          index,
                          ui: ui.value
                        }) : createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1032, ["class"]),
                    createVNode(unref(TagsInputItemDelete_default), {
                      "data-slot": "itemDelete",
                      class: ui.value.itemDelete({ class: [unref(props).ui?.itemDelete] }),
                      disabled: unref(disabled)
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "item-delete", {
                          item,
                          index,
                          ui: ui.value
                        }, () => [
                          createVNode(_sfc_main$d, {
                            name: unref(props).deleteIcon || unref(appConfig).ui.icons.close,
                            "data-slot": "itemDeleteIcon",
                            class: ui.value.itemDeleteIcon({ class: [unref(props).ui?.itemDeleteIcon] })
                          }, null, 8, ["name", "class"])
                        ])
                      ]),
                      _: 2
                    }, 1032, ["class", "disabled"])
                  ]),
                  _: 2
                }, 1032, ["value", "class"]);
              }), 128)),
              createVNode(unref(TagsInputInput_default), mergeProps({
                ref_key: "inputRef",
                ref: inputRef
              }, { ..._ctx.$attrs, ...unref(ariaAttrs) }, {
                placeholder: unref(props).placeholder,
                "max-length": unref(props).maxLength,
                "data-slot": "input",
                class: ui.value.input({ class: unref(props).ui?.input }),
                onBlur,
                onFocus
              }), null, 16, ["placeholder", "max-length", "class"]),
              renderSlot(_ctx.$slots, "default", { ui: ui.value }),
              unref(isLeading) || !!unref(props).avatar || !!slots.leading ? (openBlock(), createBlock("span", {
                key: 0,
                "data-slot": "leading",
                class: ui.value.leading({ class: unref(props).ui?.leading })
              }, [
                renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [
                  unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$d, {
                    key: 0,
                    name: unref(leadingIconName),
                    "data-slot": "leadingIcon",
                    class: ui.value.leadingIcon({ class: unref(props).ui?.leadingIcon })
                  }, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$b$1, mergeProps({
                    key: 1,
                    size: unref(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
                  }, unref(props).avatar, {
                    "data-slot": "leadingAvatar",
                    class: ui.value.leadingAvatar({ class: unref(props).ui?.leadingAvatar })
                  }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                ])
              ], 2)) : createCommentVNode("", true),
              unref(isTrailing) || !!slots.trailing ? (openBlock(), createBlock("span", {
                key: 1,
                "data-slot": "trailing",
                class: ui.value.trailing({ class: unref(props).ui?.trailing })
              }, [
                renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => [
                  unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$d, {
                    key: 0,
                    name: unref(trailingIconName),
                    "data-slot": "trailingIcon",
                    class: ui.value.trailingIcon({ class: unref(props).ui?.trailingIcon })
                  }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                ])
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/InputTags.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "projetos",
  __ssrInlineRender: true,
  setup(__props) {
    const df = new DateFormatter("en-US", { dateStyle: "medium" });
    const tz = getLocalTimeZone();
    const breakpoints = useBreakpoints(breakpointsTailwind);
    const isDesktop = breakpoints.greaterOrEqual("sm");
    const ranges = [
      { label: "Last 7 days", days: 7 },
      { label: "Last 14 days", days: 14 },
      { label: "Last 30 days", days: 30 },
      { label: "Last 3 months", months: 3 },
      { label: "Last 6 months", months: 6 },
      { label: "Last year", years: 1 }
    ];
    const initialEnd = today(tz);
    const modelValue = shallowRef({
      start: initialEnd.subtract({ days: 14 }),
      end: initialEnd
    });
    const label = computed(() => {
      const { start, end } = modelValue.value;
      if (!start) return "Pick a date";
      if (!end) return df.format(start.toDate(tz));
      return `${df.format(start.toDate(tz))} - ${df.format(end.toDate(tz))}`;
    });
    function computeStart(range) {
      const end = today(tz);
      return {
        start: end.subtract({
          days: range.days,
          months: range.months,
          years: range.years
        }),
        end
      };
    }
    function isRangeSelected(range) {
      if (!modelValue.value?.start || !modelValue.value?.end) return false;
      const { start, end } = computeStart(range);
      return modelValue.value.start.compare(start) === 0 && modelValue.value.end.compare(end) === 0;
    }
    function selectRange(range) {
      modelValue.value = computeStart(range);
    }
    const table = useTemplateRef("table");
    const data = ref([
      {
        id: "4600",
        date: "2026-06-16T15:30:00",
        email: "RH",
        amount: 594
      },
      {
        id: "4599",
        date: "2026-06-11T10:10:00",
        email: "Marketing",
        amount: 276
      },
      {
        id: "4598",
        date: "2026-06-11T08:50:00",
        email: "Mobile",
        amount: 315
      },
      {
        id: "4597",
        date: "2026-06-10T19:45:00",
        email: "Portal do cliente",
        amount: 529
      }
    ]);
    const columns = [
      {
        accessorKey: "id",
        header: "#",
        cell: ({ row }) => `#${row.getValue("id")}`
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
          return new Date(row.getValue("date")).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          });
        }
      },
      {
        accessorKey: "email",
        header: "Email"
      },
      {
        accessorKey: "amount",
        header: "Amount",
        meta: {
          class: {
            th: "text-right",
            td: "text-right font-medium"
          }
        },
        cell: ({ row }) => {
          const amount = Number.parseFloat(row.getValue("amount"));
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "EUR"
          }).format(amount);
        }
      }
    ];
    const pagination = ref({
      pageIndex: 0,
      pageSize: 5
    });
    const globalFilter = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$2;
      const _component_UButton = _sfc_main$8;
      const _component_UFormField = _sfc_main$3;
      const _component_UInput = _sfc_main$4;
      const _component_UTextarea = _sfc_main$5;
      const _component_UInputTags = _sfc_main$1;
      const _component_UBadge = _sfc_main$6;
      const _component_UPopover = _sfc_main$7;
      const _component_UCalendar = _sfc_main$9;
      const _component_UIcon = _sfc_main$d;
      const _component_UTable = _sfc_main$a;
      const _component_UPagination = _sfc_main$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl space-y-5 p-4 sm:p-6 dark:bg-slate-900 h-full" }, _attrs))}><div class="flex items-center justify-between md:flex-col lg:flex-row gap-4"><div><h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100"> Projetos </h1></div>`);
      _push(ssrRenderComponent(_component_UModal, { title: "Criar novo projeto" }, {
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col w-full max-w-lg mx-auto gap-4 justify-center"${_scopeId}><h1${_scopeId}>Informações gerais</h1>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Nome do projeto",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    placeholder: "Nome do projeto",
                    color: "secondary",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      placeholder: "Nome do projeto",
                      color: "secondary",
                      class: "w-full"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Descrição" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UTextarea, {
                    placeholder: "Digite a descrição do projeto...",
                    color: "secondary",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UTextarea, {
                      placeholder: "Digite a descrição do projeto...",
                      color: "secondary",
                      class: "w-full"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<ul class="flex flex-col gap-4"${_scopeId}><li${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Categoria",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    placeholder: "Categoria...",
                    color: "secondary",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      placeholder: "Categoria...",
                      color: "secondary",
                      class: "w-full"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Prioridade",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInputTags, {
                    placeholder: "Selecionar a prioridade...",
                    color: "secondary",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInputTags, {
                      placeholder: "Selecionar a prioridade...",
                      color: "secondary",
                      class: "w-full"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<ul class="flex items-center gap-2 flex-row mt-2"${_scopeId}><li${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              icon: "i-heroicons-chevron-double-up",
              size: "md",
              color: "error",
              variant: "soft"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Alta`);
                } else {
                  return [
                    createTextVNode("Alta")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              icon: "i-heroicons-chevron-up",
              size: "md",
              color: "warning",
              variant: "soft"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Média`);
                } else {
                  return [
                    createTextVNode("Média")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              icon: "i-heroicons-chevron-up-down",
              size: "md",
              color: "success",
              variant: "soft"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Baixa`);
                } else {
                  return [
                    createTextVNode("Baixa")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li></ul></li><li${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Datas : início - término",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UPopover, { content: { align: "center" } }, {
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex items-stretch divide-x divide-(--ui-border)"${_scopeId3}><div class="hidden sm:flex flex-col justify-center py-2"${_scopeId3}><!--[-->`);
                        ssrRenderList(ranges, (range, index) => {
                          _push4(ssrRenderComponent(_component_UButton, {
                            key: index,
                            label: range.label,
                            color: "neutral",
                            variant: "ghost",
                            class: ["rounded-none px-4", [
                              isRangeSelected(range) ? "bg-elevated" : "hover:bg-elevated/50"
                            ]],
                            truncate: "",
                            onClick: ($event) => selectRange(range)
                          }, null, _parent4, _scopeId3));
                        });
                        _push4(`<!--]--></div>`);
                        _push4(ssrRenderComponent(_component_UCalendar, {
                          modelValue: unref(modelValue),
                          "onUpdate:modelValue": ($event) => isRef(modelValue) ? modelValue.value = $event : null,
                          class: "p-2",
                          "number-of-months": unref(isDesktop) ? 2 : 1,
                          range: ""
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex items-stretch divide-x divide-(--ui-border)" }, [
                            createVNode("div", { class: "hidden sm:flex flex-col justify-center py-2" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(ranges, (range, index) => {
                                return createVNode(_component_UButton, {
                                  key: index,
                                  label: range.label,
                                  color: "neutral",
                                  variant: "ghost",
                                  class: ["rounded-none px-4", [
                                    isRangeSelected(range) ? "bg-elevated" : "hover:bg-elevated/50"
                                  ]],
                                  truncate: "",
                                  onClick: ($event) => selectRange(range)
                                }, null, 8, ["label", "class", "onClick"]);
                              }), 64))
                            ]),
                            createVNode(_component_UCalendar, {
                              modelValue: unref(modelValue),
                              "onUpdate:modelValue": ($event) => isRef(modelValue) ? modelValue.value = $event : null,
                              class: "p-2",
                              "number-of-months": unref(isDesktop) ? 2 : 1,
                              range: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "number-of-months"])
                          ])
                        ];
                      }
                    }),
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UButton, {
                          color: "neutral",
                          variant: "soft",
                          icon: "i-heroicons-calendar-days"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(unref(label))}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(label)), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UButton, {
                            color: "neutral",
                            variant: "soft",
                            icon: "i-heroicons-calendar-days"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(label)), 1)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UPopover, { content: { align: "center" } }, {
                      content: withCtx(() => [
                        createVNode("div", { class: "flex items-stretch divide-x divide-(--ui-border)" }, [
                          createVNode("div", { class: "hidden sm:flex flex-col justify-center py-2" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(ranges, (range, index) => {
                              return createVNode(_component_UButton, {
                                key: index,
                                label: range.label,
                                color: "neutral",
                                variant: "ghost",
                                class: ["rounded-none px-4", [
                                  isRangeSelected(range) ? "bg-elevated" : "hover:bg-elevated/50"
                                ]],
                                truncate: "",
                                onClick: ($event) => selectRange(range)
                              }, null, 8, ["label", "class", "onClick"]);
                            }), 64))
                          ]),
                          createVNode(_component_UCalendar, {
                            modelValue: unref(modelValue),
                            "onUpdate:modelValue": ($event) => isRef(modelValue) ? modelValue.value = $event : null,
                            class: "p-2",
                            "number-of-months": unref(isDesktop) ? 2 : 1,
                            range: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "number-of-months"])
                        ])
                      ]),
                      default: withCtx(() => [
                        createVNode(_component_UButton, {
                          color: "neutral",
                          variant: "soft",
                          icon: "i-heroicons-calendar-days"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(label)), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li></ul></div><div class="flex justify-center gap-2 mt-4 w-full"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "error",
              variant: "outline",
              class: "w-full justify-center"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Cancelar`);
                } else {
                  return [
                    createTextVNode("Cancelar")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "secondary",
              variant: "subtle",
              class: "w-full justify-center"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Criar`);
                } else {
                  return [
                    createTextVNode("Criar")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col w-full max-w-lg mx-auto gap-4 justify-center" }, [
                createVNode("h1", null, "Informações gerais"),
                createVNode(_component_UFormField, {
                  label: "Nome do projeto",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      placeholder: "Nome do projeto",
                      color: "secondary",
                      class: "w-full"
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, { label: "Descrição" }, {
                  default: withCtx(() => [
                    createVNode(_component_UTextarea, {
                      placeholder: "Digite a descrição do projeto...",
                      color: "secondary",
                      class: "w-full"
                    })
                  ]),
                  _: 1
                }),
                createVNode("ul", { class: "flex flex-col gap-4" }, [
                  createVNode("li", null, [
                    createVNode(_component_UFormField, {
                      label: "Categoria",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          placeholder: "Categoria...",
                          color: "secondary",
                          class: "w-full"
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("li", null, [
                    createVNode(_component_UFormField, {
                      label: "Prioridade",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInputTags, {
                          placeholder: "Selecionar a prioridade...",
                          color: "secondary",
                          class: "w-full"
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("ul", { class: "flex items-center gap-2 flex-row mt-2" }, [
                      createVNode("li", null, [
                        createVNode(_component_UBadge, {
                          icon: "i-heroicons-chevron-double-up",
                          size: "md",
                          color: "error",
                          variant: "soft"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Alta")
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("li", null, [
                        createVNode(_component_UBadge, {
                          icon: "i-heroicons-chevron-up",
                          size: "md",
                          color: "warning",
                          variant: "soft"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Média")
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("li", null, [
                        createVNode(_component_UBadge, {
                          icon: "i-heroicons-chevron-up-down",
                          size: "md",
                          color: "success",
                          variant: "soft"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Baixa")
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  createVNode("li", null, [
                    createVNode(_component_UFormField, {
                      label: "Datas : início - término",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UPopover, { content: { align: "center" } }, {
                          content: withCtx(() => [
                            createVNode("div", { class: "flex items-stretch divide-x divide-(--ui-border)" }, [
                              createVNode("div", { class: "hidden sm:flex flex-col justify-center py-2" }, [
                                (openBlock(), createBlock(Fragment, null, renderList(ranges, (range, index) => {
                                  return createVNode(_component_UButton, {
                                    key: index,
                                    label: range.label,
                                    color: "neutral",
                                    variant: "ghost",
                                    class: ["rounded-none px-4", [
                                      isRangeSelected(range) ? "bg-elevated" : "hover:bg-elevated/50"
                                    ]],
                                    truncate: "",
                                    onClick: ($event) => selectRange(range)
                                  }, null, 8, ["label", "class", "onClick"]);
                                }), 64))
                              ]),
                              createVNode(_component_UCalendar, {
                                modelValue: unref(modelValue),
                                "onUpdate:modelValue": ($event) => isRef(modelValue) ? modelValue.value = $event : null,
                                class: "p-2",
                                "number-of-months": unref(isDesktop) ? 2 : 1,
                                range: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "number-of-months"])
                            ])
                          ]),
                          default: withCtx(() => [
                            createVNode(_component_UButton, {
                              color: "neutral",
                              variant: "soft",
                              icon: "i-heroicons-calendar-days"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(unref(label)), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode("div", { class: "flex justify-center gap-2 mt-4 w-full" }, [
                createVNode(_component_UButton, {
                  color: "error",
                  variant: "outline",
                  class: "w-full justify-center"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Cancelar")
                  ]),
                  _: 1
                }),
                createVNode(_component_UButton, {
                  color: "secondary",
                  variant: "subtle",
                  class: "w-full justify-center"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Criar")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              label: "Criar novo projeto",
              "trailing-icon": "i-heroicons-plus",
              size: "md",
              color: "secondary",
              variant: "subtle"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                label: "Criar novo projeto",
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
      _push(`</div><ul class="mt-4 flex flex-col gap-4 md:flex-col lg:flex-row md:w-full lg:w-full md:justify-center"><li><div class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-2 border-slate-200 dark:border-slate-700 lg:w-54 lg:h-32 border-t-violet-600 border-t-4 dark:border-t-violet-600">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-inbox-stack",
        class: "size-12 text-violet-300 bg-violet-600 rounded-full p-2 shadow-lg shadow-violet-800/50 hover:translate-y-[-4px] transition-transform duration-400"
      }, null, _parent));
      _push(`<div class="flex flex-col sm:items-center md:items-start lg:items-start"><p class="font-medium text-slate-700 dark:text-slate-300"> Total de projetos </p><h1 class="text-2xl font-bold text-violet-600">7</h1></div></div></li><li><div class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-2 border-slate-200 dark:border-slate-700 lg:w-54 lg:h-32 border-t-orange-400 border-t-4 dark:border-t-orange-400">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-play-circle",
        class: "size-12 text-yellow-200 bg-orange-400 rounded-full p-2 shadow-lg shadow-orange-800/50 hover:translate-y-[-4px] transition-transform duration-400"
      }, null, _parent));
      _push(`<div class="flex flex-col sm:items-center md:items-center lg:items-start"><p class="font-medium text-slate-700 dark:text-slate-300"> em andamento </p><h1 class="text-2xl font-bold text-orange-500">5</h1></div></div></li><li><div class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-2 border-slate-200 dark:border-slate-700 lg:w-54 lg:h-32 border-t-green-600 border-t-4 dark:border-t-green-600">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-check-badge",
        class: "size-12 text-emerald-200 bg-green-600 rounded-full p-2 shadow-lg shadow-emerald-800/50 hover:translate-y-[-4px] transition-transform duration-400"
      }, null, _parent));
      _push(`<div class="flex flex-col sm:items-center md:items-center lg:items-start"><p class="font-medium text-slate-700 dark:text-slate-300"> Concluídos </p><h1 class="text-2xl font-bold text-green-600">2</h1></div></div></li><li><div class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-2 border-slate-200 dark:border-slate-700 lg:w-54 lg:h-32 border-t-red-600 border-t-4 dark:border-t-red-600">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-exclamation-circle",
        class: "size-12 text-rose-200 bg-red-500 rounded-full p-2 shadow-lg shadow-red-800/50 hover:translate-y-[-4px] transition-transform duration-400"
      }, null, _parent));
      _push(`<div class="flex flex-col sm:items-center md:items-center lg:items-start"><p class="font-medium text-slate-700 dark:text-slate-300"> Atrasados </p><h1 class="text-2xl font-bold text-red-500">3</h1></div></div></li><li><div class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-2 border-slate-200 dark:border-slate-700 lg:w-54 lg:h-32 border-t-blue-600 border-t-4 dark:border-t-blue-600">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-user-group",
        class: "size-12 text-sky-300 bg-blue-600 rounded-full p-2 shadow-lg shadow-sky-800/50 hover:translate-y-[-4px] transition-transform duration-400"
      }, null, _parent));
      _push(`<div class="flex flex-col sm:items-center md:items-center lg:items-start"><p class="font-medium text-slate-700 dark:text-slate-300"> Gestores ativos </p><h1 class="text-2xl font-bold text-blue-600">12</h1></div></div></li></ul><div class="w-full space-y-4 pb-4"><div class="flex px-4 py-3.5 border-b border-accented">`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(globalFilter),
        "onUpdate:modelValue": ($event) => isRef(globalFilter) ? globalFilter.value = $event : null,
        class: "max-w-sm",
        placeholder: "Filtro...",
        color: "secondary"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UTable, {
        ref_key: "table",
        ref: table,
        pagination: unref(pagination),
        "onUpdate:pagination": ($event) => isRef(pagination) ? pagination.value = $event : null,
        "global-filter": unref(globalFilter),
        "onUpdate:globalFilter": ($event) => isRef(globalFilter) ? globalFilter.value = $event : null,
        data: unref(data),
        columns,
        "pagination-options": {
          getPaginationRowModel: unref(getPaginationRowModel)()
        },
        class: "flex-1"
      }, null, _parent));
      _push(`<div class="flex justify-end border-t border-default pt-4 px-4">`);
      _push(ssrRenderComponent(_component_UPagination, {
        page: (unref(table)?.tableApi?.getState().pagination.pageIndex || 0) + 1,
        "items-per-page": unref(table)?.tableApi?.getState().pagination.pageSize,
        total: unref(table)?.tableApi?.getFilteredRowModel().rows.length,
        "onUpdate:page": (p) => unref(table)?.tableApi?.setPageIndex(p - 1)
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/projetos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=projetos-ClmqkT_V.mjs.map
