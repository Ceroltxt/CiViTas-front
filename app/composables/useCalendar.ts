import type { CalendarEvent } from '~/types'
import { calendarEventsSchema } from '~/schemas'
import { mockCalendarEvents } from '~/mocks'

export interface CalendarCell {
  date: Date
  day: number
  inMonth: boolean
  isToday: boolean
}

export const WEEKDAYS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
  )
}

/** Gera 6 semanas (matriz 7x6) para o mês informado. */
export function buildMonthGrid(year: number, month: number): CalendarCell[][] {
  const today = new Date()
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())

  const weeks: CalendarCell[][] = []
  const cursor = new Date(start)

  for (let w = 0; w < 6; w++) {
    const week: CalendarCell[] = []
    for (let d = 0; d < 7; d++) {
      week.push({
        date: new Date(cursor),
        day: cursor.getDate(),
        inMonth: cursor.getMonth() === month,
        isToday: sameDay(cursor, today),
      })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

// `formatMonthLabel` vive em `~/utils/date` (fonte única de meses).

// Backend: `fetchCalendarEvents()` em `~/services`.
export function useCalendarEvents(): CalendarEvent[] {
  return calendarEventsSchema.parse(mockCalendarEvents, 'calendarEvents')
}
