import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

export function useDashboardDatePicker() {
  const COSTA_ENTRY_DATE = '2026-06-01'
  const todayISO = computed(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })
  
  function daysBeforeToday(days: number): string {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const defaultDateFrom = daysBeforeToday(6)
  const dateFrom = ref(defaultDateFrom)
  const dateTo = ref(todayISO.value)

  const calendarMonth = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const dragAnchor = ref<string | null>(null)
  const isDraggingCalendar = ref(false)
  const didDragCalendar = ref(false)
  const ignoreNextDateClick = ref(false)
  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
  const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })

  function formatISODate(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const calendarMonthLabel = computed(() => {
    const label = monthFormatter.format(calendarMonth.value)
    return label.charAt(0).toUpperCase() + label.slice(1)
  })

  const calendarDays = computed(() => {
    const firstDay = new Date(calendarMonth.value.getFullYear(), calendarMonth.value.getMonth(), 1)
    const start = new Date(firstDay)
    start.setDate(firstDay.getDate() - firstDay.getDay())

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start)
      date.setDate(start.getDate() + index)
      const iso = formatISODate(date)
      return {
        iso,
        label: date.getDate(),
        currentMonth: date.getMonth() === calendarMonth.value.getMonth(),
        disabled: iso < COSTA_ENTRY_DATE || iso > todayISO.value,
      }
    })
  })

  const canShowPreviousMonth = computed(() => {
    const previous = new Date(calendarMonth.value.getFullYear(), calendarMonth.value.getMonth() - 1, 1)
    return formatISODate(new Date(previous.getFullYear(), previous.getMonth() + 1, 0)) >= COSTA_ENTRY_DATE
  })
  const canShowNextMonth = computed(() => {
    const next = new Date(calendarMonth.value.getFullYear(), calendarMonth.value.getMonth() + 1, 1)
    return formatISODate(next) <= todayISO.value
  })

  function changeCalendarMonth(offset: number) {
    if ((offset < 0 && !canShowPreviousMonth.value) || (offset > 0 && !canShowNextMonth.value)) return
    calendarMonth.value = new Date(calendarMonth.value.getFullYear(), calendarMonth.value.getMonth() + offset, 1)
  }

  function selectCalendarDate(iso: string) {
    dateFrom.value = iso
    dateTo.value = iso
  }

  function updateCalendarRange(iso: string) {
    if (!dragAnchor.value) return
    dateFrom.value = iso < dragAnchor.value ? iso : dragAnchor.value
    dateTo.value = iso > dragAnchor.value ? iso : dragAnchor.value
  }

  function beginCalendarSelection(iso: string, event: PointerEvent) {
    event.preventDefault()
    dragAnchor.value = iso
    isDraggingCalendar.value = true
    didDragCalendar.value = false
    selectCalendarDate(iso)
  }

  function extendCalendarSelection(event: PointerEvent) {
    if (!isDraggingCalendar.value) return
    const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null
    const cell = target?.closest<HTMLButtonElement>('[data-calendar-date]')
    const iso = cell?.dataset.calendarDate
    if (!iso || cell.disabled) return
    if (iso !== dragAnchor.value) didDragCalendar.value = true
    updateCalendarRange(iso)
  }

  function endCalendarSelection() {
    if (!isDraggingCalendar.value) return
    ignoreNextDateClick.value = didDragCalendar.value
    isDraggingCalendar.value = false
    dragAnchor.value = null
  }

  function handleCalendarDateClick(iso: string) {
    if (ignoreNextDateClick.value) {
      ignoreNextDateClick.value = false
      return
    }
    selectCalendarDate(iso)
  }

  function isSelectedCalendarDate(iso: string) {
    return iso >= dateFrom.value && iso <= dateTo.value
  }

  function resetFilter() {
    dateFrom.value = defaultDateFrom
    dateTo.value = todayISO.value
  }

  if (typeof window !== 'undefined') {
    onMounted(() => window.addEventListener('pointerup', endCalendarSelection))
    onBeforeUnmount(() => window.removeEventListener('pointerup', endCalendarSelection))
  }

  const dateLabel = computed(() => {
    if (dateFrom.value === defaultDateFrom && dateTo.value === todayISO.value) {
      return 'Últimos 7 dias'
    }
    if (dateFrom.value === todayISO.value && dateTo.value === todayISO.value) {
      return 'Hoje'
    }
    const format = (iso: string) => iso.split('-').reverse().join('/')
    const f = format(dateFrom.value)
    const t = format(dateTo.value)
    if (f === t) return f
    return `De ${f} até ${t}`
  })

  watch(dateFrom, (v) => {
    if (v > dateTo.value) dateTo.value = v
    if (v < COSTA_ENTRY_DATE) dateFrom.value = COSTA_ENTRY_DATE
  })

  watch(dateTo, (v) => {
    if (v > todayISO.value) dateTo.value = todayISO.value
    if (v < dateFrom.value) dateFrom.value = v
  })

  return {
    dateFrom,
    dateTo,
    dateLabel,
    calendarMonth,
    calendarMonthLabel,
    calendarDays,
    weekDays,
    canShowPreviousMonth,
    canShowNextMonth,
    changeCalendarMonth,
    beginCalendarSelection,
    extendCalendarSelection,
    endCalendarSelection,
    handleCalendarDateClick,
    isSelectedCalendarDate,
    resetFilter,
  }
}
