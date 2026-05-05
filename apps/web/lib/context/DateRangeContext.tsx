'use client'

import { createContext, useContext, useState } from 'react'

export interface DateRange {
  label: string
  from: string
  to: string
}

const now = new Date()
const today = now.toISOString().split('T')[0]!
const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]!
const lastOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]!
const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString().split('T')[0]!
const ninetyDaysAgo = new Date(now.getTime() - 90 * 86400000).toISOString().split('T')[0]!

export const DATE_RANGE_PRESETS = [
  { label: 'This month', from: firstOfMonth, to: today },
  { label: 'Last month', from: firstOfLastMonth, to: lastOfLastMonth },
  { label: 'Last 30 days', from: thirtyDaysAgo, to: today },
  { label: 'Last 90 days', from: ninetyDaysAgo, to: today },
  { label: 'YTD', from: `${now.getFullYear()}-01-01`, to: today },
] as const satisfies readonly DateRange[]

interface DateRangeContextValue {
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
}

const DateRangeContext = createContext<DateRangeContextValue>({
  dateRange: DATE_RANGE_PRESETS[2],
  setDateRange: () => {},
})

export const DateRangeProvider = ({ children }: { children: React.ReactNode }) => {
  const [dateRange, setDateRange] = useState<DateRange>(DATE_RANGE_PRESETS[2])
  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  )
}

export const useDateRange = () => useContext(DateRangeContext)