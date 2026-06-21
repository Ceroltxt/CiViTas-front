import { R as useForwardExpose, P as Presence_default, T as Teleport_default, b as Primitive, k as createContext, U as useForwardProps$1, Z as usePrimitiveElement, N as useEmitAsProps, K as useCollection, t as getActiveElement, x as injectConfigProviderContext } from './server.mjs';
import { isToday, getLocalTimeZone, isSameMonth, isSameDay, isEqualDay, CalendarDate, getDayOfWeek, startOfWeek, DateFormatter, createCalendar, toCalendar, CalendarDateTime, isEqualMonth, ZonedDateTime, today, startOfMonth, endOfMonth } from '@internationalized/date';
import { u as useDirection } from './useDirection-B3h_OC89.mjs';
import { defineComponent, openBlock, createBlock, unref, normalizeProps, guardReactiveProps, withCtx, renderSlot, createVNode, mergeProps, toRefs, ref, resolveDynamicComponent, isRef, withKeys, nextTick, watchEffect, withModifiers, watch, computed, watchSyncEffect, mergeDefaults, createTextVNode, toDisplayString, createElementVNode } from 'vue';
import { useVModel, createSharedComposable, reactiveOmit as reactiveOmit$1, useEventListener } from '@vueuse/core';
import { a as PopperArrow_default, e as useForwardPropsEmits, P as PopperAnchor_default, d as PopperRoot_default, c as PopperContent_default, u as useFocusGuards, f as useTypeahead, b as PopperContentPropsDefaultValue } from './PopperArrow-C07et48U.mjs';
import { D as DismissableLayer_default, u as useBodyScrollLock, k as useHideOthers, a as FocusScope_default, d as getOpenState, b as SUB_CLOSE_KEYS, g as getCheckedState, i as isIndeterminate, S as SELECTION_KEYS, c as SUB_OPEN_KEYS, e as isMouseEvent, j as isPointerInGraceArea, F as FIRST_LAST_KEYS, L as LAST_KEYS, f as focusFirst, I as ITEM_SELECT } from './utils-CJXk8l7g.mjs';
import { R as RovingFocusGroup_default } from './RovingFocusGroup-Dpm1zhJB.mjs';
import { u as useId } from './useId-Df0AxZi5.mjs';
import { syncRef, refAutoReset, tryOnScopeDispose, createEventHook, reactiveOmit } from '@vueuse/shared';

const ignoredElement = ["INPUT", "TEXTAREA"];
function useArrowNavigation(e, currentElement, parentElement, options = {}) {
  if (!currentElement || options.enableIgnoredElement && ignoredElement.includes(currentElement.nodeName)) return null;
  const { arrowKeyOptions = "both", attributeName = "[data-reka-collection-item]", itemsArray = [], loop = true, dir = "ltr", preventScroll = true, focus = false } = options;
  const [right, left, up, down, home, end] = [
    e.key === "ArrowRight",
    e.key === "ArrowLeft",
    e.key === "ArrowUp",
    e.key === "ArrowDown",
    e.key === "Home",
    e.key === "End"
  ];
  const goingVertical = up || down;
  const goingHorizontal = right || left;
  if (!home && !end && (!goingVertical && !goingHorizontal || arrowKeyOptions === "vertical" && goingHorizontal || arrowKeyOptions === "horizontal" && goingVertical)) return null;
  const allCollectionItems = parentElement ? Array.from(parentElement.querySelectorAll(attributeName)) : itemsArray;
  if (!allCollectionItems.length) return null;
  if (preventScroll) e.preventDefault();
  let item = null;
  if (goingHorizontal || goingVertical) {
    const goForward = goingVertical ? down : dir === "ltr" ? right : left;
    item = findNextFocusableElement(allCollectionItems, currentElement, {
      goForward,
      loop
    });
  } else if (home) item = allCollectionItems.at(0) || null;
  else if (end) item = allCollectionItems.at(-1) || null;
  if (focus) item?.focus();
  return item;
}
function findNextFocusableElement(elements, currentElement, options, iterations = !elements.includes(currentElement) ? elements.length + 1 : elements.length) {
  if (--iterations === 0) return null;
  const index = elements.indexOf(currentElement);
  let newIndex;
  if (index === -1) newIndex = options.goForward ? 0 : elements.length - 1;
  else newIndex = options.goForward ? index + 1 : index - 1;
  if (!options.loop && (newIndex < 0 || newIndex >= elements.length)) return null;
  const adjustedNewIndex = (newIndex + elements.length) % elements.length;
  const candidate = elements[adjustedNewIndex];
  if (!candidate) return null;
  const isDisabled = candidate.hasAttribute("disabled") && candidate.getAttribute("disabled") !== "false";
  if (isDisabled) return findNextFocusableElement(elements, candidate, options, iterations);
  return candidate;
}
function toDate(dateValue, tz = getLocalTimeZone()) {
  if (isZonedDateTime(dateValue)) return dateValue.toDate();
  else return dateValue.toDate(tz);
}
function isCalendarDateTime(dateValue) {
  return dateValue instanceof CalendarDateTime;
}
function isZonedDateTime(dateValue) {
  return dateValue instanceof ZonedDateTime;
}
function hasTime(dateValue) {
  return isCalendarDateTime(dateValue) || isZonedDateTime(dateValue);
}
function getDaysInMonth(date) {
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
  } else return date.set({ day: 100 }).day;
}
function isBefore(dateToCompare, referenceDate) {
  return dateToCompare.compare(referenceDate) < 0;
}
function isAfter(dateToCompare, referenceDate) {
  return dateToCompare.compare(referenceDate) > 0;
}
function isBeforeOrSame(dateToCompare, referenceDate) {
  return dateToCompare.compare(referenceDate) <= 0;
}
function isAfterOrSame(dateToCompare, referenceDate) {
  return dateToCompare.compare(referenceDate) >= 0;
}
function isBetweenInclusive(date, start, end) {
  return isAfterOrSame(date, start) && isBeforeOrSame(date, end);
}
function isBetween(date, start, end) {
  return isAfter(date, start) && isBefore(date, end);
}
function getLastFirstDayOfWeek(date, firstDayOfWeek, locale) {
  const day = getDayOfWeek(date, locale, "sun");
  if (firstDayOfWeek > day) return date.subtract({ days: day + 7 - firstDayOfWeek });
  if (firstDayOfWeek === day) return date;
  return date.subtract({ days: day - firstDayOfWeek });
}
function getNextLastDayOfWeek(date, firstDayOfWeek, locale) {
  const day = getDayOfWeek(date, locale, "sun");
  const lastDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  if (day === lastDayOfWeek) return date;
  if (day > lastDayOfWeek) return date.add({ days: 7 - day + lastDayOfWeek });
  return date.add({ days: lastDayOfWeek - day });
}
function areAllDaysBetweenValid(start, end, isUnavailable, isDisabled, isHighlightable) {
  if (isUnavailable === void 0 && isDisabled === void 0 && isHighlightable === void 0) return true;
  let dCurrent = start.add({ days: 1 });
  if ((isDisabled?.(dCurrent) || isUnavailable?.(dCurrent)) && !isHighlightable?.(dCurrent)) return false;
  const dEnd = end;
  while (dCurrent.compare(dEnd) < 0) {
    dCurrent = dCurrent.add({ days: 1 });
    if ((isDisabled?.(dCurrent) || isUnavailable?.(dCurrent)) && !isHighlightable?.(dCurrent)) return false;
  }
  return true;
}
function getDefaultDate(props) {
  const { defaultValue, defaultPlaceholder, granularity = "day", locale = "en" } = props;
  if (Array.isArray(defaultValue) && defaultValue.length) return defaultValue.at(-1).copy();
  if (defaultValue && !Array.isArray(defaultValue)) return defaultValue.copy();
  if (defaultPlaceholder) return defaultPlaceholder.copy();
  const date = /* @__PURE__ */ new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const calendarDateTimeGranularities = [
    "hour",
    "minute",
    "second"
  ];
  const defaultFormatter = new DateFormatter(locale);
  const calendar = createCalendar(defaultFormatter.resolvedOptions().calendar);
  if (calendarDateTimeGranularities.includes(granularity ?? "day")) return toCalendar(new CalendarDateTime(year, month, day, 0, 0, 0), calendar);
  return toCalendar(new CalendarDate(year, month, day), calendar);
}
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}
function getDaysBetween(start, end) {
  const days = [];
  let dCurrent = start.add({ days: 1 });
  const dEnd = end;
  while (dCurrent.compare(dEnd) < 0) {
    days.push(dCurrent);
    dCurrent = dCurrent.add({ days: 1 });
  }
  return days;
}
function createMonth(props) {
  const { dateObj, weekStartsOn, fixedWeeks, locale } = props;
  const daysInMonth = getDaysInMonth(dateObj);
  const datesArray = Array.from({ length: daysInMonth }, (_, i) => dateObj.set({ day: i + 1 }));
  const firstDayOfMonth = startOfMonth(dateObj);
  const lastDayOfMonth = endOfMonth(dateObj);
  const lastSunday = getLastFirstDayOfWeek(firstDayOfMonth, weekStartsOn, locale);
  const nextSaturday = getNextLastDayOfWeek(lastDayOfMonth, weekStartsOn, locale);
  const lastMonthDays = getDaysBetween(lastSunday.subtract({ days: 1 }), firstDayOfMonth);
  const nextMonthDays = getDaysBetween(lastDayOfMonth, nextSaturday.add({ days: 1 }));
  const totalDays = lastMonthDays.length + datesArray.length + nextMonthDays.length;
  if (fixedWeeks && totalDays < 42) {
    const extraDays = 42 - totalDays;
    let startFrom = nextMonthDays.at(-1);
    if (!startFrom) startFrom = endOfMonth(dateObj);
    const extraDaysArray = Array.from({ length: extraDays }, (_, i) => {
      const incr = i + 1;
      return startFrom.add({ days: incr });
    });
    nextMonthDays.push(...extraDaysArray);
  }
  const allDays = lastMonthDays.concat(datesArray, nextMonthDays);
  const weeks = chunk(allDays, 7);
  return {
    value: dateObj,
    cells: allDays,
    rows: weeks
  };
}
function createMonths(props) {
  const { numberOfMonths, dateObj, ...monthProps } = props;
  const months = [];
  if (!numberOfMonths || numberOfMonths === 1) {
    months.push(createMonth({
      ...monthProps,
      dateObj
    }));
    return months;
  }
  months.push(createMonth({
    ...monthProps,
    dateObj
  }));
  for (let i = 1; i < numberOfMonths; i++) {
    const nextMonth = dateObj.add({ months: i });
    months.push(createMonth({
      ...monthProps,
      dateObj: nextMonth
    }));
  }
  return months;
}
function getWeekStartsOn(locale) {
  const monday = new CalendarDate(2025, 1, 6);
  const dayOfWeek = getDayOfWeek(monday, locale);
  return (1 - dayOfWeek + 7) % 7;
}
function getWeekNumber(date, locale = "en-US", firstDayOfWeek) {
  const jan1 = new CalendarDate(date.year, 1, 1);
  const usesISOWeek = jan1.toDate("UTC").getUTCDay() !== getDayOfWeek(jan1, locale);
  const weekStartsOn = firstDayOfWeek ?? (usesISOWeek ? "mon" : "sun");
  const firstWeekContainsDate = usesISOWeek ? 4 : 1;
  const dayOfWeek = getDayOfWeek(date, locale, weekStartsOn);
  const decidingDay = date.add({ days: 7 - firstWeekContainsDate - dayOfWeek });
  const weekYear = decidingDay.year;
  const week1Ref = new CalendarDate(weekYear, 1, firstWeekContainsDate);
  const week1Start = startOfWeek(week1Ref, locale, weekStartsOn);
  const currentWeekStart = startOfWeek(date, locale, weekStartsOn);
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1e3;
  const daysDiff = Math.round((currentWeekStart.toDate("UTC").getTime() - week1Start.toDate("UTC").getTime()) / MS_PER_WEEK);
  return daysDiff + 1;
}
function useDateFormatter(initialLocale, opts = {}) {
  const locale = ref(initialLocale);
  function getLocale() {
    return locale.value;
  }
  function setLocale(newLocale) {
    locale.value = newLocale;
  }
  function custom(date, options) {
    return new DateFormatter(locale.value, {
      ...opts,
      ...options
    }).format(date);
  }
  function selectedDate(date, includeTime = true) {
    if (hasTime(date) && includeTime) return custom(toDate(date), {
      dateStyle: "long",
      timeStyle: "long"
    });
    else return custom(toDate(date), { dateStyle: "long" });
  }
  function fullMonthAndYear(date, options = {}) {
    return new DateFormatter(locale.value, {
      ...opts,
      month: "long",
      year: "numeric",
      ...options
    }).format(date);
  }
  function fullMonth(date, options = {}) {
    return new DateFormatter(locale.value, {
      ...opts,
      month: "long",
      ...options
    }).format(date);
  }
  function getMonths() {
    const defaultDate = today(getLocalTimeZone());
    const months = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ];
    return months.map((item) => ({
      label: fullMonth(toDate(defaultDate.set({ month: item }))),
      value: item
    }));
  }
  function fullYear(date, options = {}) {
    return new DateFormatter(locale.value, {
      ...opts,
      year: "numeric",
      ...options
    }).format(date);
  }
  function toParts(date, options) {
    if (isZonedDateTime(date)) return new DateFormatter(locale.value, {
      ...opts,
      ...options,
      timeZone: date.timeZone
    }).formatToParts(toDate(date));
    else return new DateFormatter(locale.value, {
      ...opts,
      ...options
    }).formatToParts(toDate(date));
  }
  function dayOfWeek(date, length = "narrow") {
    return new DateFormatter(locale.value, {
      ...opts,
      weekday: length
    }).format(date);
  }
  function dayPeriod(date) {
    const parts = new DateFormatter(locale.value, {
      ...opts,
      hour: "numeric",
      minute: "numeric"
    }).formatToParts(date);
    const value = parts.find((p) => p.type === "dayPeriod")?.value;
    if (value === "PM" || value === "pm" || value === "p.m.") return "PM";
    return "AM";
  }
  const defaultPartOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };
  function part(dateObj, type, options = {}) {
    const opts$1 = {
      ...defaultPartOptions,
      ...options
    };
    const parts = toParts(dateObj, opts$1);
    const part$1 = parts.find((p) => p.type === type);
    return part$1 ? part$1.value : "";
  }
  return {
    setLocale,
    getLocale,
    fullMonth,
    fullYear,
    fullMonthAndYear,
    toParts,
    custom,
    part,
    dayPeriod,
    selectedDate,
    dayOfWeek,
    getMonths
  };
}
function useGraceArea(triggerElement, containerElement) {
  const isPointerInTransit = refAutoReset(false, 300);
  tryOnScopeDispose(() => {
    isPointerInTransit.value = false;
  });
  const pointerGraceArea = ref(null);
  const pointerExit = createEventHook();
  function handleRemoveGraceArea() {
    pointerGraceArea.value = null;
    isPointerInTransit.value = false;
  }
  function handleCreateGraceArea(event, hoverTarget) {
    if (!hoverTarget) return;
    const currentTarget = event.currentTarget;
    const exitPoint = {
      x: event.clientX,
      y: event.clientY
    };
    const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
    const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide, 1);
    const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
    const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
    pointerGraceArea.value = graceArea;
    isPointerInTransit.value = true;
  }
  watchEffect((cleanupFn) => {
    if (triggerElement.value && containerElement.value) {
      const handleTriggerLeave = (event) => handleCreateGraceArea(event, containerElement.value);
      const handleContentLeave = (event) => handleCreateGraceArea(event, triggerElement.value);
      triggerElement.value.addEventListener("pointerleave", handleTriggerLeave);
      containerElement.value.addEventListener("pointerleave", handleContentLeave);
      cleanupFn(() => {
        triggerElement.value?.removeEventListener("pointerleave", handleTriggerLeave);
        containerElement.value?.removeEventListener("pointerleave", handleContentLeave);
      });
    }
  });
  watchEffect((cleanupFn) => {
    if (pointerGraceArea.value) {
      const handleTrackPointerGrace = (event) => {
        if (!pointerGraceArea.value || !(event.target instanceof Element)) return;
        const target = event.target;
        const pointerPosition = {
          x: event.clientX,
          y: event.clientY
        };
        const hasEnteredTarget = triggerElement.value?.contains(target) || containerElement.value?.contains(target);
        const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea.value);
        const isAnotherGraceAreaTrigger = !!target.closest("[data-grace-area-trigger]");
        if (hasEnteredTarget) handleRemoveGraceArea();
        else if (isPointerOutsideGraceArea || isAnotherGraceAreaTrigger) {
          handleRemoveGraceArea();
          pointerExit.trigger();
        }
      };
      triggerElement.value?.ownerDocument.addEventListener("pointermove", handleTrackPointerGrace);
      cleanupFn(() => triggerElement.value?.ownerDocument.removeEventListener("pointermove", handleTrackPointerGrace));
    }
  });
  return {
    isPointerInTransit,
    onPointerExit: pointerExit.on
  };
}
function getExitSideFromRect(point, rect) {
  const top = Math.abs(rect.top - point.y);
  const bottom = Math.abs(rect.bottom - point.y);
  const right = Math.abs(rect.right - point.x);
  const left = Math.abs(rect.left - point.x);
  switch (Math.min(top, bottom, right, left)) {
    case left:
      return "left";
    case right:
      return "right";
    case top:
      return "top";
    case bottom:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
  const paddedExitPoints = [];
  switch (exitSide) {
    case "top":
      paddedExitPoints.push({
        x: exitPoint.x - padding,
        y: exitPoint.y + padding
      }, {
        x: exitPoint.x + padding,
        y: exitPoint.y + padding
      });
      break;
    case "bottom":
      paddedExitPoints.push({
        x: exitPoint.x - padding,
        y: exitPoint.y - padding
      }, {
        x: exitPoint.x + padding,
        y: exitPoint.y - padding
      });
      break;
    case "left":
      paddedExitPoints.push({
        x: exitPoint.x + padding,
        y: exitPoint.y - padding
      }, {
        x: exitPoint.x + padding,
        y: exitPoint.y + padding
      });
      break;
    case "right":
      paddedExitPoints.push({
        x: exitPoint.x - padding,
        y: exitPoint.y - padding
      }, {
        x: exitPoint.x - padding,
        y: exitPoint.y + padding
      });
      break;
  }
  return paddedExitPoints;
}
function getPointsFromRect(rect) {
  const { top, right, bottom, left } = rect;
  return [
    {
      x: left,
      y: top
    },
    {
      x: right,
      y: top
    },
    {
      x: right,
      y: bottom
    },
    {
      x: left,
      y: bottom
    }
  ];
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function getHull(points) {
  const newPoints = points.slice();
  newPoints.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else if (a.y < b.y) return -1;
    else if (a.y > b.y) return 1;
    else return 0;
  });
  return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
  if (points.length <= 1) return points.slice();
  const upperHull = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    while (upperHull.length >= 2) {
      const q = upperHull.at(-1);
      const r = upperHull[upperHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
      else break;
    }
    upperHull.push(p);
  }
  upperHull.pop();
  const lowerHull = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (lowerHull.length >= 2) {
      const q = lowerHull.at(-1);
      const r = lowerHull[lowerHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
      else break;
    }
    lowerHull.push(p);
  }
  lowerHull.pop();
  if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) return upperHull;
  else return upperHull.concat(lowerHull);
}
function useKbd() {
  return {
    ALT: "Alt",
    ARROW_DOWN: "ArrowDown",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
    ARROW_UP: "ArrowUp",
    BACKSPACE: "Backspace",
    CAPS_LOCK: "CapsLock",
    CONTROL: "Control",
    DELETE: "Delete",
    END: "End",
    ENTER: "Enter",
    ESCAPE: "Escape",
    F1: "F1",
    F10: "F10",
    F11: "F11",
    F12: "F12",
    F2: "F2",
    F3: "F3",
    F4: "F4",
    F5: "F5",
    F6: "F6",
    F7: "F7",
    F8: "F8",
    F9: "F9",
    HOME: "Home",
    META: "Meta",
    PAGE_DOWN: "PageDown",
    PAGE_UP: "PageUp",
    SHIFT: "Shift",
    SPACE: " ",
    TAB: "Tab",
    CTRL: "Control",
    ASTERISK: "*",
    SPACE_CODE: "Space"
  };
}
function useLocale(locale) {
  const context = injectConfigProviderContext({ locale: ref("en") });
  return computed(() => locale?.value || context.locale?.value || "en");
}
function useCalendarState(props) {
  function isDateSelected(dateObj) {
    if (Array.isArray(props.date.value)) return props.date.value.some((d) => isSameDay(d, dateObj));
    else if (!props.date.value) return false;
    else return isSameDay(props.date.value, dateObj);
  }
  const isInvalid = computed(() => {
    if (Array.isArray(props.date.value)) {
      if (!props.date.value.length) return false;
      for (const dateObj of props.date.value) {
        if (props.isDateDisabled?.(dateObj)) return true;
        if (props.isDateUnavailable?.(dateObj)) return true;
      }
    } else {
      if (!props.date.value) return false;
      if (props.isDateDisabled?.(props.date.value)) return true;
      if (props.isDateUnavailable?.(props.date.value)) return true;
    }
    return false;
  });
  const hasSelectedDate = computed(() => {
    return Array.isArray(props.date.value) ? props.date.value.length > 0 : !!props.date.value;
  });
  const isSelectedDateDisabled = computed(() => {
    if (Array.isArray(props.date.value)) {
      if (!props.date.value.length) return false;
      return props.date.value.some((dateObj) => props.isDateDisabled?.(dateObj));
    }
    if (!props.date.value) return false;
    return !!props.isDateDisabled?.(props.date.value);
  });
  return {
    isDateSelected,
    isInvalid,
    hasSelectedDate,
    isSelectedDateDisabled
  };
}
function handleNextDisabled(lastPeriodInView, nextPageFunc) {
  const firstPeriodOfNextPage = nextPageFunc(lastPeriodInView);
  const diff = firstPeriodOfNextPage.compare(lastPeriodInView);
  const duration = {};
  if (diff >= 7) duration.day = 1;
  if (diff >= getDaysInMonth(lastPeriodInView)) duration.month = 1;
  return firstPeriodOfNextPage.set({ ...duration });
}
function handlePrevDisabled(firstPeriodInView, prevPageFunc) {
  const lastPeriodOfPrevPage = prevPageFunc(firstPeriodInView);
  const diff = firstPeriodInView.compare(lastPeriodOfPrevPage);
  const duration = {};
  if (diff >= 7) duration.day = 35;
  if (diff >= getDaysInMonth(firstPeriodInView)) duration.month = 13;
  return lastPeriodOfPrevPage.set({ ...duration });
}
function handleNextPage(date, nextPageFunc) {
  return nextPageFunc(date);
}
function handlePrevPage(date, prevPageFunc) {
  return prevPageFunc(date);
}
function useCalendar(props) {
  const formatter = useDateFormatter(props.locale.value);
  const headingFormatOptions = computed(() => {
    const options = { calendar: props.placeholder.value.calendar.identifier };
    if (props.placeholder.value.calendar.identifier === "gregory" && props.placeholder.value.era === "BC") options.era = "short";
    return options;
  });
  const grid = ref(createMonths({
    dateObj: props.placeholder.value,
    weekStartsOn: props.weekStartsOn.value,
    locale: props.locale.value,
    fixedWeeks: props.fixedWeeks.value,
    numberOfMonths: props.numberOfMonths.value
  }));
  const visibleView = computed(() => {
    return grid.value.map((month) => month.value);
  });
  function isOutsideVisibleView(date) {
    return !visibleView.value.some((month) => isEqualMonth(date, month));
  }
  const isNextButtonDisabled = (nextPageFunc) => {
    if (!props.maxValue.value || !grid.value.length) return false;
    if (props.disabled.value) return true;
    const lastPeriodInView = grid.value.at(-1).value;
    if (!nextPageFunc && !props.nextPage.value) {
      const firstPeriodOfNextPage$1 = lastPeriodInView.add({ months: 1 }).set({ day: 1 });
      return isAfter(firstPeriodOfNextPage$1, props.maxValue.value);
    }
    const firstPeriodOfNextPage = handleNextDisabled(lastPeriodInView, nextPageFunc || props.nextPage.value);
    return isAfter(firstPeriodOfNextPage, props.maxValue.value);
  };
  const isPrevButtonDisabled = (prevPageFunc) => {
    if (!props.minValue.value || !grid.value.length) return false;
    if (props.disabled.value) return true;
    const firstPeriodInView = grid.value[0].value;
    if (!prevPageFunc && !props.prevPage.value) {
      const lastPeriodOfPrevPage$1 = firstPeriodInView.subtract({ months: 1 }).set({ day: 35 });
      return isBefore(lastPeriodOfPrevPage$1, props.minValue.value);
    }
    const lastPeriodOfPrevPage = handlePrevDisabled(firstPeriodInView, prevPageFunc || props.prevPage.value);
    return isBefore(lastPeriodOfPrevPage, props.minValue.value);
  };
  function isDateDisabled(dateObj) {
    if (props.isDateDisabled?.(dateObj) || props.disabled.value) return true;
    if (props.maxValue.value && isAfter(dateObj, props.maxValue.value)) return true;
    if (props.minValue.value && isBefore(dateObj, props.minValue.value)) return true;
    return false;
  }
  const isDateUnavailable = (date) => {
    if (props.isDateUnavailable?.(date)) return true;
    return false;
  };
  const weekdays = computed(() => {
    if (!grid.value.length) return [];
    return grid.value[0].rows[0].map((date) => {
      return formatter.dayOfWeek(toDate(date), props.weekdayFormat.value);
    });
  });
  const nextPage = (nextPageFunc) => {
    const firstDate = grid.value[0].value;
    if (!nextPageFunc && !props.nextPage.value) {
      const newDate$1 = firstDate.add({ months: props.pagedNavigation.value ? props.numberOfMonths.value : 1 });
      const newGrid$1 = createMonths({
        dateObj: newDate$1,
        weekStartsOn: props.weekStartsOn.value,
        locale: props.locale.value,
        fixedWeeks: props.fixedWeeks.value,
        numberOfMonths: props.numberOfMonths.value
      });
      grid.value = newGrid$1;
      props.placeholder.value = newGrid$1[0].value.set({ day: 1 });
      return;
    }
    const newDate = handleNextPage(firstDate, nextPageFunc || props.nextPage.value);
    const newGrid = createMonths({
      dateObj: newDate,
      weekStartsOn: props.weekStartsOn.value,
      locale: props.locale.value,
      fixedWeeks: props.fixedWeeks.value,
      numberOfMonths: props.numberOfMonths.value
    });
    grid.value = newGrid;
    const duration = {};
    if (!nextPageFunc) {
      const diff = newGrid[0].value.compare(firstDate);
      if (diff >= getDaysInMonth(firstDate)) duration.day = 1;
      if (diff >= 365) duration.month = 1;
    }
    props.placeholder.value = newGrid[0].value.set({ ...duration });
  };
  const prevPage = (prevPageFunc) => {
    const firstDate = grid.value[0].value;
    if (!prevPageFunc && !props.prevPage.value) {
      const newDate$1 = firstDate.subtract({ months: props.pagedNavigation.value ? props.numberOfMonths.value : 1 });
      const newGrid$1 = createMonths({
        dateObj: newDate$1,
        weekStartsOn: props.weekStartsOn.value,
        locale: props.locale.value,
        fixedWeeks: props.fixedWeeks.value,
        numberOfMonths: props.numberOfMonths.value
      });
      grid.value = newGrid$1;
      props.placeholder.value = newGrid$1[0].value.set({ day: 1 });
      return;
    }
    const newDate = handlePrevPage(firstDate, prevPageFunc || props.prevPage.value);
    const newGrid = createMonths({
      dateObj: newDate,
      weekStartsOn: props.weekStartsOn.value,
      locale: props.locale.value,
      fixedWeeks: props.fixedWeeks.value,
      numberOfMonths: props.numberOfMonths.value
    });
    grid.value = newGrid;
    const duration = {};
    if (!prevPageFunc) {
      const diff = firstDate.compare(newGrid[0].value);
      if (diff >= getDaysInMonth(firstDate)) duration.day = 1;
      if (diff >= 365) duration.month = 1;
    }
    props.placeholder.value = newGrid[0].value.set({ ...duration });
  };
  watch(props.placeholder, (value) => {
    if (visibleView.value.some((month) => isEqualMonth(month, value))) return;
    grid.value = createMonths({
      dateObj: value,
      weekStartsOn: props.weekStartsOn.value,
      locale: props.locale.value,
      fixedWeeks: props.fixedWeeks.value,
      numberOfMonths: props.numberOfMonths.value
    });
  });
  watch([
    props.locale,
    props.weekStartsOn,
    props.fixedWeeks,
    props.numberOfMonths
  ], () => {
    grid.value = createMonths({
      dateObj: props.placeholder.value,
      weekStartsOn: props.weekStartsOn.value,
      locale: props.locale.value,
      fixedWeeks: props.fixedWeeks.value,
      numberOfMonths: props.numberOfMonths.value
    });
  });
  const headingValue = computed(() => {
    if (!grid.value.length) return "";
    if (props.locale.value !== formatter.getLocale()) formatter.setLocale(props.locale.value);
    if (grid.value.length === 1) {
      const month = grid.value[0].value;
      return `${formatter.fullMonthAndYear(toDate(month), headingFormatOptions.value)}`;
    }
    const startMonth = toDate(grid.value[0].value);
    const endMonth = toDate(grid.value.at(-1).value);
    const startMonthName = formatter.fullMonth(startMonth, headingFormatOptions.value);
    const endMonthName = formatter.fullMonth(endMonth, headingFormatOptions.value);
    const startMonthYear = formatter.fullYear(startMonth, headingFormatOptions.value);
    const endMonthYear = formatter.fullYear(endMonth, headingFormatOptions.value);
    const content = startMonthYear === endMonthYear ? `${startMonthName} - ${endMonthName} ${endMonthYear}` : `${startMonthName} ${startMonthYear} - ${endMonthName} ${endMonthYear}`;
    return content;
  });
  const fullCalendarLabel = computed(() => `${props.calendarLabel.value ?? "Event Date"}, ${headingValue.value}`);
  const isPlaceholderFocusable = computed(() => {
    return !(isDateDisabled(props.placeholder.value) || isDateUnavailable(props.placeholder.value) || isOutsideVisibleView(props.placeholder.value));
  });
  const firstFocusableDate = computed(() => {
    for (const month of grid.value) {
      if (props.minValue.value && isBefore(month.value, props.minValue.value)) continue;
      const daysInMonth = getDaysInMonth(month.value);
      const startDay = props.minValue.value && isSameMonth(props.minValue.value, month.value) ? props.minValue.value.day : 1;
      for (let day = startDay; day <= daysInMonth; day++) {
        const date = month.value.set({ day });
        if (isDateDisabled(date) || isDateUnavailable(date)) continue;
        return date;
      }
    }
  });
  return {
    isDateDisabled,
    isDateUnavailable,
    isNextButtonDisabled,
    isPrevButtonDisabled,
    grid,
    weekdays,
    visibleView,
    isOutsideVisibleView,
    formatter,
    nextPage,
    prevPage,
    headingValue,
    fullCalendarLabel,
    isPlaceholderFocusable,
    firstFocusableDate
  };
}
const _hoisted_1$1 = { style: {
  "border": "0px",
  "clip": "rect(0px, 0px, 0px, 0px)",
  "clip-path": "inset(50%)",
  "height": "1px",
  "margin": "-1px",
  "overflow": "hidden",
  "padding": "0px",
  "position": "absolute",
  "white-space": "nowrap",
  "width": "1px"
} };
const _hoisted_2$1 = {
  role: "heading",
  "aria-level": "2"
};
const [injectCalendarRootContext, provideCalendarRootContext] = /* @__PURE__ */ createContext("CalendarRoot");
var CalendarRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CalendarRoot",
  props: {
    defaultValue: {
      type: null,
      required: false,
      default: void 0
    },
    defaultPlaceholder: {
      type: null,
      required: false
    },
    placeholder: {
      type: null,
      required: false,
      default: void 0
    },
    pagedNavigation: {
      type: Boolean,
      required: false,
      default: false
    },
    preventDeselect: {
      type: Boolean,
      required: false,
      default: false
    },
    weekStartsOn: {
      type: Number,
      required: false
    },
    weekdayFormat: {
      type: String,
      required: false,
      default: "narrow"
    },
    calendarLabel: {
      type: String,
      required: false
    },
    fixedWeeks: {
      type: Boolean,
      required: false,
      default: false
    },
    maxValue: {
      type: null,
      required: false
    },
    minValue: {
      type: null,
      required: false
    },
    locale: {
      type: String,
      required: false
    },
    numberOfMonths: {
      type: Number,
      required: false,
      default: 1
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    initialFocus: {
      type: Boolean,
      required: false,
      default: false
    },
    isDateDisabled: {
      type: Function,
      required: false,
      default: void 0
    },
    isDateUnavailable: {
      type: Function,
      required: false,
      default: void 0
    },
    dir: {
      type: String,
      required: false
    },
    nextPage: {
      type: Function,
      required: false
    },
    prevPage: {
      type: Function,
      required: false
    },
    modelValue: {
      type: null,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    disableDaysOutsideCurrentView: {
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
      default: "div"
    }
  },
  emits: ["update:modelValue", "update:placeholder"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { disabled, readonly, initialFocus, pagedNavigation, weekdayFormat, fixedWeeks, multiple, minValue, maxValue, numberOfMonths, preventDeselect, isDateDisabled: propsIsDateDisabled, isDateUnavailable: propsIsDateUnavailable, calendarLabel, defaultValue, nextPage: propsNextPage, prevPage: propsPrevPage, dir: propDir, locale: propLocale, disableDaysOutsideCurrentView } = toRefs(props);
    const { primitiveElement, currentElement: parentElement } = usePrimitiveElement();
    const locale = useLocale(propLocale);
    const dir = useDirection(propDir);
    const weekStartsOn = computed(() => props.weekStartsOn ?? getWeekStartsOn(locale.value));
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: defaultValue.value,
      passive: props.modelValue === void 0
    });
    const defaultDate = getDefaultDate({
      defaultPlaceholder: props.placeholder,
      defaultValue: modelValue.value,
      locale: props.locale
    });
    const placeholder = useVModel(props, "placeholder", emits, {
      defaultValue: props.defaultPlaceholder ?? defaultDate.copy(),
      passive: props.placeholder === void 0
    });
    function onPlaceholderChange(value) {
      placeholder.value = value.copy();
    }
    const { fullCalendarLabel, headingValue, isDateDisabled, isDateUnavailable, isNextButtonDisabled, isPrevButtonDisabled, weekdays, isOutsideVisibleView, nextPage, prevPage, formatter, grid, isPlaceholderFocusable, firstFocusableDate } = useCalendar({
      locale,
      placeholder,
      weekStartsOn,
      fixedWeeks,
      numberOfMonths,
      minValue,
      maxValue,
      disabled,
      weekdayFormat,
      pagedNavigation,
      isDateDisabled: propsIsDateDisabled.value,
      isDateUnavailable: propsIsDateUnavailable.value,
      calendarLabel,
      nextPage: propsNextPage,
      prevPage: propsPrevPage
    });
    const { isInvalid, isDateSelected, hasSelectedDate, isSelectedDateDisabled } = useCalendarState({
      date: modelValue,
      isDateDisabled,
      isDateUnavailable
    });
    watch(modelValue, (_modelValue) => {
      if (Array.isArray(_modelValue) && _modelValue.length) {
        const lastValue = _modelValue.at(-1);
        if (lastValue && !isEqualDay(placeholder.value, lastValue)) onPlaceholderChange(lastValue);
      } else if (!Array.isArray(_modelValue) && _modelValue && !isEqualDay(placeholder.value, _modelValue)) onPlaceholderChange(_modelValue);
    });
    function onDateChange(value) {
      if (!multiple.value) {
        if (!modelValue.value) {
          modelValue.value = value.copy();
          return;
        }
        if (!preventDeselect.value && isEqualDay(modelValue.value, value)) {
          placeholder.value = value.copy();
          modelValue.value = void 0;
        } else modelValue.value = value.copy();
      } else if (!modelValue.value) modelValue.value = [value.copy()];
      else if (Array.isArray(modelValue.value)) {
        const index = modelValue.value.findIndex((date) => isSameDay(date, value));
        if (index === -1) modelValue.value = [...modelValue.value, value];
        else if (!preventDeselect.value) {
          const next = modelValue.value.filter((date) => !isSameDay(date, value));
          if (!next.length) {
            placeholder.value = value.copy();
            modelValue.value = void 0;
            return;
          }
          modelValue.value = next.map((date) => date.copy());
        }
      }
    }
    provideCalendarRootContext({
      isDateUnavailable,
      dir,
      isDateDisabled,
      locale,
      formatter,
      modelValue,
      placeholder,
      disabled,
      initialFocus,
      pagedNavigation,
      grid,
      weekDays: weekdays,
      weekStartsOn,
      weekdayFormat,
      fixedWeeks,
      multiple,
      numberOfMonths,
      readonly,
      preventDeselect,
      fullCalendarLabel,
      headingValue,
      isInvalid,
      isDateSelected,
      isNextButtonDisabled,
      isPrevButtonDisabled,
      isOutsideVisibleView,
      nextPage,
      prevPage,
      parentElement,
      onPlaceholderChange,
      onDateChange,
      disableDaysOutsideCurrentView,
      minValue,
      maxValue,
      isPlaceholderFocusable,
      firstFocusableDate,
      hasSelectedDate,
      isSelectedDateDisabled
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        ref_key: "primitiveElement",
        ref: primitiveElement,
        as: _ctx.as,
        "as-child": _ctx.asChild,
        "aria-label": unref(fullCalendarLabel),
        "data-readonly": unref(readonly) ? "" : void 0,
        "data-disabled": unref(disabled) ? "" : void 0,
        "data-invalid": unref(isInvalid) ? "" : void 0,
        dir: unref(dir)
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
          date: unref(placeholder),
          grid: unref(grid),
          weekDays: unref(weekdays),
          weekStartsOn: weekStartsOn.value,
          locale: unref(locale),
          fixedWeeks: unref(fixedWeeks),
          modelValue: unref(modelValue)
        }), createElementVNode("div", _hoisted_1$1, [createElementVNode("div", _hoisted_2$1, toDisplayString(unref(fullCalendarLabel)), 1)])]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "aria-label",
        "data-readonly",
        "data-disabled",
        "data-invalid",
        "dir"
      ]);
    };
  }
});
var CalendarRoot_default = CalendarRoot_vue_vue_type_script_setup_true_lang_default;
var CalendarCell_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CalendarCell",
  props: {
    date: {
      type: null,
      required: true
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "td"
    }
  },
  setup(__props) {
    const rootContext = injectCalendarRootContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        as: _ctx.as,
        "as-child": _ctx.asChild,
        role: "gridcell",
        "aria-selected": unref(rootContext).isDateSelected(_ctx.date) ? true : void 0,
        "aria-disabled": unref(rootContext).isDateDisabled(_ctx.date) || unref(rootContext).isDateUnavailable?.(_ctx.date) || unref(rootContext).disableDaysOutsideCurrentView.value,
        "data-disabled": unref(rootContext).isDateDisabled(_ctx.date) || unref(rootContext).disableDaysOutsideCurrentView.value ? "" : void 0
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "aria-selected",
        "aria-disabled",
        "data-disabled"
      ]);
    };
  }
});
var CalendarCell_default = CalendarCell_vue_vue_type_script_setup_true_lang_default;
var CalendarCellTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CalendarCellTrigger",
  props: {
    day: {
      type: null,
      required: true
    },
    month: {
      type: null,
      required: true
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "div"
    }
  },
  setup(__props) {
    const props = __props;
    const kbd = useKbd();
    const rootContext = injectCalendarRootContext();
    const { primitiveElement } = usePrimitiveElement();
    const dayValue = computed(() => props.day.day.toLocaleString(rootContext.locale.value));
    const labelText = computed(() => {
      return rootContext.formatter.custom(toDate(props.day), {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    });
    const isUnavailable = computed(() => rootContext.isDateUnavailable?.(props.day) ?? false);
    const isDateToday = computed(() => {
      return isToday(props.day, getLocalTimeZone());
    });
    const isOutsideView = computed(() => {
      return !isSameMonth(props.day, props.month);
    });
    const isOutsideVisibleView = computed(() => rootContext.isOutsideVisibleView(props.day));
    const isDisabled = computed(() => rootContext.isDateDisabled(props.day) || rootContext.disableDaysOutsideCurrentView.value && isOutsideView.value);
    const isFocusedDate = computed(() => {
      if (isOutsideView.value || isDisabled.value) return false;
      if (!rootContext.disabled.value && rootContext.isPlaceholderFocusable.value && isSameDay(props.day, rootContext.placeholder.value)) return true;
      if ((!rootContext.hasSelectedDate.value || rootContext.isSelectedDateDisabled.value) && !rootContext.isPlaceholderFocusable.value) return rootContext.firstFocusableDate.value && isSameDay(props.day, rootContext.firstFocusableDate.value);
      return false;
    });
    const isSelectedDate = computed(() => rootContext.isDateSelected(props.day));
    function changeDate(date) {
      if (rootContext.readonly.value) return;
      if (rootContext.isDateDisabled(date) || rootContext.isDateUnavailable?.(date)) return;
      rootContext.onDateChange(date);
    }
    function handleClick() {
      if (isDisabled.value) return;
      changeDate(props.day);
    }
    function handleArrowKey(e) {
      if (isDisabled.value) return;
      e.preventDefault();
      e.stopPropagation();
      const parentElement = rootContext.parentElement.value;
      const indexIncrementation = 7;
      const sign = rootContext.dir.value === "rtl" ? -1 : 1;
      switch (e.code) {
        case kbd.ARROW_RIGHT:
          shiftFocus(props.day, sign);
          break;
        case kbd.ARROW_LEFT:
          shiftFocus(props.day, -sign);
          break;
        case kbd.ARROW_UP:
          shiftFocus(props.day, -indexIncrementation);
          break;
        case kbd.ARROW_DOWN:
          shiftFocus(props.day, indexIncrementation);
          break;
        case kbd.ENTER:
        case kbd.SPACE_CODE:
          changeDate(props.day);
      }
      function shiftFocus(day, add) {
        const candidateDayValue = day.add({ days: add });
        if (rootContext.minValue.value && candidateDayValue.compare(rootContext.minValue.value) < 0 || rootContext.maxValue.value && candidateDayValue.compare(rootContext.maxValue.value) > 0) return;
        const candidateDay = parentElement.querySelector(`[data-value='${candidateDayValue.toString()}']:not([data-outside-view])`);
        if (!candidateDay) {
          if (add > 0) {
            if (rootContext.isNextButtonDisabled()) return;
            rootContext.nextPage();
          } else {
            if (rootContext.isPrevButtonDisabled()) return;
            rootContext.prevPage();
          }
          nextTick(() => {
            shiftFocus(day, add);
          });
          return;
        }
        if (candidateDay && candidateDay.hasAttribute("data-disabled")) return shiftFocus(candidateDayValue, add);
        rootContext.onPlaceholderChange(candidateDayValue);
        candidateDay?.focus();
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        ref_key: "primitiveElement",
        ref: primitiveElement,
        as: props.as,
        "as-child": props.asChild,
        role: "button",
        "aria-label": labelText.value,
        "data-reka-calendar-cell-trigger": "",
        "aria-disabled": isDisabled.value || isUnavailable.value ? true : void 0,
        "data-selected": isSelectedDate.value ? true : void 0,
        "data-value": _ctx.day.toString(),
        "data-disabled": isDisabled.value ? "" : void 0,
        "data-unavailable": isUnavailable.value ? "" : void 0,
        "data-today": isDateToday.value ? "" : void 0,
        "data-outside-view": isOutsideView.value ? "" : void 0,
        "data-outside-visible-view": isOutsideVisibleView.value ? "" : void 0,
        "data-focused": isFocusedDate.value ? "" : void 0,
        tabindex: isFocusedDate.value ? 0 : isOutsideView.value || isDisabled.value ? void 0 : -1,
        onClick: handleClick,
        onKeydown: [withKeys(handleArrowKey, [
          "up",
          "down",
          "left",
          "right",
          "space",
          "enter"
        ]), _cache[0] || (_cache[0] = withKeys(withModifiers(() => {
        }, ["prevent"]), ["enter"]))]
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
          dayValue: dayValue.value,
          disabled: isDisabled.value,
          today: isDateToday.value,
          selected: isSelectedDate.value,
          outsideView: isOutsideView.value,
          outsideVisibleView: isOutsideVisibleView.value,
          unavailable: isUnavailable.value
        }, () => [createTextVNode(toDisplayString(dayValue.value), 1)])]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "aria-label",
        "aria-disabled",
        "data-selected",
        "data-value",
        "data-disabled",
        "data-unavailable",
        "data-today",
        "data-outside-view",
        "data-outside-visible-view",
        "data-focused",
        "tabindex"
      ]);
    };
  }
});
var CalendarCellTrigger_default = CalendarCellTrigger_vue_vue_type_script_setup_true_lang_default;
var CalendarGrid_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CalendarGrid",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "table"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectCalendarRootContext();
    const disabled = computed(() => rootContext.disabled.value ? true : void 0);
    const readonly = computed(() => rootContext.readonly.value ? true : void 0);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        tabindex: "-1",
        role: "application",
        "aria-readonly": readonly.value,
        "aria-disabled": disabled.value,
        "data-readonly": readonly.value && "",
        "data-disabled": disabled.value && ""
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "aria-readonly",
        "aria-disabled",
        "data-readonly",
        "data-disabled"
      ]);
    };
  }
});
var CalendarGrid_default = CalendarGrid_vue_vue_type_script_setup_true_lang_default;
var CalendarGridBody_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CalendarGridBody",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "tbody"
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var CalendarGridBody_default = CalendarGridBody_vue_vue_type_script_setup_true_lang_default;
var CalendarGridHead_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CalendarGridHead",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "thead"
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { "aria-hidden": "true" }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var CalendarGridHead_default = CalendarGridHead_vue_vue_type_script_setup_true_lang_default;
var CalendarGridRow_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CalendarGridRow",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "tr"
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var CalendarGridRow_default = CalendarGridRow_vue_vue_type_script_setup_true_lang_default;
var CalendarHeadCell_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CalendarHeadCell",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "th"
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var CalendarHeadCell_default = CalendarHeadCell_vue_vue_type_script_setup_true_lang_default;
var CalendarHeader_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CalendarHeader",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "div"
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var CalendarHeader_default = CalendarHeader_vue_vue_type_script_setup_true_lang_default;
var CalendarHeading_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CalendarHeading",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "div"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectCalendarRootContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { "data-disabled": unref(rootContext).disabled.value ? "" : void 0 }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { headingValue: unref(rootContext).headingValue.value }, () => [createTextVNode(toDisplayString(unref(rootContext).headingValue.value), 1)])]),
        _: 3
      }, 16, ["data-disabled"]);
    };
  }
});
var CalendarHeading_default = CalendarHeading_vue_vue_type_script_setup_true_lang_default;
var CalendarNext_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CalendarNext",
  props: {
    nextPage: {
      type: Function,
      required: false
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
    const disabled = computed(() => rootContext.disabled.value || rootContext.isNextButtonDisabled(props.nextPage));
    const rootContext = injectCalendarRootContext();
    function handleClick() {
      if (disabled.value) return;
      rootContext.nextPage(props.nextPage);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        as: props.as,
        "as-child": props.asChild,
        "aria-label": "Next page",
        type: props.as === "button" ? "button" : void 0,
        "aria-disabled": disabled.value || void 0,
        "data-disabled": disabled.value || void 0,
        disabled: disabled.value,
        onClick: handleClick
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { disabled: disabled.value }, () => [_cache[0] || (_cache[0] = createTextVNode(" Next page "))])]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "type",
        "aria-disabled",
        "data-disabled",
        "disabled"
      ]);
    };
  }
});
var CalendarNext_default = CalendarNext_vue_vue_type_script_setup_true_lang_default;
var CalendarPrev_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CalendarPrev",
  props: {
    prevPage: {
      type: Function,
      required: false
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
    const disabled = computed(() => rootContext.disabled.value || rootContext.isPrevButtonDisabled(props.prevPage));
    const rootContext = injectCalendarRootContext();
    function handleClick() {
      if (disabled.value) return;
      rootContext.prevPage(props.prevPage);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        "aria-label": "Previous page",
        as: props.as,
        "as-child": props.asChild,
        type: props.as === "button" ? "button" : void 0,
        "aria-disabled": disabled.value || void 0,
        "data-disabled": disabled.value || void 0,
        disabled: disabled.value,
        onClick: handleClick
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { disabled: disabled.value }, () => [_cache[0] || (_cache[0] = createTextVNode(" Prev page "))])]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "type",
        "aria-disabled",
        "data-disabled",
        "disabled"
      ]);
    };
  }
});
var CalendarPrev_default = CalendarPrev_vue_vue_type_script_setup_true_lang_default;
var MenuAnchor_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuAnchor",
  props: {
    reference: {
      type: null,
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
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperAnchor_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var MenuAnchor_default = MenuAnchor_vue_vue_type_script_setup_true_lang_default;
var MenuArrow_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuArrow",
  props: {
    width: {
      type: Number,
      required: false
    },
    height: {
      type: Number,
      required: false
    },
    rounded: {
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
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperArrow_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var MenuArrow_default = MenuArrow_vue_vue_type_script_setup_true_lang_default;
function useIsUsingKeyboardImpl() {
  const isUsingKeyboard = ref(false);
  return isUsingKeyboard;
}
const useIsUsingKeyboard = createSharedComposable(useIsUsingKeyboardImpl);
const [injectMenuContext, provideMenuContext] = /* @__PURE__ */ createContext(["MenuRoot", "MenuSub"], "MenuContext");
const [injectMenuRootContext, provideMenuRootContext] = /* @__PURE__ */ createContext("MenuRoot");
var MenuRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuRoot",
  props: {
    open: {
      type: Boolean,
      required: false,
      default: false
    },
    dir: {
      type: String,
      required: false
    },
    modal: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { modal, dir: propDir } = toRefs(props);
    const dir = useDirection(propDir);
    const open = useVModel(props, "open", emits);
    const content = ref();
    const isUsingKeyboardRef = useIsUsingKeyboard();
    provideMenuContext({
      open,
      onOpenChange: (value) => {
        open.value = value;
      },
      content,
      onContentChange: (element) => {
        content.value = element;
      }
    });
    provideMenuRootContext({
      onClose: () => {
        open.value = false;
      },
      isUsingKeyboardRef,
      dir,
      modal
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperRoot_default), null, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      });
    };
  }
});
var MenuRoot_default = MenuRoot_vue_vue_type_script_setup_true_lang_default;
const [injectMenuContentContext, provideMenuContentContext] = /* @__PURE__ */ createContext("MenuContent");
var MenuContentImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuContentImpl",
  props: /* @__PURE__ */ mergeDefaults({
    loop: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false
    },
    disableOutsideScroll: {
      type: Boolean,
      required: false
    },
    trapFocus: {
      type: Boolean,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
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
  }, { ...PopperContentPropsDefaultValue }),
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus",
    "dismiss"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const menuContext = injectMenuContext();
    const rootContext = injectMenuRootContext();
    const { trapFocus, disableOutsidePointerEvents, loop } = toRefs(props);
    useFocusGuards();
    useBodyScrollLock(disableOutsidePointerEvents.value);
    const searchRef = ref("");
    const timerRef = ref(0);
    const pointerGraceTimerRef = ref(0);
    const pointerGraceIntentRef = ref(null);
    const pointerDirRef = ref("right");
    const lastPointerXRef = ref(0);
    const currentItemId = ref(null);
    const rovingFocusGroupRef = ref();
    const { forwardRef, currentElement: contentElement } = useForwardExpose();
    const { handleTypeaheadSearch } = useTypeahead();
    const highlightedElement = ref();
    function onKeydownNavigation(event) {
      const el = useArrowNavigation(event, highlightedElement.value || getActiveElement(), contentElement.value, {
        loop: loop.value,
        arrowKeyOptions: "vertical",
        dir: rootContext?.dir.value,
        focus: false,
        attributeName: "[data-reka-collection-item]:not([data-disabled])"
      });
      if (el) {
        highlightedElement.value = el;
        el.scrollIntoView({ block: "nearest" });
      }
    }
    function onKeydownEnter() {
      if (highlightedElement.value) highlightedElement.value.click();
    }
    const filterElement = ref();
    const activeSubmenuContext = ref();
    watch(highlightedElement, (el) => {
      if (activeSubmenuContext.value && (el === void 0 || el !== activeSubmenuContext.value.trigger.value)) {
        activeSubmenuContext.value.onOpenChange(false);
        activeSubmenuContext.value = void 0;
      }
    });
    watch(contentElement, (el) => {
      menuContext.onContentChange(el);
    });
    function isPointerMovingToSubmenu(event) {
      const isMovingTowards = pointerDirRef.value === pointerGraceIntentRef.value?.side;
      return isMovingTowards && isPointerInGraceArea(event, pointerGraceIntentRef.value?.area);
    }
    async function handleMountAutoFocus(event) {
      emits("openAutoFocus", event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      contentElement.value?.focus({ preventScroll: true });
    }
    function handleKeyDown(event) {
      if (event.defaultPrevented) return;
      const target = event.target;
      const isKeyDownInside = target.closest("[data-reka-menu-content]") === event.currentTarget;
      const isKeyDownInTextField = ["input", "textarea"].includes(target.tagName.toLowerCase());
      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
      const isCharacterKey = event.key.length === 1;
      const el = useArrowNavigation(event, getActiveElement(), contentElement.value, {
        loop: loop.value,
        arrowKeyOptions: "vertical",
        dir: rootContext?.dir.value,
        focus: true,
        attributeName: "[data-reka-collection-item]:not([data-disabled])"
      });
      if (el) return el?.focus();
      if (event.code === "Space") return;
      const collectionItems = rovingFocusGroupRef.value?.getItems() ?? [];
      if (isKeyDownInside) {
        if (event.key === "Tab") event.preventDefault();
        if (!isModifierKey && isCharacterKey && !isKeyDownInTextField) handleTypeaheadSearch(event.key, collectionItems);
      }
      if (event.target !== contentElement.value) return;
      if (!FIRST_LAST_KEYS.includes(event.key)) return;
      event.preventDefault();
      const candidateNodes = [...collectionItems.map((item) => item.ref)];
      if (LAST_KEYS.includes(event.key)) candidateNodes.reverse();
      focusFirst(candidateNodes);
    }
    function handleBlur(event) {
      if (!event?.currentTarget?.contains?.(event.target)) {
        (void 0).clearTimeout(timerRef.value);
        searchRef.value = "";
      }
    }
    function handlePointerMove(event) {
      if (!isMouseEvent(event)) return;
      const target = event.target;
      const pointerXHasChanged = lastPointerXRef.value !== event.clientX;
      if (event?.currentTarget?.contains(target) && pointerXHasChanged) {
        const newDir = event.clientX > lastPointerXRef.value ? "right" : "left";
        pointerDirRef.value = newDir;
        lastPointerXRef.value = event.clientX;
      }
    }
    function handlePointerEnter(event) {
      if (!isMouseEvent(event)) return;
      if (filterElement.value) filterElement.value.focus();
    }
    provideMenuContentContext({
      onItemEnter: (event) => {
        if (isPointerMovingToSubmenu(event)) return true;
        else return false;
      },
      onItemLeave: (event) => {
        if (isPointerMovingToSubmenu(event)) return true;
        const isInputFocused = ["INPUT", "TEXTAREA"].includes(getActiveElement()?.tagName || "");
        if (!isInputFocused) contentElement.value?.focus();
        currentItemId.value = null;
        return false;
      },
      onTriggerLeave: (event) => {
        if (isPointerMovingToSubmenu(event)) return true;
        else return false;
      },
      searchRef,
      highlightedElement,
      onKeydownNavigation,
      onKeydownEnter,
      filterElement,
      onFilterElementChange: (el) => {
        filterElement.value = el;
      },
      activeSubmenuContext,
      pointerGraceTimerRef,
      onPointerGraceIntentChange: (intent) => {
        pointerGraceIntentRef.value = intent;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(FocusScope_default), {
        "as-child": "",
        trapped: unref(trapFocus),
        onMountAutoFocus: handleMountAutoFocus,
        onUnmountAutoFocus: _cache[7] || (_cache[7] = ($event) => emits("closeAutoFocus", $event))
      }, {
        default: withCtx(() => [createVNode(unref(DismissableLayer_default), {
          "as-child": "",
          "disable-outside-pointer-events": unref(disableOutsidePointerEvents),
          onEscapeKeyDown: _cache[2] || (_cache[2] = ($event) => emits("escapeKeyDown", $event)),
          onPointerDownOutside: _cache[3] || (_cache[3] = ($event) => emits("pointerDownOutside", $event)),
          onFocusOutside: _cache[4] || (_cache[4] = ($event) => emits("focusOutside", $event)),
          onInteractOutside: _cache[5] || (_cache[5] = ($event) => emits("interactOutside", $event)),
          onDismiss: _cache[6] || (_cache[6] = ($event) => emits("dismiss"))
        }, {
          default: withCtx(() => [createVNode(unref(RovingFocusGroup_default), {
            ref_key: "rovingFocusGroupRef",
            ref: rovingFocusGroupRef,
            "current-tab-stop-id": currentItemId.value,
            "onUpdate:currentTabStopId": _cache[0] || (_cache[0] = ($event) => currentItemId.value = $event),
            "as-child": "",
            orientation: "vertical",
            dir: unref(rootContext).dir.value,
            loop: unref(loop),
            onEntryFocus: _cache[1] || (_cache[1] = (event) => {
              emits("entryFocus", event);
              if (!unref(rootContext).isUsingKeyboardRef.value) event.preventDefault();
            })
          }, {
            default: withCtx(() => [createVNode(unref(PopperContent_default), {
              ref: unref(forwardRef),
              role: "menu",
              as: _ctx.as,
              "as-child": _ctx.asChild,
              "aria-orientation": "vertical",
              "data-reka-menu-content": "",
              "data-state": unref(getOpenState)(unref(menuContext).open.value),
              dir: unref(rootContext).dir.value,
              side: _ctx.side,
              "side-offset": _ctx.sideOffset,
              align: _ctx.align,
              "align-offset": _ctx.alignOffset,
              "avoid-collisions": _ctx.avoidCollisions,
              "collision-boundary": _ctx.collisionBoundary,
              "collision-padding": _ctx.collisionPadding,
              "arrow-padding": _ctx.arrowPadding,
              "prioritize-position": _ctx.prioritizePosition,
              "position-strategy": _ctx.positionStrategy,
              "update-position-strategy": _ctx.updatePositionStrategy,
              sticky: _ctx.sticky,
              "hide-when-detached": _ctx.hideWhenDetached,
              reference: _ctx.reference,
              onKeydown: handleKeyDown,
              onBlur: handleBlur,
              onPointermove: handlePointerMove,
              onPointerenter: handlePointerEnter
            }, {
              default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
              _: 3
            }, 8, [
              "as",
              "as-child",
              "data-state",
              "dir",
              "side",
              "side-offset",
              "align",
              "align-offset",
              "avoid-collisions",
              "collision-boundary",
              "collision-padding",
              "arrow-padding",
              "prioritize-position",
              "position-strategy",
              "update-position-strategy",
              "sticky",
              "hide-when-detached",
              "reference"
            ])]),
            _: 3
          }, 8, [
            "current-tab-stop-id",
            "dir",
            "loop"
          ])]),
          _: 3
        }, 8, ["disable-outside-pointer-events"])]),
        _: 3
      }, 8, ["trapped"]);
    };
  }
});
var MenuContentImpl_default = MenuContentImpl_vue_vue_type_script_setup_true_lang_default;
var MenuItemImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "MenuItemImpl",
  props: {
    disabled: {
      type: Boolean,
      required: false
    },
    textValue: {
      type: String,
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
    const contentContext = injectMenuContentContext();
    const { forwardRef, currentElement } = useForwardExpose();
    const { CollectionItem } = useCollection();
    const isFocused = ref(false);
    const isHighlighted = computed(() => isFocused.value || currentElement.value != null && contentContext.highlightedElement.value === currentElement.value);
    async function handlePointerMove(event) {
      if (event.defaultPrevented || !isMouseEvent(event)) return;
      if (props.disabled) contentContext.onItemLeave(event);
      else {
        const defaultPrevented = contentContext.onItemEnter(event);
        if (!defaultPrevented) {
          const item = event.currentTarget;
          contentContext.highlightedElement.value = item;
          const isInputFocused = ["INPUT", "TEXTAREA"].includes(getActiveElement()?.tagName || "");
          if (!isInputFocused) item.focus({ preventScroll: true });
        }
      }
    }
    async function handlePointerLeave(event) {
      await nextTick();
      if (event.defaultPrevented) return;
      if (!isMouseEvent(event)) return;
      if (contentContext.highlightedElement.value !== currentElement.value) return;
      const isMovingToSubmenu = contentContext.onItemLeave(event);
      if (!isMovingToSubmenu && contentContext.highlightedElement.value === currentElement.value) contentContext.highlightedElement.value = void 0;
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollectionItem), { value: { textValue: _ctx.textValue } }, {
        default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
          ref: unref(forwardRef),
          role: "menuitem",
          tabindex: "-1"
        }, _ctx.$attrs, {
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "aria-disabled": _ctx.disabled || void 0,
          "data-disabled": _ctx.disabled ? "" : void 0,
          "data-highlighted": isHighlighted.value ? "" : void 0,
          onPointermove: handlePointerMove,
          onPointerleave: handlePointerLeave,
          onFocus: _cache[0] || (_cache[0] = async (event) => {
            await nextTick();
            if (event.defaultPrevented || _ctx.disabled) return;
            isFocused.value = true;
            unref(contentContext).highlightedElement.value = event.currentTarget;
          }),
          onBlur: _cache[1] || (_cache[1] = async (event) => {
            await nextTick();
            if (event.defaultPrevented) return;
            isFocused.value = false;
          })
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "as",
          "as-child",
          "aria-disabled",
          "data-disabled",
          "data-highlighted"
        ])]),
        _: 3
      }, 8, ["value"]);
    };
  }
});
var MenuItemImpl_default = MenuItemImpl_vue_vue_type_script_setup_true_lang_default;
var MenuItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuItem",
  props: {
    disabled: {
      type: Boolean,
      required: false
    },
    textValue: {
      type: String,
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
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { forwardRef, currentElement } = useForwardExpose();
    const rootContext = injectMenuRootContext();
    const contentContext = injectMenuContentContext();
    const isPointerDownRef = ref(false);
    async function handleSelect() {
      const menuItem = currentElement.value;
      if (!props.disabled && menuItem) {
        const itemSelectEvent = new CustomEvent(ITEM_SELECT, {
          bubbles: true,
          cancelable: true
        });
        emits("select", itemSelectEvent);
        await nextTick();
        if (itemSelectEvent.defaultPrevented) isPointerDownRef.value = false;
        else rootContext.onClose();
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(MenuItemImpl_default, mergeProps(props, {
        ref: unref(forwardRef),
        onClick: handleSelect,
        onPointerdown: _cache[0] || (_cache[0] = () => {
          isPointerDownRef.value = true;
        }),
        onPointerup: _cache[1] || (_cache[1] = async (event) => {
          await nextTick();
          if (event.defaultPrevented) return;
          if (!isPointerDownRef.value) event.currentTarget?.click();
        }),
        onKeydown: _cache[2] || (_cache[2] = async (event) => {
          const isTypingAhead = unref(contentContext).searchRef.value !== "";
          if (_ctx.disabled || isTypingAhead && event.key === " ") return;
          if (unref(SELECTION_KEYS).includes(event.key)) {
            event.currentTarget?.click();
            event.preventDefault();
          }
        })
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var MenuItem_default = MenuItem_vue_vue_type_script_setup_true_lang_default;
const [injectMenuItemIndicatorContext, provideMenuItemIndicatorContext] = /* @__PURE__ */ createContext(["MenuCheckboxItem", "MenuRadioItem"], "MenuItemIndicatorContext");
var MenuItemIndicator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuItemIndicator",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
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
    const indicatorContext = injectMenuItemIndicatorContext({ modelValue: ref(false) });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Presence_default), { present: _ctx.forceMount || unref(isIndeterminate)(unref(indicatorContext).modelValue.value) || unref(indicatorContext).modelValue.value === true }, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "data-state": unref(getCheckedState)(unref(indicatorContext).modelValue.value)
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "as",
          "as-child",
          "data-state"
        ])]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var MenuItemIndicator_default = MenuItemIndicator_vue_vue_type_script_setup_true_lang_default;
var MenuCheckboxItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuCheckboxItem",
  props: {
    modelValue: {
      type: [Boolean, String],
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    textValue: {
      type: String,
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
  emits: ["select", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit$1(props, ["modelValue"]);
    const forwarded = useForwardProps$1(delegatedProps);
    const modelValue = useVModel(props, "modelValue", emits);
    provideMenuItemIndicatorContext({ modelValue });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(MenuItem_default, mergeProps({ role: "menuitemcheckbox" }, unref(forwarded), {
        "aria-checked": unref(isIndeterminate)(unref(modelValue)) ? "mixed" : unref(modelValue),
        "data-state": unref(getCheckedState)(unref(modelValue)),
        onSelect: _cache[0] || (_cache[0] = async (event) => {
          emits("select", event);
          if (unref(isIndeterminate)(unref(modelValue))) modelValue.value = true;
          else modelValue.value = !unref(modelValue);
        })
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { modelValue: unref(modelValue) })]),
        _: 3
      }, 16, ["aria-checked", "data-state"]);
    };
  }
});
var MenuCheckboxItem_default = MenuCheckboxItem_vue_vue_type_script_setup_true_lang_default;
var MenuRootContentModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuRootContentModal",
  props: {
    loop: {
      type: Boolean,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
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
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    const menuContext = injectMenuContext();
    const { forwardRef, currentElement } = useForwardExpose();
    useHideOthers(currentElement);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(MenuContentImpl_default, mergeProps(unref(forwarded), {
        ref: unref(forwardRef),
        "trap-focus": unref(menuContext).open.value,
        "disable-outside-pointer-events": unref(menuContext).open.value,
        "disable-outside-scroll": true,
        onDismiss: _cache[0] || (_cache[0] = ($event) => unref(menuContext).onOpenChange(false)),
        onFocusOutside: _cache[1] || (_cache[1] = withModifiers(($event) => emits("focusOutside", $event), ["prevent"]))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["trap-focus", "disable-outside-pointer-events"]);
    };
  }
});
var MenuRootContentModal_default = MenuRootContentModal_vue_vue_type_script_setup_true_lang_default;
var MenuRootContentNonModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuRootContentNonModal",
  props: {
    loop: {
      type: Boolean,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
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
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    const menuContext = injectMenuContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(MenuContentImpl_default, mergeProps(unref(forwarded), {
        "trap-focus": false,
        "disable-outside-pointer-events": false,
        "disable-outside-scroll": false,
        onDismiss: _cache[0] || (_cache[0] = ($event) => unref(menuContext).onOpenChange(false))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var MenuRootContentNonModal_default = MenuRootContentNonModal_vue_vue_type_script_setup_true_lang_default;
var MenuContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    loop: {
      type: Boolean,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
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
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    const menuContext = injectMenuContext();
    const rootContext = injectMenuRootContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Presence_default), { present: _ctx.forceMount || unref(menuContext).open.value }, {
        default: withCtx(() => [unref(rootContext).modal.value ? (openBlock(), createBlock(MenuRootContentModal_default, normalizeProps(mergeProps({ key: 0 }, {
          ..._ctx.$attrs,
          ...unref(forwarded)
        })), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16)) : (openBlock(), createBlock(MenuRootContentNonModal_default, normalizeProps(mergeProps({ key: 1 }, {
          ..._ctx.$attrs,
          ...unref(forwarded)
        })), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16))]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var MenuContent_default = MenuContent_vue_vue_type_script_setup_true_lang_default;
const [injectMenuGroupContext, provideMenuGroupContext] = /* @__PURE__ */ createContext("MenuGroup");
var MenuGroup_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuGroup",
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
    const id = useId(void 0, "reka-menu-group");
    provideMenuGroupContext({ id });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps({ role: "group" }, props, { "aria-labelledby": unref(id) }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["aria-labelledby"]);
    };
  }
});
var MenuGroup_default = MenuGroup_vue_vue_type_script_setup_true_lang_default;
var MenuLabel_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuLabel",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "div"
    }
  },
  setup(__props) {
    const props = __props;
    const groupContext = injectMenuGroupContext({ id: "" });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { id: unref(groupContext).id || void 0 }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var MenuLabel_default = MenuLabel_vue_vue_type_script_setup_true_lang_default;
var MenuPortal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuPortal",
  props: {
    to: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    defer: {
      type: Boolean,
      required: false
    },
    forceMount: {
      type: Boolean,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Teleport_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var MenuPortal_default = MenuPortal_vue_vue_type_script_setup_true_lang_default;
const [injectMenuRadioGroupContext, provideMenuRadioGroupContext] = /* @__PURE__ */ createContext("MenuRadioGroup");
var MenuRadioGroup_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuRadioGroup",
  props: {
    modelValue: {
      type: null,
      required: false,
      default: ""
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
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit$1(props, ["modelValue"]);
    const forwarded = useForwardProps$1(delegatedProps);
    const modelValue = useVModel(props, "modelValue", emits);
    provideMenuRadioGroupContext({
      modelValue,
      onValueChange: (payload) => {
        modelValue.value = payload;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(MenuGroup_default, normalizeProps(guardReactiveProps(unref(forwarded))), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { modelValue: unref(modelValue) })]),
        _: 3
      }, 16);
    };
  }
});
var MenuRadioGroup_default = MenuRadioGroup_vue_vue_type_script_setup_true_lang_default;
var MenuRadioItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuRadioItem",
  props: {
    value: {
      type: null,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    },
    textValue: {
      type: String,
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
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, ["value"]);
    const forwarded = useForwardProps$1(delegatedProps);
    const { value } = toRefs(props);
    const radioGroupContext = injectMenuRadioGroupContext();
    const modelValue = computed(() => radioGroupContext.modelValue.value === value?.value);
    provideMenuItemIndicatorContext({ modelValue });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(MenuItem_default, mergeProps({ role: "menuitemradio" }, unref(forwarded), {
        "aria-checked": modelValue.value,
        "data-state": unref(getCheckedState)(modelValue.value),
        onSelect: _cache[0] || (_cache[0] = async (event) => {
          emits("select", event);
          unref(radioGroupContext).onValueChange(unref(value));
        })
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["aria-checked", "data-state"]);
    };
  }
});
var MenuRadioItem_default = MenuRadioItem_vue_vue_type_script_setup_true_lang_default;
var MenuSeparator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuSeparator",
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
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        role: "separator",
        "aria-orientation": "horizontal"
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var MenuSeparator_default = MenuSeparator_vue_vue_type_script_setup_true_lang_default;
const [injectMenuSubContext, provideMenuSubContext] = /* @__PURE__ */ createContext("MenuSub");
var MenuSub_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuSub",
  props: { open: {
    type: Boolean,
    required: false,
    default: void 0
  } },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const open = useVModel(props, "open", emits, {
      defaultValue: false,
      passive: props.open === void 0
    });
    const parentMenuContext = injectMenuContext();
    const trigger = ref();
    const content = ref();
    watchEffect((cleanupFn) => {
      if (parentMenuContext?.open.value === false) open.value = false;
      cleanupFn(() => open.value = false);
    });
    provideMenuContext({
      open,
      onOpenChange: (value) => {
        open.value = value;
      },
      content,
      onContentChange: (element) => {
        content.value = element;
      }
    });
    provideMenuSubContext({
      triggerId: "",
      contentId: "",
      trigger,
      onTriggerChange: (element) => {
        trigger.value = element;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperRoot_default), null, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      });
    };
  }
});
var MenuSub_default = MenuSub_vue_vue_type_script_setup_true_lang_default;
var MenuSubContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuSubContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    loop: {
      type: Boolean,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false,
      default: true
    },
    reference: {
      type: null,
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
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    const menuContext = injectMenuContext();
    const rootContext = injectMenuRootContext();
    const menuSubContext = injectMenuSubContext();
    const parentContentContext = injectMenuContentContext();
    const { forwardRef, currentElement: subContentElement } = useForwardExpose();
    menuSubContext.contentId ||= useId(void 0, "reka-menu-sub-content");
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Presence_default), { present: _ctx.forceMount || unref(menuContext).open.value }, {
        default: withCtx(() => [createVNode(MenuContentImpl_default, mergeProps(unref(forwarded), {
          id: unref(menuSubContext).contentId,
          ref: unref(forwardRef),
          "aria-labelledby": unref(menuSubContext).triggerId,
          align: "start",
          side: unref(rootContext).dir.value === "rtl" ? "left" : "right",
          "disable-outside-pointer-events": false,
          "disable-outside-scroll": false,
          "trap-focus": false,
          onOpenAutoFocus: _cache[0] || (_cache[0] = withModifiers((event) => {
            if (unref(rootContext).isUsingKeyboardRef.value) unref(subContentElement)?.focus();
          }, ["prevent"])),
          onCloseAutoFocus: _cache[1] || (_cache[1] = withModifiers(() => {
          }, ["prevent"])),
          onFocusOutside: _cache[2] || (_cache[2] = (event) => {
            if (event.defaultPrevented) return;
            const isMovingToParentContent = unref(parentContentContext).filterElement.value?.contains(event.target);
            if (event.target !== unref(menuSubContext).trigger.value && !isMovingToParentContent) unref(menuContext).onOpenChange(false);
          }),
          onEscapeKeyDown: _cache[3] || (_cache[3] = (event) => {
            unref(rootContext).onClose();
            event.preventDefault();
          }),
          onKeydown: _cache[4] || (_cache[4] = (event) => {
            const isKeyDownInside = event.currentTarget?.contains(event.target);
            const isCloseKey = unref(SUB_CLOSE_KEYS)[unref(rootContext).dir.value].includes(event.key);
            if (isKeyDownInside && isCloseKey) {
              unref(menuContext).onOpenChange(false);
              if (unref(parentContentContext).filterElement.value) {
                unref(parentContentContext).filterElement.value.focus();
                unref(parentContentContext).highlightedElement.value = unref(menuSubContext).trigger.value;
                unref(menuSubContext).trigger.value?.scrollIntoView({ block: "nearest" });
              } else unref(menuSubContext).trigger.value?.focus();
              event.preventDefault();
            }
          })
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "id",
          "aria-labelledby",
          "side"
        ])]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var MenuSubContent_default = MenuSubContent_vue_vue_type_script_setup_true_lang_default;
var MenuSubTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MenuSubTrigger",
  props: {
    disabled: {
      type: Boolean,
      required: false
    },
    textValue: {
      type: String,
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
    const menuContext = injectMenuContext();
    const rootContext = injectMenuRootContext();
    const subContext = injectMenuSubContext();
    const contentContext = injectMenuContentContext();
    watch(menuContext.open, (open) => {
      if (open) contentContext.activeSubmenuContext.value = {
        onOpenChange: menuContext.onOpenChange,
        trigger: subContext.trigger
      };
      else if (contentContext.activeSubmenuContext.value?.trigger.value === subContext.trigger.value) contentContext.activeSubmenuContext.value = void 0;
    });
    const openTimerRef = ref(null);
    subContext.triggerId ||= useId(void 0, "reka-menu-sub-trigger");
    function clearOpenTimer() {
      if (openTimerRef.value) (void 0).clearTimeout(openTimerRef.value);
      openTimerRef.value = null;
    }
    function handlePointerMove(event) {
      if (!isMouseEvent(event)) return;
      const defaultPrevented = contentContext.onItemEnter(event);
      if (defaultPrevented) return;
      if (!props.disabled && !menuContext.open.value && !openTimerRef.value) {
        contentContext.onPointerGraceIntentChange(null);
        openTimerRef.value = (void 0).setTimeout(() => {
          menuContext.onOpenChange(true);
          clearOpenTimer();
        }, 100);
      }
    }
    async function handlePointerLeave(event) {
      if (!isMouseEvent(event)) return;
      clearOpenTimer();
      const contentRect = menuContext.content.value?.getBoundingClientRect();
      if (contentRect?.width) {
        const side = menuContext.content.value?.dataset.side;
        const rightSide = side === "right";
        const bleed = rightSide ? -5 : 5;
        const contentNearEdge = contentRect[rightSide ? "left" : "right"];
        const contentFarEdge = contentRect[rightSide ? "right" : "left"];
        contentContext.onPointerGraceIntentChange({
          area: [
            {
              x: event.clientX + bleed,
              y: event.clientY
            },
            {
              x: contentNearEdge,
              y: contentRect.top
            },
            {
              x: contentFarEdge,
              y: contentRect.top
            },
            {
              x: contentFarEdge,
              y: contentRect.bottom
            },
            {
              x: contentNearEdge,
              y: contentRect.bottom
            }
          ],
          side
        });
        (void 0).clearTimeout(contentContext.pointerGraceTimerRef.value);
        contentContext.pointerGraceTimerRef.value = (void 0).setTimeout(() => contentContext.onPointerGraceIntentChange(null), 300);
      } else {
        const defaultPrevented = contentContext.onTriggerLeave(event);
        if (defaultPrevented) return;
        contentContext.onPointerGraceIntentChange(null);
      }
    }
    async function handleKeyDown(event) {
      const isTypingAhead = contentContext.searchRef.value !== "";
      if (props.disabled || isTypingAhead && event.key === " ") return;
      if (SUB_OPEN_KEYS[rootContext.dir.value].includes(event.key)) {
        menuContext.onOpenChange(true);
        await nextTick();
        menuContext.content.value?.focus();
        event.preventDefault();
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(MenuAnchor_default, { "as-child": "" }, {
        default: withCtx(() => [createVNode(MenuItemImpl_default, mergeProps(props, {
          id: unref(subContext).triggerId,
          ref: (vnode) => {
            if (!vnode) return void 0;
            unref(subContext)?.onTriggerChange(vnode?.$el);
            return void 0;
          },
          "aria-haspopup": "menu",
          "aria-expanded": unref(menuContext).open.value,
          "aria-controls": unref(subContext).contentId,
          "data-state": unref(getOpenState)(unref(menuContext).open.value),
          onClick: _cache[0] || (_cache[0] = async (event) => {
            if (props.disabled || event.defaultPrevented) return;
            event.currentTarget?.focus();
            if (!unref(menuContext).open.value) unref(menuContext).onOpenChange(true);
          }),
          onPointermove: handlePointerMove,
          onPointerleave: handlePointerLeave,
          onKeydown: handleKeyDown
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "id",
          "aria-expanded",
          "aria-controls",
          "data-state"
        ])]),
        _: 3
      });
    };
  }
});
var MenuSubTrigger_default = MenuSubTrigger_vue_vue_type_script_setup_true_lang_default;
const [injectPopoverRootContext, providePopoverRootContext] = /* @__PURE__ */ createContext("PopoverRoot");
var PopoverRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PopoverRoot",
  props: {
    defaultOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    open: {
      type: Boolean,
      required: false,
      default: void 0
    },
    modal: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { modal } = toRefs(props);
    const open = useVModel(props, "open", emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === void 0
    });
    const triggerElement = ref();
    const hasCustomAnchor = ref(false);
    providePopoverRootContext({
      contentId: "",
      triggerId: "",
      modal,
      open,
      onOpenChange: (value) => {
        open.value = value;
      },
      onOpenToggle: () => {
        open.value = !open.value;
      },
      triggerElement,
      hasCustomAnchor
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperRoot_default), null, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
          open: unref(open),
          close: () => open.value = false
        })]),
        _: 3
      });
    };
  }
});
var PopoverRoot_default = PopoverRoot_vue_vue_type_script_setup_true_lang_default;
var PopoverAnchor_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PopoverAnchor",
  props: {
    reference: {
      type: null,
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
    useForwardExpose();
    injectPopoverRootContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperAnchor_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var PopoverAnchor_default = PopoverAnchor_vue_vue_type_script_setup_true_lang_default;
var PopoverArrow_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PopoverArrow",
  props: {
    width: {
      type: Number,
      required: false,
      default: 10
    },
    height: {
      type: Number,
      required: false,
      default: 5
    },
    rounded: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "svg"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperArrow_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var PopoverArrow_default = PopoverArrow_vue_vue_type_script_setup_true_lang_default;
var PopoverClose_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PopoverClose",
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
    const rootContext = injectPopoverRootContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        type: _ctx.as === "button" ? "button" : void 0,
        as: _ctx.as,
        "as-child": props.asChild,
        onClick: _cache[0] || (_cache[0] = ($event) => unref(rootContext).onOpenChange(false))
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "type",
        "as",
        "as-child"
      ]);
    };
  }
});
var PopoverClose_default = PopoverClose_vue_vue_type_script_setup_true_lang_default;
var PopoverContentImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PopoverContentImpl",
  props: {
    trapFocus: {
      type: Boolean,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardProps$1(reactiveOmit(props, "trapFocus", "disableOutsidePointerEvents"));
    const { forwardRef } = useForwardExpose();
    const rootContext = injectPopoverRootContext();
    useFocusGuards();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(FocusScope_default), {
        "as-child": "",
        loop: "",
        trapped: _ctx.trapFocus,
        onMountAutoFocus: _cache[5] || (_cache[5] = ($event) => emits("openAutoFocus", $event)),
        onUnmountAutoFocus: _cache[6] || (_cache[6] = ($event) => emits("closeAutoFocus", $event))
      }, {
        default: withCtx(() => [createVNode(unref(DismissableLayer_default), {
          "as-child": "",
          "disable-outside-pointer-events": _ctx.disableOutsidePointerEvents,
          onPointerDownOutside: _cache[0] || (_cache[0] = ($event) => emits("pointerDownOutside", $event)),
          onInteractOutside: _cache[1] || (_cache[1] = ($event) => emits("interactOutside", $event)),
          onEscapeKeyDown: _cache[2] || (_cache[2] = ($event) => emits("escapeKeyDown", $event)),
          onFocusOutside: _cache[3] || (_cache[3] = ($event) => emits("focusOutside", $event)),
          onDismiss: _cache[4] || (_cache[4] = ($event) => unref(rootContext).onOpenChange(false))
        }, {
          default: withCtx(() => [createVNode(unref(PopperContent_default), mergeProps(unref(forwarded), {
            id: unref(rootContext).contentId,
            ref: unref(forwardRef),
            "data-state": unref(rootContext).open.value ? "open" : "closed",
            "aria-labelledby": unref(rootContext).triggerId,
            style: {
              "--reka-popover-content-transform-origin": "var(--reka-popper-transform-origin)",
              "--reka-popover-content-available-width": "var(--reka-popper-available-width)",
              "--reka-popover-content-available-height": "var(--reka-popper-available-height)",
              "--reka-popover-trigger-width": "var(--reka-popper-anchor-width)",
              "--reka-popover-trigger-height": "var(--reka-popper-anchor-height)"
            },
            role: "dialog"
          }), {
            default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
            _: 3
          }, 16, [
            "id",
            "data-state",
            "aria-labelledby"
          ])]),
          _: 3
        }, 8, ["disable-outside-pointer-events"])]),
        _: 3
      }, 8, ["trapped"]);
    };
  }
});
var PopoverContentImpl_default = PopoverContentImpl_vue_vue_type_script_setup_true_lang_default;
var PopoverContentModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PopoverContentModal",
  props: {
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectPopoverRootContext();
    const isRightClickOutsideRef = ref(false);
    useBodyScrollLock(true);
    const forwarded = useForwardPropsEmits(props, emits);
    const { forwardRef, currentElement } = useForwardExpose();
    useHideOthers(currentElement);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(PopoverContentImpl_default, mergeProps(unref(forwarded), {
        ref: unref(forwardRef),
        "trap-focus": unref(rootContext).open.value,
        "disable-outside-pointer-events": "",
        onCloseAutoFocus: _cache[0] || (_cache[0] = withModifiers((event) => {
          emits("closeAutoFocus", event);
          if (!isRightClickOutsideRef.value) unref(rootContext).triggerElement.value?.focus();
        }, ["prevent"])),
        onPointerDownOutside: _cache[1] || (_cache[1] = (event) => {
          emits("pointerDownOutside", event);
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          isRightClickOutsideRef.value = isRightClick;
        }),
        onFocusOutside: _cache[2] || (_cache[2] = withModifiers(() => {
        }, ["prevent"]))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["trap-focus"]);
    };
  }
});
var PopoverContentModal_default = PopoverContentModal_vue_vue_type_script_setup_true_lang_default;
var PopoverContentNonModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PopoverContentNonModal",
  props: {
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectPopoverRootContext();
    const hasInteractedOutsideRef = ref(false);
    const hasPointerDownOutsideRef = ref(false);
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(PopoverContentImpl_default, mergeProps(unref(forwarded), {
        "trap-focus": false,
        "disable-outside-pointer-events": false,
        onCloseAutoFocus: _cache[0] || (_cache[0] = (event) => {
          emits("closeAutoFocus", event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.value) unref(rootContext).triggerElement.value?.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.value = false;
          hasPointerDownOutsideRef.value = false;
        }),
        onInteractOutside: _cache[1] || (_cache[1] = async (event) => {
          emits("interactOutside", event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.value = true;
            if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.value = true;
          }
          const target = event.target;
          const targetIsTrigger = unref(rootContext).triggerElement.value?.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.value) event.preventDefault();
        })
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var PopoverContentNonModal_default = PopoverContentNonModal_vue_vue_type_script_setup_true_lang_default;
var PopoverContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PopoverContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectPopoverRootContext();
    const forwarded = useForwardPropsEmits(props, emits);
    const { forwardRef } = useForwardExpose();
    rootContext.contentId ||= useId(void 0, "reka-popover-content");
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Presence_default), { present: _ctx.forceMount || unref(rootContext).open.value }, {
        default: withCtx(() => [unref(rootContext).modal.value ? (openBlock(), createBlock(PopoverContentModal_default, mergeProps({ key: 0 }, unref(forwarded), { ref: unref(forwardRef) }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16)) : (openBlock(), createBlock(PopoverContentNonModal_default, mergeProps({ key: 1 }, unref(forwarded), { ref: unref(forwardRef) }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16))]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var PopoverContent_default = PopoverContent_vue_vue_type_script_setup_true_lang_default;
var PopoverPortal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PopoverPortal",
  props: {
    to: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    defer: {
      type: Boolean,
      required: false
    },
    forceMount: {
      type: Boolean,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Teleport_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var PopoverPortal_default = PopoverPortal_vue_vue_type_script_setup_true_lang_default;
var PopoverTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PopoverTrigger",
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
    const rootContext = injectPopoverRootContext();
    const { forwardRef } = useForwardExpose();
    rootContext.triggerId ||= useId(void 0, "reka-popover-trigger");
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(unref(rootContext).hasCustomAnchor.value ? unref(Primitive) : unref(PopperAnchor_default)), { "as-child": "" }, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          id: unref(rootContext).triggerId,
          ref: unref(forwardRef),
          type: _ctx.as === "button" ? "button" : void 0,
          "aria-haspopup": "dialog",
          "aria-expanded": unref(rootContext).open.value,
          "aria-controls": unref(rootContext).contentId,
          "data-state": unref(rootContext).open.value ? "open" : "closed",
          as: _ctx.as,
          "as-child": props.asChild,
          onClick: unref(rootContext).onOpenToggle
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "id",
          "type",
          "aria-expanded",
          "aria-controls",
          "data-state",
          "as",
          "as-child",
          "onClick"
        ])]),
        _: 3
      });
    };
  }
});
var PopoverTrigger_default = PopoverTrigger_vue_vue_type_script_setup_true_lang_default;
function useRangeCalendarState(props) {
  const isStartInvalid = computed(() => {
    if (!props.start.value) return false;
    if (props.isDateDisabled(props.start.value)) return true;
    return false;
  });
  const isEndInvalid = computed(() => {
    if (!props.end.value) return false;
    if (props.isDateDisabled(props.end.value)) return true;
    return false;
  });
  const isInvalid = computed(() => {
    if (isStartInvalid.value || isEndInvalid.value) return true;
    if (props.start.value && props.end.value && isBefore(props.end.value, props.start.value)) return true;
    return false;
  });
  const isSelectionStart = (date) => {
    if (!props.start.value) return false;
    return isSameDay(props.start.value, date);
  };
  const isSelectionEnd = (date) => {
    if (!props.end.value) return false;
    return isSameDay(props.end.value, date);
  };
  const isSelected = (date) => {
    if (props.start.value && isSameDay(props.start.value, date)) return true;
    if (props.end.value && isSameDay(props.end.value, date)) return true;
    if (props.end.value && props.start.value) return isBetween(date, props.start.value, props.end.value);
    return false;
  };
  const rangeIsDateDisabled = (date) => {
    if (props.isDateDisabled(date)) return true;
    if (props.maximumDays?.value) {
      if (props.start.value && props.end.value) {
        if (props.fixedDate.value) {
          const diff = getDaysBetween(props.start.value, props.end.value).length;
          if (diff <= props.maximumDays.value) {
            const daysLeft = props.maximumDays.value - diff - 1;
            const startLimit = props.start.value.subtract({ days: daysLeft });
            const endLimit = props.end.value.add({ days: daysLeft });
            return !isBetween(date, startLimit, endLimit);
          }
        }
        return false;
      }
      if (props.start.value) {
        const maxDate = props.start.value.add({ days: props.maximumDays.value });
        const minDate = props.start.value.subtract({ days: props.maximumDays.value });
        return !isBetween(date, minDate, maxDate);
      }
    }
    return false;
  };
  const isDateHighlightable = (date) => {
    if (props.isDateHighlightable?.(date)) return true;
    return false;
  };
  const highlightedRange = computed(() => {
    if (props.start.value && props.end.value && !props.fixedDate.value) return null;
    if (!props.start.value || !props.focusedValue.value) return null;
    const isStartBeforeFocused = isBefore(props.start.value, props.focusedValue.value);
    const start = isStartBeforeFocused ? props.start.value : props.focusedValue.value;
    const end = isStartBeforeFocused ? props.focusedValue.value : props.start.value;
    if (isSameDay(start, end)) return {
      start,
      end
    };
    if (props.maximumDays?.value && !props.end.value) {
      const maximumDays = props.maximumDays.value;
      const anchor = props.start.value;
      const focused = props.focusedValue.value;
      if (!isBefore(focused, anchor)) return {
        start: anchor,
        end: anchor.add({ days: maximumDays - 1 })
      };
      return {
        start: anchor.subtract({ days: maximumDays - 1 }),
        end: anchor
      };
    }
    const isValid = areAllDaysBetweenValid(start, end, props.allowNonContiguousRanges.value ? () => false : props.isDateUnavailable, rangeIsDateDisabled, props.isDateHighlightable);
    if (isValid) return {
      start,
      end
    };
    return null;
  });
  const isHighlightedStart = (date) => {
    if (!highlightedRange.value || !highlightedRange.value.start) return false;
    return isSameDay(highlightedRange.value.start, date);
  };
  const isHighlightedEnd = (date) => {
    if (!highlightedRange.value || !highlightedRange.value.end) return false;
    return isSameDay(highlightedRange.value.end, date);
  };
  const hasSelectedDate = computed(() => {
    return !!(props.start.value || props.end.value);
  });
  const isStartDateDisabled = computed(() => {
    return !!(props.start.value && props.isDateDisabled(props.start.value));
  });
  const isEndDateDisabled = computed(() => {
    return !!(props.end.value && props.isDateDisabled(props.end.value));
  });
  const isSelectedDisabled = computed(() => {
    const hasStart = !!props.start.value;
    const hasEnd = !!props.end.value;
    if (!hasStart && !hasEnd) return false;
    if (hasStart && hasEnd) return isStartDateDisabled.value && isEndDateDisabled.value;
    return hasStart && isStartDateDisabled.value || hasEnd && isEndDateDisabled.value;
  });
  const selectedFocusableDate = computed(() => {
    if (props.start.value && !isStartDateDisabled.value) return props.start.value;
    if (props.end.value && !isEndDateDisabled.value) return props.end.value;
    return void 0;
  });
  return {
    isInvalid,
    isSelected,
    isDateHighlightable,
    highlightedRange,
    isSelectionStart,
    isSelectionEnd,
    isHighlightedStart,
    isHighlightedEnd,
    isDateDisabled: rangeIsDateDisabled,
    hasSelectedDate,
    isSelectedDisabled,
    selectedFocusableDate
  };
}
const _hoisted_1 = { style: {
  "border": "0px",
  "clip": "rect(0px, 0px, 0px, 0px)",
  "clip-path": "inset(50%)",
  "height": "1px",
  "margin": "-1px",
  "overflow": "hidden",
  "padding": "0px",
  "position": "absolute",
  "white-space": "nowrap",
  "width": "1px"
} };
const _hoisted_2 = {
  role: "heading",
  "aria-level": "2"
};
const [injectRangeCalendarRootContext, provideRangeCalendarRootContext] = /* @__PURE__ */ createContext("RangeCalendarRoot");
var RangeCalendarRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarRoot",
  props: {
    defaultPlaceholder: {
      type: null,
      required: false
    },
    defaultValue: {
      type: Object,
      required: false,
      default: () => ({
        start: void 0,
        end: void 0
      })
    },
    modelValue: {
      type: [Object, null],
      required: false
    },
    placeholder: {
      type: null,
      required: false,
      default: void 0
    },
    allowNonContiguousRanges: {
      type: Boolean,
      required: false,
      default: false
    },
    pagedNavigation: {
      type: Boolean,
      required: false,
      default: false
    },
    preventDeselect: {
      type: Boolean,
      required: false,
      default: false
    },
    maximumDays: {
      type: Number,
      required: false,
      default: void 0
    },
    weekStartsOn: {
      type: Number,
      required: false
    },
    weekdayFormat: {
      type: String,
      required: false,
      default: "narrow"
    },
    calendarLabel: {
      type: String,
      required: false
    },
    fixedWeeks: {
      type: Boolean,
      required: false,
      default: false
    },
    maxValue: {
      type: null,
      required: false
    },
    minValue: {
      type: null,
      required: false
    },
    locale: {
      type: String,
      required: false
    },
    numberOfMonths: {
      type: Number,
      required: false,
      default: 1
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    initialFocus: {
      type: Boolean,
      required: false,
      default: false
    },
    isDateDisabled: {
      type: Function,
      required: false,
      default: void 0
    },
    isDateUnavailable: {
      type: Function,
      required: false,
      default: void 0
    },
    isDateHighlightable: {
      type: Function,
      required: false,
      default: void 0
    },
    dir: {
      type: String,
      required: false
    },
    nextPage: {
      type: Function,
      required: false
    },
    prevPage: {
      type: Function,
      required: false
    },
    disableDaysOutsideCurrentView: {
      type: Boolean,
      required: false,
      default: false
    },
    fixedDate: {
      type: String,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "div"
    }
  },
  emits: [
    "update:modelValue",
    "update:validModelValue",
    "update:placeholder",
    "update:startValue"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { disabled, readonly, initialFocus, pagedNavigation, weekdayFormat, fixedWeeks, numberOfMonths, preventDeselect, isDateUnavailable: propsIsDateUnavailable, isDateHighlightable: propsIsDateHighlightable, isDateDisabled: propsIsDateDisabled, calendarLabel, maxValue, minValue, dir: propDir, locale: propLocale, nextPage: propsNextPage, prevPage: propsPrevPage, allowNonContiguousRanges, disableDaysOutsideCurrentView, fixedDate, maximumDays } = toRefs(props);
    const { primitiveElement, currentElement: parentElement } = usePrimitiveElement();
    const dir = useDirection(propDir);
    const locale = useLocale(propLocale);
    const weekStartsOn = computed(() => props.weekStartsOn ?? getWeekStartsOn(locale.value));
    const lastPressedDateValue = ref();
    const focusedValue = ref();
    const isEditing = ref(false);
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: props.defaultValue ?? {
        start: void 0,
        end: void 0
      },
      passive: props.modelValue === void 0
    });
    const normalizeRange = (value) => value ?? {
      start: void 0,
      end: void 0
    };
    const normalizedModelValue = computed(() => normalizeRange(modelValue.value));
    const validModelValue = ref(normalizeRange(modelValue.value));
    watch(validModelValue, (value) => {
      emits("update:validModelValue", value);
    });
    const defaultDate = getDefaultDate({
      defaultPlaceholder: props.placeholder,
      defaultValue: normalizeRange(modelValue.value).start,
      locale: props.locale
    });
    const startValue = ref(normalizeRange(modelValue.value).start);
    const endValue = ref(normalizeRange(modelValue.value).end);
    const placeholder = useVModel(props, "placeholder", emits, {
      defaultValue: props.defaultPlaceholder ?? defaultDate.copy(),
      passive: props.placeholder === void 0
    });
    function onPlaceholderChange(value) {
      placeholder.value = value.copy();
    }
    const { fullCalendarLabel, headingValue, isDateDisabled, isDateUnavailable, isNextButtonDisabled, isPrevButtonDisabled, grid, weekdays, isOutsideVisibleView, nextPage, prevPage, formatter, isPlaceholderFocusable, firstFocusableDate } = useCalendar({
      locale,
      placeholder,
      weekStartsOn,
      fixedWeeks,
      numberOfMonths,
      minValue,
      maxValue,
      disabled,
      weekdayFormat,
      pagedNavigation,
      isDateDisabled: propsIsDateDisabled.value,
      isDateUnavailable: propsIsDateUnavailable.value,
      calendarLabel,
      nextPage: propsNextPage,
      prevPage: propsPrevPage
    });
    const { isInvalid, isSelected, isDateHighlightable, highlightedRange, isSelectionStart, isSelectionEnd, isHighlightedStart, isHighlightedEnd, isDateDisabled: rangeIsDateDisabled, hasSelectedDate, isSelectedDisabled, selectedFocusableDate } = useRangeCalendarState({
      start: startValue,
      end: endValue,
      isDateDisabled,
      isDateUnavailable,
      isDateHighlightable: propsIsDateHighlightable.value,
      focusedValue,
      allowNonContiguousRanges,
      fixedDate,
      maximumDays
    });
    watch(modelValue, (_modelValue) => {
      const next = normalizeRange(_modelValue);
      const isStartSynced = !next.start && !startValue.value || !!next.start && !!startValue.value && isEqualDay(next.start, startValue.value);
      if (!isStartSynced) startValue.value = next.start?.copy?.();
      const isEndSynced = !next.end && !endValue.value || !!next.end && !!endValue.value && isEqualDay(next.end, endValue.value);
      if (!isEndSynced) endValue.value = next.end?.copy?.();
    });
    watch(startValue, (_startValue) => {
      if (_startValue && !isEqualDay(_startValue, placeholder.value)) onPlaceholderChange(_startValue);
      emits("update:startValue", _startValue);
    });
    watch([startValue, endValue], ([_startValue, _endValue]) => {
      const value = modelValue.value;
      if (value && value.start && value.end && _startValue && _endValue && isEqualDay(value.start, _startValue) && isEqualDay(value.end, _endValue)) return;
      isEditing.value = true;
      if (_endValue && _startValue) {
        const nextValue = isBefore(_endValue, _startValue) ? {
          start: _endValue.copy(),
          end: _startValue.copy()
        } : {
          start: _startValue.copy(),
          end: _endValue.copy()
        };
        modelValue.value = {
          start: nextValue.start,
          end: nextValue.end
        };
        isEditing.value = false;
        validModelValue.value = {
          start: nextValue.start.copy(),
          end: nextValue.end.copy()
        };
      } else modelValue.value = _startValue ? {
        start: _startValue.copy(),
        end: void 0
      } : {
        start: _endValue?.copy(),
        end: void 0
      };
    });
    const kbd = useKbd();
    useEventListener(parentElement, "keydown", (ev) => {
      if (ev.key === kbd.ESCAPE && isEditing.value) {
        startValue.value = validModelValue.value.start?.copy();
        endValue.value = validModelValue.value.end?.copy();
      }
    });
    provideRangeCalendarRootContext({
      isDateUnavailable,
      isDateHighlightable,
      startValue,
      endValue,
      formatter,
      modelValue: normalizedModelValue,
      placeholder,
      disabled,
      initialFocus,
      pagedNavigation,
      grid,
      weekDays: weekdays,
      weekStartsOn,
      weekdayFormat,
      fixedWeeks,
      numberOfMonths,
      readonly,
      preventDeselect,
      fullCalendarLabel,
      headingValue,
      isInvalid,
      isDateDisabled: rangeIsDateDisabled,
      allowNonContiguousRanges,
      highlightedRange,
      focusedValue,
      lastPressedDateValue,
      isSelected,
      isSelectionEnd,
      isSelectionStart,
      isNextButtonDisabled,
      isPrevButtonDisabled,
      isOutsideVisibleView,
      nextPage,
      prevPage,
      parentElement,
      onPlaceholderChange,
      locale,
      dir,
      isHighlightedStart,
      isHighlightedEnd,
      disableDaysOutsideCurrentView,
      fixedDate,
      maximumDays,
      minValue,
      maxValue,
      isPlaceholderFocusable,
      firstFocusableDate,
      hasSelectedDate,
      isSelectedDisabled,
      selectedFocusableDate
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        ref_key: "primitiveElement",
        ref: primitiveElement,
        as: _ctx.as,
        "as-child": _ctx.asChild,
        "aria-label": unref(fullCalendarLabel),
        "data-readonly": unref(readonly) ? "" : void 0,
        "data-disabled": unref(disabled) ? "" : void 0,
        "data-invalid": unref(isInvalid) ? "" : void 0,
        dir: unref(dir)
      }, {
        default: withCtx(() => [createElementVNode("div", _hoisted_1, [createElementVNode("div", _hoisted_2, toDisplayString(unref(fullCalendarLabel)), 1)]), renderSlot(_ctx.$slots, "default", {
          date: unref(placeholder),
          grid: unref(grid),
          weekDays: unref(weekdays),
          weekStartsOn: weekStartsOn.value,
          locale: unref(locale),
          fixedWeeks: unref(fixedWeeks),
          modelValue: normalizedModelValue.value
        })]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "aria-label",
        "data-readonly",
        "data-disabled",
        "data-invalid",
        "dir"
      ]);
    };
  }
});
var RangeCalendarRoot_default = RangeCalendarRoot_vue_vue_type_script_setup_true_lang_default;
var RangeCalendarCell_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarCell",
  props: {
    date: {
      type: null,
      required: true
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "td"
    }
  },
  setup(__props) {
    const rootContext = injectRangeCalendarRootContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        as: _ctx.as,
        "as-child": _ctx.asChild,
        role: "gridcell",
        "aria-selected": unref(rootContext).isSelected(_ctx.date) ? true : void 0,
        "aria-disabled": unref(rootContext).isDateDisabled(_ctx.date) || unref(rootContext).isDateUnavailable?.(_ctx.date) || unref(rootContext).disableDaysOutsideCurrentView.value,
        "data-disabled": unref(rootContext).isDateDisabled(_ctx.date) || unref(rootContext).disableDaysOutsideCurrentView.value ? "" : void 0
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "aria-selected",
        "aria-disabled",
        "data-disabled"
      ]);
    };
  }
});
var RangeCalendarCell_default = RangeCalendarCell_vue_vue_type_script_setup_true_lang_default;
var RangeCalendarCellTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarCellTrigger",
  props: {
    day: {
      type: null,
      required: true
    },
    month: {
      type: null,
      required: true
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "div"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectRangeCalendarRootContext();
    const kbd = useKbd();
    const { primitiveElement } = usePrimitiveElement();
    const labelText = computed(() => rootContext.formatter.custom(toDate(props.day), {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }));
    const isUnavailable = computed(() => rootContext.isDateUnavailable?.(props.day) ?? false);
    const isSelectedDate = computed(() => rootContext.isSelected(props.day));
    const isSelectionStart = computed(() => rootContext.isSelectionStart(props.day));
    const isSelectionEnd = computed(() => rootContext.isSelectionEnd(props.day));
    const isHighlightStart = computed(() => rootContext.isHighlightedStart(props.day));
    const isHighlightEnd = computed(() => rootContext.isHighlightedEnd(props.day));
    const isHighlighted = computed(() => rootContext.highlightedRange.value ? isBetweenInclusive(props.day, rootContext.highlightedRange.value.start, rootContext.highlightedRange.value.end) : false);
    const allowNonContiguousRanges = computed(() => rootContext.allowNonContiguousRanges.value);
    const isDateToday = computed(() => {
      return isToday(props.day, getLocalTimeZone());
    });
    const isOutsideView = computed(() => {
      return !isSameMonth(props.day, props.month);
    });
    const isOutsideVisibleView = computed(() => rootContext.isOutsideVisibleView(props.day));
    const isDisabled = computed(() => rootContext.isDateDisabled(props.day) || rootContext.disableDaysOutsideCurrentView.value && isOutsideView.value);
    const dayValue = computed(() => props.day.day.toLocaleString(rootContext.locale.value));
    const isFocusedDate = computed(() => {
      if (isOutsideView.value || isDisabled.value) return false;
      if (!rootContext.disabled.value && rootContext.isPlaceholderFocusable.value && isSameDay(props.day, rootContext.placeholder.value)) return true;
      if (!rootContext.disabled.value && rootContext.selectedFocusableDate.value && !rootContext.isPlaceholderFocusable.value) return isSameDay(props.day, rootContext.selectedFocusableDate.value);
      if (!rootContext.disabled.value && (!rootContext.hasSelectedDate.value || rootContext.isSelectedDisabled.value) && !rootContext.isPlaceholderFocusable.value) return rootContext.firstFocusableDate.value && isSameDay(props.day, rootContext.firstFocusableDate.value);
      return false;
    });
    function changeDate(e, date) {
      if (rootContext.readonly.value) return;
      if (rootContext.isDateDisabled(date) || rootContext.isDateUnavailable?.(date)) return;
      if (rootContext.startValue.value && rootContext.highlightedRange.value === null) {
        if (isSameDay(date, rootContext.startValue.value) && !rootContext.preventDeselect.value && !rootContext.endValue.value) {
          rootContext.startValue.value = void 0;
          rootContext.onPlaceholderChange(date);
          rootContext.lastPressedDateValue.value = date.copy();
          return;
        } else if (!rootContext.endValue.value) {
          e.preventDefault();
          if (rootContext.lastPressedDateValue.value && isSameDay(rootContext.lastPressedDateValue.value, date)) rootContext.startValue.value = date.copy();
          rootContext.lastPressedDateValue.value = date.copy();
          return;
        }
      }
      rootContext.lastPressedDateValue.value = date.copy();
      if (rootContext.startValue.value && rootContext.endValue.value && isSameDay(rootContext.startValue.value, rootContext.endValue.value) && isSameDay(rootContext.startValue.value, date) && !rootContext.preventDeselect.value) {
        rootContext.startValue.value = void 0;
        rootContext.endValue.value = void 0;
        rootContext.onPlaceholderChange(date);
        return;
      }
      if (!rootContext.startValue.value) rootContext.startValue.value = date.copy();
      else if (!rootContext.endValue.value) rootContext.endValue.value = date.copy();
      else if (rootContext.endValue.value && rootContext.startValue.value) {
        if (!rootContext.fixedDate.value) {
          rootContext.endValue.value = void 0;
          rootContext.startValue.value = date.copy();
        } else if (rootContext.fixedDate.value === "start") if (date.compare(rootContext.startValue.value) < 0) rootContext.startValue.value = date.copy();
        else rootContext.endValue.value = date.copy();
        else if (rootContext.fixedDate.value === "end") if (date.compare(rootContext.endValue.value) > 0) rootContext.endValue.value = date.copy();
        else rootContext.startValue.value = date.copy();
      }
    }
    function handleClick(e) {
      if (isDisabled.value) return;
      changeDate(e, props.day);
    }
    function handleFocus() {
      if (isDisabled.value || rootContext.isDateUnavailable?.(props.day)) return;
      rootContext.focusedValue.value = props.day.copy();
    }
    function handleArrowKey(e) {
      if (isDisabled.value) return;
      e.preventDefault();
      e.stopPropagation();
      const parentElement = rootContext.parentElement.value;
      const indexIncrementation = 7;
      const sign = rootContext.dir.value === "rtl" ? -1 : 1;
      switch (e.code) {
        case kbd.ARROW_RIGHT:
          shiftFocus(props.day, sign);
          break;
        case kbd.ARROW_LEFT:
          shiftFocus(props.day, -sign);
          break;
        case kbd.ARROW_UP:
          shiftFocus(props.day, -indexIncrementation);
          break;
        case kbd.ARROW_DOWN:
          shiftFocus(props.day, indexIncrementation);
          break;
        case kbd.ENTER:
        case kbd.SPACE_CODE:
          changeDate(e, props.day);
      }
      function shiftFocus(day, add) {
        const candidateDayValue = day.add({ days: add });
        if (rootContext.minValue.value && candidateDayValue.compare(rootContext.minValue.value) < 0 || rootContext.maxValue.value && candidateDayValue.compare(rootContext.maxValue.value) > 0) return;
        const candidateDay = parentElement.querySelector(`[data-value='${candidateDayValue.toString()}']:not([data-outside-view])`);
        if (!candidateDay) {
          if (add > 0) {
            if (rootContext.isNextButtonDisabled()) return;
            rootContext.nextPage();
          } else {
            if (rootContext.isPrevButtonDisabled()) return;
            rootContext.prevPage();
          }
          nextTick(() => {
            shiftFocus(day, add);
          });
          return;
        }
        if (candidateDay && candidateDay.hasAttribute("data-disabled")) return shiftFocus(candidateDayValue, add);
        rootContext.onPlaceholderChange(candidateDayValue);
        candidateDay?.focus();
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        ref_key: "primitiveElement",
        ref: primitiveElement,
        as: _ctx.as,
        "as-child": _ctx.asChild,
        role: "button",
        "aria-label": labelText.value,
        "data-reka-calendar-cell-trigger": "",
        "aria-pressed": isSelectedDate.value && (allowNonContiguousRanges.value || !isUnavailable.value) ? true : void 0,
        "aria-disabled": isDisabled.value || isUnavailable.value ? true : void 0,
        "data-highlighted": isHighlighted.value && (allowNonContiguousRanges.value || !isUnavailable.value) ? "" : void 0,
        "data-selection-start": isSelectionStart.value ? true : void 0,
        "data-selection-end": isSelectionEnd.value ? true : void 0,
        "data-highlighted-start": isHighlightStart.value ? true : void 0,
        "data-highlighted-end": isHighlightEnd.value ? true : void 0,
        "data-selected": isSelectedDate.value && (allowNonContiguousRanges.value || !isUnavailable.value) ? true : void 0,
        "data-outside-visible-view": isOutsideVisibleView.value ? "" : void 0,
        "data-value": _ctx.day.toString(),
        "data-disabled": isDisabled.value ? "" : void 0,
        "data-unavailable": isUnavailable.value ? "" : void 0,
        "data-today": isDateToday.value ? "" : void 0,
        "data-outside-view": isOutsideView.value ? "" : void 0,
        "data-focused": isFocusedDate.value ? "" : void 0,
        tabindex: isFocusedDate.value ? 0 : isOutsideView.value || isDisabled.value ? void 0 : -1,
        onClick: handleClick,
        onFocusin: handleFocus,
        onMouseenter: handleFocus,
        onKeydown: withKeys(handleArrowKey, [
          "up",
          "down",
          "left",
          "right",
          "enter",
          "space"
        ])
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
          dayValue: dayValue.value,
          disabled: isDisabled.value,
          today: isDateToday.value,
          selected: isSelectedDate.value,
          outsideView: isOutsideView.value,
          outsideVisibleView: isOutsideVisibleView.value,
          unavailable: isUnavailable.value,
          highlighted: isHighlighted.value && (allowNonContiguousRanges.value || !isUnavailable.value),
          highlightedStart: isHighlightStart.value,
          highlightedEnd: isHighlightEnd.value,
          selectionStart: isSelectionStart.value,
          selectionEnd: isSelectionEnd.value
        }, () => [createTextVNode(toDisplayString(dayValue.value), 1)])]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "aria-label",
        "aria-pressed",
        "aria-disabled",
        "data-highlighted",
        "data-selection-start",
        "data-selection-end",
        "data-highlighted-start",
        "data-highlighted-end",
        "data-selected",
        "data-outside-visible-view",
        "data-value",
        "data-disabled",
        "data-unavailable",
        "data-today",
        "data-outside-view",
        "data-focused",
        "tabindex"
      ]);
    };
  }
});
var RangeCalendarCellTrigger_default = RangeCalendarCellTrigger_vue_vue_type_script_setup_true_lang_default;
var RangeCalendarGrid_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarGrid",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "table"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectRangeCalendarRootContext();
    const disabled = computed(() => rootContext.disabled.value ? true : void 0);
    const readonly = computed(() => rootContext.readonly.value ? true : void 0);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        tabindex: "-1",
        role: "application",
        "aria-readonly": readonly.value,
        "aria-disabled": disabled.value,
        "data-readonly": readonly.value && "",
        "data-disabled": disabled.value && "",
        onMouseleave: _cache[0] || (_cache[0] = ($event) => unref(rootContext).focusedValue.value = void 0)
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "aria-readonly",
        "aria-disabled",
        "data-readonly",
        "data-disabled"
      ]);
    };
  }
});
var RangeCalendarGrid_default = RangeCalendarGrid_vue_vue_type_script_setup_true_lang_default;
var RangeCalendarGridBody_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarGridBody",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "tbody"
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var RangeCalendarGridBody_default = RangeCalendarGridBody_vue_vue_type_script_setup_true_lang_default;
var RangeCalendarGridHead_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarGridHead",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "thead"
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { "aria-hidden": "true" }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var RangeCalendarGridHead_default = RangeCalendarGridHead_vue_vue_type_script_setup_true_lang_default;
var RangeCalendarGridRow_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarGridRow",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "tr"
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var RangeCalendarGridRow_default = RangeCalendarGridRow_vue_vue_type_script_setup_true_lang_default;
var RangeCalendarHeadCell_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarHeadCell",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "th"
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var RangeCalendarHeadCell_default = RangeCalendarHeadCell_vue_vue_type_script_setup_true_lang_default;
var RangeCalendarHeader_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarHeader",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "div"
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var RangeCalendarHeader_default = RangeCalendarHeader_vue_vue_type_script_setup_true_lang_default;
var RangeCalendarHeading_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarHeading",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "div"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectRangeCalendarRootContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { "data-disabled": unref(rootContext).disabled.value ? "" : void 0 }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { headingValue: unref(rootContext).headingValue.value }, () => [createTextVNode(toDisplayString(unref(rootContext).headingValue.value), 1)])]),
        _: 3
      }, 16, ["data-disabled"]);
    };
  }
});
var RangeCalendarHeading_default = RangeCalendarHeading_vue_vue_type_script_setup_true_lang_default;
var RangeCalendarNext_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarNext",
  props: {
    nextPage: {
      type: Function,
      required: false
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
    const disabled = computed(() => rootContext.disabled.value || rootContext.isNextButtonDisabled(props.nextPage));
    const rootContext = injectRangeCalendarRootContext();
    function handleClick() {
      if (disabled.value) return;
      rootContext.nextPage(props.nextPage);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        as: props.as,
        "as-child": props.asChild,
        "aria-label": "Next page",
        type: props.as === "button" ? "button" : void 0,
        "aria-disabled": disabled.value || void 0,
        "data-disabled": disabled.value || void 0,
        disabled: disabled.value,
        onClick: handleClick
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { disabled: disabled.value }, () => [_cache[0] || (_cache[0] = createTextVNode(" Next page "))])]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "type",
        "aria-disabled",
        "data-disabled",
        "disabled"
      ]);
    };
  }
});
var RangeCalendarNext_default = RangeCalendarNext_vue_vue_type_script_setup_true_lang_default;
var RangeCalendarPrev_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarPrev",
  props: {
    prevPage: {
      type: Function,
      required: false
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
    const disabled = computed(() => rootContext.disabled.value || rootContext.isPrevButtonDisabled(props.prevPage));
    const rootContext = injectRangeCalendarRootContext();
    function handleClick() {
      if (disabled.value) return;
      rootContext.prevPage(props.prevPage);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        as: props.as,
        "as-child": props.asChild,
        "aria-label": "Previous page",
        type: props.as === "button" ? "button" : void 0,
        "aria-disabled": disabled.value || void 0,
        "data-disabled": disabled.value || void 0,
        disabled: disabled.value,
        onClick: handleClick
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { disabled: disabled.value }, () => [_cache[0] || (_cache[0] = createTextVNode(" Prev page "))])]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "type",
        "aria-disabled",
        "data-disabled",
        "disabled"
      ]);
    };
  }
});
var RangeCalendarPrev_default = RangeCalendarPrev_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuArrow_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuArrow",
  props: {
    width: {
      type: Number,
      required: false,
      default: 10
    },
    height: {
      type: Number,
      required: false,
      default: 5
    },
    rounded: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "svg"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(MenuArrow_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DropdownMenuArrow_default = DropdownMenuArrow_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuCheckboxItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuCheckboxItem",
  props: {
    modelValue: {
      type: [Boolean, String],
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    textValue: {
      type: String,
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
  emits: ["select", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const emitsAsProps = useEmitAsProps(emits);
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(MenuCheckboxItem_default), normalizeProps(guardReactiveProps({
        ...props,
        ...unref(emitsAsProps)
      })), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DropdownMenuCheckboxItem_default = DropdownMenuCheckboxItem_vue_vue_type_script_setup_true_lang_default;
const [injectDropdownMenuRootContext, provideDropdownMenuRootContext] = /* @__PURE__ */ createContext("DropdownMenuRoot");
var DropdownMenuRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuRoot",
  props: {
    defaultOpen: {
      type: Boolean,
      required: false
    },
    open: {
      type: Boolean,
      required: false,
      default: void 0
    },
    dir: {
      type: String,
      required: false
    },
    modal: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    useForwardExpose();
    const open = useVModel(props, "open", emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === void 0
    });
    const triggerElement = ref();
    const { modal, dir: propDir } = toRefs(props);
    const dir = useDirection(propDir);
    provideDropdownMenuRootContext({
      open,
      onOpenChange: (value) => {
        open.value = value;
      },
      onOpenToggle: () => {
        open.value = !open.value;
      },
      triggerId: "",
      triggerElement,
      contentId: "",
      modal,
      dir
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(MenuRoot_default), {
        open: unref(open),
        "onUpdate:open": _cache[0] || (_cache[0] = ($event) => isRef(open) ? open.value = $event : null),
        dir: unref(dir),
        modal: unref(modal)
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open: unref(open) })]),
        _: 3
      }, 8, [
        "open",
        "dir",
        "modal"
      ]);
    };
  }
});
var DropdownMenuRoot_default = DropdownMenuRoot_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    loop: {
      type: Boolean,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
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
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    useForwardExpose();
    const rootContext = injectDropdownMenuRootContext();
    const hasInteractedOutsideRef = ref(false);
    function handleCloseAutoFocus(event) {
      if (event.defaultPrevented) return;
      if (!hasInteractedOutsideRef.value) setTimeout(() => {
        rootContext.triggerElement.value?.focus();
      }, 0);
      hasInteractedOutsideRef.value = false;
      event.preventDefault();
    }
    rootContext.contentId ||= useId(void 0, "reka-dropdown-menu-content");
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(MenuContent_default), mergeProps(unref(forwarded), {
        id: unref(rootContext).contentId,
        "aria-labelledby": unref(rootContext)?.triggerId,
        style: {
          "--reka-dropdown-menu-content-transform-origin": "var(--reka-popper-transform-origin)",
          "--reka-dropdown-menu-content-available-width": "var(--reka-popper-available-width)",
          "--reka-dropdown-menu-content-available-height": "var(--reka-popper-available-height)",
          "--reka-dropdown-menu-trigger-width": "var(--reka-popper-anchor-width)",
          "--reka-dropdown-menu-trigger-height": "var(--reka-popper-anchor-height)"
        },
        onCloseAutoFocus: handleCloseAutoFocus,
        onInteractOutside: _cache[0] || (_cache[0] = (event) => {
          if (event.defaultPrevented) return;
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (!unref(rootContext).modal.value || isRightClick) hasInteractedOutsideRef.value = true;
          if (unref(rootContext).triggerElement.value?.contains(event.target)) event.preventDefault();
        })
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id", "aria-labelledby"]);
    };
  }
});
var DropdownMenuContent_default = DropdownMenuContent_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuFilter_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuFilter",
  props: {
    modelValue: {
      type: String,
      required: false
    },
    autoFocus: {
      type: Boolean,
      required: false
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
      required: false,
      default: "input"
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: "",
      passive: props.modelValue === void 0
    });
    injectMenuRootContext();
    const contentContext = injectMenuContentContext();
    injectMenuSubContext(null);
    watch(modelValue, (v) => {
      contentContext.searchRef.value = v ?? "";
    }, { immediate: true });
    const { primitiveElement } = usePrimitiveElement();
    const disabled = computed(() => props.disabled || false);
    const activedescendant = ref();
    watchSyncEffect(() => activedescendant.value = contentContext.highlightedElement.value?.id);
    function handleInput(event) {
      if (disabled.value) return;
      const target = event.target;
      modelValue.value = target.value;
      contentContext.searchRef.value = target.value;
    }
    function handleKeyDown(event) {
      if (disabled.value) return;
      if ([
        "ArrowDown",
        "ArrowUp",
        "Home",
        "End"
      ].includes(event.key)) {
        event.preventDefault();
        contentContext.onKeydownNavigation(event);
      } else if (event.key === "Enter") {
        event.preventDefault();
        contentContext.onKeydownEnter(event);
      } else if (event.key === "Escape" && modelValue.value) {
        event.stopPropagation();
        modelValue.value = "";
        contentContext.searchRef.value = "";
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        ref_key: "primitiveElement",
        ref: primitiveElement,
        as: _ctx.as,
        "as-child": _ctx.asChild,
        value: unref(modelValue),
        disabled: disabled.value ? "" : void 0,
        "data-disabled": disabled.value ? "" : void 0,
        "aria-disabled": disabled.value ? true : void 0,
        "aria-activedescendant": activedescendant.value,
        type: "text",
        role: "searchbox",
        onInput: handleInput,
        onKeydown: handleKeyDown
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { modelValue: unref(modelValue) })]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "value",
        "disabled",
        "data-disabled",
        "aria-disabled",
        "aria-activedescendant"
      ]);
    };
  }
});
var DropdownMenuFilter_default = DropdownMenuFilter_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuGroup_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuGroup",
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
      return openBlock(), createBlock(unref(MenuGroup_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DropdownMenuGroup_default = DropdownMenuGroup_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuItem",
  props: {
    disabled: {
      type: Boolean,
      required: false
    },
    textValue: {
      type: String,
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
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const emitsAsProps = useEmitAsProps(emits);
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(MenuItem_default), normalizeProps(guardReactiveProps({
        ...props,
        ...unref(emitsAsProps)
      })), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DropdownMenuItem_default = DropdownMenuItem_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuItemIndicator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuItemIndicator",
  props: {
    forceMount: {
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
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(MenuItemIndicator_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DropdownMenuItemIndicator_default = DropdownMenuItemIndicator_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuLabel_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuLabel",
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
      return openBlock(), createBlock(unref(MenuLabel_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DropdownMenuLabel_default = DropdownMenuLabel_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuPortal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuPortal",
  props: {
    to: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    defer: {
      type: Boolean,
      required: false
    },
    forceMount: {
      type: Boolean,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(MenuPortal_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DropdownMenuPortal_default = DropdownMenuPortal_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuRadioGroup_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuRadioGroup",
  props: {
    modelValue: {
      type: null,
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
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const emitsAsProps = useEmitAsProps(emits);
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(MenuRadioGroup_default), normalizeProps(guardReactiveProps({
        ...props,
        ...unref(emitsAsProps)
      })), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DropdownMenuRadioGroup_default = DropdownMenuRadioGroup_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuRadioItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuRadioItem",
  props: {
    value: {
      type: null,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    },
    textValue: {
      type: String,
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
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(MenuRadioItem_default), normalizeProps(guardReactiveProps(unref(forwarded))), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DropdownMenuRadioItem_default = DropdownMenuRadioItem_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuSeparator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuSeparator",
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
      return openBlock(), createBlock(unref(MenuSeparator_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DropdownMenuSeparator_default = DropdownMenuSeparator_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuSub_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuSub",
  props: {
    defaultOpen: {
      type: Boolean,
      required: false
    },
    open: {
      type: Boolean,
      required: false,
      default: void 0
    }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const open = useVModel(props, "open", emit, {
      passive: props.open === void 0,
      defaultValue: props.defaultOpen ?? false
    });
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(MenuSub_default), {
        open: unref(open),
        "onUpdate:open": _cache[0] || (_cache[0] = ($event) => isRef(open) ? open.value = $event : null)
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open: unref(open) })]),
        _: 3
      }, 8, ["open"]);
    };
  }
});
var DropdownMenuSub_default = DropdownMenuSub_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuSubContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuSubContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    loop: {
      type: Boolean,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
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
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(MenuSubContent_default), mergeProps(unref(forwarded), { style: {
        "--reka-dropdown-menu-content-transform-origin": "var(--reka-popper-transform-origin)",
        "--reka-dropdown-menu-content-available-width": "var(--reka-popper-available-width)",
        "--reka-dropdown-menu-content-available-height": "var(--reka-popper-available-height)",
        "--reka-dropdown-menu-trigger-width": "var(--reka-popper-anchor-width)",
        "--reka-dropdown-menu-trigger-height": "var(--reka-popper-anchor-height)"
      } }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DropdownMenuSubContent_default = DropdownMenuSubContent_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuSubTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuSubTrigger",
  props: {
    disabled: {
      type: Boolean,
      required: false
    },
    textValue: {
      type: String,
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
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(MenuSubTrigger_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DropdownMenuSubTrigger_default = DropdownMenuSubTrigger_vue_vue_type_script_setup_true_lang_default;
var DropdownMenuTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuTrigger",
  props: {
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
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectDropdownMenuRootContext();
    const { forwardRef } = useForwardExpose();
    rootContext.triggerId ||= useId(void 0, "reka-dropdown-menu-trigger");
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(MenuAnchor_default), { "as-child": "" }, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          id: unref(rootContext).triggerId,
          ref: unref(forwardRef),
          type: _ctx.as === "button" ? "button" : void 0,
          "as-child": props.asChild,
          as: _ctx.as,
          "aria-haspopup": "menu",
          "aria-expanded": unref(rootContext).open.value,
          "aria-controls": unref(rootContext).open.value ? unref(rootContext).contentId : void 0,
          "data-disabled": _ctx.disabled ? "" : void 0,
          disabled: _ctx.disabled,
          "data-state": unref(rootContext).open.value ? "open" : "closed",
          onClick: _cache[0] || (_cache[0] = async (event) => {
            if (!_ctx.disabled && event.button === 0 && event.ctrlKey === false) {
              unref(rootContext)?.onOpenToggle();
              await nextTick();
              if (unref(rootContext).open.value) event.preventDefault();
            }
          }),
          onKeydown: _cache[1] || (_cache[1] = withKeys((event) => {
            if (_ctx.disabled) return;
            if (["Enter", " "].includes(event.key)) unref(rootContext).onOpenToggle();
            if (event.key === "ArrowDown") unref(rootContext).onOpenChange(true);
            if ([
              "Enter",
              " ",
              "ArrowDown"
            ].includes(event.key)) event.preventDefault();
          }, [
            "enter",
            "space",
            "arrow-down"
          ]))
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "id",
          "type",
          "as-child",
          "as",
          "aria-expanded",
          "aria-controls",
          "data-disabled",
          "disabled",
          "data-state"
        ])]),
        _: 3
      });
    };
  }
});
var DropdownMenuTrigger_default = DropdownMenuTrigger_vue_vue_type_script_setup_true_lang_default;
var HoverCardArrow_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "HoverCardArrow",
  props: {
    width: {
      type: Number,
      required: false,
      default: 10
    },
    height: {
      type: Number,
      required: false,
      default: 5
    },
    rounded: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "svg"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperArrow_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var HoverCardArrow_default = HoverCardArrow_vue_vue_type_script_setup_true_lang_default;
const [injectHoverCardRootContext, provideHoverCardRootContext] = /* @__PURE__ */ createContext("HoverCardRoot");
var HoverCardRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "HoverCardRoot",
  props: {
    defaultOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    open: {
      type: Boolean,
      required: false,
      default: void 0
    },
    openDelay: {
      type: Number,
      required: false,
      default: 700
    },
    closeDelay: {
      type: Number,
      required: false,
      default: 300
    }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { openDelay, closeDelay } = toRefs(props);
    useForwardExpose();
    const open = useVModel(props, "open", emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === void 0
    });
    const openTimerRef = ref(0);
    const closeTimerRef = ref(0);
    const hasSelectionRef = ref(false);
    const isPointerDownOnContentRef = ref(false);
    const isPointerInTransitRef = ref(false);
    const triggerElement = ref();
    function handleOpen() {
      clearTimeout(closeTimerRef.value);
      openTimerRef.value = (void 0).setTimeout(() => open.value = true, openDelay.value);
    }
    function handleClose() {
      clearTimeout(openTimerRef.value);
      if (!hasSelectionRef.value && !isPointerDownOnContentRef.value) closeTimerRef.value = (void 0).setTimeout(() => open.value = false, closeDelay.value);
    }
    function handleDismiss() {
      open.value = false;
    }
    provideHoverCardRootContext({
      open,
      onOpenChange(value) {
        open.value = value;
      },
      onOpen: handleOpen,
      onClose: handleClose,
      onDismiss: handleDismiss,
      hasSelectionRef,
      isPointerDownOnContentRef,
      isPointerInTransitRef,
      triggerElement
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperRoot_default), null, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open: unref(open) })]),
        _: 3
      });
    };
  }
});
var HoverCardRoot_default = HoverCardRoot_vue_vue_type_script_setup_true_lang_default;
function excludeTouch(eventHandler) {
  return (event) => event.pointerType === "touch" ? void 0 : eventHandler();
}
var HoverCardContentImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "HoverCardContentImpl",
  props: {
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
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
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardProps$1(props);
    const { forwardRef, currentElement: contentElement } = useForwardExpose();
    const rootContext = injectHoverCardRootContext();
    const { isPointerInTransit, onPointerExit } = useGraceArea(rootContext.triggerElement, contentElement);
    syncRef(rootContext.isPointerInTransitRef, isPointerInTransit, { direction: "rtl" });
    onPointerExit(() => {
      rootContext.onClose();
    });
    const containSelection = ref(false);
    let originalBodyUserSelect;
    watchEffect((cleanupFn) => {
      if (containSelection.value) {
        const body = (void 0).body;
        originalBodyUserSelect = body.style.userSelect || body.style.webkitUserSelect;
        body.style.userSelect = "none";
        body.style.webkitUserSelect = "none";
        cleanupFn(() => {
          body.style.userSelect = originalBodyUserSelect;
          body.style.webkitUserSelect = originalBodyUserSelect;
        });
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(DismissableLayer_default), {
        "as-child": "",
        "disable-outside-pointer-events": false,
        onEscapeKeyDown: _cache[1] || (_cache[1] = ($event) => emits("escapeKeyDown", $event)),
        onPointerDownOutside: _cache[2] || (_cache[2] = ($event) => emits("pointerDownOutside", $event)),
        onFocusOutside: _cache[3] || (_cache[3] = withModifiers(($event) => emits("focusOutside", $event), ["prevent"])),
        onDismiss: unref(rootContext).onDismiss
      }, {
        default: withCtx(() => [createVNode(unref(PopperContent_default), mergeProps({
          ...unref(forwarded),
          ..._ctx.$attrs
        }, {
          ref: unref(forwardRef),
          "data-state": unref(rootContext).open.value ? "open" : "closed",
          style: {
            "userSelect": containSelection.value ? "text" : void 0,
            "WebkitUserSelect": containSelection.value ? "text" : void 0,
            "--reka-hover-card-content-transform-origin": "var(--reka-popper-transform-origin)",
            "--reka-hover-card-content-available-width": "var(--reka-popper-available-width)",
            "--reka-hover-card-content-available-height": "var(--reka-popper-available-height)",
            "--reka-hover-card-trigger-width": "var(--reka-popper-anchor-width)",
            "--reka-hover-card-trigger-height": "var(--reka-popper-anchor-height)"
          },
          onPointerdown: _cache[0] || (_cache[0] = (event) => {
            if (event.currentTarget.contains(event.target)) containSelection.value = true;
            unref(rootContext).hasSelectionRef.value = false;
            unref(rootContext).isPointerDownOnContentRef.value = true;
          })
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, ["data-state", "style"])]),
        _: 3
      }, 8, ["onDismiss"]);
    };
  }
});
var HoverCardContentImpl_default = HoverCardContentImpl_vue_vue_type_script_setup_true_lang_default;
var HoverCardContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "HoverCardContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
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
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    const { forwardRef } = useForwardExpose();
    const rootContext = injectHoverCardRootContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Presence_default), { present: _ctx.forceMount || unref(rootContext).open.value }, {
        default: withCtx(() => [createVNode(HoverCardContentImpl_default, mergeProps(unref(forwarded), {
          ref: unref(forwardRef),
          onPointerenter: _cache[0] || (_cache[0] = ($event) => unref(excludeTouch)(unref(rootContext).onOpen)($event))
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16)]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var HoverCardContent_default = HoverCardContent_vue_vue_type_script_setup_true_lang_default;
var HoverCardPortal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "HoverCardPortal",
  props: {
    to: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    defer: {
      type: Boolean,
      required: false
    },
    forceMount: {
      type: Boolean,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Teleport_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var HoverCardPortal_default = HoverCardPortal_vue_vue_type_script_setup_true_lang_default;
var HoverCardTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "HoverCardTrigger",
  props: {
    reference: {
      type: null,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "a"
    }
  },
  setup(__props) {
    const { forwardRef, currentElement } = useForwardExpose();
    const rootContext = injectHoverCardRootContext();
    rootContext.triggerElement = currentElement;
    function handleLeave() {
      setTimeout(() => {
        if (!rootContext.isPointerInTransitRef.value && !rootContext.open.value) rootContext.onClose();
      }, 0);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperAnchor_default), {
        "as-child": "",
        reference: _ctx.reference
      }, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          ref: unref(forwardRef),
          "as-child": _ctx.asChild,
          as: _ctx.as,
          "data-state": unref(rootContext).open.value ? "open" : "closed",
          "data-grace-area-trigger": "",
          onPointerenter: _cache[0] || (_cache[0] = ($event) => unref(excludeTouch)(unref(rootContext).onOpen)($event)),
          onPointerleave: _cache[1] || (_cache[1] = ($event) => unref(excludeTouch)(handleLeave)($event)),
          onFocus: _cache[2] || (_cache[2] = ($event) => unref(rootContext).onOpen()),
          onBlur: _cache[3] || (_cache[3] = ($event) => unref(rootContext).onClose())
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "as-child",
          "as",
          "data-state"
        ])]),
        _: 3
      }, 8, ["reference"]);
    };
  }
});
var HoverCardTrigger_default = HoverCardTrigger_vue_vue_type_script_setup_true_lang_default;
const Calendar = {
  Root: CalendarRoot_default,
  Header: CalendarHeader_default,
  Heading: CalendarHeading_default,
  Grid: CalendarGrid_default,
  Cell: CalendarCell_default,
  HeadCell: CalendarHeadCell_default,
  Next: CalendarNext_default,
  Prev: CalendarPrev_default,
  GridHead: CalendarGridHead_default,
  GridBody: CalendarGridBody_default,
  GridRow: CalendarGridRow_default,
  CellTrigger: CalendarCellTrigger_default
};
const DropdownMenu = {
  Root: DropdownMenuRoot_default,
  Trigger: DropdownMenuTrigger_default,
  Portal: DropdownMenuPortal_default,
  Content: DropdownMenuContent_default,
  Arrow: DropdownMenuArrow_default,
  Item: DropdownMenuItem_default,
  Group: DropdownMenuGroup_default,
  Separator: DropdownMenuSeparator_default,
  CheckboxItem: DropdownMenuCheckboxItem_default,
  ItemIndicator: DropdownMenuItemIndicator_default,
  Label: DropdownMenuLabel_default,
  RadioGroup: DropdownMenuRadioGroup_default,
  RadioItem: DropdownMenuRadioItem_default,
  Sub: DropdownMenuSub_default,
  SubContent: DropdownMenuSubContent_default,
  SubTrigger: DropdownMenuSubTrigger_default,
  Filter: DropdownMenuFilter_default
};
const HoverCard = {
  Root: HoverCardRoot_default,
  Trigger: HoverCardTrigger_default,
  Portal: HoverCardPortal_default,
  Content: HoverCardContent_default,
  Arrow: HoverCardArrow_default
};
const Popover = {
  Root: PopoverRoot_default,
  Trigger: PopoverTrigger_default,
  Portal: PopoverPortal_default,
  Content: PopoverContent_default,
  Arrow: PopoverArrow_default,
  Close: PopoverClose_default,
  Anchor: PopoverAnchor_default
};
const RangeCalendar = {
  Root: RangeCalendarRoot_default,
  Header: RangeCalendarHeader_default,
  Heading: RangeCalendarHeading_default,
  Grid: RangeCalendarGrid_default,
  Cell: RangeCalendarCell_default,
  HeadCell: RangeCalendarHeadCell_default,
  Next: RangeCalendarNext_default,
  Prev: RangeCalendarPrev_default,
  GridHead: RangeCalendarGridHead_default,
  GridBody: RangeCalendarGridBody_default,
  GridRow: RangeCalendarGridRow_default,
  CellTrigger: RangeCalendarCellTrigger_default
};

export { Calendar as C, DropdownMenu as D, HoverCard as H, Popover as P, RangeCalendar as R, DropdownMenuArrow_default as a, DropdownMenuRoot_default as b, DropdownMenuTrigger_default as c, getWeekNumber as g, useArrowNavigation as u };
//# sourceMappingURL=index-C8l8nrqu.mjs.map
