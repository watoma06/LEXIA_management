import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import ReservationPage from "./page"
import { supabase, BOOKINGS_TABLE } from "@/lib/supabase" // Actual path
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"
import { ja } from "date-fns/locale"

// Mock Supabase
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        gte: jest.fn(() => ({
          lte: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        eq: jest.fn(() => Promise.resolve({ data: [], error: null })), // For single day fetches if any remain
      })),
      insert: jest.fn(() => Promise.resolve({ error: null })),
    })),
  },
  BOOKINGS_TABLE: "bookings",
}))

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  CalendarClock: () => <div data-testid="icon-calendar-clock">CalendarClock</div>,
  ChevronLeft: () => <div data-testid="icon-chevron-left">ChevronLeft</div>,
  ChevronRight: () => <div data-testid="icon-chevron-right">ChevronRight</div>,
}))

// Mock DashboardLayout
jest.mock("@/components/dashboard-layout", () => {
  return ({ children }: { children: React.ReactNode }) => <div data-testid="dashboard-layout">{children}</div>
})

// Helper to get mocked Supabase functions
const mockedSupabaseFrom = supabase.from as jest.Mock
const mockedSelect = mockedSupabaseFrom().select as jest.Mock
const mockedGte = mockedSelect().gte as jest.Mock
const mockedLte = mockedGte().lte as jest.Mock
const mockedInsert = mockedSupabaseFrom().insert as jest.Mock

const mockBookings = (bookings: any[]) => {
  mockedLte.mockResolvedValue({ data: bookings, error: null })
}

const today = new Date()

describe("ReservationPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Default to no bookings
    mockBookings([])
  })

  test("renders the reservation page with initial weekly view", async () => {
    render(<ReservationPage />)
    expect(screen.getByText("予約画面")).toBeInTheDocument()
    expect(screen.getByTestId("icon-calendar-clock")).toBeInTheDocument()
    // Weekly view is the only mode

    // Check for current week display
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
    expect(screen.getByText(`${format(weekStart, "yyyy年M月d日")} - ${format(weekEnd, "M月d日")}`)).toBeInTheDocument()

    // Check table headers for the week
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })
    for (const day of daysInWeek) {
      expect(screen.getByText(format(day, "EEEEE", { locale: ja }))).toBeInTheDocument()
    }
  })


  test("navigates to next and previous week", async () => {
    render(<ReservationPage />)
    const nextWeekButton = screen.getAllByTestId("icon-chevron-right")[0].parentElement! // Assuming first is main nav
    fireEvent.click(nextWeekButton)

    await waitFor(() => {
      const nextWeekStart = startOfWeek(addDays(today, 7), { weekStartsOn: 1 })
      expect(screen.getByText(format(nextWeekStart, "EEEEE", { locale: ja }))).toBeInTheDocument()
    })

    const prevWeekButton = screen.getAllByTestId("icon-chevron-left")[0].parentElement!
    fireEvent.click(prevWeekButton) // Back to current
    fireEvent.click(prevWeekButton) // To previous week

    await waitFor(() => {
      const prevWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 })
      expect(screen.getByText(format(prevWeekStart, "EEEEE", { locale: ja }))).toBeInTheDocument()
    })
  })


  test("displays bookings correctly (〇 and ×)", async () => {
    const todayStr = format(today, "yyyy-MM-dd")
    const tomorrowStr = format(addDays(today, 1), "yyyy-MM-dd")

    mockBookings([
      { id: 1, appointment_date: todayStr, appointment_time: "11:00", patient_name: "A" },
      { id: 2, appointment_date: tomorrowStr, appointment_time: "14:00", patient_name: "B" },
    ])

    render(<ReservationPage />)

    // Wait for table to populate based on mocked data
    // Find cells by their row (time) and column (date)
    // This is a bit complex due to table structure. We find rows then cells.
    await waitFor(() => {
      const rows = screen.getAllByRole("row") // Includes header row
      // Find 11:00 row
      const time11Row = rows.find(row => row.textContent?.startsWith("11:00"))
      // Find 14:00 row
      const time14Row = rows.find(row => row.textContent?.startsWith("14:00"))

      expect(time11Row).not.toBeNull()
      expect(time14Row).not.toBeNull()

      // Check for '×' for today 11:00
      // The column index depends on where 'today' is in the week view
      const todayFormattedHeader = format(today, "EEEEE", { locale: ja })
      const headerCells = screen.getAllByRole("columnheader")
      const todayColIndex = headerCells.findIndex(th => th.textContent === todayFormattedHeader)

      if (time11Row && todayColIndex > 0) { // todayColIndex > 0 because first col is time
        const cellsIn11Row = time11Row.querySelectorAll("td")
        expect(cellsIn11Row[todayColIndex].textContent).toBe("×")
      } else {
        throw new Error("Could not find 11:00 row or today's column for assertion")
      }

      // Check for '〇' for tomorrow 11:00 (assuming tomorrow is in view)
      const tomorrowFormattedHeader = format(addDays(today,1), "EEEEE", { locale: ja })
      const tomorrowColIndex = headerCells.findIndex(th => th.textContent === tomorrowFormattedHeader)
       if (time11Row && tomorrowColIndex > 0) {
        const cellsIn11Row = time11Row.querySelectorAll("td")
        expect(cellsIn11Row[tomorrowColIndex].textContent).toBe("〇")
      }
      // else: tomorrow might not be in the current weekly view, skip if so.
      // This depends on what day 'today' is. If 'today' is Sunday, tomorrow is not in view.

      // Check for '×' for tomorrow 14:00
       if (time14Row && tomorrowColIndex > 0) {
        const cellsIn14Row = time14Row.querySelectorAll("td")
        expect(cellsIn14Row[tomorrowColIndex].textContent).toBe("×")
      }
      // else: tomorrow might not be in the current weekly view.
    })
  })

  test("shows booking form and submits a reservation", async () => {
    render(<ReservationPage />)

    // Find an available slot (first '〇' button)
    // This assumes at least one '〇' is visible in the default view
    await waitFor(async () => {
      const availableSlots = screen.getAllByText("〇")
      expect(availableSlots.length).toBeGreaterThan(0)
      fireEvent.click(availableSlots[0])
    })

    // Form should appear
    await screen.findByText(/の予約$/) // Matches "{date} {time} の予約"
    expect(screen.getByLabelText("お名前")).toBeInTheDocument()
    expect(screen.getByLabelText("電話番号")).toBeInTheDocument()
    expect(screen.getByLabelText("メール")).toBeInTheDocument()

    // Fill form
    fireEvent.change(screen.getByLabelText("お名前"), { target: { value: "Test User" } })
    fireEvent.change(screen.getByLabelText("電話番号"), { target: { value: "09012345678" } })
    fireEvent.change(screen.getByLabelText("メール"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText("備考"), { target: { value: "Test notes" } })

    // Mock insert to simulate successful booking
    mockedInsert.mockResolvedValueOnce({ error: null })
    // Mock refetch of bookings after submission - assume it becomes booked
    const slotDate = screen.getByText(/の予約$/).textContent!.split(" ")[0]
    const slotTime = screen.getByText(/の予約$/).textContent!.split(" ")[1]
    mockBookings([{id: 3, appointment_date: slotDate, appointment_time: slotTime, patient_name: "Test User"}])


    fireEvent.click(screen.getByText("予約する"))

    await waitFor(() => {
      expect(mockedInsert).toHaveBeenCalledTimes(1)
      expect(mockedInsert).toHaveBeenCalledWith(expect.objectContaining({
        patient_name: "Test User",
        phone: "09012345678",
        email: "test@example.com",
        notes: "Test notes",
        status: "pending",
        // appointment_date and appointment_time will be based on the clicked slot
      }))
    })

    // Check for success message and form reset
    expect(await screen.findByText("予約を受け付けました")).toBeInTheDocument()
    expect(screen.queryByLabelText("お名前")).not.toBeInTheDocument() // Form should be hidden

    // Verify the slot is now marked as booked '×'
    // This requires re-finding the specific slot, which can be complex.
    // For simplicity, we trust the refetch logic and that the UI would update.
    // A more robust test would re-query the table for the '×'.
  })

  test("displays legend", () => {
    render(<ReservationPage />)
    expect(screen.getByText("凡例:")).toBeInTheDocument()
    expect(screen.getByText("〇")).toBeInTheDocument()
    expect(screen.getByText(": 空き")).toBeInTheDocument()
    expect(screen.getByText("×")).toBeInTheDocument()
    expect(screen.getByText(": 予約済み")).toBeInTheDocument()
  })

  test("booking form cancel button works", async () => {
    render(<ReservationPage />)

    await waitFor(async () => {
      const availableSlots = screen.getAllByText("〇")
      expect(availableSlots.length).toBeGreaterThan(0)
      fireEvent.click(availableSlots[0])
    })

    await screen.findByText(/の予約$/)
    expect(screen.getByLabelText("お名前")).toBeInTheDocument()

    fireEvent.click(screen.getByText("キャンセル"))

    await waitFor(() => {
      expect(screen.queryByText(/の予約$/)).not.toBeInTheDocument()
      expect(screen.queryByLabelText("お名前")).not.toBeInTheDocument()
    })
  })

})

// Helper to deal with shadcn/ui Button variant props in tests
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveAttribute(attr: string, value: unknown): R;
    }
  }
}
