import { c as calendarEventsSchema, h as mockCalendarEvents } from './index-D-j7ajRT.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';

const WEEKDAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado"
];
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function buildMonthGrid(year, month) {
  const today = /* @__PURE__ */ new Date();
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  const weeks = [];
  const cursor = new Date(start);
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push({
        date: new Date(cursor),
        day: cursor.getDate(),
        inMonth: cursor.getMonth() === month,
        isToday: sameDay(cursor, today)
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}
function useCalendarEvents() {
  return calendarEventsSchema.parse(mockCalendarEvents, "calendarEvents");
}
const DAY_MS = 864e5;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CalendarMonth",
  __ssrInlineRender: true,
  props: {
    year: {},
    month: {},
    events: {}
  },
  setup(__props) {
    const props = __props;
    const eventColors = {
      pink: { bar: "bg-pink-400", cell: "bg-pink-100" },
      blue: { bar: "bg-blue-400", cell: "bg-blue-50" },
      amber: { bar: "bg-amber-300", cell: "bg-amber-50" },
      violet: { bar: "bg-violet-400", cell: "bg-violet-50" },
      green: { bar: "bg-emerald-400", cell: "bg-emerald-50" }
    };
    const weeks = computed(() => buildMonthGrid(props.year, props.month));
    const weekBars = computed(
      () => weeks.value.map((week) => {
        const weekStart = week[0].date.getTime();
        const weekEnd = week[6].date.getTime();
        const bars = [];
        props.events.forEach((event) => {
          const eventStart = new Date(props.year, props.month, event.startDay).getTime();
          const eventEnd = eventStart + (event.length - 1) * DAY_MS;
          if (eventEnd < weekStart || eventStart > weekEnd) return;
          const segStart = Math.max(eventStart, weekStart);
          const segEnd = Math.min(eventEnd, weekEnd);
          bars.push({
            event,
            colStart: Math.round((segStart - weekStart) / DAY_MS) + 1,
            colSpan: Math.round((segEnd - segStart) / DAY_MS) + 1,
            lane: bars.length
          });
        });
        return bars;
      })
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" }, _attrs))}><div class="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800"><!--[-->`);
      ssrRenderList("WEEKDAYS" in _ctx ? _ctx.WEEKDAYS : unref(WEEKDAYS), (weekday) => {
        _push(`<div class="px-2 py-2 text-center text-xs font-medium text-slate-400">${ssrInterpolate(weekday)}</div>`);
      });
      _push(`<!--]--></div><!--[-->`);
      ssrRenderList(unref(weeks), (week, wi) => {
        _push(`<div class="relative border-b border-slate-200 last:border-b-0 dark:border-slate-800"><div class="grid grid-cols-7"><!--[-->`);
        ssrRenderList(week, (cell) => {
          _push(`<div class="min-h-28 border-r border-slate-100 px-2 py-1.5 last:border-r-0 dark:border-slate-800"><div class="flex justify-center"><span class="${ssrRenderClass([[
            cell.inMonth ? "text-slate-500" : "text-slate-300",
            cell.isToday && "flex size-6 items-center justify-center rounded-full bg-violet-500 text-white"
          ], "text-xs font-medium"])}">${ssrInterpolate(String(cell.day).padStart(2, "0"))}</span></div></div>`);
        });
        _push(`<!--]--></div><div class="pointer-events-none absolute inset-x-0 top-8 grid grid-cols-7 gap-px px-1"><!--[-->`);
        ssrRenderList(unref(weekBars)[wi], (bar) => {
          _push(`<div class="${ssrRenderClass([eventColors[bar.event.color].cell, "pointer-events-auto self-start rounded-md px-2 py-1"])}" style="${ssrRenderStyle({
            gridColumn: `${bar.colStart} / span ${bar.colSpan}`,
            marginTop: `${bar.lane * 34}px`
          })}"><span class="${ssrRenderClass([eventColors[bar.event.color].bar, "mb-1 block h-1 w-full rounded-full"])}"></span><span class="block truncate rounded bg-white/80 px-1.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">${ssrInterpolate(bar.event.title)}</span></div>`);
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calendario/CalendarMonth.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "CalendarioCalendarMonth" });

export { __nuxt_component_1 as _, useCalendarEvents as u };
//# sourceMappingURL=CalendarMonth-BzbTHpDV.mjs.map
