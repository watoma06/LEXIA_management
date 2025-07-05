import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReservationAdminPage from "./page";
import { format, startOfWeek } from "date-fns";
import { supabase, BOOKINGS_TABLE } from "@/lib/supabase";

let realtimeCallback: (() => void) | null = null;
let currentData: any[] = [];

jest.mock("@/lib/supabase", () => {
  const mockFrom = jest.fn(() => ({
    select: jest.fn(() => ({
      gte: jest.fn(() => ({
        lte: jest.fn(() => ({
          order: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: currentData, error: null }))
          }))
        }))
      }))
    })),
    delete: jest.fn(() => Promise.resolve({ error: null }))
  }));

  const channelMock = {
    on: jest.fn((event: string, filter: any, cb: () => void) => {
      realtimeCallback = cb;
      return channelMock;
    }),
    subscribe: jest.fn(() => channelMock)
  };

  return {
    supabase: {
      from: mockFrom,
      channel: jest.fn(() => channelMock),
      removeChannel: jest.fn()
    },
    BOOKINGS_TABLE: "bookings"
  };
});

jest.mock("lucide-react", () => ({
  ChevronLeft: () => <div>ChevronLeft</div>,
  ChevronRight: () => <div>ChevronRight</div>
}));

jest.mock("@/components/dashboard-layout", () => {
  return ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
});

const mockedSupabaseFrom = supabase.from as jest.Mock;

beforeEach(() => {
  currentData = [];
  realtimeCallback = null;
  jest.clearAllMocks();
});

test("updates bookings when realtime event occurs", async () => {
  render(<ReservationAdminPage />);

  await screen.findByText("表示期間内に予約はありません");

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const bookingDate = format(weekStart, "yyyy-MM-dd");
  currentData = [
    { id: 1, appointment_date: bookingDate, appointment_time: "11:00", patient_name: "Test" }
  ];

  realtimeCallback && realtimeCallback();

  await waitFor(() => {
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
